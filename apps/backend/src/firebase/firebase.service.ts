import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as serviceAccount from '../service-account.json';

@Injectable()
export class FirebaseService {
  private firebaseApp: admin.app.App;

  constructor() {
    this.firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
  }

  get firestore() {
    return admin.firestore();
  }

  get auth() {
    return admin.auth();
  }
}
