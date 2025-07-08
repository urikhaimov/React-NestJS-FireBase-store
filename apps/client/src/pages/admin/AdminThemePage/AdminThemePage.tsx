// src/pages/admin/AdminThemePage.tsx
import { useEffect, useReducer } from 'react';
import { Grid, Button, Snackbar, Alert, useMediaQuery, useTheme } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { useThemeStore } from '../../../store/themeStore';
import LoadingProgress from '../../../components/LoadingProgress';
import LogoUploader from '../../../components/LogoUploader';
import BackgroundUploader from '../../../components/BackgroundUploader';
import ThemePreviewCard from '../../../components/ThemePreviewCard';
import ThemeImportExportPanel from '../../../components/ThemeImportExportPanel';
import StoreNameField from './components/StoreNameField';
import DarkModeToggle from './components/DarkModeToggle';
import ColorPickerSection from './components/ColorPickerSection';
import FontSelectorWithControls  from './components/FontSelectorWithControls';
import HomepageLayoutSelect from './components/HomepageLayoutSelect';
import AdminStickyPage from '../../../layouts/AdminStickyPage';
const initialState = { loading: true, toastOpen: false };

function reducer(state: typeof initialState, action: any) {
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
  } = useForm({ defaultValues: themeSettings });

  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const docRef = doc(db, 'theme', 'settings');
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          const data = snapshot.data();
          reset(data);
          updateTheme(data);
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
  const cleanedForm = Object.fromEntries(
    Object.entries(form).filter(([_, value]) => value !== undefined)
  );

  try {
    const docRef = doc(db, 'theme', 'settings');
    await setDoc(docRef, cleanedForm, { merge: true });
    updateTheme(cleanedForm);
    dispatch({ type: 'SET_TOAST', payload: true });
  } catch (error) {
    console.error('❌ Failed to save theme settings:', error);
  }
};


  if (state.loading) return <LoadingProgress />;

  return (
    <AdminStickyPage
          title="Customize Your Store Theme"
         
        >
    

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={2}>
          <StoreNameField control={control} />
          <DarkModeToggle control={control} />
          <ColorPickerSection control={control} />
          <FontSelectorWithControls />
          <HomepageLayoutSelect control={control} />

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
                <BackgroundUploader value={field.value} onChange={field.onChange} />
              )}
            />
          </Grid>

          <Grid item xs={12}><ThemePreviewCard /></Grid>
          <Grid item xs={12}><ThemeImportExportPanel /></Grid>

          <Grid item xs={12}>
            <Button type="submit" variant="contained" fullWidth={isMobile} disabled={!isDirty || isSubmitting}>
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
    </AdminStickyPage>
  );
}
