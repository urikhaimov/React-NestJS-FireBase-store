import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
  Divider,
  Stack,
} from '@mui/material';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import { auth } from '../../firebase';
import StripeCheckoutForm from './StripeCheckoutForm';
import { useCartStore } from '../../stores/useCartStore';
import { getCartTotal } from '../../utils/getCartTotal';
import api from '../../api/axios';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY!);

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cart = useCartStore((s) => s.items);

  // Adjust these for your business
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
          price: item.price,
          quantity: item.quantity,
          image:
            typeof item.imageUrl === 'string'
              ? item.imageUrl
              : (item.imageUrl ?? ''),
        }));

        // Fix: Minimum amount must be 50 cents (50)
        const safeAmount = Math.max(50, total);
        console.log('Amount sent to backend (cents):', safeAmount);

        const { data } = await api.post(
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
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!data.clientSecret) throw new Error('No clientSecret returned');
        setClientSecret(data.clientSecret);
      } catch (err: any) {
        console.error('❌ Error fetching clientSecret:', err);
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchClientSecret();
  }, [cart, taxRate, discount, shipping, total]);

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
        <Typography variant="h6" mb={2}>
          Checkout
        </Typography>

        {/* Price breakdown */}
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
