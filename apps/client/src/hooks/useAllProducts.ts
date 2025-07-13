// hooks/useAllProducts.ts
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export function useAllProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await axios.get('/products');
      return res.data;
    },
  });
}
