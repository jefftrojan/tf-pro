// components/forms/AccountForm.tsx
'use client';

import { useState } from 'react';
import { 
  X, 
  Wallet, 
  CreditCard, 
  PiggyBank, 
  TrendingUp,
  DollarSign,
  Loader2 
} from 'lucide-react';

interface AccountFormProps {
  isOpen: boolean;
  onClose: () => void;
  account?: {
    id: string;
    name: string;
    type: string;
    balance: number;
    currency: string;
  };
}

const accountTypes = [
  { id: 'checking', name: 'Checking Account', icon: Wallet },
  { id: 'savings', name: 'Savings Account', icon: PiggyBank },
  { id: 'credit', name: 'Credit Card', icon: CreditCard },
  { id: 'investment', name: 'Investment Account', icon: TrendingUp },
];

const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'];

export default function AccountForm({ isOpen, onClose, account }: AccountFormProps) {
  const [formData, setFormData] = useState({
    name: account?.name || '',
    type: account?.type || 'checking',
    balance: account?.balance?.toString() || '0',
    currency: account?.currency || 'USD'
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
            {account ? 'Edit Account' : 'Add New Account'}
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
          {/* Account Name */}
          <div className="space-y-2">
            <label className="text-sm text-white/60">Account Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/20"
              placeholder="e.g., Main Checking Account"
              required
            />
          </div>

          {/* Account Type */}
          <div className="space-y-2">
            <label className="text-sm text-white/60">Account Type</label>
            <div className="grid grid-cols-2 gap-3">
              {accountTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, type: type.id })}
                  className={`flex items-center gap-2 p-3 rounded-lg border transition-colors ${
                    formData.type === type.id
                      ? 'bg-white/20 border-white/30 text-white'
                      : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                  }`}
                >
                  <type.icon className="h-5 w-5" />
                  <span className="text-sm">{type.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Initial Balance */}
          <div className="space-y-2">
            <label className="text-sm text-white/60">Initial Balance</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
              <input
                type="number"
                step="0.01"
                value={formData.balance}
                onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/20"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          {/* Currency */}
          <div className="space-y-2">
            <label className="text-sm text-white/60">Currency</label>
            <select
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/20"
            >
              {currencies.map((currency) => (
                <option key={currency} value={currency}>{currency}</option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-4 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-white/40 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
                {account ? 'Updating Account...' : 'Creating Account...'}
              </div>
            ) : (
              account ? 'Update Account' : 'Create Account'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}