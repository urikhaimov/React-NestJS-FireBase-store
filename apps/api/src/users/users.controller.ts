// src/users/users.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { adminDb } from '../firebase/firebase-admin';

@Controller('users')
@UseGuards(FirebaseAuthGuard)
export class UsersController {
  @Get()
  async findAll() {
    const snapshot = await adminDb.collection('users').get();
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }
}
