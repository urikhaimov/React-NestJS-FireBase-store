// src/components/theme/ThemeEditorForm.tsx
import React, { useEffect } from 'react';
import {
  Box, Button, Stack, TextField, MenuItem, Typography, Switch, FormControlLabel,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { themePresets } from '../constants/themePresets';
import { ThemeSettings } from '../api/theme';
import { useThemeSettings, useUpdateThemeSettingsMutation } from '../hooks/useThemeHooks';

const fontOptions = [
  'Roboto, sans-serif',
  'Open Sans, sans-serif',
  'Inter, sans-serif',
  'Orbitron, sans-serif',
  'Poppins, sans-serif',
];

const maxWidthOptions = ['1024px', '1280px', '1440px', '1600px'];

const defaultValues: ThemeSettings = {
  primaryColor: '#1976d2',
  secondaryColor: '#dc004e',
  darkMode: false,
  fontFamily: 'Roboto, sans-serif',
  maxWidth: '1280px',
};

export default function ThemeEditorForm() {
  const { data, isLoading } = useThemeSettings();
  const { mutate: updateTheme } = useUpdateThemeSettingsMutation();

  const {
    control, handleSubmit, reset, watch,
    formState: { errors, isSubmitting },
  } = useForm<ThemeSettings>({ defaultValues });

  useEffect(() => {
    if (data) reset(data);
  }, [data, reset]);

  const onSubmit = (values: ThemeSettings) => {
    updateTheme(values);
  };

  const handlePresetChange = (presetKey: string) => {
    const preset = themePresets[presetKey];
    if (preset) {
      reset({ ...preset, maxWidth: '1280px' });
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ maxWidth: 600, mx: 'auto', p: 2 }}>
      <Typography variant="h5" mb={2}>🎨 Theme Settings</Typography>

      <Stack spacing={2}>
        {/* Preset Selector */}
        <TextField
          select
          label="Theme Preset"
          defaultValue=""
          onChange={(e) => handlePresetChange(e.target.value)}
        >
          <MenuItem value="">Select a preset</MenuItem>
          {Object.keys(themePresets).map((key) => (
            <MenuItem key={key} value={key}>
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </MenuItem>
          ))}
        </TextField>

        {/* Primary Color */}
        <Controller
          name="primaryColor"
          control={control}
          rules={{ required: 'Primary color is required' }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Primary Color"
              type="color"
              error={!!errors.primaryColor}
              helperText={errors.primaryColor?.message}
              fullWidth
            />
          )}
        />

        {/* Secondary Color */}
        <Controller
          name="secondaryColor"
          control={control}
          rules={{ required: 'Secondary color is required' }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Secondary Color"
              type="color"
              error={!!errors.secondaryColor}
              helperText={errors.secondaryColor?.message}
              fullWidth
            />
          )}
        />

        {/* Font Family */}
        <Controller
          name="fontFamily"
          control={control}
          rules={{ required: 'Font is required' }}
          render={({ field }) => (
            <TextField
              {...field}
              select
              label="Font Family"
              error={!!errors.fontFamily}
              helperText={errors.fontFamily?.message}
              fullWidth
            >
              {fontOptions.map((font) => (
                <MenuItem key={font} value={font}>
                  {font.split(',')[0]}
                </MenuItem>
              ))}
            </TextField>
          )}
        />

        {/* Max Width */}
        <Controller
          name="maxWidth"
          control={control}
          rules={{ required: 'Max width is required' }}
          render={({ field }) => (
            <TextField
              {...field}
              select
              label="Max Width"
              error={!!errors.maxWidth}
              helperText={errors.maxWidth?.message}
              fullWidth
            >
              {maxWidthOptions.map((size) => (
                <MenuItem key={size} value={size}>{size}</MenuItem>
              ))}
            </TextField>
          )}
        />

        {/* Dark Mode */}
        <Controller
          name="darkMode"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={<Switch {...field} checked={field.value ?? false} onChange={(e) => field.onChange(e.target.checked)} />}
              label="Enable Dark Mode"
            />
          )}
        />

        {/* Submit */}
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          Save Theme
        </Button>
      </Stack>
    </Box>
  );
}
