import { useQuery } from '@tanstack/react-query';
import { fetchLogs, fetchLogsByCategory, LogEntry } from '../api/logs';

export function useLogs(categoryId?: string) {
  return useQuery<LogEntry[], Error>({
    queryKey: ['logs', categoryId ?? 'all'],
    queryFn: () => (categoryId ? fetchLogsByCategory(categoryId) : fetchLogs()),
  
    staleTime: 1000 * 60 * 2, // 2 minutes cache
    refetchOnWindowFocus: false,
  });
}
