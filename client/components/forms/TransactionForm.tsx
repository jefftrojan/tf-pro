// components/forms/TransactionForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { 
  X, 
  DollarSign, 
  Calendar,
  Tag,
  Loader2,
  Upload,
  Wallet,
  MessageSquare,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface Account {
  _id: string;
  name: string;
  type: string;
}

interface Transaction {
  _id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  account: string;
  date: string;
  description?: string;
  tags?: string[];
  receipt?: File | null;
}

interface TransactionFormData {
  type: 'income' | 'expense';
  amount: string;
  category: string;
  account: string;
  date: string;
  description: string;
  tags: string[];
  receipt: File | null;
}

interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Transaction>) => Promise<void>;
  accounts: Account[];
  transaction?: Transaction;
  isLoading?: boolean;
}

const categories = [
  'Housing',
  'Transportation',
  'Food & Dining',
  'Utilities',
  'Entertainment',
  'Healthcare',
  'Shopping',
  'Personal Care',
  'Education',
  'Income',
  'Others'
];

export default function TransactionForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  accounts,
  transaction,
  isLoading = false
}: TransactionFormProps) {
  // Form state
  const [formData, setFormData] = useState<TransactionFormData>({
    type: 'expense',
    amount: '',
    category: '',
    account: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    tags: [],
    receipt: null
  });
  
  const [error, setError] = useState('');
  const [newTag, setNewTag] = useState('');

  // Update form when editing existing transaction
  useEffect(() => {
    if (transaction) {
      setFormData({
        type: transaction.type,
        amount: transaction.amount.toString(),
        category: transaction.category,
        account: transaction.account,
        date: transaction.date,
        description: transaction.description || '',
        tags: transaction.tags || [],
        receipt: transaction.receipt || null
      });
    }
  }, [transaction]);

  const validateForm = (): boolean => {
    // Reset error
    setError('');

    // Required fields
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Please enter a valid amount');
      return false;
    }

    if (!formData.account) {
      setError('Please select an account');
      return false;
    }

    if (!formData.category) {
      setError('Please select a category');
      return false;
    }

    if (!formData.date) {
      setError('Please select a date');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const submitData = {
        ...formData,
        amount: parseFloat(formData.amount),
        tags: formData.tags.length > 0 ? formData.tags : undefined,
        description: formData.description.trim() || undefined
      };

      await onSubmit(submitData);
      onClose();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to submit transaction');
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('File size must be less than 5MB');
        return;
      }
      setFormData(prev => ({ ...prev, receipt: file }));
    }
  };

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      const tag = newTag.trim();
      if (!formData.tags.includes(tag)) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tag]
        }));
      }
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-xl p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">
            {transaction ? 'Edit Transaction' : 'New Transaction'}
          </h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="h-5 w-5 text-white" />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-white p-3 rounded-lg text-sm mb-6">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Transaction Type */}
          <div className="space-y-2">
            <label className="text-sm text-white/60">Transaction Type</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'income' })}
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                  formData.type === 'income'
                    ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
                    : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                }`}
              >
                <ArrowUpRight className="h-4 w-4" />
                Income
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'expense' })}
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                  formData.type === 'expense'
                    ? 'bg-rose-500/20 border-rose-500/30 text-rose-400'
                    : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                }`}
              >
                <ArrowDownRight className="h-4 w-4" />
                Expense
              </button>
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <label className="text-sm text-white/60">Amount</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/20"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          {/* Account */}
          <div className="space-y-2">
            <label className="text-sm text-white/60">Account</label>
            <div className="relative">
              <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
              <select
                value={formData.account}
                onChange={(e) => setFormData({ ...formData, account: e.target.value })}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/20"
                required
              >
                <option value="">Select Account</option>
                {Array.isArray(accounts) &&
    accounts.map((account: any) => (
      <option key={account._id} value={account._id}>
        {account.name}
      </option>
    ))}
              </select>
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm text-white/60">Category</label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/20"
                required
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <label className="text-sm text-white/60">Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/20"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm text-white/60">Description</label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-white/40" />
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/20 min-h-[80px]"
                placeholder="Add a description..."
              />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="text-sm text-white/60">Tags</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-white/10 rounded-lg text-white text-sm flex items-center gap-1"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-rose-400"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={addTag}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/20"
              placeholder="Add tags (press Enter)"
            />
          </div>

          {/* Receipt Upload */}
          <div className="space-y-2">
            <label className="text-sm text-white/60">Receipt</label>
            <div className="relative">
              <input
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                id="receipt"
                accept="image/*,.pdf"
              />
              <label
                htmlFor="receipt"
                className="flex items-center justify-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 cursor-pointer transition-colors"
              >
                <Upload className="h-5 w-5" />
                Upload Receipt
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-4 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-white/40 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
                {transaction ? 'Updating...' : 'Creating...'}
              </div>
            ) : (
              transaction ? 'Update Transaction' : 'Create Transaction'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

