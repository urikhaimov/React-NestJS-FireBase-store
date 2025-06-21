import { api } from './axios';
import axios from 'axios';

export function fetchMyOrders(token: string) {
  return axios.get('/orders/mine', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}