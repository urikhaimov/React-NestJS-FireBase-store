import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
import { fetchOrderById } from '../../api/orderApi';
import { formatCurrency } from '../../utils/format';
import { useAuthReady } from '../../hooks/useAuthReady';
import { Timestamp } from 'firebase/firestore';
import LoadingProgress from '../../components/LoadingProgress';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import PageWithStickyFilters from '../../layouts/PageWithStickyFilters';

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user, ready } = useAuthReady();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleDownloadInvoice = async () => {
    const input = document.getElementById('invoice-content');
    if (!input) return;

    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`invoice-${order.id}.pdf`);
  };

  useEffect(() => {
    const loadOrder = async () => {
      try {
        if (!user || !id) return;
        const token = await user.getIdToken();
        const res = await fetchOrderById(id, token);
        setOrder(res.data);
      } catch (err) {
        console.error('Failed to fetch order', err);
      } finally {
        setLoading(false);
      }
    };

    if (ready) loadOrder();
  }, [id, user, ready]);

  if (loading) return <LoadingProgress />;
  if (!order)
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

          <Button
            onClick={handleDownloadInvoice}
            variant="outlined"
            fullWidth
            sx={{ mt: 1 }}
          >
            Download Invoice (PDF)
          </Button>
        </Paper>
      </Box>
    </PageWithStickyFilters>
  );
}
