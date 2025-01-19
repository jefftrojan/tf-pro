'use client';
import { useState, useMemo } from 'react';
import AccountsOverview from '@/components/dashboard/AccountsOverview';
import RecentTransactions from '@/components/dashboard/RecentActivity'; // Fixed import
import BudgetOverview from '@/components/dashboard/BudgetContainer';
import SpendingChart from '@/components/dashboard/SpendingChart';
import { useReports } from '@/hooks/useReports';
import { formatCurrency } from '@/lib/utils';

const dateRanges = [
  { label: 'This Month', value: 'current' },
  { label: 'Last Month', value: 'last' },
  { label: 'Last 3 Months', value: 'last3' },
  { label: 'Last 6 Months', value: 'last6' },
  { label: 'This Year', value: 'year' },
  { label: 'Custom', value: 'custom' }
];

export default function DashboardPage() {
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

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-white/60">Welcome back! Here's an overview of your finances.</p>
      </div>

      {/* Date Range Selector */}
      <div className="flex items-center gap-4">
        <select
          value={selectedRange.value}
          onChange={(e) => setSelectedRange(dateRanges.find(range => range.value === e.target.value) || dateRanges[0])}
          className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
        >
          {dateRanges.map((range) => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
        </select>

        {selectedRange.value === 'custom' && (
          <div className="flex gap-4">
            <input
              type="date"
              value={customDateRange.startDate}
              onChange={(e) => setCustomDateRange(prev => ({ ...prev, startDate: e.target.value }))}
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
            />
            <input
              type="date"
              value={customDateRange.endDate}
              onChange={(e) => setCustomDateRange(prev => ({ ...prev, endDate: e.target.value }))}
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
            />
          </div>
        )}
      </div>

      {/* Accounts Overview */}
      <AccountsOverview />

      {/* Charts and Recent Activity */}
      {stats && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Spending Chart */}
          <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-6 border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-6">Spending Overview</h2>
            <SpendingChart data={stats.monthlyTrends} />
          </div>

          {/* Budget Overview */}
          <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-6 border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-6">Budget Status</h2>
            <BudgetOverview />
          </div>
        </div>
      )}

      {/* Recent Transactions */}
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
                       {stats?.transactions?.slice(0, 5).map((transaction) => (
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
               </div>
  );
}