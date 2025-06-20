import React, { useReducer } from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Divider,
  useMediaQuery,
  useTheme,
  Pagination,
} from '@mui/material';
import { FixedSizeList as VirtualList, ListChildComponentProps } from 'react-window';
import AdminStickyPage from '../../../layouts/AdminStickyPage';
import ProductFilters from './ProductFilters';
import { reducer, initialState } from './LocalReducer';

export default function AdminOrdersPage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const pageSize = state.pageSize;
  const paginatedOrders = state.orders.slice(
    (state.page - 1) * pageSize,
    state.page * pageSize
  );

  const renderRow = ({ index, style }: ListChildComponentProps) => {
    const order = paginatedOrders[index];
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
          Date: {new Date(order.createdAt).toLocaleString()}
        </Typography>
        <Typography variant="body2">Status: {order.status}</Typography>
      </Paper>
    );
  };

  return (
    <AdminStickyPage
      title="Admin Orders"
      filters={
        <ProductFilters
          state={state}
          dispatch={dispatch}
        />
      }
    >
      <Divider sx={{ mb: 2 }} />

      {state.loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box sx={{ width: '100%', overflowX: 'hidden' }}>
            <VirtualList
              height={isMobile ? 360 : 600}
              width="100%"
              itemCount={paginatedOrders.length}
              itemSize={isMobile ? 220 : 160}
            >
              {renderRow}
            </VirtualList>
          </Box>

          <Box mt={2} display="flex" justifyContent="center">
            <Pagination
              count={Math.ceil(state.orders.length / pageSize)}
              page={state.page}
              onChange={(_, value) => dispatch({ type: 'setPage', payload: value })}
              color="primary"
            />
          </Box>
        </>
      )}
    </AdminStickyPage>
  );
}
