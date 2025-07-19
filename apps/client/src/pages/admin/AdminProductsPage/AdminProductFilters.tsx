import React, { useState } from 'react';
import {
  Box,
  Button,
  Stack,
  Divider,
  useMediaQuery,
  useTheme,
  Fab,
} from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { Dayjs } from 'dayjs';
import { Category } from '../../../hooks/useAllCategories';
import { State, Action } from './LocalReducer';
import AdminFilterLayout from '../../../components/AdminFilterLayout';
import FilterTextField from '../../../components/admin/FilterTextField';
import FilterDatePicker from '../../../components/admin/FilterDatePicker';

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
  const [showFilters, setShowFilters] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const hasFilters =
    !!state.searchTerm || !!state.selectedCategoryId || !!state.createdAfter;

  const toggleFilters = () => setShowFilters((prev) => !prev);

  return (
    <AdminFilterLayout
      hasFilters={hasFilters}
      onClear={() => dispatch({ type: 'RESET_FILTERS' })}
      actions={
        <Box
          display="flex"
          flexDirection={isMobile ? 'column' : 'row'}
          gap={1}
          alignItems="flex-start"
        >
          <Button variant="contained" onClick={onAddProduct} fullWidth={isMobile}>
            Add Product
          </Button>
          <Button variant="outlined" onClick={toggleFilters} fullWidth={isMobile}>
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
          {hasFilters && (
            <Button
              variant="outlined"
              color="warning"
              onClick={() => dispatch({ type: 'RESET_FILTERS' })}
              fullWidth={isMobile}
            >
              Reset
            </Button>
          )}
        </Box>
      }
    >
      {/* Always render filters. Mobile: always shown in drawer. Desktop: toggle visibility */}
      <Box
        sx={{
          ...(isMobile
            ? { p: 0 }
            : {
                display: showFilters ? 'block' : 'none',
                overflowY: 'auto',
                pr: 1,
              }),
        }}
      >
        <Stack spacing={2} mt={1}>
          <Divider flexItem />

          <FilterTextField
            label="Search products"
            value={state.searchTerm}
            onChange={(val) =>
              dispatch({ type: 'SET_SEARCH_TERM', payload: val })
            }
            fullWidth
          />

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
            fullWidth
          />

          <FilterDatePicker
            label="Created After"
            value={state.createdAfter}
            onChange={(date: Dayjs | null) =>
              dispatch({ type: 'SET_CREATED_AFTER', payload: date })
            }
            slotProps={{
              textField: {
                fullWidth: true,
              },
            }}
          />
        </Stack>
      </Box>

      {!showFilters && !isMobile && hasFilters && (
        <Box mt={1} ml={1} fontStyle="italic" fontSize="0.9rem" color="text.secondary">
          Filters are active. Click "Show Filters" to edit.
        </Box>
      )}

      {isMobile && hasFilters && (
        <Fab
          color="warning"
          size="medium"
          aria-label="reset"
          onClick={() => dispatch({ type: 'RESET_FILTERS' })}
          sx={{
            position: 'fixed',
            bottom: 80,
            right: 16,
            zIndex: 1300,
          }}
        >
          <RestartAltIcon />
        </Fab>
      )}
    </AdminFilterLayout>
  );
}
