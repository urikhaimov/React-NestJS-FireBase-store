import React, { useEffect } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import Grid from '@mui/material/Grid';

import AdminFilterLayout from '../../../components/admin/AdminFilterLayout';
import FilterTextField from '../../../components/admin/FilterTextField';
import FilterDatePicker from '../../../components/admin/FilterDatePicker';

import { useFilteredOrders, OrderFilterParams } from '../../../hooks/useFilteredOrders';

interface Props {
  state: OrderFilterParams & { sortDirection: 'asc' | 'desc' | undefined };
  dispatch: React.Dispatch<any>;
}

const statusOptions = ['all', 'pending', 'shipped', 'delivered', 'succeeded'];

export default function OrderFilters({ state, dispatch }: Props) {
  const { data, refetch } = useFilteredOrders({
    email: state.email,
    status: state.status,
    minTotal: state.minTotal,
    maxTotal: state.maxTotal,
    startDate: state.startDate ? new Date(state.startDate).toISOString() : undefined,
    endDate: state.endDate ? new Date(state.endDate).toISOString() : undefined,
    sortDirection: state.sortDirection,
  });

  useEffect(() => {
    if (data) {
      dispatch({ type: 'setOrders', payload: data });
    }
  }, [data, dispatch]);

  const hasFilters =
    !!state.email ||
    (state.status !== 'all' && !!state.status) ||
    !!state.minTotal ||
    !!state.maxTotal ||
    !!state.startDate ||
    !!state.endDate;

  return (
    <AdminFilterLayout
      title="Filters"
      collapsedByDefault
      hasFilters={hasFilters}
      onClear={() => dispatch({ type: 'RESET_FILTERS' })}
      onApply={() => refetch()}
    >
      <Grid container spacing={2}>
        <Grid item>
          <FilterTextField
            label="User Email"
            value={state.email || ''}
            onChange={(val: string) => dispatch({ type: 'setEmail', payload: val })}
            sx={{ minWidth: 240 }}
          />
        </Grid>

        <Grid item>
          <FilterTextField
            label="Status"
            select
            value={state.status || 'all'}
            onChange={(val: string) => dispatch({ type: 'setStatus', payload: val })}
            options={statusOptions.map((s) => ({ value: s, label: s }))}
            sx={{ minWidth: 240 }}
          />
        </Grid>

        <Grid item>
          <FilterTextField
            label="Min Total"
            type="number"
            value={state.minTotal?.toString() || ''}
            onChange={(val: string) => dispatch({ type: 'setMinTotal', payload: parseFloat(val) || undefined })}
            sx={{ minWidth: 240 }}
          />
        </Grid>

        <Grid item>
          <FilterTextField
            label="Max Total"
            type="number"
            value={state.maxTotal?.toString() || ''}
            onChange={(val: string) => dispatch({ type: 'setMaxTotal', payload: parseFloat(val) || undefined })}
            sx={{ minWidth: 240 }}
          />
        </Grid>

        <Grid item>
          <FilterDatePicker
            label="Start Date"
            value={state.startDate ? dayjs(state.startDate) : null}
            onChange={(date: Dayjs | null) =>
              dispatch({ type: 'setStartDate', payload: date?.toDate() || undefined })
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
              dispatch({ type: 'setEndDate', payload: date?.toDate() || undefined })
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
            value={state.sortDirection || 'desc'}
            onChange={(val: string) => dispatch({ type: 'setSortDirection', payload: val as 'asc' | 'desc' })}
            options={[
              { value: 'desc', label: 'Newest' },
              { value: 'asc', label: 'Oldest' },
            ]}
            sx={{ minWidth: 240 }}
          />
        </Grid>
      </Grid>
    </AdminFilterLayout>
  );
}
