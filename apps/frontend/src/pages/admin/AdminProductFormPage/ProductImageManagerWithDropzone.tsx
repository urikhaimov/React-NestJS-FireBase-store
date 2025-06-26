// src/components/ProductImageManagerWithDropzone.tsx
import React, { useReducer } from 'react';
import {
  Box,
  Grid,
  Typography,
  IconButton,
  Card,
  CardMedia,
  CardActions,
  LinearProgress,
  Paper,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useDropzone } from 'react-dropzone';
import { storage } from '../../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  imageReducer,
  initialImageState,
} from './productImageReducer';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

interface Props {
  initialImageUrls: string[];
  onChange: (update: {
    keepImageUrls: string[];
    newFiles: File[];
    uploadedUrls: string[];
    isUploadingImages: boolean;
  }) => void;
}

export default function ProductImageManagerWithDropzone({
  initialImageUrls,
  onChange,
}: Props) {
  const [state, dispatch] = useReducer(imageReducer, {
    ...initialImageState,
    keepImageUrls: initialImageUrls,
  });

  const emitChange = (overrideProgress?: number[]) => {
    const progressArray = overrideProgress || state.progress;
    const isUploadingImages = progressArray.some((p) => p < 100);
    onChange({
      keepImageUrls: state.keepImageUrls,
      newFiles: state.newFiles,
      uploadedUrls: state.uploadedUrls,
      isUploadingImages,
    });
  };

  const handleRemoveExisting = (url: string) => {
    const updated = state.keepImageUrls.filter((img) => img !== url);
    dispatch({ type: 'SET_KEEP_IMAGE_URLS', payload: updated });
    emitChange();
  };

  const handleRemoveNew = (index: number) => {
    const updatedFiles = [...state.newFiles];
    const updatedPreviews = [...state.previews];
    const updatedProgress = [...state.progress];
    const updatedUrls = [...state.uploadedUrls];

    updatedFiles.splice(index, 1);
    updatedPreviews.splice(index, 1);
    updatedProgress.splice(index, 1);
    updatedUrls.splice(index, 1);

    dispatch({ type: 'SET_NEW_FILES', payload: updatedFiles });
    dispatch({ type: 'SET_PREVIEWS', payload: updatedPreviews });
    dispatch({ type: 'SET_PROGRESS', payload: updatedProgress });
    dispatch({ type: 'SET_UPLOADED_URLS', payload: updatedUrls });

    emitChange(updatedProgress);
  };

  const uploadFileToFirebase = async (file: File, index: number) => {
    try {
      const fileRef = ref(storage, `products/${file.name}-${Date.now()}`);
      const uploadTask = await uploadBytes(fileRef, file);
      const url = await getDownloadURL(uploadTask.ref);

      dispatch({ type: 'UPLOAD_PROGRESS', index, percent: 100 });
      dispatch({ type: 'UPLOAD_SUCCESS', index, url });

      const updatedProgress = [...state.progress];
      updatedProgress[index] = 100;

      const updatedUrls = [...state.uploadedUrls];
      updatedUrls[index] = url;
      dispatch({ type: 'SET_UPLOADED_URLS', payload: updatedUrls });

      emitChange(updatedProgress);
    } catch (err) {
      console.error('Upload failed', err);
    }
  };

  const onDrop = (acceptedFiles: File[]) => {
    const filteredFiles = acceptedFiles.filter((file) => file.size <= MAX_FILE_SIZE);
    if (filteredFiles.length !== acceptedFiles.length) {
      alert('Some files exceeded the 5MB limit and were skipped.');
    }

    const newPreviews = filteredFiles.map((f) => URL.createObjectURL(f));
    const newProgress = filteredFiles.map(() => 0);

    const startIndex = state.newFiles.length;
    const updatedFiles = [...state.newFiles, ...filteredFiles];
    const updatedProgress = [...state.progress, ...newProgress];
    const updatedPreviews = [...state.previews, ...newPreviews];
    const updatedUrls = [...state.uploadedUrls, ...filteredFiles.map(() => '')];

    dispatch({ type: 'SET_NEW_FILES', payload: updatedFiles });
    dispatch({ type: 'SET_PREVIEWS', payload: updatedPreviews });
    dispatch({ type: 'SET_PROGRESS', payload: updatedProgress });
    dispatch({ type: 'SET_UPLOADED_URLS', payload: updatedUrls });

    emitChange(updatedProgress);

    filteredFiles.forEach((file, i) => uploadFileToFirebase(file, startIndex + i));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': [],
    },
    multiple: true,
    maxSize: MAX_FILE_SIZE,
  });

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        Product Images
      </Typography>

      <Grid container spacing={2}>
        {state.keepImageUrls.map((url) => (
          <Grid item xs={4} sm={3} key={url}>
            <Card>
              <CardMedia component="img" height="120" image={url} />
              <CardActions>
                <IconButton onClick={() => handleRemoveExisting(url)}>
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}

        {state.previews.map((url, idx) => (
          <Grid item xs={4} sm={3} key={url}>
            <Card>
              <CardMedia component="img" height="120" image={url} />
              <LinearProgress
                variant="determinate"
                value={state.progress[idx] || 0}
                sx={{ mx: 1, mb: 1 }}
              />
              <CardActions>
                <IconButton onClick={() => handleRemoveNew(idx)}>
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper
        {...getRootProps()}
        elevation={3}
        sx={{
          mt: 3,
          py: 3,
          textAlign: 'center',
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'grey.400',
          color: isDragActive ? 'primary.main' : 'grey.600',
          cursor: 'pointer',
        }}
      >
        <input {...getInputProps()} />
        <CloudUploadIcon fontSize="large" />
        <Typography>
          {isDragActive
            ? 'Drop the files here...'
            : 'Drag and drop images here, or click to select files (max 5MB each)'}
        </Typography>
      </Paper>
    </Box>
  );
}
