// src/components/theme/DarkModeToggle.tsx
import React from 'react';
import { Grid, FormControlLabel, Switch } from '@mui/material';
import { Controller } from 'react-hook-form';

interface Props {
  control: any;
}

export default function DarkModeToggle({ control }: Props) {
  return (
    <Grid item xs={12}>
      <Controller
        name="darkMode"
        control={control}
        render={({ field }) => (
          <FormControlLabel
            control={<Switch {...field} checked={field.value} />}
            label="Enable Dark Mode"
          />
        )}
      />
    </Grid>
  );
}
