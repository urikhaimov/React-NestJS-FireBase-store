// src/theme/theme.ts
import { createTheme } from '@mui/material/styles';
import { storesConfig } from '../config/store.config';

export const theme = createTheme({
  palette: {
    primary: {
      main: storesConfig.theme.primaryColor,
    },
  },
  typography: {
    fontFamily: storesConfig.theme.font,
  },
});