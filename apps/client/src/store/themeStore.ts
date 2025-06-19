// src/store/themeStore.ts
import { create } from 'zustand';

export type ThemeSettings = {
  storeName: string;
  darkMode: boolean;
  primaryColor: string;
  secondaryColor: string;
  font: string;
  logoUrl: string;
  backgroundImageUrl?: string;
  faviconUrl?: string;
  homepageLayout: 'hero' | 'carousel' | 'grid';
  productCardVariant: 'compact' | 'detailed';
  categoryStyle: 'tabs' | 'dropdown' | 'grid';
  showSidebar: boolean;
  maxWidth: 'lg' | 'xl' | 'full';
  stickyHeader: boolean;
  announcementBar?: {
    text: string;
    backgroundColor: string;
    textColor: string;
  };
  footerLinks?: { label: string; url: string }[];
};

interface ThemeState {
  themeSettings: ThemeSettings;
  updateTheme: (newSettings: Partial<ThemeSettings>) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  themeSettings: {
    storeName: 'My Store',
    darkMode: false,
    primaryColor: '#1976d2',
    secondaryColor: '#ff4081',
    font: 'Roboto',
    logoUrl: '',
    homepageLayout: 'hero',
    productCardVariant: 'compact',
    categoryStyle: 'tabs',
    showSidebar: true,
    maxWidth: 'xl',
    stickyHeader: true,
    // Optional: backgroundImageUrl, faviconUrl, announcementBar, footerLinks
  },
  updateTheme: (newSettings) =>
    set((state) => ({
      themeSettings: {
        ...state.themeSettings,
        ...newSettings,
      },
    })),
}));
