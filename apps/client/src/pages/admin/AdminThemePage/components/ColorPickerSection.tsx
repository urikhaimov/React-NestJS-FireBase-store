// src/components/theme/ColorPickerSection.tsx
import React from 'react';
import { Grid, TextField } from '@mui/material';
import { Controller } from 'react-hook-form';

interface Props {
  control: any;
}

export default function ColorPickerSection({ control }: Props) {
  return (
    <>
      <Grid item xs={12} sm={6}>
        <Controller
          name="primaryColor"
          control={control}
          render={({ field }) => (
            <TextField
              label="Primary Color"
              type="color"
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              {...field}
            />
          )}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <Controller
          name="secondaryColor"
          control={control}
          render={({ field }) => (
            <TextField
              label="Secondary Color"
              type="color"
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              {...field}
            />
          )}
        />
      </Grid>
    </>
  );
}
