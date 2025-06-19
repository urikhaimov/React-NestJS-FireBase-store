import { initializeApp, cert, getApps, getApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import * as serviceAccount from '../service-account.json'; // adjust if needed

// Avoid initializing more than once
const firebaseApp = getApps().length === 0
  ? initializeApp({
      credential: cert(serviceAccount as any),
    })
  : getApp();

export const adminAuth = getAuth(firebaseApp);
