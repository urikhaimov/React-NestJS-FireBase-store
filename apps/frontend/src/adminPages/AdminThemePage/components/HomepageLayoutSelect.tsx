// src/components/theme/HomepageLayoutSelect.tsx
import React from 'react';
import { Grid, TextField, MenuItem } from '@mui/material';
import { Controller } from 'react-hook-form';

interface Props {
  control: any;
}

export default function HomepageLayoutSelect({ control }: Props) {
  return (
    <Grid item xs={12} sm={6}>
      <Controller
        name="homepageLayout"
        control={control}
        render={({ field }) => (
          <TextField
            select
            label="Homepage Layout"
            fullWidth
            variant="outlined"
            {...field}
          >
            <MenuItem value="hero">Hero</MenuItem>
            <MenuItem value="carousel">Carousel</MenuItem>
            <MenuItem value="grid">Grid</MenuItem>
          </TextField>
        )}
      />
    </Grid>
  );
}
