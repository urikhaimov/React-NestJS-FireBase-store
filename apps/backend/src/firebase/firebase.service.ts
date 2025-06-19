import { Injectable } from '@nestjs/common';
import { adminAuth } from './firebase-admin';

@Injectable()
export class FirebaseService {
  getUser(uid: string) {
    return adminAuth.getUser(uid);
  }

  verifyToken(idToken: string) {
    return adminAuth.verifyIdToken(idToken);
  }
}
