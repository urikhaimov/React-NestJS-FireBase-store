import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export interface Order {
  id: string;
  email: string;
  status: string;
  total: number;
  createdAt: string; // ISO date string
  // add more fields as needed
}

export interface OrderFilterParams {
  email?: string;
  status?: string;
  minTotal?: number;
  maxTotal?: number;
  startDate?: string; // ISO string
  endDate?: string;   // ISO string
  sortDirection?: 'asc' | 'desc';
}

async function fetchFilteredOrders(params: OrderFilterParams): Promise<Order[]> {
  const queryParams = new URLSearchParams();

  if (params.email) queryParams.append('email', params.email);
  if (params.status && params.status !== 'all') queryParams.append('status', params.status);
  if (params.minTotal !== undefined) queryParams.append('minTotal', params.minTotal.toString());
  if (params.maxTotal !== undefined) queryParams.append('maxTotal', params.maxTotal.toString());
  if (params.startDate) queryParams.append('startDate', params.startDate);
  if (params.endDate) queryParams.append('endDate', params.endDate);
  if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);

  const url = `/api/orders?${queryParams.toString()}`;
  const { data } = await axios.get<Order[]>(url);
  return data;
}

export function useFilteredOrders(params: OrderFilterParams) {
  return useQuery<Order[], Error>({
    queryKey: ['orders', params],
    queryFn: () => fetchFilteredOrders(params),
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });
}
