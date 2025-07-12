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
import { useParams } from 'react-router-dom';

import { useAuthReady } from '../../hooks/useAuthReady';
import PageWithStickyFilters from '../../layouts/PageWithStickyFilters';
import { useOrderDetails } from '../../hooks/useOrderDetails';
import { formatCurrency } from '../../utils/format';
import { Order } from '../../types/order';

function formatDate(date: string) {
  return new Date(date).toLocaleString();
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { ready } = useAuthReady();
  const { order, loading, error, downloading, downloadInvoice } = useOrderDetails(id, ready);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (loading) return <CircularProgress sx={{ mt: 4, mx: 'auto', display: 'block' }} />;
  if (error || !order)
    return (
      <Box mt={4} textAlign="center">
        <Typography color="error">Error loading order. Please try again.</Typography>
      </Box>
    );

  const { status, email, ownerName, total, createdAt, payment, shippingAddress, delivery, items, statusHistory } = order;

  return (
    <PageWithStickyFilters>
      <Box
        id="invoice-content"
        sx={{
          maxWidth: 700,
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
            <strong>Status:</strong> {status}
          </Typography>
          <Typography><strong>Customer:</strong> {ownerName} ({email})</Typography>
          <Typography><strong>Date:</strong> {formatDate(createdAt)}</Typography>
          <Typography><strong>Total:</strong> {formatCurrency(total || 0)}</Typography>

          <Typography>
            <strong>Payment:</strong> {payment.method} ({payment.status})
            {payment.transactionId && ` • TX: ${payment.transactionId}`}
          </Typography>

          <Typography>
            <strong>Shipping Address:</strong>{' '}
            {[shippingAddress.fullName, shippingAddress.street, shippingAddress.city, shippingAddress.country].filter(Boolean).join(', ')}
          </Typography>

          {delivery?.eta && (
            <Typography><strong>ETA:</strong> {delivery.eta}</Typography>
          )}
          {delivery?.trackingNumber && (
            <Typography><strong>Tracking Number:</strong> {delivery.trackingNumber}</Typography>
          )}

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>
            Items
          </Typography>
          <List dense disablePadding>
            {items.map((item, idx) => (
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
          {statusHistory?.length ? (
            statusHistory.map((entry, idx) => (
              <Typography variant="body2" color="text.secondary" key={idx}>
                • {entry.status} – {formatDate(entry.timestamp)} (by {entry.changedBy})
              </Typography>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">No status history available.</Typography>
          )}

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
