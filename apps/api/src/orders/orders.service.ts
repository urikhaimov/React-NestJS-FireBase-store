// src/orders/orders.service.ts
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { adminDb } from '../firebase/firebase-admin';

@Injectable()
export class OrdersService {
  private collection = adminDb.collection('orders');

  async getOrdersByUserId(uid: string) {
    const snapshot = await this.collection
      .where('userId', '==', uid)
      .orderBy('createdAt', 'desc')
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  // ✅ Add this method if it's missing
  async getOrderById(uid: string, orderId: string, role: string) {
    const doc = await this.collection.doc(orderId).get();

    if (!doc.exists) {
      throw new NotFoundException('Order not found');
    }

    const data = doc.data();
    const isOwner = data?.userId === uid;
    const isAdmin = role === 'admin' || role === 'superadmin';

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('Access denied');
    }

    return { id: doc.id, ...data };
  }
}
