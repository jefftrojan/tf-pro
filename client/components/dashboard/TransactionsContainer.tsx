// components/dashboard/TransactionsContainer.tsx
'use client';

import { useState } from 'react';
import { 
  PlusCircle, 
  Search, 
  Filter, 
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  FileText, 
  Loader2 
} from 'lucide-react';
import TransactionForm from '@/components/forms/TransactionForm';
import TransactionDetailsModal from '@/components/dashboard/TransactionDetailsModal';
import { useTransactions } from '@/hooks/useTransactions';
import { useAccounts } from '@/hooks/useAccounts';
import { formatCurrency } from '@/lib/utils';
import { Transaction, Account } from '@/lib/types';

interface TransactionFilters {
  type: string;
  account: string;
  category: string;
  startDate: string;
  endDate: string;
}

export default function TransactionsContainer() {
  // State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<TransactionFilters>({
    type: 'all',
    account: 'all',
    category: 'all',
    startDate: '',
    endDate: '',
  });

  // Fetch data using custom hooks
  const { 
    transactions = [], 
    isLoading: isLoadingTransactions,
    isError: isTransactionsError,
    createTransaction,
    updateTransaction,
    deleteTransaction
  } = useTransactions(filters);

  const { 
    accounts = [], 
    isLoading: isLoadingAccounts,
    isError: isAccountsError 
  } = useAccounts();

  // Handle transaction creation
  const handleCreateTransaction = async (formData: Partial<Transaction>) => {
    try {
      // Validate required fields
      if (!formData.description || !formData.amount || !formData.type || !formData.account) {
        throw new Error('Please fill in all required fields');
      }

      await createTransaction.mutate(formData, {
        onSuccess: () => {
          setIsAddModalOpen(false);
        },
        onError: (error) => {
          console.error('Failed to create transaction:', error);
          throw error;
        }
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Failed to create transaction');
    }
  };

  // Handle transaction update
  const handleUpdateTransaction = async (id: string, data: Partial<Transaction>) => {
    try {
      await updateTransaction.mutate(
        { id, data },
        {
          onSuccess: () => {
            setSelectedTransaction(null);
          },
          onError: (error) => {
            console.error('Failed to update transaction:', error);
          }
        }
      );
    } catch (error) {
      console.error('Failed to update transaction:', error);
    }
  };

  // Handle transaction deletion
  const handleDeleteTransaction = async (id: string) => {
    try {
      await deleteTransaction.mutate(id, {
        onSuccess: () => {
          setSelectedTransaction(null);
        },
        onError: (error) => {
          console.error('Failed to delete transaction:', error);
        }
      });
    } catch (error) {
      console.error('Failed to delete transaction:', error);
    }
  };

  // Filter transactions based on search query
  const filteredTransactions = transactions.filter((transaction: Transaction) => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    const account = accounts.find(a => a._id === transaction.account);
    
    return (
      transaction.description?.toLowerCase().includes(searchLower) ||
      transaction.category?.toLowerCase().includes(searchLower) ||
      account?.name.toLowerCase().includes(searchLower)
    );
  });

  // Loading state
  if (isLoadingTransactions || isLoadingAccounts) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 text-white animate-spin" />
      </div>
    );
  }

  // Error state
  if (isTransactionsError || isAccountsError) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-rose-400 mb-2">Error loading data</p>
          <button 
            onClick={() => window.location.reload()}
            className="text-white/60 hover:text-white"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Transactions</h1>
          <p className="text-white/60">
            {filteredTransactions.length} total transactions
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            disabled={createTransaction.isPending}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors disabled:opacity-50"
          >
            {createTransaction.isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <PlusCircle className="h-5 w-5" />
            )}
            Add Transaction
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors">
            <Download className="h-5 w-5" />
            Export
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="relative col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/20"
          />
        </div>

        <select
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/20"
        >
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <select
          value={filters.account}
          onChange={(e) => setFilters({ ...filters, account: e.target.value })}
          className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/20"
        >
          <option value="all">All Accounts</option>
          {accounts.map((account: Account) => (
            <option key={account._id} value={account._id}>
              {account.name}
            </option>
          ))}
        </select>
      </div>

      {/* Transactions List */}
      <div className="backdrop-blur-lg bg-white/5 rounded-xl border border-white/10">
        {/* Table Header */}
        <div className="px-6 py-4 grid grid-cols-6 gap-4 items-center text-white/60 text-sm border-b border-white/10">
          <div className="col-span-2">Description</div>
          <div>Category</div>
          <div>Date</div>
          <div>Account</div>
          <div className="text-right">Amount</div>
        </div>

        {/* Table Body */}
        {filteredTransactions.length === 0 ? (
          <div className="px-6 py-8 text-center text-white/60">
            No transactions found
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {filteredTransactions.map((transaction) => {
const accountId =
typeof transaction.account === 'string'
  ? transaction.account
  : transaction.account?._id;
  const account = accounts.find((a) => a._id === accountId);
             
              return (
                <div
                  key={transaction._id}
                  onClick={() => setSelectedTransaction(transaction)}
                  className="px-6 py-4 grid grid-cols-6 gap-4 items-center hover:bg-white/5 cursor-pointer"
                >
                  <div className="col-span-2">
                    <p className="font-medium text-white">{transaction.description}</p>
                    {transaction.reference && (
                      <p className="text-white/60 text-sm">Ref: {transaction.reference}</p>
                    )}
                  </div>
                  <div className="text-white">{transaction.category}</div>
                  <div className="text-white">
                    {new Date(transaction.date).toLocaleDateString()}
                  </div>
                  <div className="text-white">
                  {account?.name || `Unknown Account (${transaction.account})`}

                  </div>
                  <div className={`text-right font-medium ${
                    transaction.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Transaction Form Modal */}
      <TransactionForm
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateTransaction}
        accounts={accounts}
        isLoading={createTransaction.isPending}
      />

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <TransactionDetailsModal
          transaction={selectedTransaction}
          accounts={accounts}
          onClose={() => setSelectedTransaction(null)}
          onDelete={handleDeleteTransaction}
          onUpdate={handleUpdateTransaction}
          isDeleting={deleteTransaction.isPending}
          isUpdating={updateTransaction.isPending}
        />
      )}
    </div>
  );
}