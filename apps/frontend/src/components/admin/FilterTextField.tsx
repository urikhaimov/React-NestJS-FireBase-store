import { TextField, MenuItem, TextFieldProps } from '@mui/material';

interface FilterTextFieldProps extends Omit<TextFieldProps, 'onChange'> {
  label: string;
  value: string | number;
  onChange: (val: string) => void;
  options?: { value: string | number; label: string }[];
  select?: boolean;
}

export default function FilterTextField({
  label,
  value,
  onChange,
  options,
  select = false,
  ...rest
}: FilterTextFieldProps) {
  return (
    <TextField
      {...rest}
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      select={select}
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
