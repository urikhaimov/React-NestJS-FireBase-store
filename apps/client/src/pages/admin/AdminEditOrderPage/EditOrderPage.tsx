import {
  Box,
  Button,
  MenuItem,
  Typography,
  Stack,
  Snackbar,
  Alert,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import FormTextField from '../../../components/FormTextField';

export default function EditOrderPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toastOpen, setToastOpen] = useState(false);
  const { control, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (!id) {
      setError('Missing order ID');
      return;
    }

    const fetchOrder = async () => {
      try {
        const ref = doc(db, 'orders', id);
        const snap = await getDoc(ref);
        if (!snap.exists()) {
          throw new Error('Order not found');
        }

        const data = snap.data();
        reset(data); // You may need zod/yup transform here if complex
      } catch (err) {
        console.error('❌ Failed to fetch order:', err);
        setError('Could not load order data.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, reset]);

  const onSubmit = async (data: any) => {
    if (!id) return;

    try {
      await updateDoc(doc(db, 'orders', id), {
        ...data,
        updatedAt: new Date(),
      });
      setToastOpen(true);
    } catch (err) {
      console.error('❌ Failed to update order:', err);
      setError('Failed to update order.');
    }
  };

  if (loading) return <Typography sx={{ p: 3 }}>Loading...</Typography>;
  if (error) return <Typography color="error" sx={{ p: 3 }}>{error}</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Edit Order
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <FormTextField name="status" label="Order Status" control={control} select>
            {['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </FormTextField>

          <FormTextField
            name="delivery.trackingNumber"
            label="Tracking Number"
            control={control}
          />
          <FormTextField
            name="delivery.provider"
            label="Delivery Provider"
            control={control}
          />
          <FormTextField
            name="delivery.eta"
            label="Estimated Delivery Date"
            control={control}
            type="date"
          />

          <FormTextField
            name="notes"
            label="Internal Notes"
            control={control}
            multiline
            rows={3}
          />

          <Button type="submit" variant="contained">
            Update Order
          </Button>
        </Stack>
      </form>

      <Snackbar
        open={toastOpen}
        autoHideDuration={4000}
        onClose={() => setToastOpen(false)}
      >
        <Alert onClose={() => setToastOpen(false)} severity="success">
          Order updated
        </Alert>
      </Snackbar>
    </Box>
  );
}
