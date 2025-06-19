import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { defaultThemes } from '../constants/defaultThemes';

export async function ensureStoreExists(storeId: string) {
  const ref = doc(db, 'stores', storeId);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) {
    const defaultTheme = defaultThemes[storeId] || defaultThemes.default;
    await setDoc(ref, { theme: defaultTheme });
    console.log(`Store ${storeId} created in Firestore`);
  }
}
