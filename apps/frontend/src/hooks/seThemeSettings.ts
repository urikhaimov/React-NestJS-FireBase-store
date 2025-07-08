import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useThemeStore } from '../store/themeStore'; // Zustand store import

type ThemeFormValues = {
  primaryColor: string;
  secondaryColor: string;
  font: string;
  darkMode: boolean;
};

const storeId = 'store123'; // Replace this with dynamic value if needed

export function useThemeSettings() {
  const [data, setData] = useState<ThemeFormValues | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { themeSettings, toggleDarkMode, setTheme } = useThemeStore(); // Zustand hooks

  useEffect(() => {
    const fetchTheme = async () => {
      const ref = doc(db, 'themes', storeId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const fetched = snap.data();
        setData({
          primaryColor: fetched.primaryColor ?? '#1976d2',
          secondaryColor: fetched.secondaryColor ?? '#f50057',
          font: fetched.fontFamily ?? 'Roboto',
          darkMode: fetched.mode === 'dark',
        });

        // Sync fetched theme with Zustand store
        setTheme({
          storeName: 'My Store',                       // ✅ required
          darkMode: fetched.mode === 'dark',
          primaryColor: fetched.primaryColor ?? '#1976d2',
          secondaryColor: fetched.secondaryColor ?? '#f50057',
          font: fetched.fontFamily ?? 'Roboto',
          fontSize: fetched.fontSize ?? 16,            // ✅ added
          fontWeight: fetched.fontWeight ?? 400,       // ✅ added
          logoUrl: fetched.logoUrl ?? '',              // ✅ required
          homepageLayout: fetched.homepageLayout ?? 'hero',
          productCardVariant: fetched.productCardVariant ?? 'compact',
          categoryStyle: fetched.categoryStyle ?? 'tabs',
          showSidebar: fetched.showSidebar ?? true,
          maxWidth: fetched.maxWidth ?? 'xl',
          stickyHeader: fetched.stickyHeader ?? true,
          announcementBar: fetched.announcementBar,
          footerLinks: fetched.footerLinks,
        });
      }
    };
    fetchTheme();
  }, [setTheme]);

  const saveTheme = async (form: ThemeFormValues) => {
    setIsSaving(true);

    const themeDoc = {
      primaryColor: form.primaryColor,
      secondaryColor: form.secondaryColor,
      fontFamily: form.font,
      mode: form.darkMode ? 'dark' : 'light',
    };

    await setDoc(doc(db, 'themes', storeId), themeDoc, { merge: true });
    setData(form);

    // Optionally toggle live mode in Zustand
    if (form.darkMode !== themeSettings.darkMode) {
      toggleDarkMode();
    }

    setIsSaving(false);
  };

  return { data, saveTheme, isSaving };
}
