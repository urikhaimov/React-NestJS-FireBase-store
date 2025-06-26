// src/hooks/fetchProductsPage.ts
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
  Timestamp,
  QueryConstraint,
  DocumentData,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from '../firebase';
import { Product } from '../types/firebase';

export async function fetchProductsPage(
  lastDoc: QueryDocumentSnapshot<DocumentData> | null = null,
  filters: {
    categoryId?: string;
    createdAfter?: Date | null;
  } = {}
): Promise<{ products: Product[]; lastVisible: QueryDocumentSnapshot<DocumentData> | null }> {
  const constraints: QueryConstraint[] = [];

  // Apply filters first
  if (filters.categoryId) {
    constraints.push(where('categoryId', '==', filters.categoryId));
  }

  if (filters.createdAfter) {
    constraints.push(where('createdAt', '>=', Timestamp.fromDate(filters.createdAfter)));
  }

  // Required order and pagination constraints
  constraints.push(orderBy('createdAt', 'desc'));
  constraints.push(limit(10));

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
      images: data.images || [],
      description: data.description,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      createdBy: data.createdBy,
    };
  });

  const lastVisible = snap.docs[snap.docs.length - 1] || null;

  return { products, lastVisible };
}
