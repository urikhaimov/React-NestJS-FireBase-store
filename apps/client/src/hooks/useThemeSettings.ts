// src/hooks/useThemeSettings.ts
import { useFirestoreDoc } from './useFirestoreDoc';
import { useThemeStore } from '../store/themeStore';

export type ThemeSettings = {
  storeName?: string;
  darkMode?: boolean;
  primaryColor?: string;
  logoUrl?: string;
  backgroundImageUrl?: string;
  // Add other theme fields here...
};

export function useThemeSettings() {
  const { updateTheme } = useThemeStore();

  return useFirestoreDoc<ThemeSettings>({
    collection: 'theme',
    docId: 'settings',
    onUpdate: updateTheme,
  });
}
