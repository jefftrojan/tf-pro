import express from 'express';
import { body } from 'express-validator';
import { protect } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { upload } from '../middleware/upload';
import {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  uploadReceipt
} from '../controllers/transactionController';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getTransactions)
  .post(
    [
      body('type').isIn(['income', 'expense', 'transfer'])
        .withMessage('Invalid transaction type'),
      body('amount').isNumeric().withMessage('Amount must be a number'),
      body('category').notEmpty().withMessage('Category is required'),
      body('account').notEmpty().withMessage('Account is required')
    ],
    validate([
      body('type').isIn(['income', 'expense', 'transfer'])
        .withMessage('Invalid transaction type'),
      body('amount').isNumeric().withMessage('Amount must be a number'),
      body('category').notEmpty().withMessage('Category is required'),
      body('account').notEmpty().withMessage('Account is required')
    ]),
    createTransaction
  );

router
  .route('/:id')
  .get(getTransaction)
  .put(updateTransaction)
  .delete(deleteTransaction);

router.post('/:id/receipt', upload.single('receipt'), uploadReceipt);

export default router;