// useLandingPage.ts (React Query v5)
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import type { LandingPageData } from '../types/landing';

const LANDING_PAGE_QUERY_KEY = { queryKey: ['landingPage'] };

export function useLandingPage() {
  return useQuery<LandingPageData, Error>({
    queryKey: LANDING_PAGE_QUERY_KEY.queryKey,
    queryFn: async () => {
      const response = await axios.get('/api/landing-page');
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
      await axios.post('/api/landing-page', updatedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LANDING_PAGE_QUERY_KEY.queryKey });
    },
  });
}
