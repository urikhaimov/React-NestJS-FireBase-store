// src/hooks/useThemeSettings.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';

export interface ThemeSettings {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  mode: 'light' | 'dark';
  primaryColor: string;
  secondaryColor: string;
  logoUrl?: string;
  backgroundImageUrl?: string;
}

const THEME_SETTINGS_QUERY_KEY = ['themeSettings'] as const;

export function useThemeSettings() {
  const queryClient = useQueryClient();

  // Fetch theme settings
  const { data, isLoading, isError } = useQuery<ThemeSettings, Error>({
    queryKey: THEME_SETTINGS_QUERY_KEY,
    queryFn: async () => {
      const res: AxiosResponse<ThemeSettings> = await axios.get('/theme-settings');
      return res.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    refetchOnWindowFocus: false,
  });

  // Mutation to save/update theme settings
  const mutation = useMutation<AxiosResponse<any>, Error, ThemeSettings>({
    mutationFn: (newSettings) => axios.post('/theme-settings', newSettings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: THEME_SETTINGS_QUERY_KEY });
    },
  });

  return {
    data,
    isLoading,
    isError,
    save: mutation.mutate,
    isSaving: mutation.status === 'pending',
  };
}
