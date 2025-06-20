// src/pages/OrderDetailPage/OrderDetailPage.tsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Button,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthReady } from '../../hooks/useAuthReady';
import { Order } from '../MyOrdersPage/LocalReducer'; // ✅ same type

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, ready } = useAuthReady();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ready || !id) return;

    const fetchOrder = async () => {
      try {
        if (!user) {
          setLoading(false);
          return;
        }

        const token = await user.getIdToken();

        const res = await fetch(`/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Order not found');

        const data = await res.json();
        setOrder(data);
      } catch (err) {
        console.error('Error loading order:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [ready, user, id]);

  if (!ready || loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (!order) {
    return (
      <Box textAlign="center" mt={5}>
        <Typography variant="h6">Order not found</Typography>
        <Button onClick={() => navigate('/orders')} variant="contained" sx={{ mt: 2 }}>
          Back to Orders
        </Button>
      </Box>
    );
  }

  return (
    <Box maxWidth="md" mx="auto" mt={4} px={2}>
      <Typography variant="h4" gutterBottom>
        Order #{order.id}
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Typography>Status: {order.status}</Typography>
        <Typography>Date: {order.createdAt.toDate().toLocaleString()}</Typography>
        <Typography>Total: ${order.amount}</Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>Items</Typography>
        <List dense disablePadding>
          {order.items.map((item, idx) => (
            <ListItem key={idx}>
              <ListItemText
                primary={`${item.name} × ${item.quantity}`}
                secondary={`$${item.price}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
}
