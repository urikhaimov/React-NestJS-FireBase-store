// src/categories/categories.service.ts
import { Injectable } from '@nestjs/common';
import { adminDb } from '../firebase/firebase-admin';

@Injectable()
export class CategoriesService {
  async findAll() {
    const snapshot = await adminDb.collection('categories').get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  }
}
