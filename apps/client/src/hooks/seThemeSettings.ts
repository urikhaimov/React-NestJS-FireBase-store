import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useThemeContext } from '../context/ThemeContext';

type ThemeFormValues = {
  primaryColor: string;
  secondaryColor: string;
  font: string;
  darkMode: boolean;
};

const storeId = 'store123'; // replace this with dynamic value if needed

export function useThemeSettings() {
  const [data, setData] = useState<ThemeFormValues | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { theme, toggleMode, mode } = useThemeContext();

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
      }
    };
    fetchTheme();
  }, []);

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

    // Optionally toggle live mode
    if (form.darkMode !== (mode === 'dark')) {
      toggleMode();
    }

    setIsSaving(false);
  };

  return { data, saveTheme, isSaving };
}
