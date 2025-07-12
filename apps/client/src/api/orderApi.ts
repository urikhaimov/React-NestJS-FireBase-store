import type { Order } from '../types/order';
import api from './axiosInstance'; // ✅ This has auth interceptor pre-attached

// Fetch orders for the logged-in user
export function fetchMyOrders() {
  return api.get<Order[]>('/orders/mine');
}

// Fetch all orders (admin only)
export function fetchAllOrders() {
  return api.get<Order[]>('/orders');
}

// Fetch single order by ID
export function fetchOrderById(id: string) {
  return api.get<Order>(`/orders/${id}`);
}

// Update an order by ID (admin)
export function updateOrderById(id: string, data: Partial<Order>) {
  return api.patch<Order>(`/orders/${id}`, data);
}
