// lib/api.ts
import axios from 'axios';

const baseURL = 'http://localhost:5001/api/v1';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // If token exists, add it to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const auth = {
  login: (data: { email: string; password: string }) => 
    api.post('/auth/login', data),
  register: (data: { name: string; email: string; password: string }) => 
    api.post('/auth/register', data),
  getMe: () => 
    api.get('/auth/me'),
};

// Account endpoints
export const accounts = {
  getAll: () => api.get('/accounts'),
  getOne: (id: string) => api.get(`/accounts/${id}`),
  create: (data: any) => api.post('/accounts', data),
  update: (id: string, data: any) => api.put(`/accounts/${id}`, data),
  delete: (id: string) => api.delete(`/accounts/${id}`),
};

// Transaction endpoints
export const transactions = {
  getAll: (params?: any) => api.get('/transactions', { params }),
  getOne: (id: string) => api.get(`/transactions/${id}`),
  create: (data: any) => api.post('/transactions', data),
  update: (id: string, data: any) => api.put(`/transactions/${id}`, data),
  delete: (id: string) => api.delete(`/transactions/${id}`),
};

// Budget endpoints
export const budgets = {
  getAll: () => api.get('/budgets'),
  getOne: (id: string) => api.get(`/budgets/${id}`),
  create: (data: any) => api.post('/budgets', data),
  update: (id: string, data: any) => api.put(`/budgets/${id}`, data),
  delete: (id: string) => api.delete(`/budgets/${id}`),
  getStats: () => api.get('/budgets/stats'),
  getAlerts: () => api.get('/budgets/alerts'),
};

export default api;