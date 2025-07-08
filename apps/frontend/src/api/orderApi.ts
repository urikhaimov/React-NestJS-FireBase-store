import axios from 'axios';
import type { Order } from '../types/order';

const api = axios.create({
  baseURL: '/api',
});

// Helper to attach auth headers
function authHeaders(token?: string) {
  return token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : {};
}

// Fetch orders for logged-in user
export function fetchMyOrders(token: string) {
  return api.get<Order[]>('/orders/mine', authHeaders(token));
}

// Fetch all orders (admin only)
export function fetchAllOrders(token: string) {
  return api.get<Order[]>('/orders', authHeaders(token));
}

// Fetch single order by ID
export function fetchOrderById(id: string, token?: string) {
  return api.get<Order>(`/orders/${id}`, authHeaders(token));
}

// Update an order by ID (admin)
export function updateOrderById(id: string, data: Partial<Order>, token: string) {
  return api.patch<Order>(`/orders/${id}`, data, authHeaders(token));
}
