import { useQuery } from '@tanstack/react-query';
import api from '../api/axiosInstance'; // your wrapped axios instance

export interface Order {
  id: string;
  userId: string;
  email: string;
  total: number;
  createdAt: string | { toDate?: () => Date };
  status: string;
}

export async function fetchOrders(): Promise<Order[]> {
  const res = await api.get('/orders'); // no need for /api prefix or token
  return res.data;
}

export function useOrders() {
  return useQuery<Order[], Error>({
    queryKey: ['orders'],
    queryFn: fetchOrders,
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });
}
