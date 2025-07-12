import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  CircularProgress,
  Divider,
  Paper,
  Snackbar,
  Stack,
  Typography,
} from '@mui/material';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import { auth } from '../../firebase';
import StripeCheckoutForm from './StripeCheckoutForm';
import { getEnv } from '@common/utils';
import { cLogger } from '@client/logger';
import { useCartStore } from '@client/stores/useCartStore';
import api from '../../api/axiosInstance'; // ✅ axiosInstance

const rawKey = getEnv('VITE_STRIPE_PUBLIC_KEY', {
  env: import.meta.env,
}) as string;

const stripePromise = loadStripe(rawKey);

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cart = useCartStore((s) => s.items);

  const shipping = 5.99;
  const taxRate = 0.17;
  const discount = 3.0;

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const tax = subtotal * taxRate;
  const total = useCartStore.getState().getCartTotal({
    shipping,
    taxRate,
    discount: discount * 100,
  });

  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        const user = auth.currentUser;
        if (!user) throw new Error('User not authenticated');

        const token = await user.getIdToken();
        const sanitizedCart = cart.map((item) => ({
          productId: item.id,
          name: item.name,
          price: Number(item.price),
          quantity: item.quantity,
          image: typeof item.imageUrl === 'string' ? item.imageUrl : (item.imageUrl ?? ''),
        }));

        const safeAmount = Math.max(50, total); // Stripe minimum
        console.log('Amount sent to backend (cents):', safeAmount);

        const res = await api.post(
          '/api/orders/create-payment-intent',
          {
            amount: safeAmount,
            cart: sanitizedCart,
            ownerName: 'John Doe',
            passportId: 'AB1234567',
            shipping,
            taxRate,
            discount,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.data.clientSecret) throw new Error('No clientSecret returned');
        setClientSecret(res.data.clientSecret);
      } catch (err: any) {
        cLogger.error('❌ Error fetching clientSecret:', err);
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchClientSecret().catch((err) => {
      cLogger.error('❌ Error in fetchClientSecret:', err);
      setError(err.message || 'Failed to fetch payment details');
      setLoading(false);
    });
  }, []);

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        py: 4,
      }}
    >
      <Paper elevation={1} sx={{ p: 3, width: '100%', maxWidth: 480 }}>
        <Typography variant="h6" mb={2}>Checkout</Typography>

        <Stack spacing={1} mb={2}>
          <Typography>Subtotal: ${subtotal.toFixed(2)}</Typography>
          <Typography>Shipping: ${shipping.toFixed(2)}</Typography>
          <Typography>Tax (17%): ${tax.toFixed(2)}</Typography>
          <Typography>Discount: -${discount.toFixed(2)}</Typography>
          <Divider />
          <Typography fontWeight="bold">
            Total: ${(total / 100).toFixed(2)} USD
          </Typography>
        </Stack>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : clientSecret ? (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <StripeCheckoutForm />
          </Elements>
        ) : (
          <Typography color="error">
            Failed to load payment form. Please try again later.
          </Typography>
        )}
      </Paper>

      <Snackbar
        open={!!error}
        autoHideDuration={5000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setError(null)}
          severity="error"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}
