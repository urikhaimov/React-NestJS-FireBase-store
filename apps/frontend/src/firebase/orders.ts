// src/firebase/orders.ts
import { db } from '../firebase';
import {
  addDoc,
  collection,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { updateDoc } from 'firebase/firestore';
export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface PaymentInfo {
  method: string;
  status: 'paid' | 'unpaid';
  transactionId?: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface DeliveryInfo {
  provider?: string;
  trackingNumber?: string;
  eta?: string; // ISO date string or human-readable
}

export interface OrderStatusHistory {
  status: string;
  timestamp: string;
  changedBy: string;
}

export interface OrderData {
  id?: string; // redundant but useful
  userId: string;
  items: OrderItem[];
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  payment: PaymentInfo;
  shippingAddress: ShippingAddress;
  delivery?: DeliveryInfo;
  notes?: string;
  statusHistory?: OrderStatusHistory[];
  createdAt?: string | Timestamp;
  updatedAt?: string | Timestamp;
}

export async function saveOrder(order: Omit<OrderData, 'id' | 'createdAt' | 'updatedAt'>) {
  const ordersRef = collection(db, 'orders');

  const now = new Date().toISOString();

  const docRef = await addDoc(ordersRef, {
    ...order,
    createdAt: now,
    updatedAt: now,
    statusHistory: [
      {
        status: order.status,
        timestamp: now,
        changedBy: 'system', // or order.userId if you prefer
      },
    ],
  });

  // Optional: write the ID into the doc itself
 await updateDoc(docRef, { id: docRef.id });

  return docRef.id;
}
