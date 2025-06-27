// src/components/StripeCheckoutForm.tsx
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Box, Button, CircularProgress, Snackbar, Alert } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function StripeCheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`, // Optional redirect
      },
      redirect: 'if_required',
    });

    setLoading(false);

    if (error) {
      setError(error.message || 'Payment failed');
    } else if (paymentIntent?.status === 'succeeded') {
      setSuccess(true);
      navigate('/checkout/success'); // or show a message inline
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <PaymentElement />
      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={!stripe || loading}
        sx={{ mt: 2 }}
      >
        {loading ? <CircularProgress size={24} /> : 'Pay Now'}
      </Button>

      <Snackbar open={!!error} autoHideDuration={5000} onClose={() => setError(null)}>
        <Alert severity="error">{error}</Alert>
      </Snackbar>
    </Box>
  );
}
