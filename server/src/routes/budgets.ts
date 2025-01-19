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
  getBudgetStats,
  getBudgetAlerts
} from '../controllers/budgetController';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

// Validation middleware for budget creation/updates
const budgetValidation = [
  body('category').notEmpty().withMessage('Category is required'),
  body('limit').isNumeric().withMessage('Limit must be a number'),
  body('period').isIn(['daily', 'weekly', 'monthly', 'yearly'])
    .withMessage('Invalid period'),
  body('startDate').isISO8601().withMessage('Invalid start date'),
  body('endDate').isISO8601().withMessage('Invalid end date')
];

// Special routes MUST come before the /:id route
router.get('/stats', getBudgetStats);
router.get('/alerts', getBudgetAlerts);

// Standard CRUD routes
router.route('/')
  .get(getBudgets)
  .post(budgetValidation, validate(budgetValidation), createBudget);

// /:id routes must come last
router.route('/:id')
  .get(getBudget)
  .put(budgetValidation, validate(budgetValidation), updateBudget)
  .delete(deleteBudget);

export default router;