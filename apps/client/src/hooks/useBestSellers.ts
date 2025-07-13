// src/hooks/useBestSellers.ts
import { useInfiniteQuery } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance'; // or just `axios` if you're not customizing
import type { Product } from '../types/firebase';

const PAGE_SIZE = 4;

export function useBestSellers() {
  return useInfiniteQuery({
    queryKey: ['best-sellers'],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await axiosInstance.get('/products/best-sellers', {
        params: {
          offset: pageParam,
          limit: PAGE_SIZE,
        },
      });

      if (!Array.isArray(res.data?.products)) {
        throw new Error('Invalid products response');
      }

      return {
        products: res.data.products as Product[],
        nextOffset: res.data.products.length < PAGE_SIZE ? undefined : pageParam + PAGE_SIZE,
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextOffset,
  });
}
