// src/hooks/useCategories.ts
import { useQuery } from '@tanstack/react-query';
import { Category } from '../types/firebase';

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await fetch('/api/categories');
      if (!res.ok) throw new Error('Failed to fetch categories');
      return res.json();
    },
  });
}
