import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const logSecurityViolation = functions.firestore
  .document('securityViolations/{docId}')
  .onCreate((snap, context) => {
    const data = snap.data();
    console.log('🚨 Security Violation:', data);
    return null;
  });
