import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import {
  FieldError,
  FieldErrorsImpl,
  Merge,
  UseFormRegisterReturn,
} from 'react-hook-form';

interface Props extends Omit<TextFieldProps, 'error'> {
  label: string;
  register: UseFormRegisterReturn;
  errorObject?: FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
}

export default function FormTextField({
  label,
  register,
  errorObject,
  ...rest
}: Props) {
  return (
    <TextField
      {...register}
      fullWidth
      label={label}
      error={!!errorObject}
      helperText={typeof errorObject?.message === 'string' ? errorObject.message : ''}
      {...rest}
    />
  );
}
