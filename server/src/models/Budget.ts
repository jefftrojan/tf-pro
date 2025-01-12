import mongoose from 'mongoose';

export interface IBudget extends mongoose.Document {
  category: string;
  limit: number;
  spent: number;
  period: string;
  startDate: Date;
  endDate: Date;
  user: mongoose.Types.ObjectId;
  isActive: boolean;
  notifications: boolean;
  createdAt: Date;
}

const BudgetSchema = new mongoose.Schema({
  category: {
    type: String,
    required: [true, 'Please specify a category']
  },
  limit: {
    type: Number,
    required: [true, 'Please set a budget limit']
  },
  spent: {
    type: Number,
    default: 0
  },
  period: {
    type: String,
    required: [true, 'Please specify the budget period'],
    enum: ['daily', 'weekly', 'monthly', 'yearly']
  },
  startDate: {
    type: Date,
    required: [true, 'Please specify the start date']
  },
  endDate: {
    type: Date,
    required: [true, 'Please specify the end date']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  notifications: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Budget = mongoose.model<IBudget>('Budget', BudgetSchema);