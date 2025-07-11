// src/hooks/useAdminUsersQuery.ts
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../stores/useAuthStore';
import { auth } from '../firebase';
import api from '../api/axios'; // Adjust path as needed
import type { User } from '../types/User';

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
      if (!token) throw new Error('No auth token found');

      const response = await api.get<User[]>('/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
  });

  const updateUserRole = async (id: string, role: User['role']) => {
    const token = await auth.currentUser?.getIdToken();
    if (!token) throw new Error('No auth token found');

    await api.patch(
      `/api/users/${id}`,
      { role },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    queryClient.invalidateQueries({ queryKey: ['users'] });
  };

  const deleteUser = async (id: string) => {
    const token = await auth.currentUser?.getIdToken();
    if (!token) throw new Error('No auth token found');

    await api.delete(`/api/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    queryClient.invalidateQueries({ queryKey: ['users'] });
  };

  return { users, isLoading, error, updateUserRole, deleteUser };
}
