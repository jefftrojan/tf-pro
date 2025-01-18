import { useQuery } from '@tanstack/react-query';
import { transactions, accounts } from '@/lib/api';

interface DateRange {
  startDate: string;
  endDate: string;
}

interface ReportStats {
  totalIncome: number;
  totalExpenses: number;
  totalSavings: number;
  savingsRate: number;
  accountBalances: { name: string; balance: number }[];
  incomeByCategory: { category: string; amount: number }[];
  expensesByCategory: { category: string; amount: number }[];
  monthlyTrends: {
    month: string;
    income: number;
    expenses: number;
  }[];
}

export function useReports(dateRange: DateRange) {
  // Fetch transactions for the period
  const transactionsQuery = useQuery({
    queryKey: ['transactions', dateRange],
    queryFn: async () => {
      const response = await transactions.getAll({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
      });
      return response.data.data;
    }
  });

  // Fetch accounts for balances
  const accountsQuery = useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      const response = await accounts.getAll();
      return response.data.data;
    }
  });

  // Calculate report stats when data is available
  const reportStats: ReportStats | undefined = transactionsQuery.data && accountsQuery.data ? {
    // Calculate total income and expenses
    totalIncome: transactionsQuery.data
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0),
    
    totalExpenses: transactionsQuery.data
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0),

    // Calculate savings and rate
    get totalSavings() {
      return this.totalIncome - this.totalExpenses;
    },
    get savingsRate() {
      return this.totalIncome > 0 
        ? (this.totalSavings / this.totalIncome) * 100 
        : 0;
    },

    // Get account balances
    accountBalances: accountsQuery.data.map(account => ({
      name: account.name,
      balance: account.balance
    })),

    // Calculate income by category
    incomeByCategory: Object.entries(
      transactionsQuery.data
        .filter(t => t.type === 'income')
        .reduce((acc, t) => {
          acc[t.category] = (acc[t.category] || 0) + t.amount;
          return acc;
        }, {} as Record<string, number>)
    ).map(([category, amount]) => ({ category, amount })),

    // Calculate expenses by category
    expensesByCategory: Object.entries(
      transactionsQuery.data
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
          acc[t.category] = (acc[t.category] || 0) + t.amount;
          return acc;
        }, {} as Record<string, number>)
    ).map(([category, amount]) => ({ category, amount })),

    // Calculate monthly trends
    monthlyTrends: Object.entries(
      transactionsQuery.data.reduce((acc, t) => {
        const month = new Date(t.date).toISOString().slice(0, 7);
        if (!acc[month]) {
          acc[month] = { month, income: 0, expenses: 0 };
        }
        if (t.type === 'income') {
          acc[month].income += t.amount;
        } else {
          acc[month].expenses += t.amount;
        }
        return acc;
      }, {} as Record<string, { month: string; income: number; expenses: number }>)
    )
    .map(([_, data]) => data)
    .sort((a, b) => a.month.localeCompare(b.month))
  } : undefined;

  return {
    stats: reportStats,
    isLoading: transactionsQuery.isLoading || accountsQuery.isLoading,
    isError: transactionsQuery.isError || accountsQuery.isError,
    error: transactionsQuery.error || accountsQuery.error
  };
}