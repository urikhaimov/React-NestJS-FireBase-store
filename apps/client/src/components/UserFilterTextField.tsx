import React from 'react';
import { TextField, MenuItem, TextFieldProps } from '@mui/material';

interface Option {
  label: string;
  value: string;
}

interface Props extends Omit<TextFieldProps, 'onChange' | 'value'> {
  label?: string;
  value: string | number; // ✅ fixed: supports number or string
  onChange: (val: string) => void;
  select?: boolean;
  options?: Option[];
  fullWidth?: boolean;
  type?: 'text' | 'number'; // optional for number input
}

export default function UserFilterTextField({
  label,
  value,
  onChange,
  select = false,
  options = [],
  fullWidth = false,
  type = 'text',
  ...rest
}: Props) {
  return (
    <TextField
      label={label}
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      select={select}
      fullWidth={fullWidth}
      type={type}
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
