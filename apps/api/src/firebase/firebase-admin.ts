import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import * as admin from 'firebase-admin';
import * as serviceAccount from '../service-account.json'; // adjust if needed

if (!admin.apps.length) {
  initializeApp({
    credential: cert(serviceAccount as admin.ServiceAccount),
  });
}

export const adminAuth = getAuth();
