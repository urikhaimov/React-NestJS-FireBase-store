import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

export const logSecurityViolation = functions.https.onCall(
  async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'User must be logged in');
    }

    const { type, details, affectedDocId, collection } = data;

    await db.collection('securityLogs').add({
      uid: context.auth.uid,
      email: context.auth.token.email || null,
      type,
      details,
      affectedDocId,
      collection,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { success: true };
  }
);
