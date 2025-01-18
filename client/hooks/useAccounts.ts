// hooks/useAccounts.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { accounts } from '@/lib/api';
import { Account } from '@/lib/types';

interface AccountResponse {
  success: boolean;
  data: Account;
}

interface AccountsResponse {
  success: boolean;
  data: Account[];
}

interface UpdateAccountPayload {
    id: string;
    data: Partial<Account>;
  }
export function useAccounts() {
  const queryClient = useQueryClient();

  const accountsQuery = useQuery<AccountsResponse, Error>({
    queryKey: ['accounts'],
    queryFn: async () => {
      const response = await accounts.getAll();
      return response.data;
    },
  });

  const createAccount = useMutation<
    AxiosResponse<AccountResponse>,
    Error,
    Partial<Account>
  >({
    mutationFn: (data) => accounts.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });

  const updateAccount = useMutation({
    mutationFn: ({ id, data }: UpdateAccountPayload) => {
      if (!id) {
        throw new Error('Account ID is required for update');
      }
      return accounts.update(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });

  const deleteAccount = useMutation<AxiosResponse<void>, Error, string>({
    mutationFn: (id) => accounts.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });

  return {
    accounts: accountsQuery.data?.data || [],
    isLoading: accountsQuery.isLoading,
    isError: accountsQuery.isError,
    error: accountsQuery.error,
    createAccount: {
      mutate: createAccount.mutate,
      mutateAsync: createAccount.mutateAsync,
      isPending: createAccount.isPending,
      isError: createAccount.isError,
      error: createAccount.error
    },
    updateAccount: {
      mutate: updateAccount.mutate,
      mutateAsync: updateAccount.mutateAsync,
      isPending: updateAccount.isPending,
      isError: updateAccount.isError,
      error: updateAccount.error
    },
    deleteAccount: {
      mutate: deleteAccount.mutate,
      mutateAsync: deleteAccount.mutateAsync,
      isPending: deleteAccount.isPending,
      isError: deleteAccount.isError,
      error: deleteAccount.error
    }
  };
}