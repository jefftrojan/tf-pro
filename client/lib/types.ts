
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

