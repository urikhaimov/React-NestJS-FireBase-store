import React from 'react';
import { Grid, Box } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { FilterState, FilterAction } from './LocalReducer';
import UserFilterLayout from '../../components/UserFilterLayout';
import UserFilterTextField from '../../components/UserFilterTextField';
import UserFilterDatePicker from '../../components/UserFilterDatePicker';

const statusOptions = ['all', 'pending', 'shipped', 'delivered', 'succeeded'];

interface Props {
  state: FilterState;
  dispatch: React.Dispatch<FilterAction>;
}

export default function OrderFilters({ state, dispatch }: Props) {
  const hasFilters =
    state.email ||
    state.status !== 'all' ||
    state.minTotal ||
    state.maxTotal ||
    state.startDate ||
    state.endDate;

  return (
    <UserFilterLayout
      title="Filters"
      collapsedByDefault
      hasFilters={!!hasFilters}
      onClear={() => dispatch({ type: 'RESET_FILTERS' })}
    >
      <Grid container spacing={2}>
        <Grid item>
          <UserFilterTextField
            label="User Email"
            value={state.email}
            onChange={(val) => dispatch({ type: 'setEmail', payload: val })}
            sx={{ minWidth: 240 }}
          />
        </Grid>

        <Grid item>
          <UserFilterTextField
            label="Status"
            select
            value={state.status}
            onChange={(val) => dispatch({ type: 'setStatus', payload: val })}
            options={statusOptions.map((s) => ({ value: s, label: s }))}
            sx={{ minWidth: 240 }}
          />
        </Grid>

        <Grid item>
          <UserFilterTextField
            label="Min Total"
            type="number"
            value={state.minTotal?.toString() || ''}
            onChange={(val) => dispatch({ type: 'setMinTotal', payload: parseFloat(val) })}
            sx={{ minWidth: 240 }}
          />
        </Grid>

        <Grid item>
          <UserFilterTextField
            label="Max Total"
            type="number"
            value={state.maxTotal?.toString() || ''}
            onChange={(val) => dispatch({ type: 'setMaxTotal', payload: parseFloat(val) })}
            sx={{ minWidth: 240 }}
          />
        </Grid>

        <Grid item>
          <Box sx={{ minWidth: 240 }}>
            <UserFilterDatePicker
              label="Start Date"
              value={state.startDate ? dayjs(state.startDate) : null}
              onChange={(date: Dayjs | null) =>
                dispatch({ type: 'setStartDate', payload: date?.toDate() || null })
              }
            />
          </Box>
        </Grid>

        <Grid item>
          <Box sx={{ minWidth: 240 }}>
            <UserFilterDatePicker
              label="End Date"
              value={state.endDate ? dayjs(state.endDate) : null}
              onChange={(date: Dayjs | null) =>
                dispatch({ type: 'setEndDate', payload: date?.toDate() || null })
              }
            />
          </Box>
        </Grid>

        <Grid item>
          <UserFilterTextField
            label="Sort By"
            select
            value={state.sortDirection}
            onChange={(val) =>
              dispatch({ type: 'setSortDirection', payload: val as 'asc' | 'desc' })
            }
            options={[
              { value: 'desc', label: 'Newest' },
              { value: 'asc', label: 'Oldest' },
            ]}
            sx={{ minWidth: 240 }}
          />
        </Grid>
      </Grid>
    </UserFilterLayout>
  );
}
