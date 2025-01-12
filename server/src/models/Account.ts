// src/models/Account.ts
import mongoose from 'mongoose';

export interface IAccount extends mongoose.Document {
  name: string;
  type: string;
  balance: number;
  currency: string;
  user: mongoose.Types.ObjectId;
  transactions: mongoose.Types.ObjectId[];
  createdAt: Date;
}

const AccountSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add an account name']
  },
  type: {
    type: String,
    required: [true, 'Please specify the account type'],
    enum: ['checking', 'savings', 'credit', 'investment', 'cash']
  },
  balance: {
    type: Number,
    default: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  transactions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Account = mongoose.model<IAccount>('Account', AccountSchema);