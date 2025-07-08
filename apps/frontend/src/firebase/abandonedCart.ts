import { db } from '../firebase';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { CartItem } from '../store/cartStore';

export async function trackAbandonedCart({
  userId,
  items,
  clientSecret,
  status = 'started',
  email = '',
}: {
  userId: string;
  items: CartItem[];
  clientSecret: string;
  status?: 'started' | 'recovered' | 'failed';
  email?: string;
}) {
  const docRef = doc(db, 'abandonedCarts', clientSecret);
  await setDoc(docRef, {
    userId,
    email,
    items,
    clientSecret,
    status,
    startedAt: new Date().toISOString(),
  });
}

export async function updateAbandonedCartStatus(
  clientSecret: string,
  status: 'recovered' | 'failed',
  reason: string
) {
  const docRef = doc(db, 'abandonedCarts', clientSecret);
  await updateDoc(docRef, {
    status,
    reason,
    updatedAt: new Date().toISOString(),
  });
}
