import express from 'express';
import { body } from 'express-validator';
import { protect } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  getBudgets,
  getBudget,
  createBudget,
  updateBudget,
  deleteBudget,
  getBudgetStats
} from '../controllers/budgetController';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getBudgets)
  .post(
    [
      body('category').notEmpty().withMessage('Category is required'),
      body('limit').isNumeric().withMessage('Limit must be a number'),
      body('period').isIn(['daily', 'weekly', 'monthly', 'yearly'])
        .withMessage('Invalid period'),
      body('startDate').isISO8601().withMessage('Invalid start date'),
      body('endDate').isISO8601().withMessage('Invalid end date')
    ],
    validate([
      body('category').notEmpty().withMessage('Category is required'),
      body('limit').isNumeric().withMessage('Limit must be a number'),
      body('period').isIn(['daily', 'weekly', 'monthly', 'yearly'])
        .withMessage('Invalid period'),
      body('startDate').isISO8601().withMessage('Invalid start date'),
      body('endDate').isISO8601().withMessage('Invalid end date')
    ]),
    createBudget
  );

router
  .route('/:id')
  .get(getBudget)
  .put(updateBudget)
  .delete(deleteBudget);

router.get('/stats/:category', getBudgetStats);

export default router;