'use client';

import { useState } from 'react';
import { 
  PlusCircle, 
  PieChart,
  ArrowUpRight, 
  ArrowDownRight,
  AlertTriangle,
  ChevronDown,
  Filter,
  Loader2
} from 'lucide-react';
import BudgetForm from '@/components/forms/BudgetForm';
import { useBudgets } from '@/hooks/useBudgets';
import { formatCurrency } from '@/lib/utils';

interface Budget {
  _id: string;
  category: string;
  limit: number;
  spent: number;
  color: string;
}

interface Alert {
  message: string;
}

export default function BudgetsContainer() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('This Month');
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);

  const { 
    budgets = [], // Provide default empty array
    stats,
    alerts = [], // Provide default empty array
    isLoading,
    isError,
    createBudget 
  } = useBudgets();

  // Calculate totals with proper type checking
  const totalBudget = Array.isArray(budgets) 
    ? budgets.reduce((sum, budget) => sum + (budget.limit || 0), 0)
    : 0;

  const totalSpent = Array.isArray(budgets)
    ? budgets.reduce((sum, budget) => sum + (budget.spent || 0), 0)
    : 0;

  const remainingBudget = totalBudget - totalSpent;

  const handleCreateBudget = async (formData: any) => {
    try {
      await createBudget.mutateAsync(formData);
      setIsAddModalOpen(false);
    } catch (error: any) {
      console.error('Error creating budget:', error);
      throw new Error(error.response?.data?.message || 'Failed to create budget');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 text-white animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-rose-400 mb-2">Error loading budgets</p>
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
          <h1 className="text-3xl font-bold text-white mb-2">Budgets</h1>
          <p className="text-white/60">Manage your spending limits</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
        >
          <PlusCircle className="h-5 w-5" />
          Create Budget
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Budget Card */}
        <div className="backdrop-blur-lg bg-white/10 rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white/60">Total Budget</h3>
            <PieChart className="h-5 w-5 text-white/60" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            {formatCurrency(totalBudget)}
          </p>
          <p className="text-white/60 text-sm">Monthly allocation</p>
        </div>

        {/* Spent Card */}
        <div className="backdrop-blur-lg bg-white/10 rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white/60">Spent</h3>
            <ArrowDownRight className="h-5 w-5 text-rose-400" />
          </div>
          <p className="text-3xl font-bold text-rose-400 mb-1">
            {formatCurrency(totalSpent)}
          </p>
          <p className="text-white/60 text-sm">
            {totalBudget > 0 ? `${((totalSpent / totalBudget) * 100).toFixed(1)}% of total budget` : '0% of total budget'}
          </p>
        </div>

        {/* Remaining Card */}
        <div className="backdrop-blur-lg bg-white/10 rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white/60">Remaining</h3>
            <ArrowUpRight className="h-5 w-5 text-emerald-400" />
          </div>
          <p className="text-3xl font-bold text-emerald-400 mb-1">
            {formatCurrency(remainingBudget)}
          </p>
          <p className="text-white/60 text-sm">
            {totalBudget > 0 ? `${((remainingBudget / totalBudget) * 100).toFixed(1)}% remaining` : '0% remaining'}
          </p>
        </div>
      </div>

      {/* Budget Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-4">
          {alerts.map((alert: Alert, index: number) => (
            <div
              key={index}
              className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400"
            >
              <AlertTriangle className="h-5 w-5 flex-shrink-0" />
              <p>{alert.message}</p>
            </div>
          ))}
        </div>
      )}

      {/* Budgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {budgets.map((budget: Budget) => {
          const percentage = budget.limit > 0 ? (budget.spent / budget.limit) * 100 : 0;
          const isOverBudget = percentage > 100;

          return (
            <div
              key={budget._id}
              className="backdrop-blur-lg bg-white/5 hover:bg-white/10 rounded-xl p-6 border border-white/10 transition-colors cursor-pointer"
            >
              {/* Budget card content remains the same */}
            </div>
          );
        })}

        {/* Add Budget Card */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="backdrop-blur-lg bg-white/5 hover:bg-white/10 rounded-xl p-6 border border-dashed border-white/20 flex flex-col items-center justify-center gap-3 transition-all group"
        >
          <div className="p-3 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
            <PlusCircle className="h-6 w-6 text-white" />
          </div>
          <p className="text-white font-medium">Create New Budget</p>
        </button>
      </div>

      {/* Budget Form Modal */}
      <BudgetForm
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateBudget}
      />
    </div>
  );
}