import { create } from 'zustand';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export type ThemeSettings = {
  storeName: string;
  darkMode: boolean;
  primaryColor: string;
  secondaryColor: string;
  font: string;
  fontSize: number;           // ✅ added
  fontWeight: number;         // ✅ added
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
  isLoading: boolean;
  error: string | null;

  updateTheme: (newSettings: Partial<ThemeSettings>) => void;
  toggleDarkMode: () => Promise<void>;
  setTheme: (settings: ThemeSettings) => void;
  loadTheme: () => Promise<void>;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  themeSettings: {
    storeName: 'My Store',
    darkMode: false,
    primaryColor: '#1976d2',
    secondaryColor: '#ff4081',
    font: 'Roboto',
    fontSize: 16,                 // ✅ default font size
    fontWeight: 400,              // ✅ default font weight
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

  updateTheme: (newSettings) =>
    set((state) => ({
      themeSettings: {
        ...state.themeSettings,
        ...newSettings,
      },
    })),

  setTheme: (settings) =>
    set(() => ({
      themeSettings: settings,
      isLoading: false,
      error: null,
    })),

  loadTheme: async () => {
    set({ isLoading: true, error: null });
    try {
      const ref = doc(db, 'theme', 'settings');
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        const fallback: ThemeSettings = {
          storeName: data.storeName ?? 'My Store',
          darkMode: data.darkMode ?? false,
          primaryColor: data.primaryColor ?? '#1976d2',
          secondaryColor: data.secondaryColor ?? '#ff4081',
          font: data.font ?? 'Roboto',
          fontSize: data.fontSize ?? 16,
          fontWeight: data.fontWeight ?? 400,
          logoUrl: data.logoUrl ?? '',
          backgroundImageUrl: data.backgroundImageUrl,
          faviconUrl: data.faviconUrl,
          homepageLayout: data.homepageLayout ?? 'hero',
          productCardVariant: data.productCardVariant ?? 'compact',
          categoryStyle: data.categoryStyle ?? 'tabs',
          showSidebar: data.showSidebar ?? true,
          maxWidth: data.maxWidth ?? 'xl',
          stickyHeader: data.stickyHeader ?? true,
          announcementBar: data.announcementBar,
          footerLinks: data.footerLinks,
        };

        set({ themeSettings: fallback, isLoading: false });
      } else {
        throw new Error('No theme document found');
      }
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

toggleDarkMode: async () => {
  const current = get().themeSettings;
  const updated = {
    ...current,
    darkMode: !current.darkMode,
    font: current.font || 'Roboto',
    fontSize: current.fontSize ?? 16,
    fontWeight: current.fontWeight ?? 400,
    storeName: current.storeName || 'My Store',
    logoUrl: current.logoUrl || '',
    homepageLayout: current.homepageLayout || 'hero',
    productCardVariant: current.productCardVariant || 'compact',
    categoryStyle: current.categoryStyle || 'tabs',
    showSidebar: current.showSidebar ?? true,
    maxWidth: current.maxWidth || 'xl',
    stickyHeader: current.stickyHeader ?? true,
  };

  // ✅ Remove undefined fields before saving
  const cleanUpdated = Object.fromEntries(
    Object.entries(updated).filter(([_, v]) => v !== undefined)
  );

  try {
    const ref = doc(db, 'theme', 'settings');
    await setDoc(ref, cleanUpdated, { merge: true });
    set({ themeSettings: updated });
  } catch (error) {
    set({ error: 'Failed to toggle dark mode' });
    console.error('❌ Failed to toggle dark mode:', error);
  }
},


}));
