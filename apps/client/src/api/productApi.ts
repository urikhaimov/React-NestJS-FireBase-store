// src/api/productApi.ts
import axios from 'axios';
import { Product } from '../types/firebase';
export function fetchAllProducts(token: string) {
  return axios.get('/api/products', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function fetchProductById(id: string, token: string) {
  return axios.get(`/products/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function createProduct(data: any, token: string) {
  return axios.post('/products', data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function updateProduct(id: string, data: any, token: string) {
  return axios.put(`/products/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function deleteProduct(id: string, token: string) {
  return axios.delete(`/products/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// ✅ Add this:
export function reorderProducts(
  orderList: { id: string; order: number }[],
  token: string
) {
  return axios.put('/api/products/reorder', orderList, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

