import { useState } from 'react';
import {
  Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography
} from '@mui/material';
import { ThemeSettings } from '../api/theme';

type Props = {
  initialTheme: ThemeSettings;
  onSave: (theme: ThemeSettings) => void;
  isSaving: boolean;
};

const fontOptions = ['Roboto', 'Arial', 'Georgia', 'Comic Sans MS'];

function ThemeForm({ initialTheme, onSave, isSaving }: Props) {
  const [theme, setTheme] = useState(initialTheme);

  const handleChange = (field: keyof ThemeSettings) => (e: any) => {
    setTheme((prev) => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <FormControl fullWidth>
        <InputLabel>Mode</InputLabel>
        <Select value={theme.mode} onChange={handleChange('mode')} label="Mode">
          <MenuItem value="light">Light</MenuItem>
          <MenuItem value="dark">Dark</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="Primary Color"
        type="color"
        value={theme.primaryColor}
        onChange={handleChange('primaryColor')}
      />
      <TextField
        label="Secondary Color"
        type="color"
        value={theme.secondaryColor}
        onChange={handleChange('secondaryColor')}
      />

      <FormControl fullWidth>
        <InputLabel>Font</InputLabel>
        <Select value={theme.fontFamily} onChange={handleChange('fontFamily')} label="Font">
          {fontOptions.map((font) => (
            <MenuItem key={font} value={font}>
              {font}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button variant="contained" onClick={() => onSave(theme)} disabled={isSaving}>
        {isSaving ? 'Saving...' : 'Save Changes'}
      </Button>
    </Box>
  );
}
export default ThemeForm;
