// src/hooks/useProducts.ts
import { useQuery } from '@tanstack/react-query';
import {
  fetchProducts,
  fetchProductsByCategory,
  getProductById
} from '../api/products';
import type { Product } from '../types/firebase';

export function useAllProducts() {
  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });
}

export function useProduct(productId: string) {
  return useQuery<Product | null>({
    queryKey: ['product', productId],
    queryFn: () => getProductById(productId),
    enabled: !!productId,
  });
}

export function useProductsByCategory(categoryId: string) {
  return useQuery<Product[]>({
    queryKey: ['products', 'category', categoryId],
    queryFn: () => fetchProductsByCategory(categoryId),
    enabled: !!categoryId,
  });
}
