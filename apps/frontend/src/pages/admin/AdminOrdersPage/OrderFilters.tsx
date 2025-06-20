import React, { useEffect } from 'react';
import dayjs from 'dayjs';
import  Grid  from '@mui/material/Grid';

import { Timestamp, collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { db } from '../../../firebase';
import { FilterState, Action, Order } from './LocalReducer';
import FilterLayout from '../../../components/admin/FilterLayout';
import FilterTextField from '../../../components/admin/FilterTextField';
import FilterDatePicker from '../../../components/admin/FilterDatePicker';
import { Dayjs } from 'dayjs';
interface Props {
  state: FilterState;
  dispatch: React.Dispatch<Action>;
}

const statusOptions = ['all', 'pending', 'shipped', 'delivered', 'succeeded'];

export default function OrderFilters({ state, dispatch }: Props) {
  const hasFilters =
    state.email ||
    state.status !== 'all' ||
    state.minTotal ||
    state.maxTotal ||
    state.startDate ||
    state.endDate;

  const fetchOrders = async () => {
    dispatch({ type: 'setLoading', payload: true });
    const constraints = [];

    if (state.status !== 'all') constraints.push(where('status', '==', state.status));
    if (state.email) constraints.push(where('email', '==', state.email));
    if (state.minTotal) constraints.push(where('total', '>=', state.minTotal));
    if (state.maxTotal) constraints.push(where('total', '<=', state.maxTotal));
    if (state.startDate) constraints.push(where('createdAt', '>=', Timestamp.fromDate(state.startDate)));
    if (state.endDate) constraints.push(where('createdAt', '<=', Timestamp.fromDate(state.endDate)));

    const q = query(
      collection(db, 'orders'),
      orderBy('createdAt', state.sortDirection),
      ...constraints
    );
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
  }, [
    state.status,
    state.email,
    state.minTotal,
    state.maxTotal,
    state.startDate,
    state.endDate,
    state.sortDirection,
  ]);

  return (
    <FilterLayout
      title="Filters"
      collapsedByDefault
      hasFilters={!!hasFilters}
      onClear={() => dispatch({ type: 'RESET_FILTERS' })}
      onApply={fetchOrders}
    >
      <Grid container spacing={2}>
        <Grid item>
          <FilterTextField
            label="User Email"
            value={state.email}
            onChange={(val) => dispatch({ type: 'setEmail', payload: val })}
            sx={{ minWidth: 240 }}
          />
        </Grid>

        <Grid item>
          <FilterTextField
            label="Status"
            select
            value={state.status}
            onChange={(val) => dispatch({ type: 'setStatus', payload: val })}
            options={statusOptions.map((s) => ({ value: s, label: s }))}
            sx={{ minWidth: 240 }}
          />
        </Grid>

        <Grid item>
          <FilterTextField
            label="Min Total"
            type="number"
            value={state.minTotal?.toString() || ''}
            onChange={(val) => dispatch({ type: 'setMinTotal', payload: parseFloat(val) })}
            sx={{ minWidth: 240 }}
          />
        </Grid>

        <Grid item>
          <FilterTextField
            label="Max Total"
            type="number"
            value={state.maxTotal?.toString() || ''}
            onChange={(val) => dispatch({ type: 'setMaxTotal', payload: parseFloat(val) })}
            sx={{ minWidth: 240 }}
          />
        </Grid>

        <Grid item>
          <FilterDatePicker
            label="Start Date"
            value={state.startDate ? dayjs(state.startDate) : null}
            onChange={(date: Dayjs | null) =>
              dispatch({ type: 'setStartDate', payload: date?.toDate() || null })
            }
            slotProps={{
              textField: {
                fullWidth: false,
                sx: { minWidth: 240 },
              },
            }}
          />
        </Grid>

        <Grid item>
          <FilterDatePicker
            label="End Date"
            value={state.endDate ? dayjs(state.endDate) : null}
            onChange={(date: Dayjs | null) =>
              dispatch({ type: 'setEndDate', payload: date?.toDate() || null })
            }
            slotProps={{
              textField: {
                fullWidth: false,
                sx: { minWidth: 240 },
              },
            }}
          />
        </Grid>

        <Grid item>
          <FilterTextField
            label="Sort By"
            select
            value={state.sortDirection}
            onChange={(val) => dispatch({ type: 'setSortDirection', payload: val as 'asc' | 'desc' })}
            options={[{ value: 'desc', label: 'Newest' }, { value: 'asc', label: 'Oldest' }]}
            sx={{ minWidth: 240 }}
          />
        </Grid>
      </Grid>
    </FilterLayout>

  );
}
