// hooks/useAllProducts.ts
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';

export function useAllProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await axiosInstance.get('/products');
      return res.data;
    },
  });
}
