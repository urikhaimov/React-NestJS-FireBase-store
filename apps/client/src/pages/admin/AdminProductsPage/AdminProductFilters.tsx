import React from 'react';
import { Box, Stack, Divider } from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { Dayjs } from 'dayjs';
import { Category } from '../../../hooks/useAllCategories';
import { State, Action } from './LocalReducer';
import FilterTextField from '../../../components/admin/FilterTextField';
import FilterDatePicker from '../../../components/admin/FilterDatePicker';

export interface ProductFiltersProps {
  state: State;
  dispatch: React.Dispatch<Action>;
  categories: Category[];
}

export default function AdminProductFilters({
  state,
  dispatch,
  categories,
}: ProductFiltersProps) {
  return (
    <Box pr={1}>
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
  );
}
