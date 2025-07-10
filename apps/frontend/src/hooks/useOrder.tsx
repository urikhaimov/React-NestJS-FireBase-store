import { useQuery, useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import axios from 'axios';
import { useSafeAuth } from './useGetSafeAuth';

export type Order = {
  id: string;
  status: string;
  notes?: string;
  delivery?: {
    provider?: string;
    trackingNumber?: string;
    eta?: string;
  };
  items: any[];
  statusHistory?: Array<{
    status: string;
    timestamp: string;
    changedBy: string;
  }>;
  updatedAt?: string;
};

export interface UpdateOrderInput extends Partial<Order> {
  previousStatus?: string;
}

export function useOrder(id?: string) {
  return useQuery<Order, Error>({
    queryKey: ['order', id],
    queryFn: async () => {
      if (!id) throw new Error('Order ID is required');
      const response = await axios.get(`/api/orders/${id}`);
      return response.data as Order;
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
}

export function useUpdateOrder(id?: string): UseMutationResult<void, Error, UpdateOrderInput> {
  const queryClient = useQueryClient();
  const { user: admin } = useSafeAuth();

  return useMutation<void, Error, UpdateOrderInput>({
    mutationFn: async (formData: UpdateOrderInput) => {
      if (!id) throw new Error('Order ID is required');
      if (!admin) throw new Error('Admin user is required');

      const payload: Partial<Order> & { statusHistory?: any[] } = {
        status: formData.status,
        notes: formData.notes,
        delivery: formData.delivery,
        updatedAt: new Date().toISOString(),
      };

      if (formData.status && formData.status !== formData.previousStatus) {
        payload.statusHistory = [
          ...(formData.statusHistory || []),
          {
            status: formData.status,
            timestamp: new Date().toISOString(),
            changedBy: admin.name || admin.email || 'admin',
          },
        ];
      }

      await axios.put(`/api/orders/${id}`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', id] });
    },
  });
}
