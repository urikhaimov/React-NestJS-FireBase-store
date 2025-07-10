// src/hooks/useAdminUsersQuery.ts
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../stores/useAuthStore';
import { auth } from '../firebase';
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
      const res = await fetch('/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch users');
      return res.json();
    },
  });

  const updateUserRole = async (id: string, role: User['role']) => {
    const token = await auth.currentUser?.getIdToken();
    await fetch(`/api/users/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ role }),
    });
    queryClient.invalidateQueries({ queryKey: ['users'] });
  };

  const deleteUser = async (id: string) => {
    const token = await auth.currentUser?.getIdToken();
    await fetch(`/api/users/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    queryClient.invalidateQueries({ queryKey: ['users'] });
  };

  return { users, isLoading, error, updateUserRole, deleteUser };
}
