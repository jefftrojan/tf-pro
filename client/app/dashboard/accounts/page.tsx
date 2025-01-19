'use client';

import { useState } from 'react';
import { 
  PlusCircle, 
  ArrowUpRight, 
  ArrowDownRight, 
  DollarSign, 
  TrendingUp, 
  MoreVertical, 
  Wallet, 
  CreditCard, 
  PiggyBank,
  Loader2 
} from 'lucide-react';
import { useAccounts } from '@/hooks/useAccounts';
import { useTransactions } from '@/hooks/useTransactions';
import { formatCurrency } from '@/lib/utils';
import AccountForm from '@/components/forms/AccountForm';
import { Account, Transaction } from '@/lib/types';

export default function AccountsOverview() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  
  // Calculate current month's date range
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  
  const {
    accounts = [],
    isLoading: isLoadingAccounts,
    isError: isAccountError,
    createAccount,
    updateAccount,
    deleteAccount,
    error: accountError
  } = useAccounts();

  const {
    transactions = [],
    isLoading: isLoadingTransactions
  } = useTransactions({
    startDate: startOfMonth.toISOString(),
    endDate: endOfMonth.toISOString()
  });

  const isLoading = isLoadingAccounts || isLoadingTransactions;
  const isError = isAccountError;
  const error = accountError;

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

  // Calculate monthly income and expenses from transactions
  const currentMonthStats = transactions.reduce((stats, transaction) => {
    if (transaction.type === 'income') {
      stats.income += transaction.amount;
    } else if (transaction.type === 'expense') {
      stats.expenses += transaction.amount;
    }
    return stats;
  }, { income: 0, expenses: 0 });

  const totalIncome = currentMonthStats.income;
  const totalExpenses = currentMonthStats.expenses;

  const getAccountIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'checking':
        return <Wallet className="h-6 w-6" />;
      case 'credit':
        return <CreditCard className="h-6 w-6" />;
      case 'savings':
        return <PiggyBank className="h-6 w-6" />;
      default:
        return <DollarSign className="h-6 w-6" />;
    }
  };

  const handleCreateAccount = async (formData: Partial<Account>) => {
    try {
      if (!formData.name || !formData.type || formData.balance === undefined) {
        throw new Error('Missing required fields');
      }
      await createAccount.mutate({
        name: formData.name,
        type: formData.type,
        balance: formData.balance,
        currency: formData.currency || 'USD'
      });
      setIsFormOpen(false);
      setSelectedAccount(null);
    } catch (error) {
      console.error('Failed to create account:', error);
    }
  };

  const handleUpdateAccount = async (formData: Partial<Account>) => {
    if (selectedAccount?._id) {
      try {
        await updateAccount.mutate({
          id: selectedAccount._id,
          data: formData
        });
        setIsFormOpen(false);
        setSelectedAccount(null);
      } catch (error) {
        console.error('Failed to update account:', error);
      }
    }
  };

  const handleDeleteAccount = async (accountId: string) => {
    if (confirm('Are you sure you want to delete this account?')) {
      try {
        await deleteAccount.mutate(accountId);
        setIsFormOpen(false);
        setSelectedAccount(null);
      } catch (error) {
        console.error('Failed to delete account:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="backdrop-blur-lg bg-white/10 rounded-2xl p-6 animate-pulse">
            <div className="h-6 w-32 bg-white/20 rounded mb-4"></div>
            <div className="h-10 w-48 bg-white/20 rounded mb-6"></div>
            <div className="flex justify-between">
              <div className="h-8 w-20 bg-white/20 rounded"></div>
              <div className="h-8 w-8 bg-white/20 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-white text-center p-6 backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20">
        <p className="text-red-400">Error loading accounts: {error?.message}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Total Balance */}
        <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-6 border border-white/20">
          <h3 className="text-white/60 font-medium">Total Balance</h3>
          <p className="text-3xl font-bold text-white mb-4">{formatCurrency(totalBalance)}</p>
          <div className="text-emerald-400 flex items-center">
            <ArrowUpRight className="h-4 w-4 mr-1" />
          </div>
        </div>
        {/* Income */}
        <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-6 border border-white/20">
          <h3 className="text-white/60 font-medium">Monthly Income</h3>
          <p className="text-3xl font-bold text-white mb-4">{formatCurrency(totalIncome)}</p>
          <div className="text-emerald-400 flex items-center">
            <TrendingUp className="h-4 w-4 mr-1" />
          </div>
        </div>
        {/* Expenses */}
        <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-6 border border-white/20">
          <h3 className="text-white/60 font-medium">Monthly Expenses</h3>
          <p className="text-3xl font-bold text-white mb-4">{formatCurrency(totalExpenses)}</p>
          <div className="text-rose-400 flex items-center">
            <ArrowDownRight className="h-4 w-4 mr-1" />
          </div>
        </div>
      </div>

      {/* Accounts List */}
      <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-6 border border-white/20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Your Accounts</h2>
          <button 
            onClick={() => setIsFormOpen(true)}
            disabled={createAccount.isPending}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white disabled:opacity-50"
          >
            {createAccount.isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <PlusCircle className="h-5 w-5" />
            )}
            Add Account
          </button>
        </div>

        {accounts.length === 0 ? (
          <div className="text-center py-12 text-white/60">
            <p>No accounts found. Create your first account to get started!</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {accounts.map((account) => (
              <div
                key={account._id}
                className="group backdrop-blur-lg bg-white/5 hover:bg-white/10 rounded-xl p-4 border border-white/10"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/10 rounded-lg text-white">
                      {getAccountIcon(account.type)}
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{account.name}</h3>
                      <p className="text-sm text-white/60 capitalize">{account.type}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedAccount(account);
                      setIsFormOpen(true);
                    }}
                    className="p-2 hover:bg-white/10 rounded-lg"
                  >
                    <MoreVertical className="h-5 w-5 text-white/60" />
                  </button>
                </div>
                <p className="text-xl font-semibold text-white">
                  {formatCurrency(account.balance, account.currency)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Account Form Modal */}
      <AccountForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedAccount(null);
        }}
        account={selectedAccount}
        onSubmit={selectedAccount ? handleUpdateAccount : handleCreateAccount}
        onDelete={selectedAccount ? () => handleDeleteAccount(selectedAccount._id) : undefined}
        isLoading={createAccount.isPending || updateAccount.isPending}
      />
    </div>
  );
}