import React from 'react';
import { TextField, MenuItem, TextFieldProps } from '@mui/material';

interface Option {
  label: string;
  value: string;
}

interface Props extends Omit<TextFieldProps, 'onChange' | 'value'> {
  label?: string;
  value: string;
  onChange: (val: string) => void;
  select?: boolean;
  options?: Option[];
  fullWidth?: boolean; // ✅ Add this
}

export default function UserFilterTextField({
  label,
  value,
  onChange,
  select = false,
  options = [],
  fullWidth = false,
  ...rest
}: Props) {
  return (
    <TextField
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      select={select}
      fullWidth={fullWidth} // ✅ Apply fullWidth
      {...rest}
    >
      {select &&
        options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
    </TextField>
  );
}
