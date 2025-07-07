// src/pages/admin/EditOrderPage.tsx
import {
  Box,
  Button,
  MenuItem,
  Typography,
  Stack,
  Snackbar,
  Alert,
  Grid,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../../firebase';
import FormTextField from '../../../components/FormTextField';
import { useSafeAuth } from '../../../hooks/getSafeAuth';
import AdminStickyPage from '../../../layouts/AdminStickyPage';

export default function EditOrderPage() {
  const { id } = useParams();
  const { user } = useSafeAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toastOpen, setToastOpen] = useState(false);

  const { control, handleSubmit, reset, getValues } = useForm({
    defaultValues: {
      status: '',
      payment: {
        method: '',
        status: '',
        transactionId: '',
      },
      shippingAddress: {
        fullName: '',
        phone: '',
        street: '',
        city: '',
        postalCode: '',
        country: '',
      },
      delivery: {
        provider: '',
        trackingNumber: '',
        eta: '',
      },
      notes: '',
    },
  });

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const ref = doc(db, 'orders', id!);
        const snap = await getDoc(ref);
        if (!snap.exists()) throw new Error('Order not found');
        reset(snap.data());
      } catch (err) {
        console.error('❌ Failed to fetch order:', err);
        setError('Could not load order');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchOrder();
  }, [id, reset]);

  const onSubmit = async (data: any) => {
    if (!id || !user) return;

    try {
      const ref = doc(db, 'orders', id);
      await updateDoc(ref, {
        ...data,
        updatedAt: new Date().toISOString(),
        statusHistory: arrayUnion({
          status: data.status,
          timestamp: new Date().toISOString(),
          changedBy: user.name || user.uid,
        }),
      });

      setToastOpen(true);
    } catch (err) {
      console.error('❌ Failed to update order:', err);
      setError('Failed to update order');
    }
  };

  if (loading) return <Typography sx={{ p: 3 }}>Loading...</Typography>;
  if (error) return <Typography color="error" sx={{ p: 3 }}>{error}</Typography>;

  return (
    <AdminStickyPage title="Edit Order">
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ px: { xs: 1, sm: 2 }, py: 2 }}
      >
        <Stack spacing={3}>
          <FormTextField
            name="status"
            label="Order Status"
            control={control}
            select
            fullWidth
          >
            {['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </FormTextField>

          <Box>
            <Typography variant="h6" gutterBottom>
              Payment
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormTextField name="payment.method" label="Method" control={control} fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormTextField
                  name="payment.status"
                  label="Status"
                  control={control}
                  select
                  fullWidth
                >
                  {['paid', 'unpaid'].map((s) => (
                    <MenuItem key={s} value={s}>
                      {s}
                    </MenuItem>
                  ))}
                </FormTextField>
              </Grid>
              <Grid item xs={12}>
                <FormTextField
                  name="payment.transactionId"
                  label="Transaction ID"
                  control={control}
                  fullWidth
                />
              </Grid>
            </Grid>
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom>
              Shipping Address
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormTextField name="shippingAddress.fullName" label="Full Name" control={control} fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormTextField name="shippingAddress.phone" label="Phone" control={control} fullWidth />
              </Grid>
              <Grid item xs={12}>
                <FormTextField name="shippingAddress.street" label="Street" control={control} fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormTextField name="shippingAddress.city" label="City" control={control} fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormTextField name="shippingAddress.postalCode" label="Postal Code" control={control} fullWidth />
              </Grid>
              <Grid item xs={12}>
                <FormTextField name="shippingAddress.country" label="Country" control={control} fullWidth />
              </Grid>
            </Grid>
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom>
              Delivery
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormTextField name="delivery.provider" label="Provider" control={control} fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormTextField name="delivery.trackingNumber" label="Tracking Number" control={control} fullWidth />
              </Grid>
              <Grid item xs={12}>
                <FormTextField
                  name="delivery.eta"
                  label="Estimated Arrival"
                  type="date"
                  control={control}
                  fullWidth
                />
              </Grid>
            </Grid>
          </Box>

          <FormTextField
            name="notes"
            label="Admin Notes"
            control={control}
            multiline
            rows={3}
            fullWidth
          />

          <Box textAlign={isMobile ? 'center' : 'left'}>
            <Button type="submit" variant="contained" size="large" fullWidth={isMobile}>
              Update Order
            </Button>
          </Box>
        </Stack>
      </Box>

      <Snackbar
        open={toastOpen}
        autoHideDuration={4000}
        onClose={() => setToastOpen(false)}
      >
        <Alert onClose={() => setToastOpen(false)} severity="success">
          Order updated
        </Alert>
      </Snackbar>
    </AdminStickyPage>
  );
}
