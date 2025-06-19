import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { ThemeConfig } from '../types/ThemeConfig';
import { defaultThemeConfig } from '../constants/defaultTheme';

export async function fetchThemeConfig(storeId = 'default'): Promise<ThemeConfig> {
  try {
    const ref = doc(db, 'themes', storeId);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      return snap.data() as ThemeConfig;
    }

    console.warn(`Theme not found for store: ${storeId}, using default theme.`);
    return defaultThemeConfig;
  } catch (err) {
    console.error('Failed to fetch theme config:', err);
    return defaultThemeConfig;
  }
}