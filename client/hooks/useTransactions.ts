// hooks/useTransactions.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transactions } from '@/lib/api';
import { Transaction } from '@/lib/types';
import { AxiosResponse } from 'axios';

interface TransactionFilters {
  startDate?: string;
  endDate?: string;
  type?: string;
  account?: string;
  category?: string;
}

interface TransactionResponse {
  success: boolean;
  data: Transaction[];
}

interface SingleTransactionResponse {
  success: boolean;
  data: Transaction;
}

export function useTransactions(filters?: TransactionFilters) {
  const queryClient = useQueryClient();

  // Query for fetching transactions
  const transactionsQuery = useQuery<TransactionResponse>({
    queryKey: ['transactions', filters],
    queryFn: async () => {
      const response = await transactions.getAll(filters);
      return response.data;
    },
  });

  // Mutation for creating transaction
  const createTransaction = useMutation<
    AxiosResponse<SingleTransactionResponse>,
    Error,
    Partial<Transaction>
  >({
    mutationFn: (data) => transactions.create(data),
    onSuccess: () => {
      // Invalidate and refetch transactions query
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      // Also invalidate accounts since transaction affects balance
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });

  // Mutation for updating transaction
  const updateTransaction = useMutation<
    AxiosResponse<SingleTransactionResponse>,
    Error,
    { id: string; data: Partial<Transaction> }
  >({
    mutationFn: ({ id, data }) => transactions.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });

  // Mutation for deleting transaction
  const deleteTransaction = useMutation<
    AxiosResponse<void>,
    Error,
    string
  >({
    mutationFn: (id) => transactions.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });

  return {
    // Query data
    transactions: transactionsQuery.data?.data || [],
    isLoading: transactionsQuery.isLoading,
    isError: transactionsQuery.isError,
    error: transactionsQuery.error,

    // Mutations
    createTransaction: {
      mutate: createTransaction.mutate,
      mutateAsync: createTransaction.mutateAsync,
      isPending: createTransaction.isPending,
      isError: createTransaction.isError,
      error: createTransaction.error,
      reset: createTransaction.reset,
    },
    updateTransaction: {
      mutate: updateTransaction.mutate,
      mutateAsync: updateTransaction.mutateAsync,
      isPending: updateTransaction.isPending,
      isError: updateTransaction.isError,
      error: updateTransaction.error,
      reset: updateTransaction.reset,
    },
    deleteTransaction: {
      mutate: deleteTransaction.mutate,
      mutateAsync: deleteTransaction.mutateAsync,
      isPending: deleteTransaction.isPending,
      isError: deleteTransaction.isError,
      error: deleteTransaction.error,
      reset: deleteTransaction.reset,
    },
  };
}