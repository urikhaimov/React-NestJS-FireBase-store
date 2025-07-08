import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

export interface ThemeSettings {
  mode: 'light' | 'dark';
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
}

export async function getThemeSettings(storeId: string): Promise<ThemeSettings> {
  const snap = await getDoc(doc(db, 'stores', storeId));
  if (!snap.exists()) {
    console.warn('Store theme not found, falling back to defaults');
    return {
      mode: 'light',
      primaryColor: '#1976d2',
      secondaryColor: '#dc004e',
      fontFamily: 'Roboto',
      fontSize: 16,
      fontWeight: 400,
    };
  }
  return snap.data().theme as ThemeSettings;
}


export async function updateThemeSettings(storeId: string, theme: ThemeSettings) {
  await setDoc(doc(db, 'stores', storeId), { theme }, { merge: true });
}
