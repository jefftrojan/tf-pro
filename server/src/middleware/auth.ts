// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ErrorResponse } from '../utils/errorResponse';
import { User } from '../models/User';
import config from '../config/env';

export interface AuthRequest extends Request {
  user?: any;
}

// Protect routes
export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let token: string | undefined;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      // Get token from Bearer token in header
      token = req.headers.authorization.split(' ')[1];
    }
    // Check for token in cookie
    else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    // Make sure token exists
    if (!token) {
      return next(new ErrorResponse('Not authorized to access this route', 401));
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, config.JWT_SECRET) as any;

      // Get user from the token
      const user = await User.findById(decoded.id);

      if (!user) {
        return next(new ErrorResponse('No user found with this id', 401));
      }

      // Add user to request
      req.user = user;
      next();
    } catch (err) {
      // Handle JWT verification errors
      if (err instanceof jwt.JsonWebTokenError) {
        return next(new ErrorResponse('Invalid token', 401));
      }
      if (err instanceof jwt.TokenExpiredError) {
        return next(new ErrorResponse('Token expired', 401));
      }
      return next(new ErrorResponse('Not authorized to access this route', 401));
    }
  } catch (err) {
    next(err);
  }
};

// Grant access to specific roles
export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ErrorResponse('Not authorized to access this route', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};