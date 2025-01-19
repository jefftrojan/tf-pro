'use client';

import { useState, useMemo } from 'react';
import { 
  Download, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  PieChart,
  TrendingUp,
  Wallet,
  Share2,
  Loader2
} from 'lucide-react';
import { useReports } from '@/hooks/useReports';
import SpendingChart from '@/components/dashboard/SpendingChart';
import ExpenseChart from '@/components/charts/ExpenseChart';
import IncomeChart from '@/components/charts/IncomeChart';
import { formatCurrency } from '@/lib/utils';
import PrintableTable from '@/components/dashboard/PrintableTable';
const dateRanges = [
  { label: 'This Month', value: 'current' },
  { label: 'Last Month', value: 'last' },
  { label: 'Last 3 Months', value: 'last3' },
  { label: 'Last 6 Months', value: 'last6' },
  { label: 'This Year', value: 'year' },
  { label: 'Custom', value: 'custom' }
];

export default function ReportsPage() {
  const [selectedRange, setSelectedRange] = useState(dateRanges[0]);
  const [showDateRangeDropdown, setShowDateRangeDropdown] = useState(false);
  const [customDateRange, setCustomDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  // Calculate date range based on selected period
  const dateRange = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    switch (selectedRange.value) {
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
  }, [selectedRange, customDateRange]);

  // Fetch report data
  const { stats, isLoading, isError } = useReports(dateRange);

  // Handle export
  const handleExport = () => {
    
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
          <p className="text-rose-400 mb-2">Error loading report data</p>
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
          <h1 className="text-3xl font-bold text-white mb-2">Reports</h1>
          <p className="text-white/60">Analyze your financial performance</p>
        </div>
        <div className="flex gap-3">
          
          <PrintableTable stats={stats} dateRange={dateRange} />
        </div>
      </div>

      {/* Date Range Selector */}
      <div className="flex justify-between items-center">
        <div className="relative">
          <button
            onClick={() => setShowDateRangeDropdown(!showDateRangeDropdown)}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white transition-colors"
          >
            <Calendar className="h-5 w-5" />
            {selectedRange.label}
          </button>

          {showDateRangeDropdown && (
            <div className="absolute top-full mt-2 w-48 backdrop-blur-lg bg-white/10 border border-white/20 rounded-lg shadow-xl z-10">
              {dateRanges.map((range) => (
                <button
                  key={range.value}
                  onClick={() => {
                    setSelectedRange(range);
                    setShowDateRangeDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 text-white hover:bg-white/10 first:rounded-t-lg last:rounded-b-lg transition-colors"
                >
                  {range.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {stats && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Income */}
            <div className="backdrop-blur-lg bg-white/10 rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white/60">Total Income</h3>
                <ArrowUpRight className="h-5 w-5 text-emerald-400" />
              </div>
              <p className="text-2xl font-bold text-white mb-1">
                {formatCurrency(stats.totalIncome)}
              </p>
              <p className="text-emerald-400 text-sm">This period</p>
            </div>

            {/* Expenses */}
            <div className="backdrop-blur-lg bg-white/10 rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white/60">Total Expenses</h3>
                <ArrowDownRight className="h-5 w-5 text-rose-400" />
              </div>
              <p className="text-2xl font-bold text-white mb-1">
                {formatCurrency(stats.totalExpenses)}
              </p>
              <p className="text-rose-400 text-sm">This period</p>
            </div>

            {/* Savings */}
            <div className="backdrop-blur-lg bg-white/10 rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white/60">Total Savings</h3>
                <Wallet className="h-5 w-5 text-white/60" />
              </div>
              <p className="text-2xl font-bold text-white mb-1">
                {formatCurrency(stats.totalSavings)}
              </p>
              <p className="text-emerald-400 text-sm">{stats.savingsRate.toFixed(1)}% savings rate</p>
            </div>

            {/* Net Worth */}
            <div className="backdrop-blur-lg bg-white/10 rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white/60">Total Balance</h3>
                <TrendingUp className="h-5 w-5 text-white/60" />
              </div>
              <p className="text-2xl font-bold text-white mb-1">
                {formatCurrency(stats.accountBalances.reduce((sum, account) => sum + account.balance, 0))}
              </p>
              <p className="text-emerald-400 text-sm">Across all accounts</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Income vs Expenses */}
            <div className="backdrop-blur-lg bg-white/10 rounded-xl p-6 border border-white/20">
              <h3 className="text-lg font-medium text-white mb-6">Income vs Expenses</h3>
              <SpendingChart data={stats.monthlyTrends} />
            </div>

            {/* Expense Categories */}
            <div className="backdrop-blur-lg bg-white/10 rounded-xl p-6 border border-white/20">
              <h3 className="text-lg font-medium text-white mb-6">Expenses by Category</h3>
              <ExpenseChart data={stats.expensesByCategory.map(item => ({
                name: item.category,
                value: item.amount
              }))} />
            </div>

            {/* Income Categories */}
            <div className="backdrop-blur-lg bg-white/10 rounded-xl p-6 border border-white/20">
              <h3 className="text-lg font-medium text-white mb-6">Income Sources</h3>
              <IncomeChart data={stats.incomeByCategory.map(item => ({
                name: item.category,
                value: item.amount
              }))} />
            </div>

            {/* Account Balances */}
            <div className="backdrop-blur-lg bg-white/10 rounded-xl p-6 border border-white/20">
              <h3 className="text-lg font-medium text-white mb-6">Account Balances</h3>
              <div className="space-y-4">
                {stats.accountBalances.map((account) => (
                  <div key={account.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Wallet className="h-5 w-5 text-white/60" />
                      <span className="text-white">{account.name}</span>
                    </div>
                    <span className="text-white font-medium">
                      {formatCurrency(account.balance)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Transaction History Table (Optional) */}
          <div className="backdrop-blur-lg bg-white/10 rounded-xl border border-white/20">
            <div className="p-6 border-b border-white/10">
              <h3 className="text-lg font-medium text-white">Recent Transactions</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-white/60 text-sm">
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Description</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Account</th>
                    <th className="px-6 py-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {stats.transactions?.slice(0, 5).map((transaction) => (
                    <tr key={transaction._id} className="text-white">
                      <td className="px-6 py-4">
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">{transaction.description}</td>
                      <td className="px-6 py-4">{transaction.category}</td>
                      <td className="px-6 py-4">
                        {stats.accountBalances.find(a => a._id === transaction.account)?.name}
                      </td>
                      <td className={`px-6 py-4 text-right font-medium ${
                        transaction.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}