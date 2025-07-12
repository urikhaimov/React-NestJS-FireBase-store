import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance'; // ✅ Auth interceptor is used

export const useUserProfileQuery = (uid: string | undefined | null) => {
  return useQuery({
    queryKey: ['userProfile', uid],
    queryFn: async () => {
      if (!uid) throw new Error('UID is required');
      const res = await axiosInstance.get(`/users/${uid}`);
      return res.data;
    },
    enabled: !!uid,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
