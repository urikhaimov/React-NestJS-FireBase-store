// src/pages/admin/EditOrderPage.tsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  MenuItem,
  Typography,
  Stack,
  Snackbar,
  Alert,
  Grid,
  Divider,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  CardMedia,
  List,
  ListItem,
  ListItemText,
  Chip,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../../firebase';
import FormTextField from '../../../components/FormTextField';
import { useSafeAuth } from '../../../hooks/getSafeAuth';
import AdminStickyPage from '../../../layouts/AdminStickyPage';

const STATUS_COLORS: Record<string, 'default' | 'success' | 'warning' | 'error' | 'info'> = {
  pending: 'warning',
  confirmed: 'info',
  shipped: 'success',
  delivered: 'success',
  cancelled: 'error',
};

export default function EditOrderPage() {
  const { id } = useParams();
  const { user } = useSafeAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toastOpen, setToastOpen] = useState(false);

  const { control, handleSubmit, reset, getValues, setValue } = useForm({
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
        shippingCost: 0,
        sla: '',
      },
      internalTags: '',
      notes: '',
      items: [],
      statusHistory: [],
      manualStatus: '',
    },
  });

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const ref = doc(db, 'orders', id!);
        const snap = await getDoc(ref);
        if (!snap.exists()) throw new Error('Order not found');
        const data = snap.data();
        reset({
          ...data,
          internalTags: (data.internalTags || []).join(', '),
        });
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
        internalTags: data.internalTags
          .split(',')
          .map((tag: string) => tag.trim())
          .filter(Boolean),
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

  const handleManualStatus = async () => {
    const manualStatus = getValues('manualStatus');
    if (!manualStatus || !id || !user) return;
    const ref = doc(db, 'orders', id);
    await updateDoc(ref, {
      status: manualStatus,
      updatedAt: new Date().toISOString(),
      statusHistory: arrayUnion({
        status: manualStatus,
        timestamp: new Date().toISOString(),
        changedBy: `${user.name || user.uid} (manual)`,
      }),
    });
    setValue('status', manualStatus);
    setValue('manualStatus', '');
    window.location.reload();
  };

  const items = getValues('items') || [];
  const subtotal = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
  const shippingCost = getValues('delivery.shippingCost') ?? 0;
  const grandTotal = subtotal + shippingCost;

  const currentStatus = getValues('status');

  if (loading) return <Typography sx={{ p: 3 }}>Loading...</Typography>;
  if (error) return <Typography color="error" sx={{ p: 3 }}>{error}</Typography>;

  return (
    <AdminStickyPage title="Edit Order">
      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ px: { xs: 1, sm: 2 }, py: 2 }}>
        <Stack spacing={3}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="h6">Order Status:</Typography>
            <Chip label={currentStatus} color={STATUS_COLORS[currentStatus] || 'default'} />
          </Stack>

          <FormTextField name="status" label="Update Status" control={control} select fullWidth>
            {['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </FormTextField>

          <FormTextField
            name="internalTags"
            label="Internal Tags (comma-separated)"
            control={control}
            fullWidth
          />

          <Typography variant="h6">Delivery SLA</Typography>
          <FormTextField name="delivery.sla" label="SLA" control={control} select fullWidth>
            {['Standard', 'Next-day', 'Same-day', 'Express'].map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </FormTextField>

          {/* [Payment, Shipping, Delivery, Order Items, Status History sections same as before] */}

          <Button type="submit" variant="contained" fullWidth={isMobile}>
            Update Order
          </Button>
        </Stack>
      </Box>

      {/* Snackbar */}
      <Snackbar open={toastOpen} autoHideDuration={4000} onClose={() => setToastOpen(false)}>
        <Alert onClose={() => setToastOpen(false)} severity="success">
          Order updated
        </Alert>
      </Snackbar>
    </AdminStickyPage>
  );
}
