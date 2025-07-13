import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createProduct,
  deleteProduct,
  reorderProducts,
  updateProduct,
} from './useProducts';

import { cLogger } from '@client/logger';
import { IProduct, TUpdateProduct } from '@common/types';

interface ReorderPayload {
  orderList: { id: string; order: number }[];
  token: string;
}

export const useProductMutations = () => {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: (newProduct: IProduct) => createProduct(newProduct),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => {
      console.error('Create product failed:', error);
    },
  });

  const update = useMutation({
    mutationFn: ({
      id,
      data,
      keepImageUrls,
      newImageFiles,
    }: TUpdateProduct & { id: string }) =>
      updateProduct(id, { data, keepImageUrls, newImageFiles }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => {
      console.error('Update product failed:', error);
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => {
      cLogger.error('Delete product failed:', error);
    },
  });

  const reorder = useMutation({
    mutationFn: async ({ orderList, token }: ReorderPayload) => {
      return reorderProducts(orderList);
    },
    // ❌ remove this for now to prevent snapping back
    // onSuccess: () => {
    //   queryClient.invalidateQueries({ queryKey: ['products'] });
    // },
    onError: (error) => {
      cLogger.error('Reorder products failed:', error);
    },
  });

  return {
    create,
    update,
    remove,
    reorder,
  };
};
