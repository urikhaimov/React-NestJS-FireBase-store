import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getEnv } from '@common/utils';

const firebaseConfig = {
  apiKey: getEnv('VITE_FIREBASE_API_KEY', { target: import.meta }) as string,
  authDomain: getEnv('VITE_FIREBASE_AUTH_DOMAIN', {
    target: import.meta,
  }) as string,
  projectId: getEnv('VITE_FIREBASE_PROJECT_ID', {
    target: import.meta,
  }) as string,
  storageBucket: getEnv('VITE_FIREBASE_STORAGE_BUCKET', {
    target: import.meta,
  }) as string,
  messagingSenderId: getEnv('VITE_FIREBASE_MESSAGING_SENDER_ID', {
    target: import.meta,
  }) as string,
  appId: getEnv('VITE_FIREBASE_APP_ID', { target: import.meta }) as string,
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(
  firebaseApp,
  'gs://onlinestoretemplate-59d3e',
);
