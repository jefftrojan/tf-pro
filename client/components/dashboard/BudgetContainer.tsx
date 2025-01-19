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

export default function BudgetsContainer() {
  // State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('This Month');
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);

  // Fetch data
  const { 
    budgets, 
    stats,
    alerts,
    isLoading,
    isError,
    createBudget 
  } = useBudgets();

  // Calculate totals
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

interface UseBudgetsReturn {
    budgets: Budget[];
    stats: any;
    alerts: Alert[];
    isLoading: boolean;
    isError: boolean;
    createBudget: {
        mutateAsync: (formData: any) => Promise<void>;
    };
}

const totalBudget: number = budgets?.reduce((sum: number, budget: Budget) => sum + budget.limit, 0) || 0;
const totalSpent: number = budgets?.reduce((sum: number, budget: Budget) => sum + budget.spent, 0) || 0;
  const remainingBudget = totalBudget - totalSpent;

  // Handle budget creation
  const handleCreateBudget = async (formData: {
    category: string;
    limit: number;
    color?: string;
    period: string;
    startDate: string;
    endDate: string;
  }) => {
    try {
      // Directly use the mutation from useBudgets
      await createBudget.mutateAsync(formData);
      setIsAddModalOpen(false);
    } catch (error) {
      // Error handling is now done in the mutation
      console.error('Budget creation error', error);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 text-white animate-spin" />
      </div>
    );
  }

  // Error state
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

        <div className="backdrop-blur-lg bg-white/10 rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white/60">Spent</h3>
            <ArrowDownRight className="h-5 w-5 text-rose-400" />
          </div>
          <p className="text-3xl font-bold text-rose-400 mb-1">
            {formatCurrency(totalSpent)}
          </p>
          <p className="text-white/60 text-sm">
            {((totalSpent / totalBudget) * 100).toFixed(1)}% of total budget
          </p>
        </div>

        <div className="backdrop-blur-lg bg-white/10 rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white/60">Remaining</h3>
            <ArrowUpRight className="h-5 w-5 text-emerald-400" />
          </div>
          <p className="text-3xl font-bold text-emerald-400 mb-1">
            {formatCurrency(remainingBudget)}
          </p>
          <p className="text-white/60 text-sm">
            {((remainingBudget / totalBudget) * 100).toFixed(1)}% remaining
          </p>
        </div>
      </div>

      {/* Budget Alerts */}
      {alerts?.length > 0 && (
        <div className="space-y-4">
          {alerts.map((alert: any, index: number) => (
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
        {budgets?.map((budget: any) => {
          const percentage = (budget.spent / budget.limit) * 100;
          const isOverBudget = percentage > 100;

          return (
            <div
              key={budget._id}
              className="backdrop-blur-lg bg-white/5 hover:bg-white/10 rounded-xl p-6 border border-white/10 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: budget.color }}
                  />
                  <div>
                    <h3 className="font-medium text-white">{budget.category}</h3>
                    <p className="text-white/60 text-sm">Monthly Budget</p>
                  </div>
                </div>
                {isOverBudget && (
                  <div className="flex items-center gap-1 text-rose-400">
                    <AlertTriangle className="h-5 w-5" />
                    <span>Over Budget</span>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-white/60 text-sm">Spent</p>
                    <p className="text-2xl font-bold text-white">
                      {formatCurrency(budget.spent)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/60 text-sm">of {formatCurrency(budget.limit)}</p>
                    <p className={`text-sm font-medium ${
                      isOverBudget ? 'text-rose-400' : 'text-emerald-400'
                    }`}>
                      {percentage.toFixed(1)}%
                    </p>
                  </div>
                </div>

                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all ${
                      percentage >= 100 ? 'bg-rose-400' :
                      percentage >= 80 ? 'bg-amber-400' :
                      'bg-emerald-400'
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
              </div>
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
      {isAddModalOpen && (
        <BudgetForm
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleCreateBudget}
        />
      )}
    </div>
  );
}