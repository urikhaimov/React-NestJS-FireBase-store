// src/theme/generateMuiTheme.ts
import { createTheme } from '@mui/material/styles';
import { ThemeConfig } from '../types/ThemeConfig';

export function generateMuiTheme(config: ThemeConfig, mode: 'light' | 'dark') {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: config.primaryColor || '#1976d2',
      },
      secondary: {
        main: config.secondaryColor || '#e91e63',
      },
    },
    typography: {
      fontFamily: config.fontFamily || 'Roboto, sans-serif',
    },
  });
}

