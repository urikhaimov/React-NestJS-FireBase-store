// src/hooks/useSaveProductOrder.ts
import { writeBatch, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { Product } from '../types/firebase';

/**
 * Persists the new order of products in Firestore using a batch write.
 * @param products - Ordered list of products
 */
export async function saveProductOrderToFirestore(products: Product[]) {
  const batch = writeBatch(db);

  products.forEach((product, index) => {
    const ref = doc(db, 'products', product.id);
    batch.update(ref, { order: index }); // You can use any field name here
  });

  try {
    await batch.commit();
    console.log('Product order saved successfully');
  } catch (error) {
    console.error('Failed to save product order:', error);
    throw error;
  }
}
