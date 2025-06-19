import { collection, query, where, orderBy, limit, startAfter, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { Product } from '../types/firebase';

export async function fetchProductsPage(
  lastDoc: any = null,
  filters: {
    categoryId?: string;
    createdAfter?: Date | null;
  } = {}
): Promise<{ products: Product[]; lastVisible: any }> {
  const constraints: any[] = [orderBy('createdAt', 'desc'), limit(10)];

  if (filters.categoryId) {
    constraints.unshift(where('categoryId', '==', filters.categoryId));
  }

  if (filters.createdAfter) {
    constraints.unshift(where('createdAt', '>=', Timestamp.fromDate(filters.createdAfter)));
  }

  if (lastDoc) {
    constraints.push(startAfter(lastDoc));
  }

  const q = query(collection(db, 'products'), ...constraints);
  const snap = await getDocs(q);

  const products: Product[] = snap.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      price: data.price,
      stock: data.stock,
      categoryId: data.categoryId,
      createdAt: data.createdAt,
      imageUrls: data.imageUrls || [],
      description: data.description || '',
    };
  });

  const lastVisible = snap.docs[snap.docs.length - 1];
  return { products, lastVisible };
}
