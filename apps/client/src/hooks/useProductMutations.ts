import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createProduct,
  updateProduct,
  deleteProduct,
  reorderProducts
} from '../api/products';


import type { Product, NewProduct } from '../types/firebase';
import type { UpdateProductPayload } from '../api/products';

interface ReorderPayload {
  orderList: { id: string; order: number }[];
  token: string;
}

export const useProductMutations = () => {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: (newProduct: NewProduct) =>
      createProduct(newProduct, newProduct.createdBy),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
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
    }: UpdateProductPayload & { id: string }) =>
      updateProduct(id, { data, keepImageUrls, newImageFiles }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => {
      console.error('Update product failed:', error);
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => {
      console.error('Delete product failed:', error);
    },
  });

  const reorder = useMutation({
    mutationFn: async ({ orderList, token }: ReorderPayload) => {
      return reorderProducts(orderList, token);
    },
    // ❌ remove this for now to prevent snapping back
    // onSuccess: () => {
    //   queryClient.invalidateQueries({ queryKey: ['products'] });
    // },
    onError: (error) => {
      console.error('Reorder products failed:', error);
    },
  });

  return {
    create,
    update,
    remove,
    reorder,
  };
};
