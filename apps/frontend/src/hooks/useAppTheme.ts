import { createTheme, Theme } from '@mui/material/styles';
import { useMemo } from 'react';
import { useThemeSettings } from '../pages/admin/ThemePanel/useThemeSettings';

interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  font: string;
  darkMode: boolean;
}

const fallback: ThemeSettings = {
  primaryColor: '#1976d2',
  secondaryColor: '#f50057',
  font: 'Roboto',
  darkMode: false,
};

export function useAppTheme(): { theme: Theme; isLoading: boolean } {
  const { data, isLoading } = useThemeSettings();

  const theme = useMemo(() => {
    const settings = data || fallback;

    return createTheme({
      palette: {
        mode: settings.darkMode ? 'dark' : 'light',
        primary: { main: settings.primaryColor },
        secondary: { main: settings.secondaryColor },
      },
      typography: {
        fontFamily: settings.font,
      },
    });
  }, [data]);

  return { theme, isLoading };
}
