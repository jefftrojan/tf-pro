// types/reports.ts

export interface Transaction {
    _id: string;
    date: string;
    description: string;
    category: string;
    account: string;
    amount: number;
    type: 'income' | 'expense';
  }
  
  export interface AccountBalance {
    _id: string;
    name: string;
    balance: number;
  }
  
  export interface CategoryAmount {
    category: string;
    amount: number;
  }
  
  export interface MonthlyTrend {
    month: string;
    income: number;
    expenses: number;
  }
  
  export interface ReportStats {
    totalIncome: number;
    totalExpenses: number;
    totalSavings: number;
    savingsRate: number;
    accountBalances: AccountBalance[];
    monthlyTrends: MonthlyTrend[];
    expensesByCategory: CategoryAmount[];
    incomeByCategory: CategoryAmount[];
    transactions: Transaction[];
  }
  
  // Optional: Type guard for ReportStats
  export function isReportStats(obj: any): obj is ReportStats {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      typeof obj.totalIncome === 'number' &&
      typeof obj.totalExpenses === 'number' &&
      typeof obj.totalSavings === 'number' &&
      typeof obj.savingsRate === 'number' &&
      Array.isArray(obj.accountBalances) &&
      Array.isArray(obj.monthlyTrends) &&
      Array.isArray(obj.expensesByCategory) &&
      Array.isArray(obj.incomeByCategory) &&
      Array.isArray(obj.transactions)
    );
  }
  
  // Date range type used in the reports page
  export interface DateRange {
    startDate: string;
    endDate: string;
  }
  
  // Type for the date range options
  export interface DateRangeOption {
    label: string;
    value: 'current' | 'last' | 'last3' | 'last6' | 'year' | 'custom';
  }