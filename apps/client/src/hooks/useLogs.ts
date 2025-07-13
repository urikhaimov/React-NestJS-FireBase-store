import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { SecurityLog } from '../api/logs';

export async function fetchLogs(categoryId?: string): Promise<SecurityLog[]> {
  // Adjust your API endpoint as needed
  const url = categoryId ? `/logs?category=${categoryId}` : '/api/logs';
  const res = await axios.get(url);
  return res.data;
}

export function useLogs(categoryId?: string) {
  return useQuery<SecurityLog[], Error>({
    queryKey: ['logs', categoryId ?? 'all'],
    queryFn: () => fetchLogs(categoryId),
    staleTime: 1000 * 60 * 2, // 2-minute cache
    refetchOnWindowFocus: false,
  });
}
