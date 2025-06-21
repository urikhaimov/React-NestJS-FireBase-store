// apps/backend/src/products/products.service.ts
import { Injectable } from '@nestjs/common';
import { adminDb } from '../firebase/firebase-admin'; // ✅ this guarantees init
// no need for getFirestore()

@Injectable()
export class ProductsService {
  async findAll() {
    try {
      const snapshot = await adminDb.collection('products').get();
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (err) {
      console.error('🔥 Firestore fetch failed:', err);
      throw new Error('Failed to load products');
    }
  }
}
