import { useThemeStore } from '../store/themeStore';
import { createTheme } from '@mui/material/styles';
import { getThemeFromSettings } from '../utils/themeBuilder';

export function useThemeConfig() {
  const { themeSettings, isLoading, error } = useThemeStore();
  const theme = createTheme(getThemeFromSettings(themeSettings));

  return { theme, isLoading, error };
}
