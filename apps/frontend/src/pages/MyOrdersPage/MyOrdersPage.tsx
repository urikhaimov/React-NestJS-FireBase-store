import React, { useEffect, useMemo, useReducer, useCallback, useState, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import PageWithStickyFilters from '../../layouts/PageWithStickyFilters';
import { retryWithBackoff } from '../../utils/retryWithBackoff';
import { FixedSizeList as ListWindow, ListChildComponentProps } from 'react-window';
import { Order, filterReducer, initialFilterState } from './LocalReducer';
import UserOrderFilters from './UserOrderFilters';
import { useAuthReady } from '../../hooks/useAuthReady';
import { fetchMyOrders } from '../../api/orderApi';
import LoadingProgress from '../../components/LoadingProgress';
import { Timestamp } from 'firebase/firestore';

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

        // 🔁 Force-convert createdAt to Timestamp
        const converted = list.map((order: any) => ({
          ...order,
          createdAt: order.createdAt?.seconds
            ? new Timestamp(order.createdAt.seconds, order.createdAt.nanoseconds)
            : Timestamp.fromDate(new Date(order.createdAt)),
        }));

        setOrders(converted);
      } catch (err) {
        console.error('Error loading orders:', err);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [ready, user]);

  const filteredOrders = useMemo(() => {
    return orders
      .filter((order) => {
        const created = order.createdAt.toDate();
        const matchStatus =
          filterState.status === 'all' || order.status === filterState.status;
        const matchStart =
          !filterState.startDate || created >= filterState.startDate;
        const matchEnd =
          !filterState.endDate || created <= filterState.endDate;
        const matchMin =
          filterState.minTotal === null || order.amount >= filterState.minTotal;
        const matchMax =
          filterState.maxTotal === null || order.amount <= filterState.maxTotal;
        const matchEmail = !filterState.email || order.email.includes(filterState.email);
        return matchStatus && matchStart && matchEnd && matchMin && matchMax && matchEmail;
      })
      .sort((a, b) => {
        const aTime = a.createdAt.toMillis();
        const bTime = b.createdAt.toMillis();
        return filterState.sortDirection === 'asc' ? aTime - bTime : bTime - aTime;
      });
  }, [orders, filterState]);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastItemRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          dispatch({ type: 'setPage', payload: filterState.page + 1 });
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, filterState.page]
  );

  const paginatedOrders = useMemo(() => {
    return filteredOrders.slice(0, filterState.page * filterState.pageSize);
  }, [filteredOrders, filterState.page, filterState.pageSize]);

  const Row = useCallback(
    ({ index, style }: ListChildComponentProps) => {
      const order = paginatedOrders[index];
      const isLast = index === paginatedOrders.length - 1;
      return (
        <Box style={style} px={1} ref={isLast ? lastItemRef : undefined}>
          <Paper elevation={3} sx={{ p: 2, borderRadius: 2, mb: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Order #{order.id}
            </Typography>
            <Typography variant="body2">Status: {order.status}</Typography>
            <Typography variant="body2">
              Date: {order.createdAt.toDate().toLocaleString()}
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
    [paginatedOrders, lastItemRef]
  );

  if (!ready || loading) {
    return <LoadingProgress />;
  }

  return (
    <PageWithStickyFilters>
      <Typography variant="h4" gutterBottom>
        My Orders
      </Typography>

      <UserOrderFilters state={filterState} dispatch={dispatch} />

      {paginatedOrders.length === 0 ? (
        <Typography>No orders found.</Typography>
      ) : (
        <ListWindow
          height={600}
          width="100%"
          itemCount={paginatedOrders.length}
          itemSize={220}
        >
          {Row}
        </ListWindow>
      )}
    </PageWithStickyFilters>
  );
}
