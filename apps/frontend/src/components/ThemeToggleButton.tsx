// src/components/ThemeToggleButton.tsx
import { Switch, FormControlLabel, SxProps } from '@mui/material';
import { useThemeContext } from '../context/ThemeContext';
import React from 'react';

type Props = {
  sx?: SxProps; // <-- add this
};

export default function ThemeToggleButton({ sx }: Props) {
  const { mode, toggleMode } = useThemeContext();

  return (
    <FormControlLabel
      sx={sx} // <-- apply it
      control={
        <Switch checked={mode === 'dark'} onChange={toggleMode} color="primary" />
      }
      label="Dark Mode"
    />
  );
}
