// src/pages/UserProfilePage/UserProfilePage.tsx
import React, { useCallback, useReducer, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Avatar,
  Stack,
  IconButton,
  CircularProgress,
  Dialog,
  DialogContent,
  Snackbar,
  Alert,
  useMediaQuery,
  useTheme as useMuiTheme,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useSafeAuth } from '../../hooks/getSafeAuth';
import { updateProfile } from 'firebase/auth';
import { auth, storage, db } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Cropper from 'react-easy-crop';
import { Area } from 'react-easy-crop/types';
import { getCroppedImg } from '../../utils/cropImage';
import { useThemeContext } from '../../context/ThemeContext';

interface State {
  uploading: boolean;
  cropDialogOpen: boolean;
  selectedImage: File | null;
  crop: { x: number; y: number };
  zoom: number;
  croppedAreaPixels: Area | null;
}

type Action =
  | { type: 'SET_UPLOADING'; payload: boolean }
  | { type: 'SET_CROP_DIALOG_OPEN'; payload: boolean }
  | { type: 'SET_SELECTED_IMAGE'; payload: File | null }
  | { type: 'SET_CROP'; payload: { x: number; y: number } }
  | { type: 'SET_ZOOM'; payload: number }
  | { type: 'SET_CROPPED_AREA_PIXELS'; payload: Area | null };

const initialState: State = {
  uploading: false,
  cropDialogOpen: false,
  selectedImage: null,
  crop: { x: 0, y: 0 },
  zoom: 1,
  croppedAreaPixels: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_UPLOADING':
      return { ...state, uploading: action.payload };
    case 'SET_CROP_DIALOG_OPEN':
      return { ...state, cropDialogOpen: action.payload };
    case 'SET_SELECTED_IMAGE':
      return { ...state, selectedImage: action.payload };
    case 'SET_CROP':
      return { ...state, crop: action.payload };
    case 'SET_ZOOM':
      return { ...state, zoom: action.payload };
    case 'SET_CROPPED_AREA_PIXELS':
      return { ...state, croppedAreaPixels: action.payload };
    default:
      return state;
  }
}

export default function UserProfilePage() {
  const { user } = useSafeAuth();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [toastOpen, setToastOpen] = useState(false);
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
  const { theme } = useThemeContext();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  });

  if (!user) {
    return <Typography variant="h6">No user data available.</Typography>;
  }

  const onSubmit = async (data: { name: string }) => {
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, {
        displayName: data.name,
      });
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        name: data.name,
      });
      setToastOpen(true);
    }
  };

  const onCropComplete = useCallback((_: any, croppedAreaPixels: Area) => {
    dispatch({ type: 'SET_CROPPED_AREA_PIXELS', payload: croppedAreaPixels });
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      dispatch({ type: 'SET_SELECTED_IMAGE', payload: file });
      dispatch({ type: 'SET_CROP_DIALOG_OPEN', payload: true });
    }
  };

  const handleUploadCroppedImage = async () => {
    if (!state.selectedImage || !state.croppedAreaPixels || !auth.currentUser) return;
    dispatch({ type: 'SET_UPLOADING', payload: true });
    try {
      const croppedImageBlob = await getCroppedImg(
        URL.createObjectURL(state.selectedImage),
        state.croppedAreaPixels,
        state.zoom
      );
      const storageRef = ref(storage, `avatars/${auth.currentUser.uid}`);
      await uploadBytes(storageRef, croppedImageBlob!);
      const photoURL = await getDownloadURL(storageRef);
      await updateProfile(auth.currentUser, { photoURL });
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        photoURL,
      });
      dispatch({ type: 'SET_CROP_DIALOG_OPEN', payload: false });
      setToastOpen(true);
    } catch (err) {
      console.error('Avatar upload failed', err);
    } finally {
      dispatch({ type: 'SET_UPLOADING', payload: false });
    }
  };

  return (
    <Box
      flexGrow={1}
      display="flex"
      justifyContent="center"
      alignItems="center"
      px={theme.spacing(2)}
      py={theme.spacing(4)}
      sx={{
        width: '100%',
        maxWidth: '100vw',
        overflowX: 'hidden',
        bgcolor: theme.palette.background.default,
        fontFamily: theme.typography.fontFamily,
      }}
    >
      <Paper
        sx={{
          p: { xs: 2, sm: 3 },
          width: '100%',
          maxWidth: 500,
          mx: 'auto',
          backgroundColor: theme.palette.background.paper,
          fontFamily: theme.typography.fontFamily,
        }}
      >
        <Typography variant="h5" gutterBottom textAlign="center">
          My Profile
        </Typography>

        <Stack spacing={3} mt={2} alignItems="center">
          <Box position="relative">
            <Avatar sx={{ width: 80, height: 80 }} src={user?.photoURL || undefined}>
              {user?.name?.[0] || user?.email?.[0]}
            </Avatar>
            <IconButton component="label" sx={{ position: 'absolute', bottom: 0, right: 0 }} size="small">
              <PhotoCamera fontSize="small" />
              <input hidden accept="image/*" type="file" onChange={handleFileChange} />
            </IconButton>
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

              <Button type="submit" variant="contained" fullWidth disabled={isSubmitting}>
                Save Changes
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Paper>

      <Snackbar open={toastOpen} autoHideDuration={2000} onClose={() => setToastOpen(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity="success" sx={{ width: '100%' }}>✅ Profile updated</Alert>
      </Snackbar>

      <Dialog open={state.cropDialogOpen} onClose={() => dispatch({ type: 'SET_CROP_DIALOG_OPEN', payload: false })} fullWidth maxWidth="xs">
        <DialogContent sx={{ height: isMobile ? 250 : 300, position: 'relative' }}>
          {state.selectedImage && (
            <Cropper
              image={URL.createObjectURL(state.selectedImage)}
              crop={state.crop}
              zoom={state.zoom}
              aspect={1}
              onCropChange={(val) => dispatch({ type: 'SET_CROP', payload: val })}
              onZoomChange={(val) => dispatch({ type: 'SET_ZOOM', payload: val })}
              onCropComplete={onCropComplete}
            />
          )}
          <Stack direction="row" justifyContent="flex-end" mt={2}>
            <Button onClick={handleUploadCroppedImage} variant="contained" disabled={state.uploading}>
              Upload
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
