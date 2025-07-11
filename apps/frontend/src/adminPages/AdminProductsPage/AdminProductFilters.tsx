import React, { useState } from 'react';
import { Box, Button, Grid } from '@mui/material';
import { Dayjs } from 'dayjs';
import { Category } from '../../hooks/useAllCategories';
import { State, Action } from './LocalReducer';
import AdminFilterLayout from '../../components/admin/AdminFilterLayout';
import FilterTextField from '../../components/admin/FilterTextField';
import FilterDatePicker from '../../components/admin/FilterDatePicker';

export interface ProductFiltersProps {
  state: State;
  dispatch: React.Dispatch<Action>;
  categories: Category[];
  onAddProduct: () => void;
}

export default function AdminProductFilters({
  state,
  dispatch,
  categories,
  onAddProduct,
}: ProductFiltersProps) {
  const [showFilters, setShowFilters] = useState(false); // 👈 start collapsed

  const hasFilters =
    state.searchTerm || state.selectedCategoryId || state.createdAfter;

  const toggleFilters = () => setShowFilters((prev) => !prev);

  return (
    <AdminFilterLayout
      title="Filters"
      hasFilters={!!hasFilters}
      onClear={() => dispatch({ type: 'RESET_FILTERS' })}
      actions={
        <Box display="flex" gap={2}>
          <Button variant="contained" onClick={onAddProduct}>
            Add Product
          </Button>
          <Button variant="outlined" onClick={toggleFilters}>
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
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
      }
    >
      {showFilters ? (
        <Grid container spacing={2}>
          <Grid item>
            <FilterTextField
              label="Search products"
              value={state.searchTerm}
              onChange={(val) =>
                dispatch({ type: 'SET_SEARCH_TERM', payload: val })
              }
              sx={{ minWidth: 240 }}
            />
          </Grid>

          <Grid item>
            <FilterTextField
              label="Category"
              select
              value={state.selectedCategoryId}
              onChange={(val) =>
                dispatch({ type: 'SET_CATEGORY_FILTER', payload: val })
              }
              options={[
                { value: '', label: 'All' },
                ...categories.map((cat) => ({
                  value: cat.id,
                  label: cat.name,
                })),
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
      ) : (
        hasFilters && (
          <Box mt={1} ml={1} fontStyle="italic" fontSize="0.9rem">
            Filters are active. Click "Show Filters" to edit.
          </Box>
        )
      )}
    </AdminFilterLayout>
  );
}
