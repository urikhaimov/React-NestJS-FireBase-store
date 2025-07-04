import axios from 'axios';

export function fetchMyOrders(token: string) {
  return axios.get('/api/orders/mine', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function fetchAllOrders(token: string) {
  return axios.get('/api/orders', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function fetchOrderById(id: string, token?: string) {
  return axios.get(`/api/orders/${id}`, {
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {},
  });
}
