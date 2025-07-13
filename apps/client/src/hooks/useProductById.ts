import { useQuery } from '@tanstack/react-query';
import  axiosInstance  from '../api/axiosInstance'; // adjust path as needed
import type { Product } from '../types/firebase';

export function useProductById(id?: string) {
  return useQuery<Product>({
    queryKey: ['product', id],
    queryFn: async () => {
      if (!id) throw new Error('Product ID is required');
      const res = await axiosInstance.get(`/products/${id}`);
      return res.data;
    },
    enabled: !!id, // avoids firing if id is undefined
  });
}
