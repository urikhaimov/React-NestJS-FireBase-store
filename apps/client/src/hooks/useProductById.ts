import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';
import { IProduct } from '@common/types'; // adjust a path as needed

export function useProductById(id?: string) {
  return useQuery<IProduct>({
    queryKey: ['product', id],
    queryFn: async () => {
      if (!id) throw new Error('Product ID is required');
      const res = await axiosInstance.get(`/products/${id}`);
      return res.data;
    },
    enabled: !!id, // avoids firing if id is undefined
  });
}
