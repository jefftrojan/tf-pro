'use client';

import AccountsOverview from '@/components/dashboard/AccountsOverview';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import BudgetOverview from '@/components/dashboard/BudgetOverview';
import SpendingChart from '@/components/dashboard/SpendingChart';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-white/60">Welcome back! Here's an overview of your finances.</p>
      </div>

      {/* Accounts Overview */}
      <AccountsOverview />

      {/* Charts and Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Spending Chart */}
        <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-6 border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-6">Spending Overview</h2>
          <SpendingChart />
        </div>

        {/* Budget Overview */}
        <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-6 border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-6">Budget Status</h2>
          <BudgetOverview />
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-6 border border-white/20">
        <h2 className="text-xl font-semibold text-white mb-6">Recent Transactions</h2>
        <RecentTransactions />
      </div>
    </div>
  );
}