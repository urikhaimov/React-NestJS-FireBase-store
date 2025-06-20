import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Dayjs } from 'dayjs';
import { TextFieldProps } from '@mui/material';

interface FilterDatePickerProps {
  label?: string;
  value: Dayjs | null;
  onChange: (value: Dayjs | null) => void;
  slotProps?: {
    textField?: Partial<TextFieldProps>;
  };
}

export default function FilterDatePicker(props: any) {
  return (
    <DatePicker
      {...props}
      slotProps={{
        ...props.slotProps,
        textField: {
          fullWidth: true,
          ...(props.slotProps?.textField || {}),
        },
      }}
    />
  );
}