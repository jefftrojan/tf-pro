// src/controllers/accountController.ts
import { Response, NextFunction } from 'express';
import { Account } from '../models/Account';
import { ErrorResponse } from '../utils/errorResponse';
import { AuthRequest } from '../middleware/auth';

// @desc    Get all accounts
// @route   GET /api/accounts
// @access  Private
export const getAccounts = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const accounts = await Account.find({ user: req.user.id });

    res.status(200).json({
      success: true,
      count: accounts.length,
      data: accounts
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single account
// @route   GET /api/accounts/:id
// @access  Private
export const getAccount = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const account = await Account.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!account) {
      return next(
        new ErrorResponse(`Account not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: account
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new account
// @route   POST /api/accounts
// @access  Private
export const createAccount = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;

    const account = await Account.create(req.body);

    res.status(201).json({
      success: true,
      data: account
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update account
// @route   PUT /api/accounts/:id
// @access  Private
export const updateAccount = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let account = await Account.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!account) {
      return next(
        new ErrorResponse(`Account not found with id of ${req.params.id}`, 404)
      );
    }

    account = await Account.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: account
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete account
// @route   DELETE /api/accounts/:id
// @access  Private
export const deleteAccount = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const account = await Account.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!account) {
      return next(
        new ErrorResponse(`Account not found with id of ${req.params.id}`, 404)
      );
    }

    await Account.deleteOne({ _id: req.params.id, user: req.user.id });

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get account balance
// @route   GET /api/accounts/:id/balance
// @access  Private
export const getAccountBalance = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const account = await Account.findOne({
      _id: req.params.id,
      user: req.user.id
    }).select('balance');

    if (!account) {
      return next(
        new ErrorResponse(`Account not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: {
        balance: account.balance
      }
    });
  } catch (err) {
    next(err);
  }
};