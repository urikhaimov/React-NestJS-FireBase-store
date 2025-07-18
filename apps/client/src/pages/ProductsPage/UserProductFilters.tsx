// src/pages/ProductsPage/UserProductFilters.tsx
import React, { useState } from 'react';
import {
  Box,
  Button,
  Stack,
  useMediaQuery,
  useTheme,
  TextField,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { headerHeight, footerHeight } from '../../config/themeConfig';
import { State, Action } from './LocalReducer';
import FilterLayout from '../../components/UserFilterLayout';
import { Category } from '../../types/firebase';
interface Props {
  state: State;
  dispatch: React.Dispatch<Action>;
  hasFilters: boolean;
  categories: Category[]; // ✅ Add this li
}

export default function UserProductFilters({
  state,
  dispatch,
  hasFilters,
}: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [showFilters, setShowFilters] = useState(!isMobile);

  return (
    <FilterLayout
      hasFilters={hasFilters}
      actions={
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          {/* Show/Hide Filters Button on the left */}
          <Button
            variant="outlined"
            onClick={() => setShowFilters((prev) => !prev)}
            size="small"
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>

          {/* Reset button on the right (or hide on mobile) */}
          {!isMobile && hasFilters && (
            <Button
              variant="text"
              color="warning"
              onClick={() => dispatch({ type: 'RESET_FILTERS' })}
              size="small"
            >
              Reset
            </Button>
          )}
        </Box>
      }
    >
      {showFilters && (
        <Box
          sx={{
            height: isMobile
              ? `calc(100vh - ${headerHeight + footerHeight + 140}px)`
              : 'auto',
            overflowY: isMobile ? 'auto' : 'visible',
            pr: 1,
          }}
        >
          <Stack spacing={2}>
            <TextField
              size="small"
              label="Search"
              value={state.search}
              onChange={(e) =>
                dispatch({ type: 'SET_SEARCH', payload: e.target.value })
              }
              fullWidth
            />

            <TextField
              size="small"
              label="Min Price"
              type="number"
              value={state.minPrice ?? ''}
              onChange={(e) =>
                dispatch({
                  type: 'SET_MIN_PRICE',
                  payload: e.target.value ? +e.target.value : null,
                })
              }
              fullWidth
            />

            <TextField
              size="small"
              label="Max Price"
              type="number"
              value={state.maxPrice ?? ''}
              onChange={(e) =>
                dispatch({
                  type: 'SET_MAX_PRICE',
                  payload: e.target.value ? +e.target.value : null,
                })
              }
              fullWidth
            />

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
          </Stack>
        </Box>
      )}
    </FilterLayout>
  );
}
