// src/components/ImageUploader.tsx
import {
  Box,
  Typography,
  Paper,
  Snackbar,
  Alert,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useDropzone } from 'react-dropzone';
import React, { useRef, useEffect } from 'react';
import ReorderComponent from './ReorderComponent';

export interface CombinedImage {
  id: string;
  url: string;
  type: 'existing' | 'new';
  file?: File;
  progress?: number;
}

export interface ImageUploaderProps {
  images: CombinedImage[];
  onDrop: (files: File[]) => void;
  onRemove: (id: string) => void;
  onReorderAll: (newOrder: CombinedImage[]) => void;
  errorMessage?: string;
  showSnackbar: boolean;
  onCloseSnackbar: () => void;
}

export default function ImageUploader({
  images,
  onDrop,
  onRemove,
  onReorderAll,
  errorMessage,
  showSnackbar,
  onCloseSnackbar,
}: ImageUploaderProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: true,
    maxSize: 5 * 1024 * 1024,
  });

  const createdPreviewsRef = useRef<string[]>([]);

  useEffect(() => {
    const blobs = images.filter((img) => img.url.startsWith('blob:'));
    for (const blob of blobs) {
      if (!createdPreviewsRef.current.includes(blob.url)) {
        createdPreviewsRef.current.push(blob.url);
      }
    }
  }, [images]);

  useEffect(() => {
    return () => {
      createdPreviewsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  return (
    <Box>
      <Typography variant="subtitle1" fontWeight={600} mb={1}>
        Product Images
      </Typography>

      <ReorderComponent images={images} onReorder={onReorderAll} onRemove={onRemove} />

      <Paper
        {...getRootProps()}
        elevation={3}
        sx={{
          py: 3,
          px: 2,
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'grey.400',
          textAlign: 'center',
          color: isDragActive ? 'primary.main' : 'grey.600',
          cursor: 'pointer',
          mt: 2,
        }}
      >
        <input {...getInputProps()} />
        <CloudUploadIcon fontSize="large" />
        <Typography mt={1}>
          {isDragActive ? 'Drop files here...' : 'Drag or click to upload (max 5MB)'}
        </Typography>
      </Paper>

      <Snackbar open={showSnackbar} autoHideDuration={5000} onClose={onCloseSnackbar}>
        <Alert severity="error" onClose={onCloseSnackbar}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
