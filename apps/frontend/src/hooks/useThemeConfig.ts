import { useThemeContext } from '../context/ThemeContext';

export function useThemeConfig() {
  const { theme, isLoading, error } = useThemeContext();
  return { theme, isLoading, error };
}
