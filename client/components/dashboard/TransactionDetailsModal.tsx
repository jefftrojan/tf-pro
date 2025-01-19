// components/modals/TransactionDetailsModal.tsx
'use client';

import { useState } from 'react';
import { 
  X, 
  Download, 
  Edit, 
  Trash2, 
  ExternalLink, 
  ArrowUpRight, 
  ArrowDownRight,
  Tag,
  Loader2
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import TransactionForm from '@/components/forms/TransactionForm';

interface Transaction {
  _id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
  account: string;
  status: 'completed' | 'pending' | 'failed';
  reference?: string;
  notes?: string;
  receipt?: string;
  tags?: string[];
}

interface Account {
  _id: string;
  name: string;
  type: string;
  balance: number;
  currency?: string;
}

interface TransactionDetailsModalProps {
  transaction: Transaction;
  accounts: Account[];
  onClose: () => void;
  onDelete?: (id: string) => Promise<void>;
  onUpdate?: (id: string, data: Partial<Transaction>) => Promise<void>;
  isDeleting?: boolean;
  isUpdating?: boolean;
}

export default function TransactionDetailsModal({
  transaction,
  accounts,
  onClose,
  onDelete,
  onUpdate,
  isDeleting = false,
  isUpdating = false
}: TransactionDetailsModalProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Find associated account
  const account = accounts.find(a => a._id === transaction.account);

  const handleDelete = async () => {
    if (!onDelete) return;
    
    if (window.confirm('Are you sure you want to delete this transaction? This action cannot be undone.')) {
      try {
        await onDelete(transaction._id);
        onClose();
      } catch (error) {
        console.error('Failed to delete transaction:', error);
      }
    }
  };

  const handleUpdate = async (formData: Partial<Transaction>) => {
    if (!onUpdate) return;
    
    try {
      await onUpdate(transaction._id, formData);
      setIsEditMode(false);
    } catch (error) {
      console.error('Failed to update transaction:', error);
    }
  };

  if (isEditMode) {
    return (
      <TransactionForm
        isOpen={true}
        onClose={() => setIsEditMode(false)}
        onSubmit={handleUpdate}
        accounts={accounts}
        transaction={transaction}
        isLoading={isUpdating}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-semibold text-white">Transaction Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-white/60 text-sm mb-1">Amount</p>
              <p className={`text-2xl font-bold ${
                transaction.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {transaction.type === 'income' ? '+' : '-'}
                {formatCurrency(transaction.amount)}
              </p>
            </div>
            <div>
              <p className="text-white/60 text-sm mb-1">Date</p>
              <p className="text-xl font-medium text-white">
                {formatDate(transaction.date)}
              </p>
            </div>
          </div>

          {/* Account & Type */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-white/60 text-sm mb-1">Account</p>
              <p className="text-white">{account?.name || 'Unknown Account'}</p>
            </div>
            <div>
              <p className="text-white/60 text-sm mb-1">Type</p>
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full ${
                transaction.type === 'income' 
                  ? 'bg-emerald-400/10 text-emerald-400'
                  : 'bg-rose-400/10 text-rose-400'
              }`}>
                {transaction.type === 'income' ? (
                  <ArrowUpRight className="h-4 w-4" />
                ) : (
                  <ArrowDownRight className="h-4 w-4" />
                )}
                {transaction.type}
              </span>
            </div>
          </div>

          {/* Category */}
          <div>
            <p className="text-white/60 text-sm mb-1">Category</p>
            <p className="text-white">{transaction.category}</p>
          </div>

          {/* Description & Reference */}
          <div>
            <p className="text-white/60 text-sm mb-1">Description</p>
            <p className="text-white">{transaction.description}</p>
            {transaction.reference && (
              <p className="text-white/60 text-sm mt-1">
                Reference: {transaction.reference}
              </p>
            )}
          </div>

          {/* Tags */}
          {transaction.tags && transaction.tags.length > 0 && (
            <div>
              <p className="text-white/60 text-sm mb-2">Tags</p>
              <div className="flex flex-wrap gap-2">
                {transaction.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-white/10 rounded-lg text-white text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {transaction.notes && (
            <div>
              <p className="text-white/60 text-sm mb-1">Notes</p>
              <p className="text-white whitespace-pre-line">{transaction.notes}</p>
            </div>
          )}

          {/* Receipt */}
          {transaction.receipt && (
            <div>
              <p className="text-white/60 text-sm mb-2">Receipt</p>
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors">
                <Download className="h-4 w-4" />
                Download Receipt
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-white/10">
          <div>
            {onDelete && (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-2 px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-colors disabled:opacity-50"
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                Delete
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="px-4 py-2 hover:bg-white/10 text-white rounded-lg transition-colors"
            >
              Close
            </button>
            {onUpdate && (
              <button
                onClick={() => setIsEditMode(true)}
                disabled={isUpdating}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {isUpdating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Edit className="h-4 w-4" />
                )}
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}