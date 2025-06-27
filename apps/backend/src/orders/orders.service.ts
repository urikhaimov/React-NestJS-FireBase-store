// apps/backend/src/orders/orders.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateOrderDto } from './dto/create-order.dto';
import { adminDb } from '../firebase/firebase-admin';
import Stripe from 'stripe';

@Injectable()
export class OrdersService {
  private stripe: Stripe;

  constructor(private readonly config: ConfigService) {
    const secretKey = this.config.get<string>('STRIPE_SECRET_KEY');

    if (!secretKey) {
      throw new Error('Missing STRIPE_SECRET_KEY in environment');
    }

    this.stripe = new Stripe(secretKey, {
      apiVersion: '2025-05-28.basil',
    });
  }

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

  async createPaymentIntent(amount: number) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount,
        currency: 'usd',
        automatic_payment_methods: { enabled: true },
      });

      return {
        clientSecret: paymentIntent.client_secret,
      };
    } catch (error) {
      console.error('Stripe error:', error);
      throw new InternalServerErrorException('Failed to create payment intent');
    }
  }
}
