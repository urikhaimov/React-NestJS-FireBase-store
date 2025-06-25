import React, { useState } from 'react';
import { Grid, Box, Button } from '@mui/material';
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

export default function UserOrderFilters({ state, dispatch }: Props) {
  const [showFilters, setShowFilters] = useState(false); // ⬅ Hidden by default

  const hasFilters =
    state.email ||
    state.status !== 'all' ||
    state.minTotal ||
    state.maxTotal ||
    state.startDate ||
    state.endDate ||
    state.minPrice ||
    state.maxPrice ||
    state.inStockOnly;

  return (
    <UserFilterLayout
      title="Filters"
      collapsedByDefault
      hasFilters={!!hasFilters}
      onClear={() => dispatch({ type: 'RESET_FILTERS' })}
      actions={
        <Box display="flex" gap={2}>
          <Button variant="outlined" onClick={() => setShowFilters((prev) => !prev)}>
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
          {hasFilters && (
            <Button
              variant="outlined"
              color="warning"
              onClick={() => dispatch({ type: 'RESET_FILTERS' })}
            >
              Reset
            </Button>
          )}
        </Box>
      }
    >
      {showFilters ? (
        <Box sx={{ maxHeight: 400, overflowY: 'auto', pr: 1 }}>
          <Grid container spacing={2} sx={{ width: '100%' }}>
            <Grid item xs={12}>
              <UserFilterTextField
                label="User Email"
                value={state.email}
                onChange={(val) => dispatch({ type: 'setEmail', payload: val })}
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <UserFilterTextField
                label="Status"
                select
                value={state.status}
                onChange={(val) => dispatch({ type: 'setStatus', payload: val })}
                options={statusOptions.map((s) => ({ value: s, label: s }))}
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <UserFilterTextField
                label="Min Total"
                type="number"
                value={state.minTotal?.toString() || ''}
                onChange={(val) =>
                  dispatch({ type: 'setMinTotal', payload: parseFloat(val) })
                }
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <UserFilterTextField
                label="Max Total"
                type="number"
                value={state.maxTotal?.toString() || ''}
                onChange={(val) =>
                  dispatch({ type: 'setMaxTotal', payload: parseFloat(val) })
                }
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <UserFilterTextField
                label="Min Price"
                type="number"
                value={state.minPrice?.toString() || ''}
                onChange={(val) =>
                  dispatch({ type: 'setMinPrice', payload: parseFloat(val) })
                }
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <UserFilterTextField
                label="Max Price"
                type="number"
                value={state.maxPrice?.toString() || ''}
                onChange={(val) =>
                  dispatch({ type: 'setMaxPrice', payload: parseFloat(val) })
                }
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <UserFilterTextField
                label="In Stock Only"
                select
                value={state.inStockOnly ? 'yes' : 'no'}
                onChange={(val) =>
                  dispatch({ type: 'setInStockOnly', payload: val === 'yes' })
                }
                options={[
                  { value: 'no', label: 'All' },
                  { value: 'yes', label: 'In Stock Only' },
                ]}
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <UserFilterDatePicker
                label="Start Date"
                value={state.startDate ? dayjs(state.startDate) : null}
                onChange={(date: Dayjs | null) =>
                  dispatch({ type: 'setStartDate', payload: date?.toDate() || null })
                }
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <UserFilterDatePicker
                label="End Date"
                value={state.endDate ? dayjs(state.endDate) : null}
                onChange={(date: Dayjs | null) =>
                  dispatch({ type: 'setEndDate', payload: date?.toDate() || null })
                }
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
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
                fullWidth
              />
            </Grid>
          </Grid>
        </Box>
      ) : (
        hasFilters && (
          <Box mt={1} fontSize="0.85rem" fontStyle="italic">
            Filters are active. Click "Show Filters" to edit.
          </Box>
        )
      )}
    </UserFilterLayout>
  );
}
