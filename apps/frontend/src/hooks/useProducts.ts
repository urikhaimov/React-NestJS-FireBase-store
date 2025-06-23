// hooks/useProducts.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Product } from '../types/firebase';
import { useSnackbar } from 'notistack';

const PRODUCTS_QUERY_KEY = ['products'];
// ✅ Add to hooks/useProducts.ts


export const useProduct = (id: string) =>
  useQuery<Product>({
    queryKey: ['product', id],
    queryFn: async () => {
      const res = await axios.get(`/api/products/${id}`);
      return res.data;
    },
    enabled: !!id, // Prevent query if id is undefined
  });

export const useAllProducts = () =>
  useQuery<Product[]>({
    queryKey: PRODUCTS_QUERY_KEY,
    queryFn: async () => {
      const res = await axios.get('/api/products');
      return res.data;
    },
  });

export const useAddProduct = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async (product: Omit<Product, 'id'>) => {
      const res = await axios.post('/api/products', product);
      return res.data;
    },
    onSuccess: () => {
      enqueueSnackbar('Product added', { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
    },
    onError: () => {
      enqueueSnackbar('Failed to add product', { variant: 'error' });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<Product> & { id: string }) => {
      await axios.put(`/api/products/${id}`, data);
    },
    onSuccess: () => {
      enqueueSnackbar('Product updated', { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
    },
    onError: () => {
      enqueueSnackbar('Failed to update product', { variant: 'error' });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/products/${id}`);
    },
    onSuccess: () => {
      enqueueSnackbar('Product deleted', { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
    },
    onError: () => {
      enqueueSnackbar('Failed to delete product', { variant: 'error' });
    },
  });
};
