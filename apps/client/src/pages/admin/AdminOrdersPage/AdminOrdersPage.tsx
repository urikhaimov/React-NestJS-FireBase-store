import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Divider,
  useMediaQuery,
  useTheme,
  Pagination,
} from '@mui/material';
import { VariableSizeList, ListChildComponentProps } from 'react-window';
import PageWithStickyFilters from '../../../layouts/PageWithStickyFilters';
// Import OrderFilters properly or remove if not ready yet
// import OrderFilters from './OrderFilters';
import { useAuthReady } from '@client/hooks/useAuthReady';
import LoadingProgress from '@client/components/LoadingProgress';
import { useOrders, Order } from '@client/hooks/useOrders';
import { useNavigate } from 'react-router-dom';

export default function AdminOrdersPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { ready, user } = useAuthReady();

  const [token, setToken] = useState<string | undefined>();
  useEffect(() => {
    if (ready && user) {
      user.getIdToken().then(setToken);
    }
  }, [ready, user]);

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data: orders = [], isLoading, error } = useOrders(token);

  const paginatedOrders: Order[] = Array.isArray(orders)
    ? orders.slice((page - 1) * pageSize, page * pageSize)
    : [];

  const renderRow = ({ index, style }: ListChildComponentProps) => {
    const order = paginatedOrders[index];
    if (!order) return null;

    const date =
      typeof order.createdAt === 'string'
        ? new Date(order.createdAt)
        : (order.createdAt?.toDate?.() ?? new Date());

    return (
      <Paper
        key={order.id}
        sx={{
          p: 2,
          m: 1,
          borderRadius: 2,
          backgroundColor: theme.palette.background.paper,
          boxShadow: theme.shadows[2],
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box',
        }}
        style={style}
      >
        <Typography variant="subtitle2" fontWeight="bold">
          Order ID: {order.id}
        </Typography>
        <Typography variant="body2">User ID: {order.userId}</Typography>
        <Typography variant="body2">Email: {order.email}</Typography>
        <Typography variant="body2">Total: ${order.total}</Typography>
        <Typography variant="body2">
          Date: {date.toLocaleString() ?? 'Invalid date'}
        </Typography>
        <Typography variant="body2">Status: {order.status}</Typography>
        <Button
          variant="outlined"
          onClick={() => navigate(`/admin/orders/${order.id}`)}
        >
          Edit
        </Button>
      </Paper>
    );
  };

  return (
    <PageWithStickyFilters
      title="Admin Orders"
      // Provide real props or remove filters if not implemented
      // filters={<OrderFilters state={state} dispatch={dispatch} />}
    >
      <Divider sx={{ mb: 2 }} />

      {isLoading ? (
        <LoadingProgress />
      ) : error ? (
        <Typography color="error" sx={{ p: 2 }}>
          Failed to load orders: {error.message}
        </Typography>
      ) : (
        <>
          <VariableSizeList
            style={{ overflowX: 'hidden' }}
            height={isMobile ? 300 : 350}
            width="100%"
            itemCount={paginatedOrders.length}
            itemSize={() => (isMobile ? 220 : 160)}
          >
            {renderRow}
          </VariableSizeList>

          <Box mt={2} display="flex" justifyContent="center">
            <Pagination
              count={Math.ceil(orders.length / pageSize)}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
            />
          </Box>
        </>
      )}
    </PageWithStickyFilters>
  );
}
