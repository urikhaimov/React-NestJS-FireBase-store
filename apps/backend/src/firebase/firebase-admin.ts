// src/firebase/firebase-admin.ts
import * as admin from 'firebase-admin';
import * as serviceAccount from './service-account.json'; // ✅ ensure this path is correct

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
