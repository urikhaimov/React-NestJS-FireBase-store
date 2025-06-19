import React from 'react';
import { Controller } from 'react-hook-form';
import TextField from '@mui/material/TextField';

interface ControlledTextFieldProps {
  name: string;
  control: any;
  label: string;
  rules?: any;
  inputProps?: any;
  onChangeFormat?: (value: string) => string;
}

const ControlledTextField: React.FC<ControlledTextFieldProps> = ({
  name,
  control,
  label,
  rules,
  inputProps,
  onChangeFormat,
}) => (
  <Controller
    name={name}
    control={control}
    rules={rules}
    render={({ field, fieldState }) => (
      <TextField
        {...field}
        label={label}
        fullWidth
        error={!!fieldState.error}
        helperText={fieldState.error?.message}
        inputProps={inputProps}
        onChange={(e) => {
          const formatted = onChangeFormat ? onChangeFormat(e.target.value) : e.target.value;
          field.onChange(formatted);
        }}
        value={field.value || ''}
      />
    )}
  />
);
export default ControlledTextField;