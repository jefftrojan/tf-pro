// src/controllers/budgetController.ts
import { Response, NextFunction } from 'express';
import { Budget } from '../models/Budget';
import { Transaction } from '../models/Transaction';
import { ErrorResponse } from '../utils/errorResponse';
import { AuthRequest } from '../middleware/auth';

// @desc    Get all budgets
// @route   GET /api/budgets
// @access  Private
export const getBudgets = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const budgets = await Budget.find({ user: req.user.id });

    // Calculate current spending for each budget
    const budgetsWithSpending = await Promise.all(
      budgets.map(async (budget) => {
        const spent = await calculateSpending(budget, req.user.id);
        return {
          ...budget.toObject(),
          spent,
          remaining: budget.limit - spent,
          percentage: (spent / budget.limit) * 100
        };
      })
    );

    res.status(200).json({
      success: true,
      count: budgets.length,
      data: budgetsWithSpending
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single budget
// @route   GET /api/budgets/:id
// @access  Private
export const getBudget = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const budget = await Budget.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!budget) {
      return next(
        new ErrorResponse(`Budget not found with id of ${req.params.id}`, 404)
      );
    }

    const spent = await calculateSpending(budget, req.user.id);

    const budgetWithSpending = {
      ...budget.toObject(),
      spent,
      remaining: budget.limit - spent,
      percentage: (spent / budget.limit) * 100
    };

    res.status(200).json({
      success: true,
      data: budgetWithSpending
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new budget
// @route   POST /api/budgets
// @access  Private
export const createBudget = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Check if budget already exists for this category and period
    const existingBudget = await Budget.findOne({
      user: req.user.id,
      category: req.body.category,
      period: req.body.period,
      startDate: { $lte: new Date(req.body.endDate) },
      endDate: { $gte: new Date(req.body.startDate) }
    });

    if (existingBudget) {
      return next(
        new ErrorResponse(
          `Budget already exists for this category and time period`,
          400
        )
      );
    }

    // Add user to req.body
    req.body.user = req.user.id;

    const budget = await Budget.create(req.body);

    res.status(201).json({
      success: true,
      data: budget
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update budget
// @route   PUT /api/budgets/:id
// @access  Private
export const updateBudget = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let budget = await Budget.findOne({
        _id: req.params.id,
        user: req.user.id
      });
  
      if (!budget) {
        return next(
          new ErrorResponse(`Budget not found with id of ${req.params.id}`, 404)
        );
      }
  
      const updatedBudget = await Budget.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });
  
      if (!updatedBudget) {
        return next(
          new ErrorResponse(`Error updating budget`, 500)
        );
      }
  
      const spent = await calculateSpending(updatedBudget, req.user.id);
  
      const budgetWithSpending = {
        ...updatedBudget.toObject(),
        spent,
        remaining: updatedBudget.limit - spent,
        percentage: (spent / updatedBudget.limit) * 100
      };
  
      res.status(200).json({
        success: true,
        data: budgetWithSpending
      });
    } catch (err) {
      next(err);
    }
  };
// @desc    Delete budget
// @route   DELETE /api/budgets/:id
// @access  Private
export const deleteBudget = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const budget = await Budget.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!budget) {
      return next(
        new ErrorResponse(`Budget not found with id of ${req.params.id}`, 404)
      );
    }

    await budget.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get budget statistics and analysis
// @route   GET /api/budgets/stats
// @access  Private
export const getBudgetStats = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get all active budgets
    const budgets = await Budget.find({
      user: req.user.id,
      endDate: { $gte: new Date() }
    });

    const budgetStats = await Promise.all(
      budgets.map(async (budget) => {
        const spent = await calculateSpending(budget, req.user.id);
        const remaining = budget.limit - spent;
        const percentage = (spent / budget.limit) * 100;

        // Get daily spending trend
        const dailySpending = await Transaction.aggregate([
          {
            $match: {
              user: req.user.id,
              category: budget.category,
              date: {
                $gte: budget.startDate,
                $lte: new Date()
              }
            }
          },
          {
            $group: {
              _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
              total: { $sum: "$amount" }
            }
          },
          { $sort: { _id: 1 } }
        ]);

        return {
          ...budget.toObject(),
          spent,
          remaining,
          percentage,
          dailySpending,
          daysRemaining: Math.ceil(
            (budget.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
          ),
          dailyBudget: remaining / Math.max(1, Math.ceil(
            (budget.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
          ))
        };
      })
    );

    res.status(200).json({
      success: true,
      data: budgetStats
    });
  } catch (err) {
    next(err);
  }
};

// Helper function to calculate spending for a budget
const calculateSpending = async (budget: any, userId: string): Promise<number> => {
  const transactions = await Transaction.find({
    user: userId,
    category: budget.category,
    type: 'expense',
    date: {
      $gte: budget.startDate,
      $lte: budget.endDate
    }
  });

  return transactions.reduce((total, transaction) => total + transaction.amount, 0);
};

// @desc    Get budget alerts
// @route   GET /api/budgets/alerts
// @access  Private
export const getBudgetAlerts = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const budgets = await Budget.find({
      user: req.user.id,
      endDate: { $gte: new Date() }
    });

    const alerts = await Promise.all(
      budgets.map(async (budget) => {
        const spent = await calculateSpending(budget, req.user.id);
        const percentage = (spent / budget.limit) * 100;

        // Check if spending exceeds thresholds
        const alerts = [];
        if (percentage >= 90) {
          alerts.push('Critical: Budget almost exhausted');
        } else if (percentage >= 75) {
          alerts.push('Warning: Budget usage high');
        }

        // Check spending rate
        const daysElapsed = Math.ceil(
          (new Date().getTime() - budget.startDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        const totalDays = Math.ceil(
          (budget.endDate.getTime() - budget.startDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        
        const expectedPercentage = (daysElapsed / totalDays) * 100;
        if (percentage > expectedPercentage + 10) {
          alerts.push('Warning: Spending rate higher than expected');
        }

        return {
          budgetId: budget._id,
          category: budget.category,
          spent,
          limit: budget.limit,
          percentage,
          alerts
        };
      })
    );

    // Filter to only return budgets with alerts
    const activeAlerts = alerts.filter(alert => alert.alerts.length > 0);

    res.status(200).json({
      success: true,
      data: activeAlerts
    });
  } catch (err) {
    next(err);
  }
};