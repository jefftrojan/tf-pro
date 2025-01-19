// hooks/useSettings.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { auth } from '@/lib/api';

interface UserSettings {
  name: string;
  email: string;
  preferences: {
    currency: string;
    dateFormat: string;
    language: string;
    notifications: {
      email: boolean;
      push: boolean;
      budgetAlerts: boolean;
      weeklyReport: boolean;
      monthlyReport: boolean;
    };
    theme: string;
  };
}

export const defaultSettings: UserSettings = {
  name: '',
  email: '',
  preferences: {
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    language: 'en',
    notifications: {
      email: true,
      push: true,
      budgetAlerts: true,
      weeklyReport: true,
      monthlyReport: true,
    },
    theme: 'dark',
  },
};

export function useSettings() {
  const queryClient = useQueryClient();

  // Fetch user settings
  const settingsQuery = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const response = await auth.getMe();
      return response.data.data;
    },
  });

  // Update settings mutation
  const updateSettings = useMutation({
    mutationFn: async (data: Partial<UserSettings>) => {
      const response = await auth.updateMe(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });

  return {
    settings: settingsQuery.data || defaultSettings,
    isLoading: settingsQuery.isLoading,
    isError: settingsQuery.isError,
    error: settingsQuery.error,
    updateSettings,
  };
}