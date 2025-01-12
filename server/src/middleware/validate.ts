import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { ErrorResponse } from '../utils/errorResponse';

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Run all validations
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const extractedErrors: string[] = [];
    errors.array().map(err => extractedErrors.push(err.msg));

    return next(new ErrorResponse(extractedErrors.join(', '), 400));
  };
};

// Common validation rules
export const validatePagination = [
  (req: Request, res: Response, next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    
    req.query.page = page.toString();
    req.query.limit = limit.toString();
    req.query.skip = ((page - 1) * limit).toString();
    
    next();
  }
];

export const validateDateRange = [
  (req: Request, res: Response, next: NextFunction) => {
    const { startDate, endDate } = req.query;

    if (startDate && endDate) {
      const start = new Date(startDate as string);
      const end = new Date(endDate as string);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return next(new ErrorResponse('Invalid date format', 400));
      }

      if (start > end) {
        return next(
          new ErrorResponse('Start date must be before end date', 400)
        );
      }
    }

    next();
  }
];