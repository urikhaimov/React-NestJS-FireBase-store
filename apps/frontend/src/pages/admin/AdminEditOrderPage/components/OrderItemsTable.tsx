import React from 'react';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Paper,
  TableContainer,
  Avatar,
  Box,
} from '@mui/material';

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

interface Props {
  items?: OrderItem[]; // ✅ optional for safety
}

export default function OrderItemsTable({ items = [] }: Props) {
  const total = items.reduce((sum, item) => {
    const price = Number(item.price || 0);
    const qty = Number(item.quantity || 0);
    return sum + price * qty;
  }, 0);

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Order Items
      </Typography>

      {items.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No items in this order.
        </Typography>
      ) : (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>Name</TableCell>
                <TableCell align="right">Qty</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Subtotal</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.productId}>
                  <TableCell>
                    <Avatar
                      src={item.image || ''}
                      alt={item.name || 'No image'}
                      variant="rounded"
                    />
                  </TableCell>
                  <TableCell>{item.name || 'Unnamed Product'}</TableCell>
                  <TableCell align="right">{item.quantity ?? 0}</TableCell>
                  <TableCell align="right">
                    ${Number(item.price).toFixed(2)}
                  </TableCell>
                  <TableCell align="right">
                    ${(item.price * item.quantity).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={4} align="right">
                  <strong>Total</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>${total.toFixed(2)}</strong>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
}
