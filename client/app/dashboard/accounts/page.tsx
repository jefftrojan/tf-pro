'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  PlusCircle, 
  Wallet, 
  CreditCard, 
  PiggyBank, 
  ArrowUpRight, 
  ArrowDownRight,
  DollarSign,
  TrendingUp,
  MoreVertical 
} from 'lucide-react';
import { accounts } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

interface Account {
  _id: string;
  name: string;
  type: string;
  balance: number;
  currency: string;
}

export default function AccountsOverview() {
  const [loading, setLoading] = useState(true);
  const [accountsData, setAccountsData] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await accounts.getAll();
        setAccountsData(response.data.data);
      } catch (error) {
        console.error('Error fetching accounts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  const totalBalance = accountsData.reduce((sum, account) => sum + account.balance, 0);
  const totalIncome = 5230.50; // todo: would calculate this from transactions
  const totalExpenses = 1890.75; // todo: would calculate this from transactions

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

  if (loading) {
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

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white/60 font-medium">Total Balance</h3>
            <DollarSign className="h-5 w-5 text-white/60" />
          </div>
          <p className="text-3xl font-bold text-white mb-4">
            {formatCurrency(totalBalance)}
          </p>
          <div className="flex items-center text-emerald-400">
            <ArrowUpRight className="h-4 w-4 mr-1" />
            <span className="text-sm">+2.5% from last month</span>
          </div>
        </div>

        <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white/60 font-medium">Monthly Income</h3>
            <ArrowUpRight className="h-5 w-5 text-emerald-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-4">
            {formatCurrency(totalIncome)}
          </p>
          <div className="flex items-center text-emerald-400">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span className="text-sm">+12% from last month</span>
          </div>
        </div>

        <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white/60 font-medium">Monthly Expenses</h3>
            <ArrowDownRight className="h-5 w-5 text-rose-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-4">
            {formatCurrency(totalExpenses)}
          </p>
          <div className="flex items-center text-rose-400">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span className="text-sm">-8% from last month</span>
          </div>
        </div>
      </div>

      {/* Accounts List */}
      <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-6 border border-white/20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Your Accounts</h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors">
            <PlusCircle className="h-5 w-5" />
            <span>Add Account</span>
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {accountsData.map((account) => (
            <Link
              key={account._id}
              href={`/dashboard/accounts/${account._id}`}
              className="group backdrop-blur-lg bg-white/5 hover:bg-white/10 rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-lg text-white">
                    {getAccountIcon(account.type)}
                  </div>
                  <div>
                    <h3 className="font-medium text-white group-hover:text-white/90">
                      {account.name}
                    </h3>
                    <p className="text-sm text-white/60 capitalize">{account.type}</p>
                  </div>
                </div>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedAccount(account._id);
                  }}
                  className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <MoreVertical className="h-5 w-5 text-white/60" />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <p className="text-xl font-semibold text-white">
                  {formatCurrency(account.balance, account.currency)}
                </p>
                <div className="flex items-center text-emerald-400 text-sm">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  <span>+2.5%</span>
                </div>
              </div>
            </Link>
          ))}

          {/* Add Account Card */}
          <button className="group h-full min-h-[160px] backdrop-blur-lg bg-white/5 hover:bg-white/10 rounded-xl p-4 border border-dashed border-white/20 hover:border-white/40 transition-all flex flex-col items-center justify-center gap-3 text-white/60 hover:text-white">
            <PlusCircle className="h-8 w-8" />
            <span className="font-medium">Add New Account</span>
          </button>
        </div>
      </div>
    </div>
  );
}