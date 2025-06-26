// src/hooks/useProductMutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createProduct,
  updateProduct,
  deleteProduct,
  reorderProducts,
} from '../api/products';
import type { Product, NewProduct } from '../types/firebase';
import type { UpdateProductPayload } from '../api/products';

export const useProductMutations = () => {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: (newProduct: NewProduct) =>
      createProduct(newProduct, newProduct.createdBy),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const update = useMutation({
    mutationFn: ({
      id,
      data,
      keepImageUrls,
      newImageFiles,
    }: UpdateProductPayload & { id: string }) =>
      updateProduct(id, { data, keepImageUrls, newImageFiles }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const reorder = useMutation({
    mutationFn: async ({
      orderList,
      token,
    }: {
      orderList: { id: string; order: number }[];
      token: string;
    }) => {
      return await reorderProducts(orderList, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  return { create, update, remove, reorder };
};
