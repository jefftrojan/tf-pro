import mongoose from 'mongoose';
import { IAccount } from './Account';

export interface ITransaction extends mongoose.Document {
  type: string;
  amount: number;
  category: string;
  subcategory?: string;
  description?: string;
  date: Date;
  account: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  receiptUrl?: string;
  tags?: string[];
  createdAt: Date;
}


const TransactionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: [true, 'Please specify the transaction type'],
    enum: ['income', 'expense', 'transfer']
  },
  amount: {
    type: Number,
    required: [true, 'Please add an amount']
  },
  category: {
    type: String,
    required: [true, 'Please specify a category']
  },
  subcategory: String,
  description: String,
  date: {
    type: Date,
    default: Date.now
  },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiptUrl: String,
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }, 

});


// Update account balance after transaction
TransactionSchema.post('save', async function(doc) {
    const Account = this.model('Account');
    const account = await Account.findById(doc.account) as IAccount | null;
    
    if (account) {
      account.balance += doc.type === 'income' ? doc.amount : -doc.amount;
      await account.save();
    }
  });

export const Transaction = mongoose.model<ITransaction>('Transaction', TransactionSchema);