// src/hooks/useAllProducts.ts
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Product } from '../types/firebase';

export function useAllProducts() {
  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      const snap = await getDocs(collection(db, 'products'));
      return snap.docs.map((doc) => {
        const data = doc.data() as Product;
        return { ...data, id: doc.id };
      });
    },
    staleTime: 0, // force refetch on mount
    refetchOnWindowFocus: true,
  });
}