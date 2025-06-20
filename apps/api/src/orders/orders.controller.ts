import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
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

  // ✅ THIS METHOD MUST EXIST
  async getOrderById(uid: string, orderId: string) {
    const doc = await adminDb.collection('orders').doc(orderId).get();

    if (!doc.exists) throw new NotFoundException('Order not found');

    const data = doc.data();
    if (data?.userId !== uid) throw new ForbiddenException('Access denied');

    return { id: doc.id, ...data };
  }
}
