import React, { useEffect, useMemo, useReducer, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  TextField,
  MenuItem,
  Pagination,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import PageWithStickyFilters from '../../layouts/PageWithStickyFilters';
import { Order, filterReducer, initialFilterState } from './FilterReducer';
import { FixedSizeList as VirtualList, ListChildComponentProps } from 'react-window';

const statusOptions = ['all', 'pending', 'shipped', 'delivered', 'succeeded'];

interface LocalState {
  orders: Order[];
  loading: boolean;
}

type LocalAction =
  | { type: 'SET_ORDERS'; payload: Order[] }
  | { type: 'SET_LOADING'; payload: boolean };

const localReducer = (state: LocalState, action: LocalAction): LocalState => {
  switch (action.type) {
    case 'SET_ORDERS':
      return { ...state, orders: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

export default function MyOrdersPage() {
  const [filterState, dispatch] = useReducer(filterReducer, initialFilterState);
  const [localState, localDispatch] = useReducer(localReducer, {
    orders: [],
    loading: true,
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

useEffect(() => {
  const fetchOrders = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const idToken = await user.getIdToken();

      const res = await fetch('/orders', {
        headers: {
          Authorization: `Bearer ${idToken}`, // ✅ still required
        },
      });

      const text = await res.text();
      console.log('Raw response:', text);

      if (!res.ok) throw new Error('Failed to fetch orders');

      const list = JSON.parse(text);
      localDispatch({ type: 'SET_ORDERS', payload: list });
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      localDispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  fetchOrders();
}, []);



  const filteredOrders = useMemo(() => {
    return localState.orders.filter(order => {
      const matchesStatus =
        filterState.status === 'all' || order.status === filterState.status;
      const matchesDate =
        !filterState.createdAfter ||
        (order.createdAt?.toDate &&
          order.createdAt.toDate().getTime() >=
          filterState.createdAfter.toDate().getTime());

      return matchesStatus && matchesDate;
    });
  }, [localState.orders, filterState.status, filterState.createdAfter]);

  const paginatedOrders = useMemo(() => {
    const start = (filterState.page - 1) * filterState.pageSize;
    return filteredOrders.slice(start, start + filterState.pageSize);
  }, [filteredOrders, filterState.page, filterState.pageSize]);

  const totalPages = Math.ceil(filteredOrders.length / filterState.pageSize);

  const Row = useCallback(({ index, style }: ListChildComponentProps) => {
    const order = paginatedOrders[index];
    return (
      <Box style={style} px={1}>
        <Paper
          key={order.id}
          elevation={3}
          sx={{
            p: 2,
            borderRadius: 2,
            mb: 2,
            backgroundColor: 'background.paper',
            boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
          }}
        >
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Order #{order.id}
          </Typography>
          <Typography variant="body2">Status: {order.status}</Typography>
          <Typography variant="body2">
            Date: {order.createdAt?.toDate?.().toLocaleString()}
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
  }, [paginatedOrders]);

  if (localState.loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <PageWithStickyFilters>
      <Typography variant="h4" gutterBottom>
        My Orders
      </Typography>

      <Box
        display="flex"
        flexWrap="wrap"
        gap={2}
        mb={3}
        alignItems="center"
        justifyContent={{ xs: 'center', sm: 'flex-start' }}
      >
        <TextField
          label="Status"
          value={filterState.status}
          onChange={(e) =>
            dispatch({ type: 'SET_STATUS', payload: e.target.value })
          }
          select
          size="small"
          sx={{ minWidth: 140 }}
        >
          {statusOptions.map((status) => (
            <MenuItem key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </MenuItem>
          ))}
        </TextField>

        <DatePicker
          label="Created After"
          value={filterState.createdAfter}
          onChange={(newDate) =>
            dispatch({ type: 'SET_CREATED_AFTER', payload: newDate })
          }
          slotProps={{ textField: { size: 'small' } }}
        />
      </Box>

      {paginatedOrders.length === 0 ? (
        <Typography>No orders found.</Typography>
      ) : (
        <>
          <VirtualList
            height={isMobile ? 300 : 350}
            width="100%"
            itemCount={paginatedOrders.length}
            itemSize={220}
          >
            {Row}
          </VirtualList>

          <Box display="flex" justifyContent="center" mt={2}>
            <Pagination
              count={totalPages}
              page={filterState.page}
              onChange={(_, page) =>
                dispatch({ type: 'SET_PAGE', payload: page })
              }
              color="primary"
            />
          </Box>
        </>
      )}
    </PageWithStickyFilters>
  );
}