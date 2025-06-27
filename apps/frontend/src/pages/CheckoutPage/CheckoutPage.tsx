import { useEffect, useState } from 'react';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import StripeCheckoutForm from './StripeCheckoutForm';
import { auth } from '../../firebase'; // ✅ adjust path if needed
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY!);

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchClientSecret = async () => {
    try {
      const user = auth.currentUser;
      const token = user ? await user.getIdToken() : '';

      const res = await fetch('/api/orders/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: 1999 }), // example: 19.99 USD
      });

      const data = await res.json();
      setClientSecret(data.clientSecret);
    } catch (error) {
      console.error('Error fetching client secret:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchClientSecret();
}, []);


  if (loading || !clientSecret) {
    return (
      <Box sx={{ textAlign: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 480, mx: 'auto', mt: 6, px: 2 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Checkout
        </Typography>

        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <StripeCheckoutForm />
        </Elements>
      </Paper>
    </Box>
  );
}
