// src/stores/useThemeStore.ts
import { create } from 'zustand';
import axiosInstance from '../api/axiosInstance';
import type { ThemeSettings } from '../types/theme';

interface ThemeState {
  themeSettings: ThemeSettings;
  isLoading: boolean;
  error: string | null;
  updateTheme: (newSettings: Partial<ThemeSettings>) => void;
  toggleDarkMode: () => void;
  setTheme: (settings: ThemeSettings) => void;
  loadTheme: () => Promise<void>; // ✅ ADDED
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  themeSettings: {
    storeName: 'My Store',
    darkMode: false,
    primaryColor: '#1976d2',
    secondaryColor: '#ff4081',
    font: 'Roboto',
    fontFamily: 'Roboto',
    fontSize: 16,
    fontWeight: 400,
    logoUrl: '',
    homepageLayout: 'hero',
    productCardVariant: 'compact',
    categoryStyle: 'tabs',
    showSidebar: true,
    maxWidth: 'xl',
    stickyHeader: true,
  },
  isLoading: true,
  error: null,

  updateTheme: (newSettings) => {
    set((state) => ({
      themeSettings: {
        ...state.themeSettings,
        ...newSettings,
      },
    }));
  },

  setTheme: (settings) => {
    set({ themeSettings: settings, isLoading: false, error: null });
  },

  toggleDarkMode: async () => {
    const current = get().themeSettings;
    const updated = {
      ...current,
      darkMode: !current.darkMode,
    };

    try {
      await axiosInstance.put('/theme/settings', updated);
      set({ themeSettings: updated });
    } catch (error) {
      console.error('❌ Failed to toggle dark mode:', error);
      set({ error: 'Failed to toggle dark mode' });
    }
  },

  loadTheme: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axiosInstance.get<ThemeSettings>('/theme/settings');
      get().setTheme(data);
    } catch (error: any) {
      console.error('❌ Failed to load theme:', error);
      set({ error: error.message, isLoading: false });
    }
  },
}));
