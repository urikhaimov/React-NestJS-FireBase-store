// apps/backend/src/firebase/firebase-admin.ts
import * as admin from 'firebase-admin';
import * as serviceAccount from './service-account.json'; // ✅ adjust if needed

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
export { admin };
