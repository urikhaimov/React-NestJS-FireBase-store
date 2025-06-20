import React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Dayjs } from 'dayjs';

interface Props {
  label?: string;
  value: Dayjs | null;
  onChange: (date: Dayjs | null) => void;
}

export default function UserFilterDatePicker({ label, value, onChange }: Props) {
  return (
    <DatePicker
      label={label}
      value={value}
      onChange={onChange}
      slotProps={{ textField: { fullWidth: true } }}
    />
  );
}
