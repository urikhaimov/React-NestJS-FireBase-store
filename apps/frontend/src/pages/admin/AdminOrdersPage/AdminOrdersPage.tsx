// src/pages/admin/AdminOrdersPage/AdminOrdersPage.tsx
import React, { useEffect, useReducer } from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  MenuItem,
  TextField,
  Button,
  Divider,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { collection, getDocs, orderBy, query, where, Timestamp } from 'firebase/firestore';
import { db } from '../../../firebase';
import { FixedSizeList as VirtualList, ListChildComponentProps } from 'react-window';
import AdminStickyPage from '../../../layouts/AdminStickyPage';
import dayjs from 'dayjs';
import { reducer, initialState, Order } from './LocalReducer';
const statusOptions = ['all', 'pending', 'shipped', 'delivered', 'succeeded'];

export default function AdminOrdersPage() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchOrders = async () => {
    dispatch({ type: 'setLoading', payload: true });
    const constraints = [];

    if (state.status !== 'all') {
      constraints.push(where('status', '==', state.status));
    }

    if (state.email) {
      constraints.push(where('email', '==', state.email));
    }

    if (state.minTotal) {
      constraints.push(where('total', '>=', state.minTotal));
    }
    if (state.maxTotal) {
      constraints.push(where('total', '<=', state.maxTotal));
    }

    if (state.startDate) {
      constraints.push(where('createdAt', '>=', Timestamp.fromDate(state.startDate)));
    }
    if (state.endDate) {
      constraints.push(where('createdAt', '<=', Timestamp.fromDate(state.endDate)));
    }

    const q = query(collection(db, 'orders'), orderBy('createdAt', state.sortDirection), ...constraints);
    const snapshot = await getDocs(q);

    const data: Order[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Order, 'id'>),
    }));

    dispatch({ type: 'setOrders', payload: data });
    dispatch({ type: 'setLoading', payload: false });
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.status, state.email, state.minTotal, state.maxTotal, state.startDate, state.endDate, state.sortDirection]);

  const renderRow = ({ index, style }: ListChildComponentProps) => {
    const order = state.orders[index];
    return (
      <Paper key={order.id} sx={{ p: 2, m: 1 }} style={style}>
        <Typography variant="body2">Order ID: {order.id}</Typography>
        <Typography variant="body2">User ID: {order.userId}</Typography>
        <Typography variant="body2">Email: {order.email}</Typography>
        <Typography variant="body2"> Total: ${order.total ? order.total.toFixed(2) : 'N/A'}</Typography>
        <Typography variant="body2">
          Date: {new Date(order.createdAt).toLocaleString()}
        </Typography>
        <Typography variant="body2">Status: {order.status}</Typography>
      </Paper>
    );
  };

  return (
    <AdminStickyPage title="Admin Orders">
      <Box display="flex" gap={2} flexWrap="wrap" mb={2}>
        <TextField
          label="User Email"
          value={state.email}
          onChange={(e) => dispatch({ type: 'setEmail', payload: e.target.value })}
        />

        <TextField
          select
          label="Status"
          value={state.status}
          onChange={(e) => dispatch({ type: 'setStatus', payload: e.target.value })}
        >
          {statusOptions.map((status) => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Min Total"
          type="number"
          value={state.minTotal}
          onChange={(e) => dispatch({ type: 'setMinTotal', payload: parseFloat(e.target.value) })}
        />

        <TextField
          label="Max Total"
          type="number"
          value={state.maxTotal}
          onChange={(e) => dispatch({ type: 'setMaxTotal', payload: parseFloat(e.target.value) })}
        />

        <DatePicker
          label="Start Date"
          value={state.startDate ? dayjs(state.startDate) : null}
          onChange={(date) => dispatch({ type: 'setStartDate', payload: date ? date.toDate() : null })}
        />

        <DatePicker
          label="End Date"
          value={state.endDate ? dayjs(state.endDate) : null}
          onChange={(date) => dispatch({ type: 'setEndDate', payload: date ? date.toDate() : null })}
        />

        <TextField
          select
          label="Sort By"
          value={state.sortDirection}
          onChange={(e) => dispatch({ type: 'setSortDirection', payload: e.target.value as 'asc' | 'desc' })}
        >
          <MenuItem value="desc">Newest</MenuItem>
          <MenuItem value="asc">Oldest</MenuItem>
        </TextField>

        <Button variant="contained" onClick={fetchOrders}>
          Apply Filters
        </Button>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {state.loading ? (
        <CircularProgress />
      ) : (
        <VirtualList
          height={600}
          width="100%"
          itemCount={state.orders.length}
          itemSize={150}
        >
          {renderRow}
        </VirtualList>
      )}
    </AdminStickyPage>
  );
}
