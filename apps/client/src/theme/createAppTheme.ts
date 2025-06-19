// src/themes/createAppTheme.ts
import { createTheme, ThemeOptions } from '@mui/material/styles';
import { ThemeSettings } from '../store/themeStore';

export function createAppTheme(settings: ThemeSettings) {
  return createTheme({
    palette: {
      mode: settings.darkMode ? 'dark' : 'light',
      primary: { main: settings.primaryColor },
      secondary: { main: settings.secondaryColor },
    },
    typography: {
      fontFamily: settings.font,
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
          },
        },
      },
    },
  });
}
