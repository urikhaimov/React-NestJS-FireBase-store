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
  Snackbar,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useDropzone } from 'react-dropzone';
import React, { useRef, useEffect } from 'react';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export interface ImageUploaderProps {
  keepImageUrls: string[];
  previews: string[];
  progress: number[];
  uploadedUrls: string[];
  uploading: boolean;
  onDrop: (files: File[]) => void;
  onRemoveExisting: (url: string) => void;
  onRemoveNew: (index: number) => void;
  errorMessage?: string;
  showSnackbar: boolean;
  onCloseSnackbar: () => void;
}

export default function ImageUploader({
  keepImageUrls,
  previews,
  progress,
  uploadedUrls,
  uploading,
  onDrop,
  onRemoveExisting,
  onRemoveNew,
  errorMessage,
  showSnackbar,
  onCloseSnackbar,
}: ImageUploaderProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: true,
    maxSize: MAX_FILE_SIZE,
  });

  // Keep track of previews created in this component for cleanup
  const createdPreviewsRef = useRef<string[]>([]);

  // Track which previews were created locally (blob:) to revoke them on unmount
  useEffect(() => {
    const newBlobs = previews.filter((url) => url.startsWith('blob:'));
    for (const blob of newBlobs) {
      if (!createdPreviewsRef.current.includes(blob)) {
        createdPreviewsRef.current.push(blob);
      }
    }
  }, [previews]);

  // Revoke blob URLs when component unmounts
  useEffect(() => {
    return () => {
      createdPreviewsRef.current.forEach((url) => URL.revokeObjectURL(url));
      createdPreviewsRef.current = [];
    };
  }, []);

  return (
    <Box>
      <Typography variant="subtitle1" fontWeight={600}>
        Product Images
      </Typography>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        {/* Existing images */}
        {keepImageUrls.map((url) => (
          <Grid item xs={4} sm={3} key={url}>
            <Card>
              <CardMedia component="img" height="120" image={url} />
              <CardActions>
                <IconButton onClick={() => onRemoveExisting(url)}>
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}

        {/* New previews with progress */}
        {previews.map((url, idx) => (
          <Grid item xs={4} sm={3} key={url}>
            <Card>
              <CardMedia component="img" height="120" image={url} />
              <LinearProgress
                variant="determinate"
                value={progress[idx] || 0}
                sx={{ mx: 1, mb: 1 }}
              />
              <CardActions>
                <IconButton
                  onClick={() => {
                    if (url.startsWith('blob:')) {
                      URL.revokeObjectURL(url);
                      createdPreviewsRef.current = createdPreviewsRef.current.filter((b) => b !== url);
                    }
                    onRemoveNew(idx);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Dropzone */}
      <Paper
        {...getRootProps()}
        elevation={3}
        sx={{
          py: 3,
          px: 2,
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'grey.400',
          transition: 'border-color 0.3s',
          textAlign: 'center',
          color: isDragActive ? 'primary.main' : 'grey.600',
          cursor: 'pointer',
        }}
      >
        <input {...getInputProps()} />
        <CloudUploadIcon fontSize="large" />
        <Typography mt={1}>
          {isDragActive
            ? 'Drop the files here...'
            : 'Drag and drop images here or click to upload (max 5MB)'}
        </Typography>
        {errorMessage && (
          <Typography color="error" variant="body2" mt={1}>
            {errorMessage}
          </Typography>
        )}
      </Paper>

      {/* Snackbar error */}
      <Snackbar open={showSnackbar} autoHideDuration={5000} onClose={onCloseSnackbar}>
        <Alert severity="error" onClose={onCloseSnackbar}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
