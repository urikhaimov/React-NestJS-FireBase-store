import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Category } from '../types/firebase';
import { useSnackbar } from 'notistack';
import { useOptimisticMutation } from './useOptimisticMutation';

export const useCategories = () => {
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await axios.get('/api/categories');
      return res.data;
    },
  });
};

export const useAddCategory = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation<Category, unknown, string>({
    mutationFn: async (name: string) => {
      const res = await axios.post('/api/categories', { name });
      return res.data;
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to add category';
      enqueueSnackbar(message, { variant: 'error' });
    },
    onSuccess: () => {
      enqueueSnackbar('Category added', { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<void, unknown, string, { previous?: Category[] }>({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/categories/${id}`);
    },
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['categories'] });
      const previous = queryClient.getQueryData<Category[]>(['categories']);
      queryClient.setQueryData(
        ['categories'],
        previous?.filter((c) => c.id !== id)
      );
      return { previous };
    },
    onError: (_err: unknown, _id: string, context: { previous?: Category[] } | undefined) => {
      if (context?.previous) {
        queryClient.setQueryData(['categories'], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

export function useUpdateCategory() {
  return useOptimisticMutation<{ id: string; name: string }, Category>({
    mutationFn: async ({ id, name }) => {
      await axios.put(`/api/categories/${id}`, { name });
    },
    queryKey: ['categories'],
    getItemId: (item) => item.id,
    getOptimisticUpdate: (item, { name }) => ({ ...item, name }),
    successMessage: 'Category updated',
    errorMessage: 'Failed to update category',
  });
}
