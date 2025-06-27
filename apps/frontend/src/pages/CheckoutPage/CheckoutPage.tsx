import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
} from '@mui/material';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import { auth } from '../../firebase';
import StripeCheckoutForm from './StripeCheckoutForm';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY!);

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        const user = auth.currentUser;
        if (!user) throw new Error('User not authenticated');

        const token = await user.getIdToken();

        const res = await fetch('/api/orders/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ amount: 1999 }), // in cents
        });

        if (!res.ok) {
          throw new Error(`Error fetching client secret: ${res.statusText}`);
        }

        const data = await res.json();
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error('Error fetching clientSecret:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClientSecret();
  }, []);

  return (
    <Box
      sx={{
        maxWidth: 480,
        mx: 'auto',
        mt: 6,
        px: 2,
        height: 'calc(100vh - 100px)',
        overflow: 'auto',
      }}
    >
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Checkout
        </Typography>

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
    </Box>
  );
}
