import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
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

import { FilterState, Action, Order } from './LocalReducer';
import dayjs from 'dayjs';

import { collection, getDocs, orderBy, query, where, Timestamp } from 'firebase/firestore';
import { db } from '../../../firebase';






export interface ProductFiltersProps {
    state: FilterState;
    dispatch: React.Dispatch<Action>;

}

const statusOptions = ['all', 'pending', 'shipped', 'delivered', 'succeeded'];
export default function ProductFilters({
    state,
    dispatch,

}: ProductFiltersProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const hasFilters = state.searchTerm || state.selectedCategoryId || state.createdAfter;
    const [expanded, setExpanded] = useState(false);



    const fetchOrders = async () => {
        dispatch({ type: 'setLoading', payload: true });
        const constraints = [];

        if (state.status !== 'all') {
            constraints.push(where('status', '==', state.status));
        }
        if (state.email) {
            constraints.push(where('email', '==', state.email));
        }
        if (state.minTotal) {
            constraints.push(where('total', '>=', state.minTotal));
        }
        if (state.maxTotal) {
            constraints.push(where('total', '<=', state.maxTotal));
        }
        if (state.startDate) {
            constraints.push(where('createdAt', '>=', Timestamp.fromDate(state.startDate)));
        }
        if (state.endDate) {
            constraints.push(where('createdAt', '<=', Timestamp.fromDate(state.endDate)));
        }

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

 const filtersContent = (
  <Box
    sx={{
      display: 'flex',
      flexDirection: { xs: 'column', sm: 'row' },
      flexWrap: 'wrap',
      gap: 2,
      mb: 2,
      alignItems: 'flex-end',
      '& > *': {
        flex: { xs: '1 1 100%', sm: '1 1 auto' },
        minWidth: { sm: '150px' },
      },
    }}
  >
    <TextField
      label="User Email"
      size="small"
      value={state.email}
      onChange={(e) => dispatch({ type: 'setEmail', payload: e.target.value })}
    />

    <TextField
      select
      label="Status"
      size="small"
      value={state.status}
      onChange={(e) => dispatch({ type: 'setStatus', payload: e.target.value })}
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
    />

    <TextField
      label="Max Total"
      type="number"
      size="small"
      value={state.maxTotal}
      onChange={(e) =>
        dispatch({ type: 'setMaxTotal', payload: parseFloat(e.target.value) })
      }
    />

    <DatePicker
      label="Start Date"
      value={state.startDate ? dayjs(state.startDate) : null}
      onChange={(date) =>
        dispatch({ type: 'setStartDate', payload: date ? date.toDate() : null })
      }
      slotProps={{ textField: { size: 'small' } }}
    />

    <DatePicker
      label="End Date"
      value={state.endDate ? dayjs(state.endDate) : null}
      onChange={(date) =>
        dispatch({ type: 'setEndDate', payload: date ? date.toDate() : null })
      }
      slotProps={{ textField: { size: 'small' } }}
    />

    <TextField
      select
      label="Sort By"
      size="small"
      value={state.sortDirection}
      onChange={(e) =>
        dispatch({ type: 'setSortDirection', payload: e.target.value as 'asc' | 'desc' })
      }
    >
      <MenuItem value="desc">Newest</MenuItem>
      <MenuItem value="asc">Oldest</MenuItem>
    </TextField>

    <Button variant="contained" onClick={fetchOrders}>
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
