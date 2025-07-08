import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  MenuItem,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../../firebase';
import { useSafeAuth } from '../../../hooks/getSafeAuth';
import LoadingProgress from '../../../components/LoadingProgress';
import OrderItemsTable from './components/OrderItemsTable';
import OrderStatusBadge from './components/OrderStatusBadge';
import OrderSummaryCard from './components/OrderSummaryCard';

const STATUS_OPTIONS = [
  'pending',
  'confirmed',
  'shipped',
  'delivered',
  'cancelled',
];

export default function EditOrderPage() {
  const { id } = useParams();
  const { user: admin } = useSafeAuth();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<any | null>(null);
  const [toastOpen, setToastOpen] = useState(false);

  const { control, handleSubmit, setValue, watch } = useForm();
  const currentStatus = watch('status');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const snap = await getDoc(doc(db, 'orders', id!));
        if (snap.exists()) {
          const data = snap.data();
          setOrder(data);
          setValue('status', data.status);
          setValue('notes', data.notes || '');
          setValue('deliveryProvider', data.delivery?.provider || '');
          setValue('trackingNumber', data.delivery?.trackingNumber || '');
          setValue('eta', data.delivery?.eta || '');
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOrder();
  }, [id, setValue]);

  const onSubmit = async (formData: any) => {
    if (!order || !id || !admin) return;
    const updatedFields: any = {
      status: formData.status,
      notes: formData.notes,
      delivery: {
        provider: formData.deliveryProvider,
        trackingNumber: formData.trackingNumber,
        eta: formData.eta,
      },
      updatedAt: new Date().toISOString(),
    };

    // If status changed, add to statusHistory
    if (formData.status !== order.status) {
      updatedFields.statusHistory = arrayUnion({
        status: formData.status,
        timestamp: new Date().toISOString(),
        changedBy: admin.name || admin.email,
      });
    }

    await updateDoc(doc(db, 'orders', id), updatedFields);
    setToastOpen(true);
  };

  if (loading || !order) return <LoadingProgress />;

  return (
    <Box sx={{ px: { xs: 1, sm: 3 }, py: 2 }}>
      <Typography variant="h5" gutterBottom>
        Edit Order #{order.id}
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6">Order Status</Typography>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  fullWidth
                  label="Status"
                  margin="normal"
                >
                  {STATUS_OPTIONS.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option.toUpperCase()}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
            <OrderStatusBadge status={currentStatus} />
          </Paper>

          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6">Delivery Information</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="deliveryProvider"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label="Provider" fullWidth />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="trackingNumber"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label="Tracking Number" fullWidth />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="eta"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="ETA (ISO or text)"
                      fullWidth
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Paper>

          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6">Admin Notes</Typography>
            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Internal Notes"
                  fullWidth
                  multiline
                  rows={3}
                />
              )}
            />
          </Paper>

          <Button variant="contained" onClick={handleSubmit(onSubmit)}>
            Save Changes
          </Button>
        </Grid>

        <Grid item xs={12} md={4}>
          <OrderSummaryCard order={order} />
          <OrderItemsTable items={order.items} />
        </Grid>
      </Grid>

      <Snackbar
        open={toastOpen}
        autoHideDuration={4000}
        onClose={() => setToastOpen(false)}
      >
        <Alert severity="success">Order updated successfully!</Alert>
      </Snackbar>
    </Box>
  );
}
