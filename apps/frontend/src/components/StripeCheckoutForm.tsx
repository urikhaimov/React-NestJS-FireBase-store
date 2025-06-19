import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import {
  Box,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Yup schema (if you want additional non-card fields)
const schema = yup.object().shape({
  // example: name: yup.string().required('Name is required'),
});

export const StripeCheckoutForm: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [successSnackbar, setSuccessSnackbar] = useState(false);
  const [errorSnackbar, setErrorSnackbar] = useState<string | null>(null);

  const {
    handleSubmit,
    // register, // uncomment if you have other form fields
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async () => {
    if (!stripe || !elements) {
      setErrorSnackbar('Stripe is not loaded yet. Please try again.');
      return;
    }

    setLoading(true);

    try {
      // Call backend to create PaymentIntent
      const res = await fetch('/api/create-payment-intent', { method: 'POST' });
      const { clientSecret } = await res.json();

      const cardElement = elements.getElement(CardElement);

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement!,
          // Add billing details if needed
        },
      });

      if (result.error) {
        setErrorSnackbar(result.error.message || 'Payment failed.');
      } else if (result.paymentIntent?.status === 'succeeded') {
        setSuccessSnackbar(true);
        reset();
      }
    } catch (err) {
      console.error(err);
      setErrorSnackbar('An error occurred during payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 4 }}>
      <CardElement
        options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': { color: '#aab7c4' },
            },
            invalid: { color: '#9e2146' },
          },
        }}
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Pay with Stripe'}
      </Button>

      {/* Success Snackbar */}
      <Snackbar
        open={successSnackbar}
        autoHideDuration={3000}
        onClose={() => setSuccessSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSuccessSnackbar(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          ✅ Payment successful!
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={!!errorSnackbar}
        autoHideDuration={4000}
        onClose={() => setErrorSnackbar(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setErrorSnackbar(null)}
          severity="error"
          sx={{ width: '100%' }}
        >
          {errorSnackbar}
        </Alert>
      </Snackbar>
    </Box>
  );
};
