import React from 'react';
import { Switch, FormControlLabel, SxProps } from '@mui/material';
import { useThemeStore } from '../store/themeStore';

type Props = {
  sx?: SxProps;
};

export default function ThemeToggleButton({ sx }: Props) {
  const { themeSettings, toggleDarkMode } = useThemeStore();

  return (
    <FormControlLabel
      sx={sx}
      control={
        <Switch
          checked={themeSettings.darkMode}
          onChange={toggleDarkMode}
          color="primary"
        />
      }
      label="Dark Mode"
    />
  );
}
