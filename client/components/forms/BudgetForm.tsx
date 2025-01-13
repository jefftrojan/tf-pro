// components/forms/BudgetForm.tsx
'use client';

import { useState } from 'react';
import { 
  X, 
  DollarSign, 
  Calendar,
  Bell,
  Tag,
  Loader2 
} from 'lucide-react';

interface BudgetFormProps {
  isOpen: boolean;
  onClose: () => void;
  budget?: {
    id: string;
    category: string;
    limit: number;
    period: string;
    startDate: string;
    endDate: string;
    notifications: boolean;
  };
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

export default function BudgetForm({ isOpen, onClose, budget }: BudgetFormProps) {
  const [formData, setFormData] = useState({
    category: budget?.category || '',
    limit: budget?.limit?.toString() || '',
    period: budget?.period || 'monthly',
    startDate: budget?.startDate || new Date().toISOString().split('T')[0],
    endDate: budget?.endDate || '',
    notifications: budget?.notifications ?? true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      onClose();
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
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
                onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/20"
                placeholder="0.00"
                required
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
                  onClick={() => setFormData({ ...formData, period })}
                  className={`px-4 py-2 rounded-lg border capitalize transition-colors ${
                    formData.period === period
                      ? 'bg-white/20 border-white/30 text-white'
                      : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                  }`}
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
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/20"
                  required
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
                />
              </div>
            </div>
          </div>

          {/* Notifications */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.notifications}
              onChange={(e) => setFormData({ ...formData, notifications: e.target.checked })}
              className="rounded border-white/20 bg-white/5 text-purple-500 focus:ring-purple-500"
            />
            <span className="text-white">Enable budget notifications</span>
          </label>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-4 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-white/40 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
                {budget ? 'Updating Budget...' : 'Creating Budget...'}
              </div>
            ) : (
              budget ? 'Update Budget' : 'Create Budget'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}