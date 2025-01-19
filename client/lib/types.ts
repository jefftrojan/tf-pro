// lib/types.ts

// Base interfaces
export interface Account {
  _id: string;
  name: string;
  type: string;
  balance: number;
  currency: string;
}

// Define the possible account reference types
export type AccountReference = string | { _id: string };

export interface Transaction {
  _id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
  account: AccountReference;
  status?: 'completed' | 'pending' | 'failed';
  reference?: string;
  notes?: string;
  receipt?: string;
  tags?: string[];
}

// Form data for creating/updating transactions
export interface TransactionFormData {
  type: 'income' | 'expense';
  amount: string;
  category: string;
  account: string;
  date: string;
  description: string;
  tags: string[];
  receipt: File | null;
}

// Payload for creating a new transaction
export type CreateTransactionPayload = Omit<Transaction, '_id' | 'status' | 'receipt' | 'account'> & {
  account: string;
  receipt?: File;
};

// Props for Transaction Form component
export interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTransactionPayload) => Promise<void>;
  accounts: Account[];
  transaction?: Transaction;
  isLoading?: boolean;
}

// Props for Transaction Details Modal
export interface TransactionDetailsModalProps {
  transaction: Transaction;
  accounts: Account[];
  onClose: () => void;
  onDelete?: (id: string) => Promise<void>;
  onUpdate?: (id: string, data: Partial<Transaction>) => Promise<void>;
  isDeleting?: boolean;
  isUpdating?: boolean;
}

// Budgeting interfaces
export interface Budget {
  _id: string;
  category: string;
  limit: number;
  spent: number;
  color: string;
  period: string;
  startDate: string;
  endDate: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetStats {
  totalBudget: number;
  totalSpent: number;
  averageUsage: number;
  overBudgetCount: number;
}

export interface BudgetAlert {
  category: string;
  message: string;
  type: 'warning' | 'danger';
  percentage: number;
}

// Transaction filtering interface
export interface TransactionFilters {
  type: 'all' | 'income' | 'expense';
  account: string;
  category: string;
  startDate: string;
  endDate: string;
}

// Generic API Response type
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}