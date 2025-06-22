import * as admin from 'firebase-admin';
import * as serviceAccount from './service-account.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

const adminDb = admin.firestore();
const adminAuth = admin.auth();

export { adminDb, adminAuth, admin }; // ✅ export all needed members
