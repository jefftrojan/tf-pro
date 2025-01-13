'use client';

import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface BudgetCategory {
  id: string;
  name: string;
  budget: number;
  spent: number;
  color: string;
}

// Sample data - replace with API data
const budgetCategories: BudgetCategory[] = [
  {
    id: '1',
    name: 'Housing',
    budget: 2000,
    spent: 1800,
    color: '#22c55e'
  },
  {
    id: '2',
    name: 'Food & Dining',
    budget: 800,
    spent: 750,
    color: '#eab308'
  },
  {
    id: '3',
    name: 'Transportation',
    budget: 400,
    spent: 380,
    color: '#3b82f6'
  },
  {
    id: '4',
    name: 'Entertainment',
    budget: 300,
    spent: 350,
    color: '#ef4444'
  },
];

export default function BudgetOverview() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const getPercentage = (spent: number, budget: number) => {
    return Math.round((spent / budget) * 100);
  };

  const getStatusColor = (spent: number, budget: number) => {
    const percentage = getPercentage(spent, budget);
    if (percentage >= 100) return 'bg-rose-400';
    if (percentage >= 80) return 'bg-amber-400';
    return 'bg-emerald-400';
  };

  return (
    <div className="space-y-6">
      {/* Overall Budget Status */}
      <div className="bg-white/5 rounded-xl p-4">
        <div className="flex justify-between items-center mb-2">
          <p className="text-white/60">Monthly Budget</p>
          <span className="text-white font-medium">
            {formatCurrency(3500)} / {formatCurrency(4000)}
          </span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-emerald-400 rounded-full"
            style={{ width: '87.5%' }}
          />
        </div>
        <p className="text-white/60 text-sm mt-2">
          You've spent 87.5% of your total budget
        </p>
      </div>

      {/* Category List */}
      <div className="space-y-4">
        {budgetCategories.map((category) => (
          <div
            key={category.id}
            className={`bg-white/5 rounded-xl p-4 transition-all ${
              selectedCategory === category.id ? 'ring-2 ring-white/20' : ''
            }`}
            onClick={() => setSelectedCategory(category.id)}
          >
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <p className="text-white font-medium">{category.name}</p>
              </div>
              <span className="text-white">
                {formatCurrency(category.spent)} / {formatCurrency(category.budget)}
              </span>
            </div>
            
            <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-2">
              <div 
                className={`h-full rounded-full ${getStatusColor(category.spent, category.budget)}`}
                style={{ width: `${getPercentage(category.spent, category.budget)}%` }}
              />
            </div>

            <div className="flex justify-between items-center">
              <p className="text-white/60 text-sm">
                {getPercentage(category.spent, category.budget)}% spent
              </p>
              {category.spent > category.budget && (
                <div className="flex items-center gap-1 text-rose-400 text-sm">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Over budget</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}