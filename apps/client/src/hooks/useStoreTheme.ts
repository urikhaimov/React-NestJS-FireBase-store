// src/hooks/useStoreTheme.ts
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';

export const useStoreTheme = (storeId: string) => {
  return useQuery({
    queryKey: ['store-theme', storeId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/themes/${storeId}`);
      return data;
    },
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 min
  });
};
