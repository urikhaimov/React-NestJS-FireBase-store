/**
 * StripeProvider wraps Stripe's <Elements> context for payment forms.
 * Must be wrapped around any component using useStripe or CardElement.
 * Loads public key from VITE_STRIPE_PUBLIC_KEY.
 */
import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { getEnv } from '@common/utils';

const rawKey = getEnv('VITE_STRIPE_PUBLIC_KEY', { target: import.meta });

if (!rawKey) {
  console.error('Missing Stripe public key');
}
const stripePromise = loadStripe(
  getEnv('VITE_STRIPE_PUBLIC_KEY', { target: import.meta }) as string,
);

export const StripeProvider = ({ children }: { children: React.ReactNode }) => {
  if (!stripePromise) {
    console.error('Stripe public key missing or invalid');
    return null;
  }

  return <Elements stripe={stripePromise}>{children}</Elements>;
};
