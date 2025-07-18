// src/pages/admin/AdminOrdersPage/AdminOrdersPage.tsx
import React, { useEffect, useReducer, useState, useMemo } from 'react';
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
import { useAuthReady } from '@client/hooks/useAuthReady';
import LoadingProgress from '@client/components/LoadingProgress';
import { useOrders, Order } from '@client/hooks/useOrders';
import { useNavigate } from 'react-router-dom';
import AdminOrderFilters from './AdminOrderFilters';
import {
  FilterState,
  FilterAction,
  initialFilterState,
  filterReducer,
} from './LocalReducer';

export default function AdminOrdersPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { ready, user } = useAuthReady();

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [state, dispatch] = useReducer(filterReducer, initialFilterState);

  const { data: allOrders = [], isLoading, error } = useOrders();

  const filteredOrders = useMemo(() => {
    return allOrders
      .filter((order) => {
        const matchesEmail =
          !state.email ||
          order.email?.toLowerCase().includes(state.email.toLowerCase());
        const matchesStatus =
          state.status === 'all' || order.status === state.status;
        const matchesMinTotal =
          !state.minTotal || order.total >= state.minTotal;
        const matchesMaxTotal =
          !state.maxTotal || order.total <= state.maxTotal;

        const createdAt =
          typeof order.createdAt === 'string'
            ? new Date(order.createdAt)
            : (order.createdAt?.toDate?.() ?? new Date());

        const matchesStartDate =
          !state.startDate || createdAt >= new Date(state.startDate);
        const matchesEndDate =
          !state.endDate || createdAt <= new Date(state.endDate);

        return (
          matchesEmail &&
          matchesStatus &&
          matchesMinTotal &&
          matchesMaxTotal &&
          matchesStartDate &&
          matchesEndDate
        );
      })
      .sort((a, b) => {
        const aDate =
          typeof a.createdAt === 'string'
            ? new Date(a.createdAt)
            : (a.createdAt?.toDate?.() ?? new Date());

        const bDate =
          typeof b.createdAt === 'string'
            ? new Date(b.createdAt)
            : (b.createdAt?.toDate?.() ?? new Date());

        return state.sortDirection === 'asc'
          ? aDate.getTime() - bDate.getTime()
          : bDate.getTime() - aDate.getTime();
      });
  }, [allOrders, state]);

  const paginatedOrders: Order[] = filteredOrders.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

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
          borderRadius: 2,
          boxShadow: 2,
          backgroundColor: theme.palette.background.paper,
          boxSizing: 'border-box',
          mx: 1,
          ...style,
        }}
      >
        <Typography variant="subtitle2" fontWeight="bold" noWrap>
          Order ID: {order.id}
        </Typography>
        <Typography variant="body2" noWrap>
          User ID: {order.userId}
        </Typography>
        <Typography variant="body2" noWrap>
          Email: {order.email}
        </Typography>
        <Typography variant="body2">
          Total: $
          {typeof order.total === 'number' ? order.total.toFixed(2) : 'N/A'}
        </Typography>
        <Typography variant="body2">Date: {date.toLocaleString()}</Typography>
        <Typography variant="body2">Status: {order.status}</Typography>

        <Box mt={1}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => navigate(`/admin/orders/${order.id}`)}
          >
            Edit
          </Button>
        </Box>
      </Paper>
    );
  };

  return (
    <PageWithStickyFilters
      title="Admin Orders"
      sidebar={<AdminOrderFilters state={state} dispatch={dispatch} />}
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
          <Box
            sx={{ px: 1, overflowY: 'auto', maxHeight: 'calc(100vh - 240px)' }}
          >
            <VariableSizeList
              height={isMobile ? 320 : 380}
              width="100%"
              itemCount={paginatedOrders.length}
              itemSize={() => (isMobile ? 240 : 180)}
              style={{ overflowX: 'hidden' }}
            >
              {renderRow}
            </VariableSizeList>
          </Box>

          <Box mt={2} display="flex" justifyContent="center">
            <Pagination
              count={Math.ceil(filteredOrders.length / pageSize)}
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
