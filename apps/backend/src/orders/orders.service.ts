import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { adminDb } from '../firebase/firebase-admin';
import { query, where, getDocs, collection } from 'firebase/firestore'; // optional if using frontend SDK

@Injectable()
export class OrdersService {
  async createOrder(dto: CreateOrderDto) {
    const order = {
      ...dto,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    const ref = await adminDb.collection('orders').add(order);
    return { id: ref.id, ...order };
  }

  async getOrdersByUserId(uid: string) {
    const snapshot = await adminDb
      .collection('orders')
      .where('userId', '==', uid)
      .get();

    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  async getOrderById(uid: string, id: string, role: string) {
    const doc = await adminDb.collection('orders').doc(id).get();
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
