

// app/dashboard/budgets/page.tsx
'use client';

import { useState, useMemo } from 'react';
import { 
  PlusCircle, 
  PieChart,
  ArrowUpRight, 
  ArrowDownRight,
  AlertTriangle,
  ChevronDown,
  Filter,
  Loader2,
  Download,
  FileSpreadsheet
} from 'lucide-react';
import { PieChart as RechartsGPieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import BudgetForm from '@/components/forms/BudgetForm';
import { useBudgets } from '@/hooks/useBudgets';
import { formatCurrency, exportToExcel, calculateBudgetStatus, getStatusColor } from '@/lib/utils';

// Suggested categories with colors
export const budgetCategories = [
  { name: 'Housing', color: '#22c55e' },
  { name: 'Transportation', color: '#3b82f6' },
  { name: 'Food & Dining', color: '#f59e0b' },
  { name: 'Utilities', color: '#6366f1' },
  { name: 'Entertainment', color: '#ec4899' },
  { name: 'Healthcare', color: '#14b8a6' },
  { name: 'Shopping', color: '#8b5cf6' },
  { name: 'Personal Care', color: '#f43f5e' },
  { name: 'Education', color: '#0ea5e9' },
  { name: 'Savings', color: '#84cc16' },
  { name: 'Debt Payments', color: '#ea580c' },
  { name: 'Others', color: '#64748b' }
];

// Period options
const periodOptions = [
  { label: 'This Month', value: 'current' },
  { label: 'Last Month', value: 'last' },
  { label: 'Last 3 Months', value: 'last3' },
  { label: 'Last 6 Months', value: 'last6' },
  { label: 'This Year', value: 'year' },
  { label: 'Custom', value: 'custom' }
];

interface DateRange {
  startDate: string;
  endDate: string;
}

export default function BudgetsPage() {
  // State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(periodOptions[0]);
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [customDateRange, setCustomDateRange] = useState<DateRange>({
    startDate: '',
    endDate: ''
  });

  // Calculate date range based on selected period
  const dateRange = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    switch (selectedPeriod.value) {
      case 'current':
        return {
          startDate: startOfMonth.toISOString(),
          endDate: endOfMonth.toISOString()
        };
      case 'last':
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        return {
          startDate: lastMonth.toISOString(),
          endDate: new Date(now.getFullYear(), now.getMonth(), 0).toISOString()
        };
      case 'last3':
        return {
          startDate: new Date(now.getFullYear(), now.getMonth() - 3, 1).toISOString(),
          endDate: endOfMonth.toISOString()
        };
      case 'last6':
        return {
          startDate: new Date(now.getFullYear(), now.getMonth() - 6, 1).toISOString(),
          endDate: endOfMonth.toISOString()
        };
      case 'year':
        return {
          startDate: new Date(now.getFullYear(), 0, 1).toISOString(),
          endDate: new Date(now.getFullYear(), 11, 31).toISOString()
        };
      case 'custom':
        return customDateRange;
      default:
        return {
          startDate: startOfMonth.toISOString(),
          endDate: endOfMonth.toISOString()
        };
    }
  }, [selectedPeriod, customDateRange]);

  // Fetch data using custom hooks with date range
  const { 
    budgets = [], 
    stats,
    alerts,
    isLoading,
    isError,
    createBudget,
    updateBudget,
    deleteBudget 
  } = useBudgets(dateRange);

  // Calculate chart data
  const chartData = useMemo(() => 
    budgets.map(budget => ({
      name: budget.category,
      value: budget.spent,
      color: budget.color
    }))
  , [budgets]);

  // Export data
  const handleExport = () => {
    const data = budgets.map(budget => ({
      Category: budget.category,
      'Budget Limit': budget.limit,
      'Amount Spent': budget.spent,
      'Remaining': budget.limit - budget.spent,
      'Percentage Used': ((budget.spent / budget.limit) * 100).toFixed(1) + '%',
      Period: selectedPeriod.label
    }));

    exportToExcel(data, `Budget_Report_${selectedPeriod.label.replace(' ', '_')}`);
  };

  const handleCreateBudget = async (formData: Partial<Budget>) => {
    try {
      await createBudget.mutateAsync(formData);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error creating budget:', error);
      throw error;
    }
  };

  const handleUpdateBudget = async (formData: Partial<Budget>) => {
    if (!selectedBudget?._id) return;

    try {
      await updateBudget.mutateAsync({
        id: selectedBudget._id,
        data: formData
      });
      setSelectedBudget(null);
    } catch (error) {
      console.error('Error updating budget:', error);
      throw error;
    }
  };

  const handleDeleteBudget = async (budgetId: string) => {
    try {
      await deleteBudget.mutateAsync(budgetId);
      setSelectedBudget(null);
    } catch (error) {
      console.error('Error deleting budget:', error);
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Budgets</h1>
          <p className="text-white/60">Manage your spending limits</p>
        </div>
        <button
          onClick={() => {
            setSelectedBudget(null);
            setIsAddModalOpen(true);
          }}
          disabled={createBudget.isPending}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors disabled:opacity-50"
        >
          {createBudget.isPending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <PlusCircle className="h-5 w-5" />
          )}
          Create Budget
        </button>
      </div>

      {/* Period Selector and Export */}
      <div className="flex justify-between items-center">
        <div className="relative">
          <button
            onClick={() => setShowPeriodDropdown(!showPeriodDropdown)}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white transition-colors"
          >
            {selectedPeriod.label}
            <ChevronDown className="h-4 w-4 text-white/60" />
          </button>

          {showPeriodDropdown && (
            <div className="absolute top-full mt-2 w-48 backdrop-blur-lg bg-white/10 border border-white/20 rounded-lg shadow-xl z-10">
              {periodOptions.map((period) => (
                <button
                  key={period.value}
                  onClick={() => {
                    setSelectedPeriod(period);
                    setShowPeriodDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 text-white hover:bg-white/10 first:rounded-t-lg last:rounded-b-lg transition-colors"
                >
                  {period.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white transition-colors"
          >
            <FileSpreadsheet className="h-5 w-5" />
            Export Report
          </button>
        </div>
      </div>

      {/* Statistics Visualization */}
      <div className="backdrop-blur-lg bg-white/5 rounded-xl p-6 border border-white/10">
        <h3 className="text-lg font-medium text-white mb-4">Spending Distribution</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsGPieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend />
            </RechartsGPieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Budgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {budgets.map((budget) => {
  const { percentage, isOverBudget, statusColor } = calculateBudgetStatus(budget.spent, budget.limit);

  return (
    <div
      key={budget._id}
      onClick={() => setSelectedBudget(budget)}
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
            className={`h-full rounded-full transition-all ${statusColor}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
})}
        {/* Add Budget Card */}
        <button
          onClick={() => {
            setSelectedBudget(null);
            setIsAddModalOpen(true);
          }}
          disabled={createBudget.isPending}
          className="backdrop-blur-lg bg-white/5 hover:bg-white/10 rounded-xl p-6 border border-dashed border-white/20 flex flex-col items-center justify-center gap-3 transition-all group"
        >
          <div className="p-3 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
            {createBudget.isPending ? (
              <Loader2 className="h-6 w-6 text-white animate-spin" />
            ) : (
              <PlusCircle className="h-6 w-6 text-white" />
            )}
          </div>
          <p className="text-white font-medium">Create New Budget</p>
        </button>
      </div>

      {/* Budget Form with Category Suggestions */}
      <BudgetForm
        isOpen={isAddModalOpen || !!selectedBudget}
        onClose={() => {
          setIsAddModalOpen(false);
          setSelectedBudget(null);
        }}
        onSubmit={selectedBudget ? handleUpdateBudget : handleCreateBudget}
        onDelete={selectedBudget ? () => handleDeleteBudget(selectedBudget._id) : undefined}
        budget={selectedBudget}
        isLoading={createBudget.isPending || updateBudget.isPending}
        suggestedCategories={budgetCategories}
      />
    </div>
  );
}