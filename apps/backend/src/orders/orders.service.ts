// src/orders/orders.service.ts
import { Injectable } from '@nestjs/common';
import { adminDb } from '../firebase/firebase-admin';

@Injectable()
export class OrdersService {
  async getOrdersByUserId(uid: string) {
    const snapshot = await adminDb
      .collection('orders')
      .where('userId', '==', uid)
      .orderBy('createdAt', 'desc')
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }
}
