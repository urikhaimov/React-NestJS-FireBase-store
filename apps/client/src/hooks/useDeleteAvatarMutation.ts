// src/hooks/useDeleteAvatarMutation.ts
import {
  InvalidateQueryFilters,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';

export const useDeleteAvatarMutation = (uid: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await axios.delete(`/api/users/${uid}/avatar`);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries([
        'userProfile',
        uid,
      ] as InvalidateQueryFilters<readonly unknown[]>);
    },
  });
};
