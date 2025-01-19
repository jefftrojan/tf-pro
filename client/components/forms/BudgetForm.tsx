'use client';

import { useState, useEffect } from 'react';
import { 
  X, 
  DollarSign, 
  Calendar,
  Bell,
  Tag,
  Loader2,
  Trash2 
} from 'lucide-react';
import { Budget } from '@/lib/types';
import { getStatusColor } from '@/lib/utils';

interface BudgetFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  budget?: Budget | null;
  isLoading?: boolean;
  suggestedCategories?: Array<{ name: string; color: string; }>;
}

const periods = ['daily', 'weekly', 'monthly', 'yearly'];

export default function BudgetForm({ 
  isOpen, 
  onClose, 
  onSubmit,
  onDelete,
  budget,
  isLoading = false,
  suggestedCategories = []
}: BudgetFormProps) {
  const [formData, setFormData] = useState<any>({
    category: '',
    limit: '',
    period: 'monthly',
    startDate: new Date().toISOString().split('T')[0],
    endDate: (() => {
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);
      return endDate.toISOString().split('T')[0];
    })(),
    notifications: true,
    color: '#' + Math.floor(Math.random()*16777215).toString(16)
  });
  const [error, setError] = useState('');

  // Update form when editing existing budget
  useEffect(() => {
    if (budget) {
      setFormData({
        category: budget.category,
        limit: budget.limit.toString(),
        period: 'monthly', // Default period as it's not in the Budget type
        startDate: budget.period?.startDate || new Date().toISOString().split('T')[0],
        endDate: budget.period?.endDate || (() => {
          const endDate = new Date();
          endDate.setMonth(endDate.getMonth() + 1);
          return endDate.toISOString().split('T')[0];
        })(),
        notifications: true, // Default value as it's not in the Budget type
        color: budget.color,
        description: budget.description
      });
    }
  }, [budget]);

  const validateForm = (): boolean => {
    setError('');

    if (!formData.category) {
      setError('Please select a category');
      return false;
    }

    const limitNum = parseFloat(formData.limit);
    if (isNaN(limitNum) || limitNum <= 0) {
      setError('Please enter a valid budget limit');
      return false;
    }

    if (!formData.startDate) {
      setError('Please select a start date');
      return false;
    }

    if (!formData.endDate) {
      setError('Please select an end date');
      return false;
    }

    // Validate date range
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    if (end <= start) {
      setError('End date must be after start date');
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
      // Prepare data to match the expected format
      const submitData = {
        ...formData,
        limit: parseFloat(formData.limit),
        period: {
          startDate: formData.startDate,
          endDate: formData.endDate
        }
      };

      await onSubmit(submitData);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to submit budget');
    }
  };

  const handleStartDateChange = (date: string) => {
    let endDate = new Date(date);
    endDate.setMonth(endDate.getMonth() + 1);

    setFormData({
      ...formData,
      startDate: date,
      endDate: endDate.toISOString().split('T')[0]
    });
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
      <div className="relative w-full max-w-md backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">
            {budget ? 'Edit Budget' : 'Create New Budget'}
          </h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-white" />
          </button>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-white p-3 rounded-lg text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
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
                disabled={isLoading}
              >
                <option value="">Select Category</option>
                {(suggestedCategories.length > 0 
                  ? suggestedCategories.map(c => c.name) 
                  : [
                    'Housing', 'Transportation', 'Food & Dining', 
                    'Utilities', 'Entertainment', 'Healthcare', 
                    'Shopping', 'Personal Care', 'Education', 
                    'Savings', 'Others'
                  ]).map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Budget Limit */}
          <div className="space-y-2">
            <label className="text-sm text-white/60">Budget Limit</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
              <input
                type="number"
                step="0.01"
                value={formData.limit}
                onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/20"
                placeholder="0.00"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-white/60">Start Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleStartDateChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/20"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-white/60">End Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/20"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            {/* Delete Button - Only show for existing budgets */}
            {budget && onDelete && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this budget?')) {
                    onDelete(budget._id);
                  }
                }}
                disabled={isLoading}
                className="flex-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
              >
                <div className="flex items-center justify-center">
                  <Trash2 className="h-5 w-5 mr-2" />
                  Delete
                </div>
              </button>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-4 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-white/40 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  {budget ? 'Updating Budget...' : 'Creating Budget...'}
                </div>
              ) : (
                budget ? 'Update Budget' : 'Create Budget'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}