// src/components/FormCheckbox.tsx
import {
  Checkbox,
  FormControlLabel,
  FormHelperText,
  FormGroup,
} from '@mui/material';
import React from 'react';
import { FieldError, UseFormRegisterReturn } from 'react-hook-form';

type Props = {
  label: string;
  register: UseFormRegisterReturn;
  error?: FieldError;
};

export default function FormCheckbox({ label, register, error }: Props) {
  return (
    <FormGroup>
      <FormControlLabel control={<Checkbox {...register} />} label={label} />
      {error && <FormHelperText error>{error.message?.toString()}</FormHelperText>}
    </FormGroup>
  );
}
