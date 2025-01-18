// src/controllers/transactionController.ts
import { Response, NextFunction } from 'express';
import { Transaction } from '../models/Transaction';
import { Account } from '../models/Account';
import { ErrorResponse } from '../utils/errorResponse';
import { AuthRequest } from '../middleware/auth';

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Private
export const getTransactions = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { 
      startDate, 
      endDate, 
      type, 
      category, 
      account,
      sort = '-date',
      limit = 10,
      page = 1
    } = req.query;

    // Build query
    const query: any = { user: req.user.id };

    // Add date range to query if both dates are provided
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      };
    }

    // Add type filter if provided and not 'all'
    if (type && type !== 'all') {
      query.type = type;
    }

    // Add category filter if provided and not 'all'
    if (category && category !== 'all') {
      query.category = category;
    }

    // Add account filter if provided and not 'all'
    if (account && account !== 'all') {
      query.account = account;
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Execute query with pagination and populate account details
    const transactions = await Transaction.find(query)
      .sort(sort as string)
      .skip(skip)
      .limit(Number(limit))
      .populate('account', 'name type')
      .populate('category', 'name type'); // Optional: if you want category details too

    // Get total count for pagination
    const total = await Transaction.countDocuments(query);

    res.status(200).json({
      success: true,
      count: transactions.length,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      },
      data: transactions
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single transaction
// @route   GET /api/transactions/:id
// @access  Private
export const getTransaction = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user.id
    }).populate('account', 'name type');

    if (!transaction) {
      return next(
        new ErrorResponse(`Transaction not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: transaction
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new transaction
// @route   POST /api/transactions
// @access  Private
export const createTransaction = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;

    // Check if account exists and belongs to user
    const account = await Account.findOne({
      _id: req.body.account,
      user: req.user.id
    });

    if (!account) {
      return next(new ErrorResponse('Invalid account', 400));
    }

    const transaction = await Transaction.create(req.body);

    // Update account balance
    const amount = req.body.type === 'expense' ? -req.body.amount : req.body.amount;
    account.balance += amount;
    await account.save();

    // Populate account details in response
    await transaction.populate('account', 'name type');

    res.status(201).json({
      success: true,
      data: transaction
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update transaction
// @route   PUT /api/transactions/:id
// @access  Private
export const updateTransaction = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!transaction) {
      return next(
        new ErrorResponse(`Transaction not found with id of ${req.params.id}`, 404)
      );
    }

    // If amount or type is being updated, adjust account balance
    if (req.body.amount || req.body.type) {
      const account = await Account.findById(transaction.account);
      
      if (account) {
        // Reverse previous transaction
        const oldAmount = transaction.type === 'expense' 
          ? transaction.amount 
          : -transaction.amount;
        account.balance += oldAmount;

        // Apply new transaction
        const newAmount = (req.body.type || transaction.type) === 'expense'
          ? -(req.body.amount || transaction.amount)
          : (req.body.amount || transaction.amount);
        account.balance += newAmount;

        await account.save();
      }
    }

    // If account is being changed
    if (req.body.account && req.body.account !== transaction.account.toString()) {
      // Verify new account belongs to user
      const newAccount = await Account.findOne({
        _id: req.body.account,
        user: req.user.id
      });

      if (!newAccount) {
        return next(new ErrorResponse('Invalid account', 400));
      }

      // Reverse transaction from old account
      const oldAccount = await Account.findById(transaction.account);
      if (oldAccount) {
        const oldAmount = transaction.type === 'expense' 
          ? transaction.amount 
          : -transaction.amount;
        oldAccount.balance += oldAmount;
        await oldAccount.save();
      }

      // Apply transaction to new account
      const newAmount = transaction.type === 'expense' 
        ? -transaction.amount 
        : transaction.amount;
      newAccount.balance += newAmount;
      await newAccount.save();
    }

    transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('account', 'name type');

    res.status(200).json({
      success: true,
      data: transaction
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Private
export const deleteTransaction = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!transaction) {
      return next(
        new ErrorResponse(`Transaction not found with id of ${req.params.id}`, 404)
      );
    }

    // Update account balance before deleting transaction
    const account = await Account.findById(transaction.account);
    if (account) {
      const amount = transaction.type === 'expense' 
        ? transaction.amount 
        : -transaction.amount;
      account.balance += amount;
      await account.save();
    }

    await transaction.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Upload receipt for transaction
// @route   PUT /api/transactions/:id/receipt
// @access  Private
export const uploadReceipt = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!transaction) {
      return next(
        new ErrorResponse(`Transaction not found with id of ${req.params.id}`, 404)
      );
    }

    if (!req.file) {
      return next(new ErrorResponse(`Please upload a file`, 400));
    }

    // Update transaction with receipt URL
    transaction.receiptUrl = req.file.path;
    await transaction.save();

    res.status(200).json({
      success: true,
      data: transaction
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get transaction statistics
// @route   GET /api/transactions/stats
// @access  Private
export const getTransactionStats = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { startDate, endDate } = req.query;

    const query: any = { user: req.user.id };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      };
    }

    const stats = await Transaction.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
          avgAmount: { $avg: '$amount' }
        }
      }
    ]);

    const categoryStats = await Transaction.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: stats,
        byCategory: categoryStats
      }
    });
  } catch (err) {
    next(err);
  }
};