// useLandingPage.ts (React Query v5)
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';
import type { LandingPageData } from '../types/landing';

const LANDING_PAGE_QUERY_KEY = { queryKey: ['landingPage'] };

export function useLandingPage() {
  return useQuery<LandingPageData, Error>({
    queryKey: LANDING_PAGE_QUERY_KEY.queryKey,
    queryFn: async () => {
      const response = await axiosInstance.get('/landing-page');
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useUpdateLandingPage() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, LandingPageData>({
    mutationFn: async (updatedData) => {
      await axiosInstance.post('/landing-page', updatedData);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: LANDING_PAGE_QUERY_KEY.queryKey,
      });
    },
  });
}
