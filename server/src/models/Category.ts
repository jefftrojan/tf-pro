import mongoose from 'mongoose';

export interface ICategory extends mongoose.Document {
  name: string;
  type: string;
  icon?: string;
  color?: string;
  parent?: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  isCustom: boolean;
  createdAt: Date;
}

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a category name']
  },
  type: {
    type: String,
    required: [true, 'Please specify the category type'],
    enum: ['income', 'expense']
  },
  icon: String,
  color: String,
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isCustom: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Category = mongoose.model<ICategory>('Category', CategorySchema);