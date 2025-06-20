import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  MenuItem,
  useTheme,
  useMediaQuery,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

import { FilterState, Action, Order } from './LocalReducer';
import { collection, getDocs, orderBy, query, where, Timestamp } from 'firebase/firestore';
import { db } from '../../../firebase';

export interface ProductFiltersProps {
  state: FilterState;
  dispatch: React.Dispatch<Action>;
}

const statusOptions = ['all', 'pending', 'shipped', 'delivered', 'succeeded'];

export default function ProductFilters({ state, dispatch }: ProductFiltersProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const hasFilters = state.email || state.status !== 'all' || state.minTotal || state.maxTotal || state.startDate || state.endDate;
  const [expanded, setExpanded] = useState(false);

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

  const inputStyle = {
    flex: { xs: '1 1 100%', sm: '1 1 200px' },
    width: 300,
  };

  const filtersContent = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        flexWrap: 'wrap',
        gap: 2,
        mb: 2,
        alignItems: 'flex-end',
      }}
    >
      <TextField
        label="User Email"
        size="small"
        value={state.email}
        onChange={(e) => dispatch({ type: 'setEmail', payload: e.target.value })}
        sx={inputStyle}
      />

      <TextField
        select
        label="Status"
        size="small"
        value={state.status}
        onChange={(e) => dispatch({ type: 'setStatus', payload: e.target.value })}
        sx={inputStyle}
      >
        {statusOptions.map((status) => (
          <MenuItem key={status} value={status}>
            {status}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label="Min Total"
        type="number"
        size="small"
        value={state.minTotal}
        onChange={(e) =>
          dispatch({ type: 'setMinTotal', payload: parseFloat(e.target.value) })
        }
        sx={inputStyle}
      />

      <TextField
        label="Max Total"
        type="number"
        size="small"
        value={state.maxTotal}
        onChange={(e) =>
          dispatch({ type: 'setMaxTotal', payload: parseFloat(e.target.value) })
        }
        sx={inputStyle}
      />

      <DatePicker
        label="Start Date"
        value={state.startDate ? dayjs(state.startDate) : null}
        onChange={(date) =>
          dispatch({ type: 'setStartDate', payload: date ? date.toDate() : null })
        }
        slotProps={{ textField: { size: 'small', sx: inputStyle } }}
      />

      <DatePicker
        label="End Date"
        value={state.endDate ? dayjs(state.endDate) : null}
        onChange={(date) =>
          dispatch({ type: 'setEndDate', payload: date ? date.toDate() : null })
        }
        slotProps={{ textField: { size: 'small', sx: inputStyle } }}
      />

      <TextField
        select
        label="Sort By"
        size="small"
        value={state.sortDirection}
        onChange={(e) =>
          dispatch({ type: 'setSortDirection', payload: e.target.value as 'asc' | 'desc' })
        }
        sx={inputStyle}
      >
        <MenuItem value="desc">Newest</MenuItem>
        <MenuItem value="asc">Oldest</MenuItem>
      </TextField>

      <Button
        variant="contained"
        onClick={fetchOrders}
        sx={{ minWidth: 200, height: 40 }}
      >
        Apply Filters
      </Button>
    </Box>
  );

  return (
    <Box mb={3}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={2}
        mb={2}
      >
        {hasFilters && (
          <Button
            variant="outlined"
            color="warning"
            onClick={() => dispatch({ type: 'RESET_FILTERS' })}
          >
            Clear Filters
          </Button>
        )}
      </Box>

      {isMobile ? (
        <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle2">Show Filters</Typography>
          </AccordionSummary>
          <AccordionDetails>{filtersContent}</AccordionDetails>
        </Accordion>
      ) : (
        filtersContent
      )}
    </Box>
  );
}
