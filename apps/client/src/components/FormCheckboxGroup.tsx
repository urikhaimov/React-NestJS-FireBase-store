import {
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  FormHelperText,
} from '@mui/material';
import React from 'react';
import { FieldError, UseFormRegister } from 'react-hook-form';

type Option = {
  label: string;
  value: string;
};

type Props = {
  label: string;
  name: string;
  options: Option[];
  register: UseFormRegister<any>;
  error?: FieldError;
};

export default function FormCheckboxGroup({ label, name, options, register, error }: Props) {
  return (
    <FormControl component="fieldset" error={!!error} variant="standard">
      <FormLabel component="legend">{label}</FormLabel>
      <FormGroup>
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            control={
              <Checkbox
                value={option.value}
                {...register(name)}
              />
            }
            label={option.label}
          />
        ))}
      </FormGroup>
      {error && <FormHelperText>{error.message?.toString()}</FormHelperText>}
    </FormControl>
  );
}
