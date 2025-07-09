import React, { useEffect, useState } from 'react';
import {
  Grid,
  Button,
  Snackbar,
  Alert,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';

import { useThemeSettings, ThemeSettings } from '../../../hooks/useThemeSettings';

import LoadingProgress from '../../../components/LoadingProgress';
import LogoUploader from '../../../components/LogoUploader';
import BackgroundUploader from '../../../components/BackgroundUploader';
import ThemePreviewCard from '../../../components/ThemePreviewCard';
import ThemeImportExportPanel from '../../../components/ThemeImportExportPanel';

import StoreNameField from './components/StoreNameField';
import DarkModeToggle from './components/DarkModeToggle';
import ColorPickerSection from './components/ColorPickerSection';
import FontSelectorWithControls from './components/FontSelectorWithControls';
import HomepageLayoutSelect from './components/HomepageLayoutSelect';
import AdminStickyPage from '../../../layouts/AdminStickyPage';

export default function AdminThemePage() {
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));

  const { data: themeSettings, isLoading, isError, save, isSaving } = useThemeSettings();

  const [toastOpen, setToastOpen] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty, isSubmitting },
  } = useForm<ThemeSettings>({
    defaultValues: themeSettings ?? {},
  });

  // Reset form when themeSettings loads or changes
  useEffect(() => {
    if (themeSettings) reset(themeSettings);
  }, [themeSettings, reset]);

  if (isLoading) return <LoadingProgress />;

  if (isError)
    return (
      <AdminStickyPage title="Customize Your Store Theme">
        <div>Error loading theme settings</div>
      </AdminStickyPage>
    );

  const onSubmit: SubmitHandler<ThemeSettings> = (data) => {
    save(data, {
      onSuccess: () => setToastOpen(true),
    });
  };

  return (
    <AdminStickyPage title="Customize Your Store Theme">
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
                <LogoUploader value={field.value ?? ''} onChange={field.onChange} />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="backgroundImageUrl"
              control={control}
              render={({ field }) => (
                <BackgroundUploader value={field.value ?? ''} onChange={field.onChange} />
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
              disabled={!isDirty || isSubmitting || isSaving}
            >
              Save Theme
            </Button>
          </Grid>
        </Grid>
      </form>

      <Snackbar
        open={toastOpen}
        autoHideDuration={1500}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={() => setToastOpen(false)}
        >
          Theme updated successfully
        </Alert>
      </Snackbar>
    </AdminStickyPage>
  );
}
