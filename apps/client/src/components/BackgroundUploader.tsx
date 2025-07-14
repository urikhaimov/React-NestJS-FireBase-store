// src/components/BackgroundUploader.tsx
import React, { useCallback, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slider,
  Typography,
} from '@mui/material';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../utils/cropImage';
import { storage } from '../firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useStoreContext } from '../stores/useStoreContext';
import { useDropzone } from 'react-dropzone';

interface BackgroundUploaderProps {
  value?: string;
  onChange: (url: string) => void;
}

export default function BackgroundUploader({
  value,
  onChange,
}: BackgroundUploaderProps) {
  const { storeId } = useStoreContext();
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [openCropDialog, setOpenCropDialog] = useState(false);

  const onCropComplete = useCallback(
    (
      _: unknown,
      croppedPixels: { x: number; y: number; width: number; height: number },
    ) => {
      setCroppedAreaPixels(croppedPixels);
    },
    [],
  );

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
      setOpenCropDialog(true);
    };
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
  });

  const handleCropAndUpload = async () => {
    setUploading(true);
    try {
      const blob = await getCroppedImg(preview!, croppedAreaPixels, zoom);
      if (!blob) throw new Error('Cropping failed');

      const fileRef = ref(storage, `stores/${storeId}/background.png`);
      await uploadBytes(fileRef, blob);
      const url = await getDownloadURL(fileRef);
      onChange(url);
      setOpenCropDialog(false);
    } catch (err) {
      console.error('Upload failed', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        Upload Store Background
      </Typography>

      <Box
        {...getRootProps()}
        sx={{
          border: '2px dashed gray',
          borderRadius: 2,
          p: 2,
          textAlign: 'center',
          cursor: 'pointer',
        }}
      >
        <input {...getInputProps()} />
        <Typography>Drop image here or click to select</Typography>
      </Box>

      {value && (
        <Box
          mt={2}
          height={150}
          borderRadius={2}
          sx={{
            backgroundImage: `url(${value})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}

      <Dialog open={openCropDialog} fullWidth maxWidth="sm">
        <DialogTitle>Crop Background</DialogTitle>
        <DialogContent>
          <Box sx={{ position: 'relative', width: '100%', height: 300 }}>
            <Cropper
              image={preview!}
              crop={crop}
              zoom={zoom}
              aspect={16 / 9} // Landscape crop for background
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </Box>
          <Box mt={2}>
            <Typography gutterBottom>Zoom</Typography>
            <Slider
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              onChange={(_, value) => setZoom(value as number)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCropDialog(false)}>Cancel</Button>
          <Button onClick={handleCropAndUpload} disabled={uploading}>
            {uploading ? <CircularProgress size={20} /> : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
