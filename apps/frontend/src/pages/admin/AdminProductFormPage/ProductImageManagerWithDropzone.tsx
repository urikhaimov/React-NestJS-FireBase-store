// ✅ src/components/ProductImageManagerWithDropzone.tsx
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
  ImageAction,
  ImageState,
} from './productImageReducer';

interface Props {
  initialImageUrls: string[];
  onChange: (update: {
    keepImageUrls: string[];
    newFiles: File[];
    uploadedUrls: string[];
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

  const handleRemoveExisting = (url: string) => {
    const updated = state.keepImageUrls.filter((img) => img !== url);
    dispatch({ type: 'SET_KEEP_IMAGE_URLS', payload: updated });
    onChange({
      keepImageUrls: updated,
      newFiles: state.newFiles,
      uploadedUrls: state.uploadedUrls,
    });
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

    onChange({
      keepImageUrls: state.keepImageUrls,
      newFiles: updatedFiles,
      uploadedUrls: updatedUrls,
    });
  };

  const uploadFileToFirebase = async (file: File, index: number) => {
    try {
      const fileRef = ref(storage, `products/${file.name}-${Date.now()}`);
      const uploadTask = await uploadBytes(fileRef, file);
      const url = await getDownloadURL(uploadTask.ref);

      dispatch({ type: 'UPLOAD_PROGRESS', index, percent: 100 });
      dispatch({ type: 'UPLOAD_SUCCESS', index, url });

      onChange({
        keepImageUrls: state.keepImageUrls,
        newFiles: state.newFiles,
        uploadedUrls: [...state.uploadedUrls.slice(0, index), url],
      });
    } catch (err) {
      console.error('Upload failed', err);
    }
  };

  const onDrop = (acceptedFiles: File[]) => {
    const newPreviews = acceptedFiles.map((f) => URL.createObjectURL(f));
    const newProgress = acceptedFiles.map(() => 0);

    const startIndex = state.newFiles.length;
    const updatedFiles = [...state.newFiles, ...acceptedFiles];

    dispatch({ type: 'SET_NEW_FILES', payload: updatedFiles });
    dispatch({ type: 'SET_PREVIEWS', payload: [...state.previews, ...newPreviews] });
    dispatch({ type: 'SET_PROGRESS', payload: [...state.progress, ...newProgress] });
    dispatch({ type: 'SET_UPLOADED_URLS', payload: [...state.uploadedUrls, ...acceptedFiles.map(() => '')] });

    acceptedFiles.forEach((file, i) => uploadFileToFirebase(file, startIndex + i));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': [],
    },
    multiple: true,
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
            : 'Drag and drop images here, or click to select files'}
        </Typography>
      </Paper>
    </Box>
  );
}
