'use client';

import { useState, useEffect } from 'react';
import { 
  X, 
  DollarSign, 
  Calendar,
  Tag,
  Loader2,
  Trash2 
} from 'lucide-react';
import { budgets } from '@/lib/api';
import { Budget } from '@/lib/types';

interface BudgetFormData {
  category: string;
  limit: number;
  color?: string;
  period: string;
  startDate: string;
  endDate: string;
}

interface BudgetFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: Budget) => void;
  budget?: Budget;
  isLoading?: boolean;
}

const periods = ['daily', 'weekly', 'monthly', 'yearly'];
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
  'Savings',
  'Others'
];

export default function BudgetForm({ 
  isOpen, 
  onClose, 
  onSubmit,
  budget,
  isLoading = false,
}: BudgetFormProps) {
  const [formData, setFormData] = useState<BudgetFormData>({
    category: '',
    limit: 0,
    color: '#' + Math.floor(Math.random()*16777215).toString(16), 
    period: 'monthly',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0]
  });
  const [error, setError] = useState('');

  // Update form when editing existing budget
  useEffect(() => {
    if (budget) {
      const today = new Date();
      const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
  
      setFormData({
        category: budget.category || '',
        limit: budget.limit || 0,
        color: budget.color || '#' + Math.floor(Math.random()*16777215).toString(16),
        period: 'monthly', // default if not specified
        startDate: budget.startDate || today.toISOString().split('T')[0],
        endDate: budget.endDate || nextMonth.toISOString().split('T')[0]
      });
    }
  }, [budget]);

  const validateForm = (): boolean => {
    setError('');
  
    // Trim category and check
    const trimmedCategory = formData.category.trim();
    if (!trimmedCategory) {
      setError('Please select a category');
      return false;
    }
  
    // Validate limit
    const limitNum = Number(formData.limit);
    if (isNaN(limitNum) || limitNum <= 0) {
      setError('Please enter a valid budget limit');
      return false;
    }
  
    // Validate dates
    if (!formData.startDate) {
      setError('Please select a start date');
      return false;
    }
  
    if (!formData.endDate) {
      setError('Please select an end date');
      return false;
    }
  
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
  
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      setError('Invalid date selection');
      return false;
    }
  
    if (endDate <= startDate) {
      setError('End date must be after start date');
      return false;
    }
  
    return true;
  };

  const handlePeriodChange = (period: string) => {
    const startDate = new Date(formData.startDate);
    let endDate = new Date(startDate);

    switch (period) {
      case 'daily':
        endDate.setDate(startDate.getDate() + 1);
        break;
      case 'weekly':
        endDate.setDate(startDate.getDate() + 7);
        break;
      case 'monthly':
        endDate.setMonth(startDate.getMonth() + 1);
        break;
      case 'yearly':
        endDate.setFullYear(startDate.getFullYear() + 1);
        break;
    }

    setFormData(prev => ({
      ...prev,
      period,
      endDate: endDate.toISOString().split('T')[0]
    }));
  };

  const handleStartDateChange = (date: string) => {
    const startDate = new Date(date);
    let endDate = new Date(startDate);

    switch (formData.period) {
      case 'daily':
        endDate.setDate(startDate.getDate() + 1);
        break;
      case 'weekly':
        endDate.setDate(startDate.getDate() + 7);
        break;
      case 'monthly':
        endDate.setMonth(startDate.getMonth() + 1);
        break;
      case 'yearly':
        endDate.setFullYear(startDate.getFullYear() + 1);
        break;
    }

    setFormData(prev => ({
      ...prev,
      startDate: date,
      endDate: endDate.toISOString().split('T')[0]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!validateForm()) {
      return;
    }
  
    try {
      // Trim and validate all fields
      const budgetData = {
        category: formData.category.trim(),
        limit: Number(formData.limit),
        color: formData.color || undefined,
        period: formData.period || 'monthly',
        startDate: formData.startDate,
        endDate: formData.endDate
      };
  
      // Additional validation
      if (!budgetData.category) {
        setError('Category is required');
        return;
      }
  
      if (isNaN(budgetData.limit) || budgetData.limit <= 0) {
        setError('Invalid budget limit');
        return;
      }
  
      console.log('Sending budget data:', budgetData);
  
      let response;
      if (budget) {
        // Update existing budget
        response = await budgets.update(budget._id, budgetData);
      } else {
        // Create new budget
        response = await budgets.create(budgetData);
      }
  
      if (response.data) {
        onSubmit?.(response.data);
        onClose();
      } else {
        setError(response.message || 'Failed to submit budget');
      }
    } catch (err: any) {
      console.error('Full error object:', err);
      console.error('Error response:', err.response);
      
      // More detailed error handling
      const errorMessage = 
        err.response?.data?.message || 
        err.message || 
        'Failed to submit budget';
  
      // If the error is from the API, it might contain multiple error messages
      if (typeof errorMessage === 'string' && errorMessage.includes(',')) {
        setError(errorMessage.split(',')[0]);
      } else {
        setError(errorMessage);
      }
    }
  };

  const handleDelete = async () => {
    if (budget && window.confirm('Are you sure you want to delete this budget?')) {
      try {
        await budgets.delete(budget._id);
        onClose();
      } catch (err: any) {
        setError(
          err.response?.data?.message || 
          err.message || 
          'Failed to delete budget'
        );
      }
    }
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
                {categories.map((category) => (
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
                onChange={(e) => setFormData({ ...formData, limit: parseFloat(e.target.value) })}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/20"
                placeholder="0.00"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Period */}
          <div className="space-y-2">
            <label className="text-sm text-white/60">Budget Period</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {periods.map((period) => (
                <button
                  key={period}
                  type="button"
                  onClick={() => handlePeriodChange(period)}
                  disabled={isLoading}
                  className={`px-4 py-2 rounded-lg border capitalize transition-colors ${
                    formData.period === period
                      ? 'bg-white/20 border-white/30 text-white'
                      : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {period}
                </button>
              ))}
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
            {budget && (
              <button
                type="button"
                onClick={handleDelete}
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