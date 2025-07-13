// src/hooks/useUpdateUserProfileMutation.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const useUpdateUserProfileMutation = (uid: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name?: string; photoURL?: string }) => {
      await axios.put(`/users/${uid}`, data);
    },
    onSuccess: () => {
     queryClient.invalidateQueries({ queryKey: ['userProfile', uid] });
    },
  });
};
