import { createTheme, ThemeOptions } from '@mui/material/styles';
import type { StoreConfig } from '../types/StoreConfig';

export function generateTheme(config: StoreConfig) {
  const isDark = config.mode === 'dark';

  const themeOptions: ThemeOptions = {
    palette: {
      mode: isDark ? 'dark' : 'light',
      primary: {
        main: config.primaryColor,
      },
      background: {
        default: isDark ? '#121212' : '#ffffff',
        paper: isDark ? '#1e1e1e' : '#f5f5f5',
      },
    },
    typography: {
      fontFamily: config.font,
    },
  };

  return createTheme(themeOptions);
}
