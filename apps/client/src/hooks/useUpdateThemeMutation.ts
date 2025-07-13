// src/hooks/useUpdateThemeMutation.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateThemeSettings } from '../api/theme';

export const useUpdateThemeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateThemeSettings,
    onSuccess: (data) => {
      queryClient.setQueryData(['themeSettings'], data);
    },
  });
};
