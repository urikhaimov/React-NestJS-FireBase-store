import {
  Card,
  CardContent,
  CardHeader,
  Box,
  Button,
  FormControlLabel,
  Switch,
  TextField,
  Typography
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useThemeSettings } from './useThemeSettings';
import PageWithStickyFilters from '../../../layouts/PageWithStickyFilters';
type ThemeFormValues = {
  primaryColor: string;
  secondaryColor: string;
  font: string;
  darkMode: boolean;
}

export function ThemePanel() {
  const { data: theme, saveTheme, isSaving } = useThemeSettings();

  const { register, handleSubmit, reset } = useForm<ThemeFormValues>({
    defaultValues: theme ?? {
      primaryColor: '#1976d2',
      secondaryColor: '#f50057',
      font: 'Roboto',
      darkMode: false,
    },
  });

  const onSubmit = (data: ThemeFormValues) => {
    saveTheme(data);
  };

  return (
    <PageWithStickyFilters>
         <Typography variant="h4" gutterBottom>
        {'Theme Settings'}
      </Typography>
      <Box p={3}>
        <Card>
          <CardHeader title="Admin Dashboard – Theme Manager" />
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                label="Primary Color"
                type="color"
                fullWidth
                margin="normal"
                {...register('primaryColor')}
              />
              <TextField
                label="Secondary Color"
                type="color"
                fullWidth
                margin="normal"
                {...register('secondaryColor')}
              />
              <TextField
                label="Font"
                fullWidth
                margin="normal"
                {...register('font')}
              />
              <FormControlLabel
                control={<Switch {...register('darkMode')} />}
                label="Dark Mode"
              />
              <Box mt={2}>
                <Button type="submit" variant="contained" disabled={isSaving}>
                  Save Theme
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Box>
    </PageWithStickyFilters >
  );
}
