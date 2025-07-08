import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Snackbar,
  Alert,
  Button,
  CircularProgress,
} from '@mui/material';
import { useCartStore } from '../../store/cartStore';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../../firebase';

export default function CheckoutSuccessPage() {
  const clearCart = useCartStore((s) => s.clearCart);
  const items = useCartStore((s) => s.items); // 👈 get saved items for backend
  const [toastOpen, setToastOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const confirmAndSaveOrder = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const clientSecret = params.get('payment_intent_client_secret');
        if (!clientSecret) throw new Error('Missing payment client secret');

        const user = auth.currentUser;
        if (!user) throw new Error('Not authenticated');
        const token = await user.getIdToken();

        // Fetch payment intent from backend
        const res = await fetch(`/api/stripe/payment-intent/${clientSecret}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const paymentIntent = await res.json();
        if (!paymentIntent?.id) throw new Error('Payment intent not found');

        // Save order in backend
        const saveRes = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            paymentIntentId: paymentIntent.id,
            totalAmount: paymentIntent.amount,
            items: items.map((item) => ({
              productId: item.id,
              quantity: item.quantity,
            })),
          }),
        });

        if (!saveRes.ok) throw new Error('Failed to save order');

        clearCart();               // ✅ clear cart
        setToastOpen(true);        // ✅ show toast
      } catch (err: any) {
        console.error('❌ Order save error:', err);
        setError(err.message || 'Error saving order');
      } finally {
        setLoading(false);
      }
    };

    confirmAndSaveOrder();
  }, []);

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2,
      }}
    >
      <Paper sx={{ p: 4, maxWidth: 480, textAlign: 'center' }}>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <>
            <Typography variant="h5" gutterBottom>
              Payment Successful 🎉
            </Typography>
            <Typography variant="body1" gutterBottom>
              Thank you for your order.
            </Typography>
            <Button
              variant="contained"
              sx={{ mt: 2 }}
              onClick={() => navigate('/')}
            >
              Back to Home
            </Button>
          </>
        )}
      </Paper>

      <Snackbar
        open={toastOpen}
        autoHideDuration={5000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setToastOpen(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          Cart cleared. Order saved!
        </Alert>
      </Snackbar>
    </Box>
  );
}
