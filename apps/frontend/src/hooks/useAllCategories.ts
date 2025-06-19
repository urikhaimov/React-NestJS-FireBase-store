import { useQuery } from '@tanstack/react-query';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export interface Category {
  id: string;
  name: string;
}

export function useAllCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const snap = await getDocs(collection(db, 'categories'));
      return snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Category[];
    },
  });
}
