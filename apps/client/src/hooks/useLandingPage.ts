import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import type { LandingPageData } from '../types/landing';

export function useLandingPage() {
  return useQuery<LandingPageData, Error>({
    queryKey: ['landingPage', 'default'],
    queryFn: async () => {
      const res = await axios.get('/api/landingPages/default');
      return res.data as LandingPageData;
    },
    refetchOnWindowFocus: false,
  });
}

export function useUpdateLandingPage() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, LandingPageData>({
    mutationFn: async (data: LandingPageData) => {
      await axios.put('/api/landingPages/default', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['landingPage', 'default'] });
    },
  });
}
