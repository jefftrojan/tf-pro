import { Response, NextFunction } from 'express';
import { Category } from '../models/Category';
import { Transaction } from '../models/Transaction';
import { ErrorResponse } from '../utils/errorResponse';
import { AuthRequest } from '../middleware/auth';

// @desc    Get all categories
// @route   GET /api/categories
// @access  Private
export const getCategories = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { type } = req.query;
    
    const query: any = { 
      $or: [
        { user: req.user.id },
        { isCustom: false }
      ]
    };

    if (type) {
      query.type = type;
    }

    const categories = await Category.find(query)
      .populate('parent', 'name')
      .sort('name');

    // Get usage statistics for each category
    const categoriesWithStats = await Promise.all(
      categories.map(async (category) => {
        const stats = await Transaction.aggregate([
          {
            $match: {
              user: req.user.id,
              category: category.name,
              date: {
                $gte: new Date(new Date().setMonth(new Date().getMonth() - 1))
              }
            }
          },
          {
            $group: {
              _id: null,
              totalAmount: { $sum: '$amount' },
              count: { $sum: 1 },
              avgAmount: { $avg: '$amount' }
            }
          }
        ]);

        return {
          ...category.toObject(),
          stats: stats[0] || { totalAmount: 0, count: 0, avgAmount: 0 }
        };
      })
    );

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categoriesWithStats
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single category with details
// @route   GET /api/categories/:id
// @access  Private
export const getCategory = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      $or: [
        { user: req.user.id },
        { isCustom: false }
      ]
    }).populate('parent', 'name');

    if (!category) {
      return next(
        new ErrorResponse(`Category not found with id of ${req.params.id}`, 404)
      );
    }

    // Get detailed category statistics
    const monthlyStats = await Transaction.aggregate([
      {
        $match: {
          user: req.user.id,
          category: category.name
        }
      },
      {
        $group: {
          _id: {
            month: { $month: '$date' },
            year: { $year: '$date' }
          },
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
          avgAmount: { $avg: '$amount' }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } }
    ]);

    // Get recent transactions
    const recentTransactions = await Transaction.find({
      user: req.user.id,
      category: category.name
    })
      .sort('-date')
      .limit(5)
      .populate('account', 'name type');

    res.status(200).json({
      success: true,
      data: {
        ...category.toObject(),
        monthlyStats,
        recentTransactions
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new category
// @route   POST /api/categories
// @access  Private
export const createCategory = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Check if category with same name exists
    const existingCategory = await Category.findOne({
      name: req.body.name,
      $or: [
        { user: req.user.id },
        { isCustom: false }
      ]
    });

    if (existingCategory) {
      return next(
        new ErrorResponse('Category with this name already exists', 400)
      );
    }

    // Add user and set as custom category
    req.body.user = req.user.id;
    req.body.isCustom = true;

    // Validate parent category if provided
    if (req.body.parent) {
      const parentCategory = await Category.findOne({
        _id: req.body.parent,
        $or: [
          { user: req.user.id },
          { isCustom: false }
        ]
      });

      if (!parentCategory) {
        return next(new ErrorResponse('Invalid parent category', 400));
      }
    }

    const category = await Category.create(req.body);

    res.status(201).json({
      success: true,
      data: category
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private
export const updateCategory = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let category = await Category.findOne({
      _id: req.params.id,
      user: req.user.id,
      isCustom: true
    });

    if (!category) {
      return next(
        new ErrorResponse(
          `Category not found or cannot be modified`,
          404
        )
      );
    }

    // Check if new name conflicts with existing categories
    if (req.body.name && req.body.name !== category.name) {
      const existingCategory = await Category.findOne({
        name: req.body.name,
        $or: [
          { user: req.user.id },
          { isCustom: false }
        ],
        _id: { $ne: req.params.id }
      });

      if (existingCategory) {
        return next(
          new ErrorResponse('Category with this name already exists', 400)
        );
      }
    }

    // Validate parent category if being updated
    if (req.body.parent) {
      const parentCategory = await Category.findOne({
        _id: req.body.parent,
        $or: [
          { user: req.user.id },
          { isCustom: false }
        ]
      });

      if (!parentCategory) {
        return next(new ErrorResponse('Invalid parent category', 400));
      }
    }

    category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: category
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private
export const deleteCategory = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      user: req.user.id,
      isCustom: true
    });

    if (!category) {
      return next(
        new ErrorResponse(
          `Category not found or cannot be deleted`,
          404
        )
      );
    }

    // Check if category is in use
    const transactionCount = await Transaction.countDocuments({
      user: req.user.id,
      category: category.name
    });

    if (transactionCount > 0) {
      return next(
        new ErrorResponse(
          `Cannot delete category with existing transactions. Please reassign transactions first.`,
          400
        )
      );
    }

    await category.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get category statistics
// @route   GET /api/categories/stats
// @access  Private
export const getCategoryStats = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { startDate, endDate, type } = req.query;

    const query: any = {
      user: req.user.id
    };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      };
    }

    if (type) {
      query.type = type;
    }

    const categoryStats = await Transaction.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$category',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
          avgAmount: { $avg: '$amount' },
          minAmount: { $min: '$amount' },
          maxAmount: { $max: '$amount' },
          firstTransaction: { $min: '$date' },
          lastTransaction: { $max: '$date' }
        }
      },
      {
        $sort: { totalAmount: -1 }
      }
    ]);

    res.status(200).json({
      success: true,
      data: categoryStats
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get subcategories
// @route   GET /api/categories/:id/subcategories
// @access  Private
export const getSubcategories = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories = await Category.find({
      parent: req.params.id,
      $or: [
        { user: req.user.id },
        { isCustom: false }
      ]
    }).sort('name');

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (err) {
    next(err);
  }
};