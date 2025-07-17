import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';

export interface SecurityLog {
  id: string;
  timestamp: string; // ISO string
  email?: string;
  uid?: string;
  type: string;
  details: string;
  collection: string;
  affectedDocId: string;
}

export function useSecurityLogs() {
  return useQuery<SecurityLog[], Error>({
    queryKey: ['securityLogs'],
    queryFn: async () => {
      const response = await axiosInstance.get('/admin/security-logs');
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}
