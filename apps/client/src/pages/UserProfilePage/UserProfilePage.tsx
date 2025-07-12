import React, { useEffect, useReducer } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Stack,
  CircularProgress,
  Snackbar,
  Alert,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';

import { useAuthStore } from '../../stores/useAuthStore';
import { useUserProfileQuery } from '../../hooks/useUserProfileQuery';
import { useUpdateUserProfileMutation } from '../../hooks/useUpdateUserProfileMutation';
import { useUploadAvatarMutation } from '../../hooks/useUploadAvatarMutation';
import AvatarUploader from '../../components/AvatarUploader';

type State = {
  toastOpen: boolean;
  errorMsg: string;
};

type Action =
  | { type: 'SET_TOAST_OPEN'; payload: boolean }
  | { type: 'SET_ERROR_MSG'; payload: string };

const initialState: State = {
  toastOpen: false,
  errorMsg: '',
};

function reducer(state: State, action: Action): State {
  return { ...state, [action.type.replace('SET_', '').toLowerCase()]: action.payload };
}

export default function UserProfilePage() {
  const { user, loading, authInitialized } = useAuthStore();
  const [state, dispatch] = useReducer(reducer, initialState);
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { name: '', email: '' } });

  const { data: userDoc, isLoading: userDocLoading } = useUserProfileQuery(user?.uid);
  const updateMutation = useUpdateUserProfileMutation(user?.uid || '');
  const uploadAvatarMutation = useUploadAvatarMutation(user?.uid || '');

  useEffect(() => {
    if (user && userDoc) {
      reset({
        name: userDoc.name ?? '',
        email: user.email ?? '',
      });
    }
  }, [user, userDoc, reset]);

  const onSubmit = async (data: { name: string }) => {
    try {
      await updateMutation.mutateAsync({ name: data.name });
      dispatch({ type: 'SET_TOAST_OPEN', payload: true });
    } catch (err) {
      console.error('❌ Update failed:', err);
      dispatch({ type: 'SET_ERROR_MSG', payload: 'Failed to update profile.' });
    }
  };

  const handleAvatarUpload = async (file: File) => {
    try {
      await uploadAvatarMutation.mutateAsync(file);
      dispatch({ type: 'SET_TOAST_OPEN', payload: true });
    } catch (err: any) {
      console.error('❌ Avatar upload failed:', err);
      dispatch({
        type: 'SET_ERROR_MSG',
        payload: err?.message || 'Avatar upload failed.',
      });
    }
  };

  if (loading || !authInitialized || userDocLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Typography variant="h6" textAlign="center" mt={4}>
        No user data available.
      </Typography>
    );
  }

  return (
    <Box
      flexGrow={1}
      display="flex"
      justifyContent="center"
      alignItems="center"
      px={muiTheme.spacing(2)}
      py={muiTheme.spacing(4)}
    >
      <Paper
        sx={{
          p: { xs: 2, sm: 3 },
          width: '100%',
          maxWidth: 500,
          mx: 'auto',
          backgroundColor: muiTheme.palette.background.paper,
        }}
      >
        <Typography variant="h5" gutterBottom textAlign="center">
          My Profile
        </Typography>

        <Stack spacing={3} mt={2} alignItems="center">
          <AvatarUploader
            avatarUrl={userDoc?.photoURL ?? null}
            onDrop={handleAvatarUpload}
            errorMessage={state.errorMsg}
            showSnackbar={!!state.errorMsg}
            onCloseSnackbar={() => dispatch({ type: 'SET_ERROR_MSG', payload: '' })}
          />

          <Box component="form" onSubmit={handleSubmit(onSubmit)} width="100%">
            <Stack spacing={2}>
              <Controller
                name="name"
                control={control}
                rules={{ required: 'Name is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Name"
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
              <TextField label="Email" value={user.email ?? ''} fullWidth disabled />
              <TextField label="UID" value={user.uid ?? ''} fullWidth disabled />
              <Button type="submit" variant="contained" fullWidth disabled={isSubmitting}>
                Save Changes
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Paper>

      <Snackbar
        open={state.toastOpen}
        autoHideDuration={3000}
        onClose={() => dispatch({ type: 'SET_TOAST_OPEN', payload: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          ✅ Profile updated
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!state.errorMsg}
        autoHideDuration={4000}
        onClose={() => dispatch({ type: 'SET_ERROR_MSG', payload: '' })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" sx={{ width: '100%' }}>
          {state.errorMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
