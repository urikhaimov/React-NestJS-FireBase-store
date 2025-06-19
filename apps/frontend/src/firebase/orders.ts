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
}

export async function saveOrder(order: OrderData) {
  const ordersRef = collection(db, 'orders');
  const docRef = await addDoc(ordersRef, {
    ...order,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}
