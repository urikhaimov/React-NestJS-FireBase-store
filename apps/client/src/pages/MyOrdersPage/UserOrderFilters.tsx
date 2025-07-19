// src/pages/MyOrders/UserOrderFilters.tsx
import React from 'react';
import { Box, Stack } from '@mui/material';
import FormTextField from '../../components/FormTextField';
import { DatePicker } from '@mui/x-date-pickers';
import { FilterAction, FilterState } from './LocalReducer';
import dayjs from 'dayjs';

interface Props {
  state: FilterState;
  dispatch: React.Dispatch<FilterAction>;
}

export default function UserOrderFilters({ state, dispatch }: Props) {
  return (
    <Box p={1}>
      <Stack spacing={2}>
        <FormTextField
          label="Status"
          isSelect
          selectOptions={[
            { label: 'All', value: 'all' },
            { label: 'Pending', value: 'pending' },
            { label: 'Processing', value: 'processing' },
            { label: 'Shipped', value: 'shipped' },
            { label: 'Delivered', value: 'delivered' },
            { label: 'Cancelled', value: 'cancelled' },
          ]}
          value={state.status}
          onChange={(e) =>
            dispatch({ type: 'setStatus', payload: e.target.value })
          }
        />

        <DatePicker
          label="Start Date"
          value={state.startDate ? dayjs(state.startDate) : null}
          onChange={(date) =>
            dispatch({ type: 'setStartDate', payload: date?.toDate() ?? null })
          }
          slotProps={{ textField: { size: 'small', fullWidth: true } }}
        />

        <DatePicker
          label="End Date"
          value={state.endDate ? dayjs(state.endDate) : null}
          onChange={(date) =>
            dispatch({ type: 'setEndDate', payload: date?.toDate() ?? null })
          }
          slotProps={{ textField: { size: 'small', fullWidth: true } }}
        />

        <FormTextField
          label="Min Total"
          type="number"
          value={state.minTotal ?? ''}
          onChange={(e) =>
            dispatch({
              type: 'setMinTotal',
              payload: e.target.value === '' ? null : Number(e.target.value),
            })
          }
        />

        <FormTextField
          label="Max Total"
          type="number"
          value={state.maxTotal ?? ''}
          onChange={(e) =>
            dispatch({
              type: 'setMaxTotal',
              payload: e.target.value === '' ? null : Number(e.target.value),
            })
          }
        />

        <FormTextField
          label="Email"
          value={state.email}
          onChange={(e) =>
            dispatch({ type: 'setEmail', payload: e.target.value })
          }
        />
      </Stack>
    </Box>
  );
}
