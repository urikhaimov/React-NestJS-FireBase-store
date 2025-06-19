// src/api/userPreferences.ts
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

export async function updateUserThemeMode(userId: string, mode: 'light' | 'dark') {
  const ref = doc(db, 'users', userId);
  await updateDoc(ref, { themeMode: mode });
}

export async function fetchUserThemeMode(userId: string): Promise<'light' | 'dark' | null> {
  const ref = doc(db, 'users', userId);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    return snap.data().themeMode || null;
  }
  return null;
}
