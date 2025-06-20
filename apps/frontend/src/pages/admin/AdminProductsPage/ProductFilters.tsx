import React from 'react';
import { Box, Button, Grid, MenuItem } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Category } from '../../../hooks/useAllCategories';
import { State, Action } from './LocalReducer';
import FilterLayout from '../../../components/admin/FilterLayout';
import FilterTextField from '../../../components/admin/FilterTextField';
import FilterDatePicker from '../../../components/admin/FilterDatePicker';
import { Dayjs } from 'dayjs';
export interface ProductFiltersProps {
  state: State;
  dispatch: React.Dispatch<Action>;
  categories: Category[];
  onAddProduct: () => void;
}

export default function ProductFilters({ state, dispatch, categories, onAddProduct }: ProductFiltersProps) {
  const hasFilters = state.searchTerm || state.selectedCategoryId || state.createdAfter;

  return (
    <FilterLayout
      title="Filters"
      hasFilters={!!hasFilters}
      onClear={() => dispatch({ type: 'RESET_FILTERS' })}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Button variant="contained" onClick={onAddProduct}>
          Add Product
        </Button>

        {hasFilters && (
          <Button variant="outlined" color="warning" onClick={() => dispatch({ type: 'RESET_FILTERS' })}>
            Clear Filters
          </Button>
        )}
      </Box>

      <Grid container spacing={2}>
        <Grid item>
          <FilterTextField
            label="Search products"
            value={state.searchTerm}
            onChange={(val) => dispatch({ type: 'SET_SEARCH_TERM', payload: val })}
            sx={{ minWidth: 240 }}
          />
        </Grid>

        <Grid item>
          <FilterTextField
            label="Category"
            select
            value={state.selectedCategoryId}
            onChange={(val) => dispatch({ type: 'SET_CATEGORY_FILTER', payload: val })}
            options={[
              { value: '', label: 'All' },
              ...categories.map((cat) => ({ value: cat.id, label: cat.name })),
            ]}
            sx={{ minWidth: 240 }}
          />
        </Grid>

        <Grid item>
          <FilterDatePicker
            label="Created After"
            value={state.createdAfter}
            onChange={(date: Dayjs | null) =>
              dispatch({ type: 'SET_CREATED_AFTER', payload: date })
            }
            slotProps={{
              textField: {
                fullWidth: false,
                sx: { minWidth: 240 },
              },
            }}
          />
        </Grid>
      </Grid>
    </FilterLayout>
  );
}
