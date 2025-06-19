import React from 'react';
import { ThemeProvider } from '../context/ThemeContext';

export const StoreBoundThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return <ThemeProvider>{children}</ThemeProvider>; // ✅ No props passed
};
