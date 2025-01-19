// components/dashboard/RecentTransactions.tsx
'use client';

import { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Search, Filter, MoreHorizontal } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
  account: string;
}

const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'expense',
    amount: 85.50,
    category: 'Food & Dining',
    description: 'Grocery Shopping',
    date: '2024-01-12',
    account: 'Main Account'
  },
  {
    id: '2',
    type: 'income',
    amount: 2500.00,
    category: 'Salary',
    description: 'Monthly Salary',
    date: '2024-01-10',
    account: 'Main Account'
  },
  {
    id: '3',
    type: 'expense',
    amount: 45.00,
    category: 'Transportation',
    description: 'Fuel',
    date: '2024-01-09',
    account: 'Credit Card'
  },
  {
    id: '4',
    type: 'expense',
    amount: 120.00,
    category: 'Entertainment',
    description: 'Movie Night',
    date: '2024-01-08',
    account: 'Credit Card'
  },
];

export default function RecentTransactions() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/20"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white transition-colors"
        >
          <Filter className="h-5 w-5" />
          <span>Filters</span>
        </button>
      </div>

      {/* Transactions List */}
      <div className="space-y-4">
        {mockTransactions.map((transaction) => (
          <div
            key={transaction.id}
            className="backdrop-blur-lg bg-white/5 hover:bg-white/10 rounded-lg p-4 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${
                  transaction.type === 'income' 
                    ? 'bg-emerald-400/10 text-emerald-400'
                    : 'bg-rose-400/10 text-rose-400'
                }`}>
                  {transaction.type === 'income' ? (
                    <ArrowUpRight className="h-5 w-5" />
                  ) : (
                    <ArrowDownRight className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-white">{transaction.description}</p>
                  <div className="flex items-center gap-2 text-white/60 text-sm">
                    <span>{transaction.category}</span>
                    <span>•</span>
                    <span>{transaction.account}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <p className={`text-lg font-medium ${
                  transaction.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </p>
                <button className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                  <MoreHorizontal className="h-5 w-5 text-white/60" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View All Link */}
      <button className="w-full py-2 text-white/60 hover:text-white transition-colors">
        View All Transactions
      </button>
    </div>
  );
}