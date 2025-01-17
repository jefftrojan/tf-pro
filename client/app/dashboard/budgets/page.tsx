"use client";
import { useState, useMemo, useEffect } from 'react';
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
import { PieChart as RechartsGPieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import BudgetForm from '@/components/forms/BudgetForm';
import { useBudgets } from '@/hooks/useBudgets';
import { formatCurrency, exportToExcel, calculateBudgetStatus, getStatusColor } from '@/lib/utils';
import { budgetCategories, periodOptions } from '@/lib/constants/budgets';
import { Budget } from '@/lib/types';
import BudgetChart from '@/components/charts/BudgetChart';


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
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const endOfYear = new Date(now.getFullYear(), 11, 31);
  
    return {
      startDate: startOfYear.toISOString(),
      endDate: endOfYear.toISOString()
    };
  }, []);

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

  const chartData = useMemo(() => {
    // Filter out budgets with zero or negative spent amounts
    return budgets
      .filter(budget => budget.spent > 0)
      .map(budget => ({
        name: budget.category,
        value: budget.spent,
        color: budget.color || 
          budgetCategories.find(cat => cat.name === budget.category)?.color || 
          `#${Math.floor(Math.random()*16777215).toString(16)}`
      }));
  }, [budgets]);

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
  useEffect(() => {
    console.log('Chart Data:', chartData);
  }, [chartData])

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
      {/* Statistics Visualization */}
<div className="backdrop-blur-lg bg-white/5 rounded-xl p-6 border border-white/10">
  <h3 className="text-lg font-medium text-white mb-4">Spending Distribution</h3>
  
  {/* Conditional Rendering */}
  {isLoading ? (
    <div className="flex items-center justify-center h-[300px]">
      <Loader2 className="h-8 w-8 text-white animate-spin" />
    </div>
  ) : budgets.length === 0 ? (
    <div className="flex items-center justify-center h-[300px] text-white/60">
      <p>No budgets created. Start tracking your spending!</p>
    </div>
  ) : (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsGPieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={120}
            innerRadius={60}
            fill="#8884d8"
            dataKey="value"
            paddingAngle={5}
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color || `#${Math.floor(Math.random()*16777215).toString(16)}`} 
              />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value, name) => [
              formatCurrency(Number(value)), 
              name
            ]}
          />
          <Legend 
            layout="vertical" 
            align="right" 
            verticalAlign="middle"
            formatter={(value) => {
              const matchingEntry = chartData.find(entry => entry.name === value);
              return matchingEntry 
                ? `${value} - ${formatCurrency(matchingEntry.value)}`
                : value;
            }}
          />
        </RechartsGPieChart>
      </ResponsiveContainer>
    </div>
  )}
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