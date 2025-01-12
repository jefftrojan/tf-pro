import express from 'express';
import { body } from 'express-validator';
import { protect } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getCategories)
  .post(
    [
      body('name').notEmpty().withMessage('Category name is required'),
      body('type').isIn(['income', 'expense'])
        .withMessage('Invalid category type')
    ],
    validate([
      body('name').notEmpty().withMessage('Category name is required'),
      body('type').isIn(['income', 'expense'])
        .withMessage('Invalid category type')
    ]),
    createCategory
  );

router
  .route('/:id')
  .get(getCategory)
  .put(updateCategory)
  .delete(deleteCategory);

export default router;