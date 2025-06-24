// src/components/ProductImageManagerWithDropzone.tsx
import React, { useState, useRef, useEffect } from 'react';
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

interface Props {
  initialImageUrls: string[];
  onChange: (update: {
    keepImageUrls: string[];
    newFiles: File[];
  }) => void;
}

export default function ProductImageManagerWithDropzone({
  initialImageUrls,
  onChange,
}: Props) {
  const [keepImageUrls, setKeepImageUrls] = useState<string[]>(initialImageUrls);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [progress, setProgress] = useState<number[]>([]);

  const handleRemoveExisting = (url: string) => {
    const updated = keepImageUrls.filter((img) => img !== url);
    setKeepImageUrls(updated);
    onChange({ keepImageUrls: updated, newFiles });
  };

  const handleRemoveNew = (index: number) => {
    const updatedFiles = [...newFiles];
    const updatedPreviews = [...previews];
    const updatedProgress = [...progress];
    updatedFiles.splice(index, 1);
    updatedPreviews.splice(index, 1);
    updatedProgress.splice(index, 1);
    setNewFiles(updatedFiles);
    setPreviews(updatedPreviews);
    setProgress(updatedProgress);
    onChange({ keepImageUrls, newFiles: updatedFiles });
  };

  const onDrop = (acceptedFiles: File[]) => {
    const newPreviews = acceptedFiles.map((file) => URL.createObjectURL(file));
    const newProgress = acceptedFiles.map(() => 0);

    setNewFiles((prev) => {
      const updated = [...prev, ...acceptedFiles];
      onChange({ keepImageUrls, newFiles: updated });
      return updated;
    });
    setPreviews((prev) => [...prev, ...newPreviews]);
    setProgress((prev) => [...prev, ...newProgress]);

    // Simulate upload progress animation
    acceptedFiles.forEach((_, index) => simulateProgress(index + progress.length));
  };

  const simulateProgress = (index: number) => {
    let percent = 0;
    const interval = setInterval(() => {
      percent += 10;
      setProgress((prev) => {
        const updated = [...prev];
        updated[index] = Math.min(percent, 100);
        return updated;
      });
      if (percent >= 100) clearInterval(interval);
    }, 80);
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
        {keepImageUrls.map((url) => (
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
