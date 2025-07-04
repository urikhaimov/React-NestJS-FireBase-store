import React, { useState } from 'react';
import {
  Grid,
  Button,
  Box,
  Checkbox,
  FormControlLabel,
  Typography,
} from '@mui/material';
import { Dayjs } from 'dayjs';
import { Category } from '../../types/firebase';
import { State, Action } from '../ProductsPage/LocalReducer';
import UserFilterLayout from '../../components/UserFilterLayout';
import UserFilterTextField from '../../components/UserFilterTextField';
import UserFilterDatePicker from '../../components/UserFilterDatePicker';

interface Props {
  state: State;
  dispatch: React.Dispatch<Action>;
  categories: Category[];
}

export default function UserProductFilters({ state, dispatch, categories }: Props) {
  const [showFilters, setShowFilters] = useState(false);

  const hasFilters =
    state.search ||
    state.selectedCategoryId ||
    state.createdAfter ||
    state.minPrice !== null ||
    state.maxPrice !== null ||
    state.inStockOnly;

  const toggleFilters = () => setShowFilters((prev) => !prev);

  return (
    <UserFilterLayout
      title="Filters"
      collapsedByDefault={!hasFilters}
      actions={
        <Box display="flex" gap={2}>
          <Button variant="outlined" onClick={toggleFilters}>
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => dispatch({ type: 'RESET_FILTERS' })}
          >
            Reset
          </Button>
        </Box>
      }
    >
      {showFilters ? (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <UserFilterTextField
              label="Search"
              value={state.search}
              onChange={(val) => dispatch({ type: 'SET_SEARCH', payload: val })}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <UserFilterTextField
              label="Category"
              select
              fullWidth
              value={state.selectedCategoryId}
              onChange={(val) =>
                dispatch({ type: 'SET_CATEGORY', payload: val })
              }
              options={[
                { value: '', label: 'All' },
                ...categories.map((cat) => ({
                  value: cat.id,
                  label: cat.name,
                })),
              ]}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <UserFilterDatePicker
              label="Created After"
              value={state.createdAfter}
              fullWidth
              onChange={(date: Dayjs | null) =>
                dispatch({ type: 'SET_CREATED_AFTER', payload: date })
              }
            />
          </Grid>

          <Grid item xs={6} sm={3}>
            <UserFilterTextField
              label="Min Price"
              type="number"
              value={state.minPrice ?? ''}
              onChange={(val) =>
                dispatch({
                  type: 'SET_MIN_PRICE',
                  payload: val ? Number(val) : null,
                })
              }
              fullWidth
            />
          </Grid>

          <Grid item xs={6} sm={3}>
            <UserFilterTextField
              label="Max Price"
              type="number"
              value={state.maxPrice ?? ''}
              onChange={(val) =>
                dispatch({
                  type: 'SET_MAX_PRICE',
                  payload: val ? Number(val) : null,
                })
              }
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={state.inStockOnly}
                  onChange={(e) =>
                    dispatch({
                      type: 'SET_IN_STOCK_ONLY',
                      payload: e.target.checked,
                    })
                  }
                />
              }
              label="In Stock Only"
            />
          </Grid>
        </Grid>
      ) : (
        hasFilters && (
          <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
            Filters are active. Click "Show Filters" to edit.
          </Typography>
        )
      )}
    </UserFilterLayout>
  );
}
