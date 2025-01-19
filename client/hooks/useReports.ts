import { useQuery } from '@tanstack/react-query';
import { transactions, accounts } from '@/lib/api';
import type { 
  Transaction, 
  Account, 
  ApiResponse 
} from '@/lib/api';
import { AxiosError } from 'axios';

interface DateRange {
  startDate: string;
  endDate: string;
}

interface CategoryAmount {
  category: string;
  amount: number;
}

interface MonthlyTrend {
  month: string;
  income: number;
  expenses: number;
}

interface ReportStats {
  totalIncome: number;
  totalExpenses: number;
  totalSavings: number;
  savingsRate: number;
  accountBalances: Array<Pick<Account, '_id' | 'name' | 'balance' | 'type' | 'currency'>>;
  incomeByCategory: CategoryAmount[];
  expensesByCategory: CategoryAmount[];
  monthlyTrends: MonthlyTrend[];
  transactions: Transaction[];
}

function calculateReportStats(
  transactions: Transaction[], 
  accounts: Account[]
): ReportStats {
  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSavings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (totalSavings / totalIncome) * 100 : 0;

  // Calculate category breakdowns using reduce once for efficiency
  const categoryTotals = transactions.reduce((acc, t) => {
    const key = `${t.type}:${t.category}`;
    acc[key] = (acc[key] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  // Extract income and expense categories
  const incomeByCategory = Object.entries(categoryTotals)
    .filter(([key]) => key.startsWith('income:'))
    .map(([key, amount]) => ({
      category: key.split(':')[1],
      amount
    }));

  const expensesByCategory = Object.entries(categoryTotals)
    .filter(([key]) => key.startsWith('expense:'))
    .map(([key, amount]) => ({
      category: key.split(':')[1],
      amount
    }));

  // Calculate monthly trends
  const monthlyTrends = Object.values(
    transactions.reduce((acc, t) => {
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
    }, {} as Record<string, MonthlyTrend>)
  ).sort((a, b) => a.month.localeCompare(b.month));

  return {
    totalIncome,
    totalExpenses,
    totalSavings,
    savingsRate,
    accountBalances: accounts.map(account => ({
      _id: account._id,
      name: account.name,
      balance: account.balance,
      type: account.type,
      currency: account.currency
    })),
    incomeByCategory,
    expensesByCategory,
    monthlyTrends,
    transactions
  };
}

export function useReports(dateRange: DateRange) {
  // Fetch transactions for the period
  const transactionsQuery = useQuery<ApiResponse<Transaction[]>, AxiosError>({
    queryKey: ['transactions', dateRange],
    queryFn: async () => {
      const response = await transactions.getAll({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
      });
      return response.data;
    }
  });

  // Fetch accounts for balances
  const accountsQuery = useQuery<ApiResponse<Account[]>, AxiosError>({
    queryKey: ['accounts'],
    queryFn: async () => {
      const response = await accounts.getAll();
      return response.data;
    }
  });

  // Calculate report stats when data is available
  const reportStats: ReportStats | undefined = 
    transactionsQuery.data?.data && 
    accountsQuery.data?.data
      ? calculateReportStats(
          transactionsQuery.data.data, 
          accountsQuery.data.data
        )
      : undefined;

  return {
    stats: reportStats,
    isLoading: transactionsQuery.isLoading || accountsQuery.isLoading,
    isError: transactionsQuery.isError || accountsQuery.isError,
    error: transactionsQuery.error || accountsQuery.error
  };
}