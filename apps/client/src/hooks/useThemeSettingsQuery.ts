// src/hooks/useThemeSettingsQuery.ts
import { useQuery } from '@tanstack/react-query';
import { fetchThemeSettings } from '../api/themeSettings';
import { useThemeStore } from '../stores/useThemeStore';

export const useThemeSettingsQuery = () => {
  const setTheme = useThemeStore((s) => s.setTheme);

  return useQuery({
    queryKey: ['themeSettings'],
    queryFn: fetchThemeSettings,
    staleTime: 5 * 60 * 1000,
    onSuccess: (data) => {
      setTheme(data);
    },
  });
};
