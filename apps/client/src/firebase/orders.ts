import { db } from '../firebase';
import {
  collection,
  addDoc,
  updateDoc,
  Timestamp,
} from 'firebase/firestore';

// ----- Interfaces -----

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
  eta?: string; // ISO 8601 or human-readable
  shippingCost?: number;
  sla?: string; // ✅ e.g. "Standard", "Next-day"
}

export interface OrderStatusHistory {
  status: string;
  timestamp: string; // ISO string
  changedBy: string; // uid or "system"
}

export interface OrderData {
  id?: string;
  userId: string;
  items: OrderItem[];
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  payment: PaymentInfo;
  shippingAddress: ShippingAddress;
  delivery?: DeliveryInfo;
  notes?: string;
  internalTags?: string[]; // ✅ e.g. ["fragile", "gift"]
  statusHistory?: OrderStatusHistory[];
  createdAt?: string | Timestamp;
  updatedAt?: string | Timestamp;
}

// ----- Firestore Save -----

/**
 * Saves a new order to Firestore
 * Automatically sets `createdAt`, `updatedAt`, and first `statusHistory` entry.
 */
export async function saveOrder(
  order: Omit<OrderData, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const now = new Date().toISOString();
  const ordersRef = collection(db, 'orders');

  const docRef = await addDoc(ordersRef, {
    ...order,
    createdAt: now,
    updatedAt: now,
    statusHistory: [
      ...(order.statusHistory ?? []),
      {
        status: order.status,
        timestamp: now,
        changedBy: 'system', // or use `order.userId`
      },
    ],
  });

  // Write generated ID into doc for reference
  await updateDoc(docRef, { id: docRef.id });

  return docRef.id;
}
