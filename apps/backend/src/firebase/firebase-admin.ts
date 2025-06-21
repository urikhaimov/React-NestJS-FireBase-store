// src/firebase/firebase-admin.ts
import * as admin from 'firebase-admin';
import serviceAccount from './service-account.json'; // ✅ ensure path is correct

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

export { admin }; // ✅ export full SDK
export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
