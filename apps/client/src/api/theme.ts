import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from './axios';

export interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  darkMode: boolean;
  fontFamily: string;
  maxWidth: string;
}

export const getThemeSettings = async (): Promise<ThemeSettings> => {
  const response = await api.get<ThemeSettings>('/api/theme-settings');
  return response.data;
};

export const updateThemeSettings = async (
  data: Partial<ThemeSettings>
): Promise<ThemeSettings> => {
  const response = await api.post<ThemeSettings>('/api/theme-settings', data);
  return response.data;
};

export const useThemeSettingsQuery = () =>
  useQuery({
    queryKey: ['theme-settings'],
    queryFn: getThemeSettings,
  });

export const useUpdateThemeSettingsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateThemeSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['theme-settings'] });
    },
  });
};
