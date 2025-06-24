import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProduct, updateProduct, deleteProduct } from '../api/products';
import type { Product, NewProduct } from '../types/firebase';

type UpdateProductPayload = {
  id: string;
  data: Partial<Omit<Product, 'id'>>;
  keepImageUrls: string[];
  newImages: File[];
};

export const useProductMutations = () => {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: (newProduct: NewProduct) => createProduct(newProduct),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const update = useMutation({
    mutationFn: ({ id, data, keepImageUrls, newImages }: UpdateProductPayload) =>
      updateProduct(id, { data, keepImageUrls, newImages }),
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

  return { create, update, remove };
};
