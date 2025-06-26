import axios from 'axios';

export type ProductOrderItem = { id: string; order: number };

export async function reorderProducts(
  orderList: ProductOrderItem[],
  token: string
): Promise<void> {
  await axios.post(
    '/api/products/reorder',
    { orderList },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}
