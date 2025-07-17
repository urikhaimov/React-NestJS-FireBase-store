// src/hooks/useDeleteAvatarMutation.ts
import {
  InvalidateQueryFilters,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';

export const useDeleteAvatarMutation = (uid: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await axiosInstance.delete(`/users/${uid}/avatar`);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries([
        'userProfile',
        uid,
      ] as InvalidateQueryFilters<readonly unknown[]>);
    },
  });
};
