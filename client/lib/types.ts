
export interface Account {
    _id: string;
    name: string;
    type: string;
    balance: number;
    currency: string;
  }

  export interface Transaction {
    _id: string;
    type: 'income' | 'expense';
    amount: number;
    category: string;
    description: string;
    date: string;
    account: string;
    status?: 'completed' | 'pending' | 'failed';
    reference?: string;
    notes?: string;
    receipt?: string;
    tags?: string[];
  }

  export interface Budget {
    _id: string;
    category: string;
    limit: number;
    spent: number;
    color: string;
    description?: string;
    period?: {
      startDate: string;
      endDate: string;
    };
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