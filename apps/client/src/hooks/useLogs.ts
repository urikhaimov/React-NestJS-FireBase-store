import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { SecurityLog } from '../api/logs';

export function fetchLogs(categoryId?: string): Promise<SecurityLog[]> {
  // Adjust your API endpoint as needed
  const url = categoryId ? `/api/logs?category=${categoryId}` : '/api/logs';
  return axios.get(url).then(res => res.data);
}

export function useLogs(categoryId?: string) {
  return useQuery<SecurityLog[], Error>({
    queryKey: ['logs', categoryId ?? 'all'],
    queryFn: () => fetchLogs(categoryId),
    staleTime: 1000 * 60 * 2, // 2 minutes cache
    refetchOnWindowFocus: false,
  });
}
