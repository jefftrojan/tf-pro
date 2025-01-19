// lib/api.ts
import axios, { AxiosError, AxiosResponse } from 'axios';

// Base interfaces
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Auth interfaces
interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

// Account interfaces
interface Account {
  _id: string;
  name: string;
  type: string;
  balance: number;
  currency: string;
  user: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateAccountData {
  name: string;
  type: string;
  balance: number;
  currency?: string;
}

// Transaction interfaces
interface Transaction {
  _id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  account: string;
  date: string;
  reference?: string;
  notes?: string;
  tags?: string[];
  receipt?: string;
  user: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateTransactionData {
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  account: string;
  date?: string;
  reference?: string;
  notes?: string;
  tags?: string[];
}

// Budget interfaces
interface Budget {
  _id: string;
  category: string;
  limit: number;
  spent: number;
  color: string;
  user: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateBudgetData {
  category: string;
  limit: number;
  color?: string;
}

interface BudgetStats {
  totalBudget: number;
  totalSpent: number;
  remainingBudget: number;
  percentageSpent: number;
}

interface BudgetAlert {
  type: string;
  message: string;
  category?: string;
  threshold?: number;
}

// API client setup
const baseURL = 'https://wallet-backend-f7dx.onrender.com/api/v1';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const auth = {
  login: (data: LoginData) => 
    api.post<ApiResponse<{ token: string; user: User }>>('/auth/login', data),
  
  register: (data: RegisterData) => 
    api.post<ApiResponse<{ token: string; user: User }>>('/auth/register', data),
  
  getMe: () => 
    api.get<ApiResponse<User>>('/auth/me'),

  updateDetails: (data: { name: string; email: string }) => 
    api.put<ApiResponse<User>>('/auth/updatedetails', data),
};

// Account endpoints
export const accounts = {
  getAll: () => 
    api.get<ApiResponse<Account[]>>('/accounts'),
  
  getOne: (id: string) => 
    api.get<ApiResponse<Account>>(`/accounts/${id}`),
  
  create: (data: CreateAccountData) => 
    api.post<ApiResponse<Account>>('/accounts', data),
  
  update: (id: string, data: Partial<CreateAccountData>) => 
    api.put<ApiResponse<Account>>(`/accounts/${id}`, data),
  
  delete: (id: string) => 
    api.delete<ApiResponse<void>>(`/accounts/${id}`),
};

// Transaction endpoints
export const transactions = {
  getAll: (params?: {
    startDate?: string;
    endDate?: string;
    type?: string;
    account?: string;
    category?: string;
  }) => api.get<ApiResponse<Transaction[]>>('/transactions', { params }),
  
  getOne: (id: string) => 
    api.get<ApiResponse<Transaction>>(`/transactions/${id}`),
  
  create: (data: CreateTransactionData) => 
    api.post<ApiResponse<Transaction>>('/transactions', data),
  
  update: (id: string, data: Partial<CreateTransactionData>) => 
    api.put<ApiResponse<Transaction>>(`/transactions/${id}`, data),
  
  delete: (id: string) => 
    api.delete<ApiResponse<void>>(`/transactions/${id}`),
  
  uploadReceipt: (id: string, file: File) => {
    const formData = new FormData();
    formData.append('receipt', file);
    return api.post<ApiResponse<{ receiptUrl: string }>>(`/transactions/${id}/receipt`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  downloadReceipt: (id: string) => 
    api.get<Blob>(`/transactions/${id}/receipt`, {
      responseType: 'blob',
    }),
};

// Budget endpoints
export const budgets = {
  getAll: () => 
    api.get<ApiResponse<Budget[]>>('/budgets'),
  
  getOne: (id: string) => 
    api.get<ApiResponse<Budget>>(`/budgets/${id}`),
  
  create: (data: CreateBudgetData) => 
    api.post<ApiResponse<Budget>>('/budgets', data),
  
  update: (id: string, data: Partial<CreateBudgetData>) => 
    api.put<ApiResponse<Budget>>(`/budgets/${id}`, data),
  
  delete: (id: string) => 
    api.delete<ApiResponse<void>>(`/budgets/${id}`),
  
  getStats: () => 
    api.get<ApiResponse<BudgetStats>>('/budgets/stats'),
  
  getAlerts: () => 
    api.get<ApiResponse<BudgetAlert[]>>('/budgets/alerts'),
};

export default api;