export interface Account {
    _id: string;
    name: string;
    type: string;
    balance: number;
    currency: string;
    monthlyIncome: number;
    monthlyExpenses: number;
  }
  
  export type AccountFormData = Omit<Account, '_id'>;
  
  export type CreateAccountData = {
    name: string;
    type: string;
    balance: number;
    currency?: string;
    monthlyIncome?: number;
    monthlyExpenses?: number;
  };
  
  export type UpdateAccountData = Partial<AccountFormData>;
  
  export type AccountType = 'checking' | 'credit' | 'savings' | 'other';