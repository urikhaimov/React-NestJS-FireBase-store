import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { fetchOrderById, updateOrderById } from '../api/orderApi';
import { useSafeAuth } from './useGetSafeAuth';
import type { Order } from '../types/order';

// Fetch a single order
function useOrder(id?: string) {
  return useQuery<Order, Error>({
    queryKey: ['order', id],
    queryFn: async () => {
      if (!id) throw new Error('Order ID is required');
      const { data } = await fetchOrderById(id);
      return data;
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
}

// Update a single order
function useUpdateOrder(
  id?: string,
): UseMutationResult<
  void,
  Error,
  Partial<Order> & { previousStatus?: string }
> {
  const queryClient = useQueryClient();
  const { user: admin } = useSafeAuth();

  return useMutation({
    mutationFn: async (
      update: Partial<Order> & { previousStatus?: string },
    ) => {
      if (!id) throw new Error('Order ID is required');
      if (!admin) throw new Error('Admin user required');

      const patch: Partial<Order> = {
        ...update,
        updatedAt: new Date().toISOString(),
      };

      if (update.status && update.status !== update.previousStatus) {
        patch.statusHistory = [
          ...(update.statusHistory || []),
          {
            status: update.status,
            timestamp: new Date().toISOString(),
            changedBy: admin.name || admin.email || 'admin',
          },
        ];
      }

      await updateOrderById(id, patch);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['order', id] });
    },
  });
}

// ✅ Export everything needed
export { useOrder, useUpdateOrder, Order };
