// src/categories/categories.service.ts
import { Injectable } from '@nestjs/common';
import { adminDb } from '../firebase/firebase-admin';
import { collection, getDocs } from 'firebase/firestore';

@Injectable()
export class CategoriesService {
  async getAllCategories() {
 const snapshot = await adminDb.collection('categories').get();
const categories = snapshot.docs.map(doc => ({
  id: doc.id,
  ...doc.data(),
}));
  }
}
