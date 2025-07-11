import React, { useCallback, useEffect, useReducer } from 'react';
import {
  Box, Typography, Paper, TextField, Button, Avatar, Stack,
  IconButton, CircularProgress, Dialog, DialogContent, Snackbar, Alert,
  useMediaQuery, useTheme as useMuiTheme,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { updateProfile } from 'firebase/auth';
import { auth, storage, db } from '../../firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import DeleteIcon from '@mui/icons-material/Delete';
import Cropper from 'react-easy-crop';
import { Area } from 'react-easy-crop/types';
import { getCroppedImg } from '../../utils/cropImage';
import { useThemeContext } from '../../context/ThemeContext';
import { useAuthStore } from '../../stores/useAuthStore';
import {reducer, initialState} from './LocalReducer';
import { useThemeStore } from '../../stores/useThemeStore';
export default function UserProfilePage() {
  const user = useAuthStore((s) => s.user);
  const refreshUser = useAuthStore((s) => s.refreshUser);
  const [state, dispatch] = useReducer(reducer, initialState);
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
  const { theme } = useThemeContext();

  const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { name: '', email: '' },
  });

  useEffect(() => {
    if (user) reset({ name: user.name || '', email: user.email || '' });
  }, [user, reset]);

  useEffect(() => {
    return () => {
      if (state.imageSrc) URL.revokeObjectURL(state.imageSrc);
    };
  }, [state.imageSrc]);

  const onSubmit = async (data: { name: string }) => {
    if (!auth.currentUser) return;
    const uid = auth.currentUser.uid;
    await updateProfile(auth.currentUser, { displayName: data.name });
    await updateDoc(doc(db, 'users', uid), { name: data.name });
    await refreshUser();
    dispatch({ type: 'SET_TOAST_OPEN', payload: true });
  };

  const onCropComplete = useCallback((_: any, croppedAreaPixels: Area) => {
    dispatch({ type: 'SET_CROPPED_AREA_PIXELS', payload: croppedAreaPixels });
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) {
      dispatch({ type: 'SET_ERROR_MSG', payload: '❌ Please select a valid image file.' });
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    dispatch({ type: 'SET_IMAGE_SRC', payload: objectUrl });
    dispatch({ type: 'SET_SELECTED_IMAGE', payload: file });
    dispatch({ type: 'SET_CROP_DIALOG_OPEN', payload: true });
  };

  const handleUploadCroppedImage = async () => {
    if (!auth.currentUser || !state.imageSrc || !state.croppedAreaPixels) return;
    const uid = auth.currentUser.uid;
    dispatch({ type: 'SET_UPLOADING', payload: true });

    try {
      const croppedBlob = await getCroppedImg(state.imageSrc, state.croppedAreaPixels, state.zoom);
      const storageRef = ref(storage, `avatars/${uid}`);
      await uploadBytes(storageRef, croppedBlob!);
      const photoURL = await getDownloadURL(storageRef);

      await updateProfile(auth.currentUser, { photoURL });
      await updateDoc(doc(db, 'users', uid), { photoURL });
      await refreshUser();

      dispatch({ type: 'SET_TOAST_OPEN', payload: true });
      dispatch({ type: 'SET_CROP_DIALOG_OPEN', payload: false });
    } catch (err) {
      console.error('❌ Upload failed', err);
      dispatch({
        type: 'SET_ERROR_MSG',
        payload: (err as any)?.message || '❌ Upload failed. Please try again.',
      });
    } finally {
      dispatch({ type: 'SET_UPLOADING', payload: false });
    }
  };

  const handleAvatarDelete = async () => {
    if (!auth.currentUser) return;
    const uid = auth.currentUser.uid;
    const avatarRef = ref(storage, `avatars/${uid}`);

    try {
      await deleteObject(avatarRef);
      await updateProfile(auth.currentUser, { photoURL: null });
      await updateDoc(doc(db, 'users', uid), { photoURL: null });
      await refreshUser();
      dispatch({ type: 'SET_TOAST_OPEN', payload: true });
    } catch (err) {
      console.error('Failed to delete avatar:', err);
      dispatch({ type: 'SET_ERROR_MSG', payload: '❌ Failed to delete avatar.' });
    }
  };

  if (!user || !user.uid) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography mt={2}>Loading user profile...</Typography>
      </Box>
    );
  }

  return (
    <Box flexGrow={1} display="flex" justifyContent="center" alignItems="center" px={theme.spacing(2)} py={theme.spacing(4)}>
      <Paper sx={{ p: { xs: 2, sm: 3 }, width: '100%', maxWidth: 500, mx: 'auto', backgroundColor: theme.palette.background.paper }}>
        <Typography variant="h5" gutterBottom textAlign="center">My Profile</Typography>

        <Stack spacing={3} mt={2} alignItems="center">
          <Box position="relative">
            <Avatar
              src={state.imageSrc || user?.photoURL || undefined}
              sx={{ width: 80, height: 80, border: '2px solid white' }}
            >
              {user?.name?.[0] || user?.email?.[0]}
            </Avatar>

            <IconButton component="label" sx={{ position: 'absolute', bottom: 0, right: 0 }} size="small">
              <PhotoCamera fontSize="small" />
              <input hidden accept="image/*" type="file" onChange={handleFileChange} />
            </IconButton>

            {user?.photoURL && (
              <IconButton
                size="small"
                onClick={handleAvatarDelete}
                sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'white' }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            )}
          </Box>

          {state.uploading && <CircularProgress size={24} />}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} width="100%">
            <Stack spacing={2}>
              <Controller
                name="name"
                control={control}
                rules={{ required: 'Name is required' }}
                render={({ field }) => (
                  <TextField {...field} label="Name" fullWidth error={!!errors.name} helperText={errors.name?.message} />
                )}
              />
              <TextField label="Email" value={user.email} fullWidth disabled />
              <TextField label="UID" value={user.uid} fullWidth disabled />
              <Button type="submit" variant="contained" fullWidth disabled={isSubmitting}>Save Changes</Button>
            </Stack>
          </Box>
        </Stack>
      </Paper>

      <Snackbar open={state.toastOpen} autoHideDuration={3000} onClose={() => dispatch({ type: 'SET_TOAST_OPEN', payload: false })} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity="success" sx={{ width: '100%' }}>✅ Profile updated</Alert>
      </Snackbar>

      <Snackbar open={!!state.errorMsg} autoHideDuration={4000} onClose={() => dispatch({ type: 'SET_ERROR_MSG', payload: '' })} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="error" sx={{ width: '100%' }}>{state.errorMsg}</Alert>
      </Snackbar>

      <Dialog open={state.cropDialogOpen} onClose={() => dispatch({ type: 'SET_CROP_DIALOG_OPEN', payload: false })} fullWidth maxWidth="xs">
        <DialogContent sx={{ height: isMobile ? 250 : 300, position: 'relative' }}>
          {state.imageSrc && (
            <Cropper
              image={state.imageSrc}
              crop={state.crop}
              zoom={state.zoom}
              aspect={1}
              onCropChange={(val) => dispatch({ type: 'SET_CROP', payload: val })}
              onZoomChange={(val) => dispatch({ type: 'SET_ZOOM', payload: val })}
              onCropComplete={onCropComplete}
            />
          )}
          <Stack direction="row" justifyContent="space-between" mt={2}>
            <Button onClick={() => dispatch({ type: 'SET_CROP_DIALOG_OPEN', payload: false })}>Cancel</Button>
            <Button onClick={handleUploadCroppedImage} variant="contained" disabled={state.uploading}>
              Upload
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
