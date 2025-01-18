// hooks/useBudgets.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { budgets } from '@/lib/api';
import { AxiosError } from 'axios';

interface DateRange {
  startDate: string;
  endDate: string;
}

export function useBudgets(dateRange?: DateRange) {
  const queryClient = useQueryClient();

  // Query for fetching budgets
  const budgetsQuery = useQuery({
    queryKey: ['budgets', dateRange],
    queryFn: async () => {
      const response = await budgets.getAll(dateRange);
      return response.data;
    },
  });

  // Query for fetching stats
  const statsQuery = useQuery({
    queryKey: ['budgetStats', dateRange],
    queryFn: async () => {
      const response = await budgets.getStats(dateRange);
      return response.data;
    },
  });

  // Query for fetching alerts
  const alertsQuery = useQuery({
    queryKey: ['budgetAlerts', dateRange],
    queryFn: async () => {
      const response = await budgets.getAlerts(dateRange);
      return response.data;
    },
  });

  // Mutation for creating budget
  const createBudget = useMutation({
    mutationFn: (data: any) => budgets.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['budgetStats'] });
      queryClient.invalidateQueries({ queryKey: ['budgetAlerts'] });
    },
  });

  // Mutation for updating budget
  const updateBudget = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      budgets.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['budgetStats'] });
      queryClient.invalidateQueries({ queryKey: ['budgetAlerts'] });
    },
  });

  // Mutation for deleting budget
  const deleteBudget = useMutation({
    mutationFn: (id: string) => budgets.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['budgetStats'] });
      queryClient.invalidateQueries({ queryKey: ['budgetAlerts'] });
    },
  });

  return {
    budgets: budgetsQuery.data?.data || [],
    stats: statsQuery.data?.data,
    alerts: alertsQuery.data?.data || [],
    isLoading: budgetsQuery.isLoading || statsQuery.isLoading || alertsQuery.isLoading,
    isError: budgetsQuery.isError || statsQuery.isError || alertsQuery.isError,
    error: budgetsQuery.error || statsQuery.error || alertsQuery.error,
    createBudget,
    updateBudget,
    deleteBudget,
  };
}