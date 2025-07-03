import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import { auth } from '../../firebase';
import StripeCheckoutForm from './StripeCheckoutForm';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY!);

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      } catch (err: any) {
        console.error('Error fetching clientSecret:', err);
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchClientSecret();
  }, []);

  return (
   <Box
  sx={{
    minHeight: 'calc(100vh - 64px)', // assuming header is 64px
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
    <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
      {error}
    </Alert>
  </Snackbar>
</Box>

  );
}
