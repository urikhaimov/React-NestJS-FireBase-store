import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { IProduct } from '@common/types';

export function useProduct(productId?: string) {
  return useQuery<IProduct | null>({
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
