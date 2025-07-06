// src/pages/admin/AdminThemePage.tsx
import React, { useEffect, useReducer } from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Switch,
  FormControlLabel,
  Snackbar,
  Alert,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { useThemeStore } from '../../../store/themeStore';
import LogoUploader from '../../../components/LogoUploader';
import BackgroundUploader from '../../../components/BackgroundUploader';
import ThemePreviewCard from '../../../components/ThemePreviewCard';
import ThemeImportExportPanel from '../../../components/ThemeImportExportPanel';
import LoadingProgress from '../../../components/LoadingProgress';

const FONT_OPTIONS = ['Roboto', 'Open Sans', 'Montserrat', 'Poppins'];

const initialState = {
  loading: true,
  toastOpen: false,
};

type UIState = typeof initialState;
type Action =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_TOAST'; payload: boolean };

function reducer(state: UIState, action: Action): UIState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_TOAST':
      return { ...state, toastOpen: action.payload };
    default:
      return state;
  }
}

export default function AdminThemePage() {
  const { themeSettings, updateTheme } = useThemeStore();
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
  const [state, dispatch] = useReducer(reducer, initialState);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty, isSubmitting },
  } = useForm({
    defaultValues: themeSettings,
  });

useEffect(() => {
  const fetchTheme = async () => {
    try {
      const docRef = doc(db, 'theme', 'settings');
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        const data = snapshot.data();
        reset(data);        // updates form values
        updateTheme(data); // updates global store
      }
    } catch (err) {
      console.error('Failed to load theme:', err);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  fetchTheme();
}, [reset, updateTheme]);

  const onSubmit = async (form: any) => {
    const docRef = doc(db, 'theme', 'settings'); // global path
    await setDoc(docRef, form, { merge: true });
    updateTheme(form);
    dispatch({ type: 'SET_TOAST', payload: true });
  };

  if (state.loading) return <LoadingProgress />;

  return (
    <Box
      sx={{
        p: isMobile ? 2 : 4,
        height: '60vh',
        overflowY: 'auto',
        maxHeight: 'calc(100vh - 64px)',
      }}
    >
      <Typography variant="h5" gutterBottom>
        Customize Your Store Theme
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Controller
              name="storeName"
              control={control}
              render={({ field }) => (
                <TextField label="Store Name" fullWidth {...field} />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="darkMode"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Switch {...field} checked={field.value} />}
                  label="Enable Dark Mode"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="primaryColor"
              control={control}
              render={({ field }) => (
                <TextField
                  label="Primary Color"
                  type="color"
                  fullWidth
                  {...field}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="secondaryColor"
              control={control}
              render={({ field }) => (
                <TextField
                  label="Secondary Color"
                  type="color"
                  fullWidth
                  {...field}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Font</InputLabel>
              <Controller
                name="font"
                control={control}
                render={({ field }) => (
                  <Select {...field} label="Font">
                    {FONT_OPTIONS.map((font) => (
                      <MenuItem key={font} value={font}>
                        {font}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="homepageLayout"
              control={control}
              render={({ field }) => (
                <TextField select label="Homepage Layout" fullWidth {...field}>
                  <MenuItem value="hero">Hero</MenuItem>
                  <MenuItem value="carousel">Carousel</MenuItem>
                  <MenuItem value="grid">Grid</MenuItem>
                </TextField>
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="logoUrl"
              control={control}
              render={({ field }) => (
                <LogoUploader value={field.value} onChange={field.onChange} />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="backgroundImageUrl"
              control={control}
              render={({ field }) => (
                <BackgroundUploader
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <ThemePreviewCard />
          </Grid>

          <Grid item xs={12}>
            <ThemeImportExportPanel />
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              fullWidth={isMobile}
              disabled={!isDirty || isSubmitting}
            >
              Save Theme
            </Button>
          </Grid>
        </Grid>
      </form>

      <Snackbar
        open={state.toastOpen}
        autoHideDuration={1500}
        onClose={() => dispatch({ type: 'SET_TOAST', payload: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled">
          Theme updated successfully
        </Alert>
      </Snackbar>
    </Box>
  );
}
