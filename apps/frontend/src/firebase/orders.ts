// src/firebase/orders.ts
import { db } from '../firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

export interface OrderData {
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  email: string;
  fullName: string;
  address: string;
  createdAt?: any;
  updatedAt?: any;
  status?: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  delivery?: {
    trackingNumber?: string;
    provider?: string;
    eta?: string;
  };
  notes?: string;
}
export async function saveOrder(order: OrderData) {
  const ordersRef = collection(db, 'orders');
  const docRef = await addDoc(ordersRef, {
    ...order,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}
