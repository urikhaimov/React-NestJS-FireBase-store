import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import axios from 'axios';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId?: string;
  images: string[];
}

export function useProduct(
  productId?: string,
  options?: Omit<
    UseQueryOptions<Product | null, Error, Product | null, readonly [string, string?]>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery<Product | null, Error, Product | null, readonly [string, string?]>({
    queryKey: ['product', productId],
    queryFn: async () => {
      if (!productId) return null;
      const { data } = await axios.get<Product>(`/products/${productId}`);
      return data;
    },
    enabled: !!productId,
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    ...options,
  });
}
