import { Module } from '@nestjs/common';
import {
  FirebaseAdminAppProvider,
  FirestoreProvider,
  FirebaseAuthProvider,
  FirebaseStorageProvider,
} from './firebase-admin.provider';

@Module({
  providers: [
    FirebaseAdminAppProvider,
    FirestoreProvider,
    FirebaseAuthProvider,
    FirebaseStorageProvider,
  ],
  exports: [
    FirebaseAdminAppProvider,
    FirestoreProvider,
    FirebaseAuthProvider,
    FirebaseStorageProvider,
  ],
})
export class FirebaseAdminModule {}
