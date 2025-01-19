// types/transactions.ts
import type { Transaction as ApiTransaction, Account as ApiAccount } from '@/lib/api';

// Extend the API Transaction type to handle polymorphic account field
export type Transaction = Omit<ApiTransaction, 'account'> & {
  account: string | { _id: string };
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: string;
  reference?: string;
  notes?: string;
  receipt?: string | File | null;
  tags?: string[];
};

// Form Data type for creating/updating transactions
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

// Account type used in the UI
export type Account = ApiAccount;

// Filter types
export interface TransactionFilters {
  type: 'all' | 'income' | 'expense';
  account: string;
  category: string;
  startDate: string;
  endDate: string;
}

// Props interfaces for components
export interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Transaction>) => Promise<void>;
  accounts: Account[];
  transaction?: Transaction;
  isLoading?: boolean;
}

export interface TransactionDetailsModalProps {
  transaction: Transaction;
  accounts: Account[];
  onClose: () => void;
  onDelete?: (id: string) => Promise<void>;
  onUpdate?: (id: string, data: Partial<Transaction>) => Promise<void>;
  isDeleting?: boolean;
  isUpdating?: boolean;
}