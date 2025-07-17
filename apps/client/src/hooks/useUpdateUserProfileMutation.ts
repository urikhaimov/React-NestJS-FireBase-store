// src/hooks/useUpdateUserProfileMutation.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';

export const useUpdateUserProfileMutation = (uid: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name?: string; photoURL?: string }) => {
      await axiosInstance.put(`/users/${uid}`, data);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['userProfile', uid] });
    },
  });
};
