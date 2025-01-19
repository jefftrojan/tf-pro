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
  
  // Get accounts data
  const {
    accounts = [],
    isLoading: isLoadingAccounts,
    isError: isAccountsError,
    createAccount,
    updateAccount,
    deleteAccount,
    error: accountsError
  } = useAccounts();

  // Get current month's transactions
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const endOfMonth = new Date();
  endOfMonth.setHours(23, 59, 59, 999);

  const { transactions } = useTransactions({
    startDate: startOfMonth.toISOString(),
    endDate: endOfMonth.toISOString() 
  }) || { transactions: []};

  // Calculate totals
  const totalBalance = accounts.reduce((sum, account) => 
    sum + (account.balance || 0), 0);

  // Calculate this month's income and expenses
  const { totalIncome, totalExpenses } = transactions.reduce((acc, transaction) => {
    if (transaction.type === 'income') {
      acc.totalIncome += transaction.amount;
    } else if (transaction.type === 'expense') {
      acc.totalExpenses += transaction.amount;
    }
    return acc;
  }, { totalIncome: 0, totalExpenses: 0 });

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
      await createAccount.mutate(formData, {
        onSuccess: () => {
          setIsFormOpen(false);
          setSelectedAccount(null);
        },
        onError: (error) => {
          console.error('Failed to create account:', error);
        }
      });
    } catch (error) {
      console.error('Failed to create account:', error);
    }
  };

  const handleUpdateAccount = async (formData: Partial<Account>) => {
    if (!selectedAccount?._id) {
      console.error('No account selected for update');
      return;
    }
  
    try {
      // mke sure we're not sending _id in the data payload
      const { _id, ...updateData } = formData as Account;
      
      await updateAccount.mutate(
        {
          id: selectedAccount._id,
          data: {
            name: updateData.name,
            type: updateData.type,
            balance: updateData.balance,
            currency: updateData.currency
          }
        },
        {
          onSuccess: () => {
            setIsFormOpen(false);
            setSelectedAccount(null);
          },
          onError: (error) => {
            console.error('Failed to update account:', error);
          }
        }
      );
    } catch (error) {
      console.error('Failed to update account:', error);
    }
  };

  const handleDeleteAccount = async (accountId: string) => {
    try {
      await deleteAccount.mutate(accountId, {
        onSuccess: () => {
          setIsFormOpen(false);
          setSelectedAccount(null);
        },
        onError: (error) => {
          console.error('Failed to delete account:', error);
        }
      });
    } catch (error) {
      console.error('Failed to delete account:', error);
    }
  };

  // Loading state
  if (isLoadingAccounts) {
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

  // Error state
  if (isAccountsError) {
    return (
      <div className="text-white text-center p-6 backdrop-blur-lg bg-white/10 rounded-2xl">
        <p className="text-red-400">Error loading accounts: {accountsError?.message}</p>
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
          <p className="text-3xl font-bold text-white mb-4">
            {formatCurrency(totalBalance)}
          </p>
          <div className="text-emerald-400 flex items-center">
            <ArrowUpRight className="h-4 w-4 mr-1" />
            <span className="text-sm">Updated just now</span>
          </div>
        </div>

        {/* Income */}
        <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-6 border border-white/20">
          <h3 className="text-white/60 font-medium">Monthly Income</h3>
          <p className="text-3xl font-bold text-white mb-4">
            {formatCurrency(totalIncome)}
          </p>
          <div className="text-emerald-400 flex items-center">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span className="text-sm">This month</span>
          </div>
        </div>

        {/* Expenses */}
        <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-6 border border-white/20">
          <h3 className="text-white/60 font-medium">Monthly Expenses</h3>
          <p className="text-3xl font-bold text-white mb-4">
            {formatCurrency(totalExpenses)}
          </p>
          <div className="text-rose-400 flex items-center">
            <ArrowDownRight className="h-4 w-4 mr-1" />
            <span className="text-sm">This month</span>
          </div>
        </div>
      </div>

      {/* Accounts List */}
      <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-6 border border-white/20">
      <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Your Accounts</h2>
          <button 
            onClick={() => {
              setSelectedAccount(null);
              setIsFormOpen(true);
            }}
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