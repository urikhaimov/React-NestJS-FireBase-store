// src/pages/CheckoutPage.tsx
import React, { useReducer } from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  Divider,
  CircularProgress
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useCartStore } from '../../store/cartStore';
import { useNavigate } from 'react-router-dom';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import ControlledTextField from '../../components/ControlledTextField';
import {
  validateEmail,
  validateZip,
} from '../../utils/validators';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import {reducer,initialState} from './LocalReducer';
import PageWithStickyFilters from '../../layouts/PageWithStickyFilters';

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();


const [state, dispatch] = useReducer(reducer,initialState );
  const { handleSubmit, control, getValues } = useForm();

  const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        color: '#ffffff',
        fontSize: '16px',
        '::placeholder': {
          color: '#cccccc',
        },
        fontFamily: 'inherit',
      },
      invalid: {
        color: '#ff4d4f',
      },
    },
  };

  const onSubmit = async () => {
    dispatch({ type: 'loading', payload: true });
    dispatch({ type: 'error', payload: '' });

    try {
      if (!stripe || !elements) throw new Error('Stripe is not loaded');

      const response = await fetch('/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: subtotal * 100, currency: 'usd' }),
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const { clientSecret } = await response.json();

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: {
            name: getValues('fullName'),
            email: getValues('email'),
            address: {
              line1: getValues('address'),
              postal_code: getValues('zip')?.replace(/\s/g, ''),
            },
          },
        },
      });

      if (result.error) {
        dispatch({ type: 'error', payload: result.error.message || 'Payment failed.' });
        dispatch({ type: 'loading', payload: false });
      } else if (result.paymentIntent?.status === 'succeeded') {
        const orderData = {
          userId: auth.currentUser?.uid || null,
          email: getValues('email'),
          items,
          amount: subtotal,
          status: result.paymentIntent.status,
          createdAt: serverTimestamp(),
        };

        await addDoc(collection(db, 'orders'), orderData);

        dispatch({ type: 'success', payload: true });
        clearCart();

        setTimeout(() => {
          dispatch({ type: 'loading', payload: false });
          navigate('/thank-you');
        }, 2000);
      }
    } catch (err: any) {
      console.error('Checkout Error:', err);
      dispatch({ type: 'error', payload: err.message || 'Something went wrong during checkout.' });
      dispatch({ type: 'loading', payload: false });
    }
  };

  if (!stripe || !elements) {
    return (
      <Box sx={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="body1">Loading payment interface...</Typography>
      </Box>
    );
  }
  console.log('state.loading',state.loading)
  return (
    <PageWithStickyFilters>
      <Typography variant="h4" gutterBottom>Checkout</Typography>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <ControlledTextField
              name="fullName"
              control={control}
              label="Full Name"
              rules={{ required: 'Full Name is required' }}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <ControlledTextField
              name="email"
              control={control}
              label="Email"
              rules={{ required: 'Email is required', validate: validateEmail }}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <ControlledTextField
              name="address"
              control={control}
              label="Address"
              rules={{ required: 'Address is required' }}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" mt={3}>Card Details</Typography>
            <Box sx={{ border: '1px solid gray', borderRadius: '4px', p: 2 }}>
              <CardElement options={CARD_ELEMENT_OPTIONS} />
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h6" gutterBottom>Total: ${subtotal.toFixed(2)}</Typography>

        {state.error && (
          <Typography color="error" mt={1}>{state.error}</Typography>
        )}

        <Button
          variant="contained"
          type="submit"
          disabled={state.loading}
          startIcon={
            state.loading ? (
              <CircularProgress size={20} sx={{ color: 'white' }} />
            ) : null
          }
        >
          {state.loading ? 'Processing...' : 'Place Order'}
        </Button>
      </form>
    </PageWithStickyFilters>
  );
}
