// src/components/theme/StoreNameField.tsx
import React from 'react';
import { Grid, TextField } from '@mui/material';
import { Controller } from 'react-hook-form';

interface Props {
  control: any;
}

export default function StoreNameField({ control }: Props) {
  return (
    <Grid item xs={12}>
      <Controller
        name="storeName"
        control={control}
        render={({ field }) => (
          <TextField label="Store Name" fullWidth variant="outlined" {...field} />
        )}
      />
    </Grid>
  );
}
