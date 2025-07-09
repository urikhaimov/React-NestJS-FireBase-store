import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export interface Order {
  id: string;
  userId: string;
  email: string;
  total: number;
  createdAt: string | { toDate?: () => Date };
  status: string;
}

export async function fetchOrders(token: string): Promise<Order[]> {
  const res = await axios.get('/api/orders', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export function useOrders(token?: string) {
  return useQuery<Order[], Error>({
    queryKey: ['orders'],
    queryFn: () => {
      if (!token) return Promise.resolve([]);
      return fetchOrders(token);
    },
    enabled: !!token,
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });
}
