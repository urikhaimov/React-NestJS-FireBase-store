import React from 'react';
import InputMask from 'react-input-mask';
import { TextField, TextFieldProps } from '@mui/material';
import {
  FieldError,
  FieldErrorsImpl,
  Merge,
  UseFormRegisterReturn,
} from 'react-hook-form';

interface Props extends Omit<TextFieldProps, 'error'> {
  label: string;
  mask: string;
  register: UseFormRegisterReturn;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
}

export default function FormMaskedInput({ label, mask, register, error, ...rest }: Props) {
  return (
    <InputMask {...register} mask={mask}>
      {(inputProps: any) => (
        <TextField
          {...inputProps}
          fullWidth
          label={label}
          error={!!error}
          helperText={error?.message}
          {...rest}
        />
      )}
    </InputMask>
  );
}
