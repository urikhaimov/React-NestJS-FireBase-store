import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Product } from '../types/firebase'; // adjust path to your Product type

export function useProduct(productId?: string) {
  return useQuery<Product | null>({
    queryKey: ['product', productId],
    queryFn: async () => {
      if (!productId) return null;

      const res = await axios.get(`/products/${productId}`);
      console.log('🧪 Product response:', res.data); // <--- Add this
      return res.data;
    },
    enabled: !!productId,
  });
}
