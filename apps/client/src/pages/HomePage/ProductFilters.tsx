import React from 'react';
import { Grid } from '@mui/material';
import { Dayjs } from 'dayjs';
import { Category } from '../../types/firebase';
import { State, Action } from './LocalReducer';
import UserFilterLayout from '../../components/UserFilterLayout';
import UserFilterTextField from '../../components/UserFilterTextField';
import UserFilterDatePicker from '../../components/UserFilterDatePicker';

interface Props {
  state: State;
  dispatch: React.Dispatch<Action>;
  categories: Category[];
}

export default function ProductFilters({ state, dispatch, categories }: Props) {
  const hasFilters =
    state.search || state.selectedCategoryId || state.createdAfter;

  return (
    <UserFilterLayout title="Filters" collapsedByDefault={!hasFilters}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <UserFilterTextField
            label="Search"
            value={state.search}
            onChange={(val) => dispatch({ type: 'SET_SEARCH', payload: val })}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <UserFilterTextField
            label="Category"
            select
            value={state.selectedCategoryId}
            onChange={(val) => dispatch({ type: 'SET_CATEGORY', payload: val })}
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
            onChange={(date: Dayjs | null) =>
              dispatch({ type: 'SET_CREATED_AFTER', payload: date })
            }
          />
        </Grid>
      </Grid>
    </UserFilterLayout>
  );
}
