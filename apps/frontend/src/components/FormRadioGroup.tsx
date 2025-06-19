// src/components/FormRadioGroup.tsx
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
} from '@mui/material';
import React from 'react';
import { FieldError, UseFormRegisterReturn } from 'react-hook-form';

type Props = {
  label: string;
  options: { value: string; label: string }[];
  register: UseFormRegisterReturn;
  error?: FieldError;
};

export default function FormRadioGroup({ label, options, register, error }: Props) {
  return (
    <FormControl component="fieldset" error={!!error}>
      <FormLabel component="legend">{label}</FormLabel>
      <RadioGroup row>
        {options.map((opt) => (
          <FormControlLabel
            key={opt.value}
            value={opt.value}
            control={<Radio {...register} />}
            label={opt.label}
          />
        ))}
      </RadioGroup>
      <FormHelperText>{error?.message?.toString()}</FormHelperText>
    </FormControl>
  );
}
