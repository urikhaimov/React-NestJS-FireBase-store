// src/hooks/useConfirmOrder.ts
import { useEffect, useState } from 'react';
import { useCartStore } from '../stores/useCartStore';
import { useLocation } from 'react-router-dom';
import { auth } from '../firebase';
import api from '../api/axiosInstance';

export function useConfirmOrder() {
  const [loading, setLoading] = useState(true);
  const [toastOpen, setToastOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const clearCart = useCartStore((s) => s.clearCart);
  const items = useCartStore((s) => s.items);
  const location = useLocation();

  useEffect(() => {
    const confirmAndSaveOrder = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const paymentIntentId = params.get('payment_intent');
        if (!paymentIntentId) throw new Error('Missing payment intent ID');

        const user = auth.currentUser;
        if (!user) throw new Error('Not authenticated');

        const paymentRes = await api.get(`/stripe/payment-intent/${paymentIntentId}`);
        const paymentIntent = paymentRes.data;
        if (!paymentIntent?.id) throw new Error('Payment intent not found');

        await api.post('/orders', {
          userId: user.uid,
          paymentIntentId: paymentIntent.id,
          totalAmount: paymentIntent.amount,
          items: items.map((item) => ({
            productId: item.id,
            name: item.name,
            price: Number(item.price),
            image: item.imageUrl,
            quantity: item.quantity,
          })),
        });

        clearCart();
        setToastOpen(true);
      } catch (err: any) {
        console.error('❌ Order save error:', err);
        setError(err.message || 'Error saving order');
      } finally {
        setLoading(false);
      }
    };

    confirmAndSaveOrder();
  }, [clearCart, items, location.search]);

  return {
    loading,
    toastOpen,
    setToastOpen,
    error,
  };
}
    