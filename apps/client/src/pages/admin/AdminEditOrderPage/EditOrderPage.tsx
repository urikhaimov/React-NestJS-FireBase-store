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
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { useParams } from 'react-router-dom';

import { useOrder, useUpdateOrder, Order } from '../../../hooks/useOrder';

import OrderSummaryCard from './components/OrderSummaryCard';
import OrderItemsTable from './components/OrderItemsTable';
import OrderStatusBadge from './components/OrderStatusBadge';
const STATUS_OPTIONS = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

export default function EditOrderPage() {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading, isError, error } = useOrder(id);
  const updateOrderMutation = useUpdateOrder(id);
  const [toastOpen, setToastOpen] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting },
  } = useForm<Order>({
    defaultValues: order || {
       status: 'pending', // ✅ must match one of the allowed union types
      notes: '',
      delivery: { provider: '', trackingNumber: '', eta: '' },
      items: [],
    },
  });

  useEffect(() => {
    if (order) reset(order);
  }, [order, reset]);

  const currentStatus = watch('status');

  const onSubmit: SubmitHandler<Order> = (formData) => {
    updateOrderMutation.mutate(
      { ...formData, previousStatus: order?.status },
      {
        onSuccess: () => setToastOpen(true),
      }
    );
  };

  if (isLoading) return <CircularProgress />;

  if (isError)
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">Error loading order: {error?.message}</Typography>
      </Box>
    );

  return (
    <Box sx={{ px: { xs: 1, sm: 3 }, py: 2 }}>
      <Typography variant="h5" gutterBottom>
        Edit Order #{order?.id ?? ''}
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6">Order Status</Typography>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <TextField {...field} select fullWidth label="Status" margin="normal">
                  {STATUS_OPTIONS.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option.toUpperCase()}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
            {/* Assume OrderStatusBadge is imported and used here */}
            <OrderStatusBadge status={currentStatus} />
          </Paper>

          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6">Delivery Information</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="delivery.provider"
                  control={control}
                  render={({ field }) => <TextField {...field} label="Provider" fullWidth />}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="delivery.trackingNumber"
                  control={control}
                  render={({ field }) => <TextField {...field} label="Tracking Number" fullWidth />}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="delivery.eta"
                  control={control}
                  render={({ field }) => <TextField {...field} label="ETA (ISO or text)" fullWidth />}
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
                <TextField {...field} label="Internal Notes" fullWidth multiline rows={3} />
              )}
            />
          </Paper>

          <Button
            variant="contained"
            onClick={handleSubmit(onSubmit)}
            disabled={updateOrderMutation.status === 'pending' || isSubmitting}
          >
            {updateOrderMutation.status === 'pending' ? <CircularProgress size={24} /> : 'Save Changes'}
          </Button>
        </Grid>

        <Grid item xs={12} md={4}>
          <OrderSummaryCard order={order!} />
          <OrderItemsTable items={order?.items ?? []} />
        </Grid>
      </Grid>

      <Snackbar open={toastOpen} autoHideDuration={4000} onClose={() => setToastOpen(false)}>
        <Alert severity="success" onClose={() => setToastOpen(false)}>
          Order updated successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
}
