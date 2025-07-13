import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Typography,
  Stack,
  MenuItem,
} from '@mui/material';
import { themePresets, loadGoogleFont } from '../../../constants/themePresets';
import { useThemeSettings, useUpdateThemeSettingsMutation } from '../../../hooks/useThemeHooks';
import { ThemeSettings } from '../../../api/theme';

export default function AdminThemePage() {
  const { data, isLoading } = useThemeSettings();
  const { mutate, isPending } = useUpdateThemeSettingsMutation();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ThemeSettings>({
    defaultValues: data,
  });

  const selectedFont = watch('fontFamily');

  // Load Google font on fontFamily change
  useEffect(() => {
    if (selectedFont) loadGoogleFont(selectedFont);
  }, [selectedFont]);

  // Reset form when data is loaded
  useEffect(() => {
    if (data) reset(data);
  }, [data, reset]);

  const onSubmit = (values: ThemeSettings) => {
    mutate(values);
  };

  const applyPreset = (presetName: keyof typeof themePresets) => {
    const preset = themePresets[presetName];
    reset(preset);
    loadGoogleFont(preset.fontFamily);
  };

  if (isLoading || !data) {
    return <Typography sx={{ p: 3 }}>Loading theme settings...</Typography>;
  }

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>Edit Theme</Typography>

      <Stack direction="row" spacing={2} mb={3}>
        {Object.keys(themePresets).map((key) => (
          <Button
            key={key}
            variant="outlined"
            onClick={() => applyPreset(key as keyof typeof themePresets)}
          >
            {key}
          </Button>
        ))}
      </Stack>

      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2} maxWidth={500}>
          <Controller
            name="primaryColor"
            control={control}
            rules={{ required: 'Primary color is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Primary Color"
                error={!!errors.primaryColor}
                helperText={errors.primaryColor?.message}
              />
            )}
          />
          <Controller
            name="secondaryColor"
            control={control}
            rules={{ required: 'Secondary color is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Secondary Color"
                error={!!errors.secondaryColor}
                helperText={errors.secondaryColor?.message}
              />
            )}
          />
          <Controller
            name="fontFamily"
            control={control}
            rules={{ required: 'Font is required' }}
            render={({ field }) => (
              <TextField select label="Font" {...field}>
                <MenuItem value="Roboto">Roboto</MenuItem>
                <MenuItem value="Open Sans">Open Sans</MenuItem>
                <MenuItem value="Inter">Inter</MenuItem>
                <MenuItem value="Orbitron">Orbitron</MenuItem>
              </TextField>
            )}
          />
          <Controller
            name="darkMode"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Switch {...field} checked={field.value} />}
                label="Dark Mode"
              />
            )}
          />
          <Button type="submit" variant="contained" disabled={isPending}>
            {isPending ? 'Saving...' : 'Save Theme'}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
