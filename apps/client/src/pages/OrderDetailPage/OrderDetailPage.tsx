// src/pages/OrderDetailPage.tsx
import React from 'react';
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
  useTheme,
  useMediaQuery,
} from '@mui/material';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Timestamp } from 'firebase/firestore';
import { useParams } from 'react-router-dom';

import { useAuthReady } from '../../hooks/useAuthReady';
import { formatCurrency } from '../../utils/format';
import LoadingProgress from '../../components/LoadingProgress';
import PageWithStickyFilters from '../../layouts/PageWithStickyFilters';
import { useOrderDetails } from '../../hooks/useOrderDetails';

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { ready } = useAuthReady();
  const { order, loading, error, downloading, downloadInvoice } = useOrderDetails(id, ready);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (loading) return <LoadingProgress />;

  if (error || !order)
    return (
      <Box mt={4} textAlign="center">
        <Typography>Order not found.</Typography>
      </Box>
    );

  const createdAt =
    order.createdAt?.seconds != null
      ? new Timestamp(order.createdAt.seconds, order.createdAt.nanoseconds).toDate()
      : new Date(order.createdAt);

  return (
    <PageWithStickyFilters>
      <Box
        id="invoice-content"
        sx={{
          maxWidth: 600,
          mx: 'auto',
          mt: 3,
          px: isMobile ? 1 : 3,
          overflowX: 'hidden',
        }}
      >
        <Typography variant="h5" gutterBottom textAlign="center">
          Order #{order.id}
        </Typography>

        <Paper elevation={3} sx={{ p: isMobile ? 2 : 3, borderRadius: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            <strong>Status:</strong> {order.status}
          </Typography>
          <Typography><strong>Customer:</strong> {order.ownerName}</Typography>
          <Typography><strong>Date:</strong> {createdAt.toLocaleString()}</Typography>
          <Typography><strong>Total:</strong> {formatCurrency(order.amount)}</Typography>
          <Typography><strong>Payment:</strong> Visa ending in 4242</Typography>
          <Typography><strong>Shipping Address:</strong> 123 Main St, Tel Aviv, Israel</Typography>
          <Typography><strong>ETA:</strong> July 8, 2025</Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>
            Items
          </Typography>
          <List dense disablePadding>
            {order.items.map((item: any, idx: number) => (
              <ListItem key={idx} disablePadding sx={{ py: 1 }}>
                <ListItemText
                  primary={`${item.name} × ${item.quantity}`}
                  secondary={`Price: ${formatCurrency(item.price)}`}
                  sx={{ pl: 1 }}
                />
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>
            Order Timeline
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Order placed: {createdAt.toLocaleString()} <br />
            • Payment confirmed <br />
            • Packed for shipping <br />
            • Estimated delivery: July 8, 2025
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Box mt={2} textAlign="center">
            <Button
              onClick={downloadInvoice}
              variant="outlined"
              fullWidth
              disabled={downloading}
            >
              {downloading ? (
                <CircularProgress size={20} sx={{ color: 'inherit' }} />
              ) : (
                'Download Invoice (PDF)'
              )}
            </Button>
          </Box>
        </Paper>
      </Box>
    </PageWithStickyFilters>
  );
}
