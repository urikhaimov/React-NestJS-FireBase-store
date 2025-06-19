import { useQuery } from '@tanstack/react-query';
import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
  orderBy,
  startAfter,
  limit,
  QueryDocumentSnapshot,
  DocumentData,
} from 'firebase/firestore';
import { db } from '../firebase';
import { Product } from '../types/firebase';

export async function fetchFilteredProducts({
  searchTerm,
  categoryId,
  createdAfter,
  pageSize = 20,
  lastDoc = null,
}: {
  searchTerm?: string;
  categoryId?: string;
  createdAfter?: Date;
  pageSize?: number;
  lastDoc?: QueryDocumentSnapshot<DocumentData> | null;
}) {
  const baseQuery = collection(db, 'products');

  const filters = [];
  if (typeof categoryId === 'string' && categoryId.trim() !== '') {
    filters.push(where('categoryId', '==', categoryId));
  }
  if (createdAfter) filters.push(where('createdAt', '>=', Timestamp.fromDate(createdAfter)));

  let compoundQuery = query(baseQuery, ...filters, orderBy('createdAt', 'desc'), limit(pageSize));

  if (lastDoc) {
    compoundQuery = query(baseQuery, ...filters, orderBy('createdAt', 'desc'), startAfter(lastDoc), limit(pageSize));
  }

  const snap = await getDocs(compoundQuery);
  const products = snap.docs.map((doc) => {
    const data = doc.data() as Product;
    return { ...data, id: doc.id };
  }) as Product[];

  const lastVisible = snap.docs[snap.docs.length - 1] || null;

  return { products, lastVisible };
}