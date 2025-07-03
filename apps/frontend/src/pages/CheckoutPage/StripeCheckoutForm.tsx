import React, { useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { useForm } from 'react-hook-form';
import FormTextField from '../../components/FormTextField';

type FormData = {
  ownerName: string;
  passportId: string;
};

export default function StripeCheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: FormData) => {
    if (!stripe || !elements) return;
    setLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
        payment_method_data: {
          billing_details: {
            name: data.ownerName, // ✅ Only this is allowed on frontend
          },
        },
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message || 'Payment failed');
    } else {
      // Will redirect if payment succeeded
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
      <Typography variant="subtitle2" gutterBottom>
        Payment Details
      </Typography>

      <Box
        sx={{
          border: 1,
          borderColor: 'divider',
          borderRadius: 1,
          p: 2,
          bgcolor: 'background.default',
          mb: 2,
        }}
      >
        <PaymentElement />
      </Box>

      <FormTextField
        label="Owner Name"
        register={register('ownerName', { required: 'Owner name is required' })}
        errorObject={errors.ownerName}
        margin="normal"
      />

      <FormTextField
        label="Passport ID"
        register={register('passportId', { required: 'Passport ID is required' })}
        errorObject={errors.passportId}
        margin="normal"
      />

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
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}
