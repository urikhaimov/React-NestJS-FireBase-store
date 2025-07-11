import api from './axios'; // make sure this points to your axios config file
import { ThemeSettings } from '../types/theme';

export const fetchThemeSettings = async (): Promise<ThemeSettings> => {
  const { data } = await api.get<ThemeSettings>('/theme-settings');
  return data;
};

export const updateThemeSettings = async (
  settings: Partial<ThemeSettings>
): Promise<ThemeSettings> => {
  const { data } = await api.post<ThemeSettings>('/theme-settings', settings);
  return data;
};
