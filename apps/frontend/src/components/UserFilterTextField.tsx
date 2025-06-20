import React from 'react';
import { TextField, TextFieldProps, MenuItem } from '@mui/material';

interface Option {
  value: string;
  label: string;
}

interface Props extends Omit<TextFieldProps, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  options?: Option[];
  select?: boolean;
}

export default function UserFilterTextField({
  value,
  onChange,
  options,
  select,
  ...rest
}: Props) {
  return (
    <TextField
      fullWidth
      select={select}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      {...rest}
    >
      {select &&
        options?.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
    </TextField>
  );
}
