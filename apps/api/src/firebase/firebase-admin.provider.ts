import { initializeApp, cert, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { getStorage } from 'firebase-admin/storage';
import { Provider } from '@nestjs/common';
import * as admin from 'firebase-admin';

export const FirebaseAdminAppProvider: Provider = {
  provide: 'FIREBASE_ADMIN_APP',
  useFactory: (): App => {
    if (!admin.apps.length) {
      return initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      });
    }
    return admin.app();
  },
};

export const FirestoreProvider: Provider = {
  provide: 'FIRESTORE',
  useFactory: (app: App) => getFirestore(app),
  inject: ['FIREBASE_ADMIN_APP'],
};

export const FirebaseAuthProvider: Provider = {
  provide: 'FIREBASE_AUTH',
  useFactory: (app: App) => getAuth(app),
  inject: ['FIREBASE_ADMIN_APP'],
};

export const FirebaseStorageProvider: Provider = {
  provide: 'FIREBASE_STORAGE',
  useFactory: (app: App) => getStorage(app),
  inject: ['FIREBASE_ADMIN_APP'],
};
