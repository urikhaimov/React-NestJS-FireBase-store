import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Category } from '../types/firebase';
import { useSnackbar } from 'notistack';
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

  return useMutation({
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
  return useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/categories/${id}`);
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['categories'] });
      const previous = queryClient.getQueryData<Category[]>(['categories']);
      queryClient.setQueryData(['categories'], previous?.filter((c) => c.id !== id));
      return { previous };
    },
    onError: (_err, _id, context) => {
      queryClient.setQueryData(['categories'], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      await axios.put(`/api/categories/${id}`, { name });
    },
    onMutate: async ({ id, name }) => {
      await queryClient.cancelQueries({ queryKey: ['categories'] });
      const previous = queryClient.getQueryData<Category[]>(['categories']);
      queryClient.setQueryData(['categories'], previous?.map((c) => (c.id === id ? { ...c, name } : c)));
      return { previous };
    },
    onError: (_err, _input, context) => {
      queryClient.setQueryData(['categories'], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};
