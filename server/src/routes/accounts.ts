import express from 'express';
import { body } from 'express-validator';
import { protect } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  getAccounts,
  getAccount,
  createAccount,
  updateAccount,
  deleteAccount
} from '../controllers/accountController';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getAccounts)
  .post(
    [
      body('name').notEmpty().withMessage('Account name is required'),
      body('type').isIn(['checking', 'savings', 'credit', 'investment', 'cash'])
        .withMessage('Invalid account type')
    ],
    validate([
      body('name').notEmpty().withMessage('Account name is required'),
      body('type').isIn(['checking', 'savings', 'credit', 'investment', 'cash'])
        .withMessage('Invalid account type')
    ]),
    createAccount
  );

router
  .route('/:id')
  .get(getAccount)
  .put(updateAccount)
  .delete(deleteAccount);

export default router;