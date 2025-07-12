import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { auth } from '../firebase'; // adjust path if needed

export const useUserProfileQuery = (uid: string | undefined | null) => {
  return useQuery({
    queryKey: ['userProfile', uid],
    queryFn: async () => {
      if (!uid) throw new Error('UID is required');
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      const token = await user.getIdToken(); // 🔐 get Firebase token
      const res = await axios.get(`/api/users/${uid}`, {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ send token to backend
        },
      });
      return res.data;
    },
    enabled: !!uid,
    staleTime: 5 * 60 * 1000,
  });
};
