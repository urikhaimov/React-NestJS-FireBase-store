import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../stores/useAuthStore';
import { auth } from '../firebase';
import type { User } from '../types/User';
import api from '../api/axiosInstance';

export function useAdminUsersQuery() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const {
    data: users = [],
    isLoading,
    error,
  } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const token = await auth.currentUser?.getIdToken();
      const res = await api.get('/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
  });

  const updateUserRole = async (id: string, role: User['role']) => {
    const token = await auth.currentUser?.getIdToken();
    await api.patch(
      `/api/users/${id}`,
      { role },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    queryClient.invalidateQueries({ queryKey: ['users'] });
  };

  const deleteUser = async (id: string) => {
    const token = await auth.currentUser?.getIdToken();
    await api.delete(`/api/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    queryClient.invalidateQueries({ queryKey: ['users'] });
  };

  return { users, isLoading, error, updateUserRole, deleteUser };
}
