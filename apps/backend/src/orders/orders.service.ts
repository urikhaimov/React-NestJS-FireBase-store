// src/orders/orders.service.ts
import { Injectable } from '@nestjs/common';
import { admin } from '../firebase/firebase-admin';

import { adminDb } from '../firebase/firebase-admin';
@Injectable()
export class OrdersService {
  async getOrdersByUserId(uid: string) {
    const snapshot = await admin.firestore()
      .collection('orders')
      .where('userId', '==', uid)
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  async getOrderById(uid: string, id: string, role: string) {
    const doc = await admin.firestore().collection('orders').doc(id).get();
    const data = doc.data();

    if (!doc.exists || !data) throw new Error('Order not found');

    if (role === 'admin' || role === 'superadmin' || data.userId === uid) {
      return { id: doc.id, ...data };
    }

    throw new Error('Unauthorized');
  }



  async getAllOrders() {
    const snapshot = await adminDb.collection('orders').get();
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }
}


