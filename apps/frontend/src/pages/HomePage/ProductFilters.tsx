import React from 'react';
import {
  Box,
  Grid,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Category } from '../../types/firebase';
import { State, Action } from './LocalReducer';
import FilterLayout from '../../components/admin/FilterLayout';
interface Props {
  state: State;
  dispatch: React.Dispatch<Action>;
  categories: Category[];
}

export default function ProductFilters({ state, dispatch, categories }: Props) {
  const hasFilters =
    state.search || state.selectedCategoryId || state.createdAfter;

  return (
    <Box mb={3} position="sticky" top={0} zIndex={10} bgcolor="background.paper">
      <Box display="flex" justifyContent="flex-end" mb={2}>
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

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Search products"
            value={state.search}
            onChange={(e) =>
              dispatch({ type: 'SET_SEARCH', payload: e.target.value })
            }
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              label="Category"
              value={state.selectedCategoryId}
              onChange={(e) =>
                dispatch({ type: 'SET_CATEGORY', payload: e.target.value })
              }
            >
              <MenuItem value="">All</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <DatePicker
            label="Created After"
            value={state.createdAfter}
            onChange={(val) =>
              dispatch({ type: 'SET_CREATED_AFTER', payload: val })
            }
            slotProps={{ textField: { fullWidth: true } }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
