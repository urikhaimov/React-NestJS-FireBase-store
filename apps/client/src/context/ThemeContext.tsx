// src/context/ThemeContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { createTheme, Theme } from '@mui/material/styles';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

type ThemeContextType = {
  theme: Theme;
  mode: 'light' | 'dark';
  toggleMode: () => void;
  isLoading: boolean;
  error: string | null;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const storeId = localStorage.getItem('storeId') || 'store1';
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const [theme, setTheme] = useState(createTheme());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const buildTheme = (darkMode: boolean, primaryColor: string, secondaryColor: string, font: string) =>
    createTheme({
      palette: {
        mode: darkMode ? 'dark' : 'light',
        primary: { main: primaryColor },
        secondary: { main: secondaryColor },
      },
      typography: {
        fontFamily: font,
      },
    });

  const fetchTheme = async () => {
    setIsLoading(true);
    setError(null);
    try {
      let docRef = doc(db, 'themes', storeId);
      let docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        console.warn(`⚠ Theme not found for store: ${storeId}. Falling back to 'settings'.`);
        docRef = doc(db, 'themes', 'settings');
        docSnap = await getDoc(docRef);
      }

      if (docSnap.exists()) {
        const data = docSnap.data();
        const dark = !!data.darkMode;
        const primary = data.primaryColor || '#1976d2';
        const secondary = data.secondaryColor || '#f50057';
        const font = data.font || 'Roboto';
        setTheme(buildTheme(dark, primary, secondary, font));
        setMode(dark ? 'dark' : 'light');
      } else {
        throw new Error('No valid theme found.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Unknown error loading theme.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTheme();
  }, [storeId]);

  const toggleMode = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    setTheme(
      createTheme({
        ...theme,
        palette: {
          ...theme.palette,
          mode: newMode,
        },
      })
    );
  };

  return (
    <ThemeContext.Provider value={{ theme, mode, toggleMode, isLoading, error }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useThemeContext must be used within a ThemeProvider');
  return context;
};
