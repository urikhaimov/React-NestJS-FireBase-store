// src/stripe/StripeProvider.tsx
import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';


const rawKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

if (!rawKey) {
  console.error('Missing Stripe public key');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY!);
export const StripeProvider = ({ children }: { children: React.ReactNode }) => {
  if (!stripePromise) {
    console.error('Stripe public key missing or invalid');
    return null;
  }

  return <Elements stripe={stripePromise}>{children}</Elements>;
};
