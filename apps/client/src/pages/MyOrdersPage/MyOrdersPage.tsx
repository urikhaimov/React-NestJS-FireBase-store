import React, { useEffect, useMemo, useReducer, useCallback, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Pagination,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import PageWithStickyFilters from '../../layouts/PageWithStickyFilters';
import { retryWithBackoff } from '../../utils/retryWithBackoff';
import { VariableSizeList, ListChildComponentProps } from 'react-window';
import { Order, filterReducer, initialFilterState } from './LocalReducer';
import OrderFilters from './OrderFilters';
import { useAuthReady } from '../../hooks/useAuthReady';
import { fetchMyOrders } from '../../api/orderApi';
import LoadingProgress from '../../components/LoadingProgress'
export default function MyOrdersPage() {
  const [filterState, dispatch] = useReducer(filterReducer, initialFilterState);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const { user, ready } = useAuthReady();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (!ready) return;

    const loadOrders = async () => {
      try {
        if (!user) {
          setLoading(false);
          return;
        }

        const idToken = await user.getIdToken();

        const fetchFn = () => fetchMyOrders(idToken).then(res => res.data);
        const list = await retryWithBackoff(fetchFn);
        setOrders(list);
      } catch (err) {
        console.error('Error loading orders:', err);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [ready, user]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchStatus =
        filterState.status === 'all' || order.status === filterState.status;
      const matchStart =
        !filterState.startDate ||
        order.createdAt.toDate().getTime() >= filterState.startDate.getTime();
      return matchStatus && matchStart;
    });
  }, [orders, filterState.status, filterState.startDate]);

  const paginatedOrders = useMemo(() => {
    const start = (filterState.page - 1) * filterState.pageSize;
    return filteredOrders.slice(start, start + filterState.pageSize);
  }, [filteredOrders, filterState.page, filterState.pageSize]);

  const totalPages = Math.ceil(filteredOrders.length / filterState.pageSize);

  const Row = useCallback(
    ({ index, style }: ListChildComponentProps) => {
      const order = paginatedOrders[index];
      return (
        <Box style={style} px={1}>
          <Paper elevation={3} sx={{ p: 2, borderRadius: 2, mb: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Order #{order.id}
            </Typography>
            <Typography variant="body2">Status: {order.status}</Typography>
            <Typography variant="body2">
              Date:{(order.createdAt as any).toDate?.()?.toLocaleString?.() ?? 'Invalid date'}

            </Typography>
            <Typography variant="body2" gutterBottom>
              Total: ${order.amount}
            </Typography>
            <Divider sx={{ my: 1 }} />
            <List dense disablePadding>
              {order.items.map((item, idx) => (
                <ListItem key={idx} disablePadding>
                  <ListItemText
                    primary={`${item.name} × ${item.quantity}`}
                    secondary={`Price: $${item.price}`}
                    sx={{ pl: 1 }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>
      );
    },
    [paginatedOrders]
  );

  if (!ready || loading) {
    return (
     <LoadingProgress/>
    );
  }

  return (
    <PageWithStickyFilters>
      <Typography variant="h4" gutterBottom>
        My Orders
      </Typography>

      <OrderFilters state={filterState} dispatch={dispatch} />

      {paginatedOrders.length === 0 ? (
        <Typography>No orders found.</Typography>
      ) : (
        <>
          <VariableSizeList
            height={600}
            width="100%"
            itemCount={paginatedOrders.length}
            itemSize={() => 220}
          >
            {Row}
          </VariableSizeList>

          <Box display="flex" justifyContent="center" mt={2}>
            <Pagination
              count={totalPages}
              page={filterState.page}
              onChange={(_, page) =>
                dispatch({ type: 'setPage', payload: page })
              }
              color="primary"
            />
          </Box>
        </>
      )}
    </PageWithStickyFilters>
  );
}
