// src/components/FormSelect.tsx
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  FormHelperText,
  SelectProps,
} from '@mui/material';
import { FieldError, UseFormRegisterReturn } from 'react-hook-form';
import React from 'react';

type Props = {
  label: string;
  options: { value: string; label: string }[];
  register: UseFormRegisterReturn;
  error?: FieldError;
} & Omit<SelectProps, 'native'>;

export default function FormSelect({ label, options, register, error, ...rest }: Props) {
  return (
    <FormControl fullWidth error={!!error}>
      <InputLabel>{label}</InputLabel>
      <Select label={label} {...register} {...rest}>
        {options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>{error?.message?.toString()}</FormHelperText>
    </FormControl>
  );
}
