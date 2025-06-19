import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

export async function deleteProduct(productId: string) {
  const productRef = doc(db, 'products', productId);
  await deleteDoc(productRef);
}
