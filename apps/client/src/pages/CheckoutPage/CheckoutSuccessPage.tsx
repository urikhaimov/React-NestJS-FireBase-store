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
import { useCartStore } from '../../stores/useCartStore';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../../firebase';
import api from '../../api/axios'; // ✅ Your axios instance

export default function CheckoutSuccessPage() {
  const clearCart = useCartStore((s) => s.clearCart);
  const items = useCartStore((s) => s.items);
  const [toastOpen, setToastOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const confirmAndSaveOrder = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const paymentIntentId = params.get('payment_intent');
        if (!paymentIntentId) throw new Error('Missing payment intent ID');

        const user = auth.currentUser;
        if (!user) throw new Error('Not authenticated');
        const token = await user.getIdToken();

        // ✅ Get payment intent details
        const paymentRes = await api.get(`/api/stripe/payment-intent/${paymentIntentId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const paymentIntent = paymentRes.data;
        if (!paymentIntent?.id) throw new Error('Payment intent not found');

        // ✅ Save order to backend
        await api.post(
          '/api/orders',
          {
            userId: user.uid,
            paymentIntentId: paymentIntent.id,
            totalAmount: paymentIntent.amount,
            items: items.map((item) => ({
              productId: item.id,
              name: item.name,
              price: Number(item.price),
              image: item.imageUrl,
              quantity: item.quantity,
            })),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        clearCart();
        setToastOpen(true);
      } catch (err: any) {
        console.error('❌ Order save error:', err);
        setError(err.message || 'Error saving order');
      } finally {
        setLoading(false);
      }
    };

    confirmAndSaveOrder();
  }, [clearCart, items, location.search]);

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
