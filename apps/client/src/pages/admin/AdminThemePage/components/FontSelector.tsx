// src/components/theme/FontSelector.tsx
import React, { useEffect } from 'react';
import { Grid, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { Controller } from 'react-hook-form';
const FONT_OPTIONS = [
  'Roboto',
  'Open Sans',
  'Montserrat',
  'Poppins',
  'Lato',
  'Inter',
  'Rubik',
  'Nunito',
  'Work Sans',
  'Raleway',
  'Merriweather',
  'Ubuntu',
  'Manrope',
];

interface Props {
  control: any;
}

function loadGoogleFont(font: string) {
  const formatted = font.replace(/ /g, '+');
  const href = `https://fonts.googleapis.com/css2?family=${formatted}:wght@400;500;600;700&display=swap`;

  if (!document.querySelector(`link[href="${href}"]`)) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }
}

export default function FontSelector({ control }: Props) {
  return (
    <Grid item xs={12} sm={6}>
      <FormControl fullWidth>
        <InputLabel>Font</InputLabel>
        <Controller
          name="font"
          control={control}
          render={({ field }) => {
            const { value, onChange } = field;

            useEffect(() => {
              if (value) loadGoogleFont(value);
            }, [value]);

            return (
              <Select label="Font" value={value} onChange={onChange}>
                {FONT_OPTIONS.map((font) => (
                  <MenuItem key={font} value={font} style={{ fontFamily: font }}>
                    {font}
                  </MenuItem>
                ))}
              </Select>
            );
          }}
        />
      </FormControl>
    </Grid>
  );
}
