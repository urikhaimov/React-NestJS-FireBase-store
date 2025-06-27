import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
  InputAdornment,
  Grid,
} from '@mui/material';
import { useEffect, useReducer, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import { fetchCategories } from '../../../api/categories';
import { getProductById, createProduct, updateProduct } from '../../../api/products';
import { storage } from '../../../firebase';
import type { Category } from '../../../types/firebase';
import {
  productFormReducer,
  initialProductFormState,
} from './productFormReducer';

import ImageUploader from '../../../components/ImageUploader';
import { useSafeAuth } from '../../../hooks/getSafeAuth';

type FormState = {
  name: string;
  description: string;
  price: string;
  stock: string;
  categoryId: string;
};

type Props = {
  mode: 'add' | 'edit';
};

export default function ProductFormPage({ mode }: Props) {
  const isEdit = mode === 'edit';
  const { productId } = useParams();
  const navigate = useNavigate();
  const { user } = useSafeAuth();

  const [state, dispatch] = useReducer(productFormReducer, initialProductFormState);
  const {
    product,
    keepImageUrls,
    newFiles,
    previews,
    uploadedUrls,
    progress,
    uploading,
    success,
    isUploadingImages,
  } = state;

  const [categories, setCategories] = useState<Category[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormState>({
    defaultValues: {
      name: '',
      description: '',
      price: '',
      stock: '',
      categoryId: '',
    },
  });

  useEffect(() => {
    fetchCategories().then((data) => {
      setCategories(data);
      if (mode === 'add' && data.length > 0) {
        setValue('categoryId', '');
      }
    });

    if (isEdit && productId) {
      getProductById(productId)
        .then((prod) => {
          if (prod) {
            dispatch({ type: 'SET_PRODUCT', payload: prod });
            const defaults = {
              name: prod.name,
              description: prod.description,
              price: String(prod.price),
              stock: String(prod.stock),
              categoryId: prod.categoryId,
            };
            Object.entries(defaults).forEach(([key, val]) =>
              setValue(key as keyof FormState, val ?? '')
            );
          } else {
            dispatch({ type: 'SET_PRODUCT', payload: null });
          }
        })
        .catch(() => dispatch({ type: 'SET_PRODUCT', payload: null }));
    }
  }, [isEdit, productId, setValue, mode]);

  const handleImageDrop = (acceptedFiles: File[]) => {
    const filteredFiles = acceptedFiles.filter((file) => file.size <= 5 * 1024 * 1024);
    if (filteredFiles.length !== acceptedFiles.length) {
      setErrorMessage('Some files exceeded 5MB limit.');
      setShowSnackbar(true);
      return;
    }

    const newPreviews = filteredFiles.map((f) => URL.createObjectURL(f));
    const newProgress = filteredFiles.map(() => 0);
    const startIndex = newFiles.length;

    const updatedFiles = [...newFiles, ...filteredFiles];
    const updatedPreviews = [...previews, ...newPreviews];
    const updatedProgress = [...progress, ...newProgress];
    const updatedUrls = [...uploadedUrls];

    dispatch({ type: 'SET_NEW_FILES', payload: updatedFiles });
    dispatch({ type: 'SET_PREVIEWS', payload: updatedPreviews });
    dispatch({ type: 'SET_PROGRESS', payload: updatedProgress });
    dispatch({ type: 'SET_IMAGE_UPLOADING', payload: true });

    filteredFiles.forEach((file, i) => {
      const index = startIndex + i;
      const fileRef = ref(storage, `products/${file.name}-${Date.now()}`);
      uploadBytes(fileRef, file)
        .then((snap) => getDownloadURL(snap.ref))
        .then((url) => {
          updatedUrls[index] = url;
          updatedProgress[index] = 100;

          dispatch({ type: 'SET_UPLOADED_URLS', payload: [...updatedUrls] });
          dispatch({ type: 'SET_PROGRESS', payload: [...updatedProgress] });

          const stillUploading = updatedProgress.some((p) => p < 100);
          dispatch({ type: 'SET_IMAGE_UPLOADING', payload: stillUploading });
        })
        .catch((err) => {
          console.error('Upload failed', err);
          setErrorMessage('Image upload failed. Please try again.');
          setShowSnackbar(true);
        });
    });
  };

  const handleRemoveExisting = (url: string) => {
    const updated = keepImageUrls.filter((img) => img !== url);
    dispatch({ type: 'SET_KEEP_IMAGE_URLS', payload: updated });
  };

  const handleRemoveNew = (index: number) => {
    const updatedFiles = [...newFiles];
    const updatedPreviews = [...previews];
    const updatedProgress = [...progress];
    const updatedUrls = [...uploadedUrls];

    updatedFiles.splice(index, 1);
    updatedPreviews.splice(index, 1);
    updatedProgress.splice(index, 1);
    updatedUrls.splice(index, 1);

    dispatch({ type: 'SET_NEW_FILES', payload: updatedFiles });
    dispatch({ type: 'SET_PREVIEWS', payload: updatedPreviews });
    dispatch({ type: 'SET_PROGRESS', payload: updatedProgress });
    dispatch({ type: 'SET_UPLOADED_URLS', payload: updatedUrls });

    const stillUploading = updatedProgress.some((p) => p < 100);
    dispatch({ type: 'SET_IMAGE_UPLOADING', payload: stillUploading });
  };

  const onSubmit = async (data: FormState) => {
    if (uploading || isUploadingImages) {
      alert('Please wait for the current upload to finish.');
      return;
    }

    if (!data.categoryId) return;

    dispatch({ type: 'SET_UPLOADING', payload: true });

    try {
      const allImages = [...keepImageUrls, ...uploadedUrls];
      const imageUrls = allImages.filter(
        (url) => typeof url === 'string' && url.startsWith('http')
      );

      if (imageUrls.length === 0) {
        alert('Please upload at least one product image.');
        dispatch({ type: 'SET_UPLOADING', payload: false });
        return;
      }

      const payload = {
        name: data.name,
        description: data.description,
        price: Number(data.price),
        stock: Number(data.stock),
        categoryId: data.categoryId,
        images: imageUrls,
      };

      if (isEdit && productId) {
        await updateProduct(productId, {
          data: payload,
          keepImageUrls,
          newImageFiles: newFiles,
        });
      } else {
        await createProduct(
          { ...payload, createdBy: user?.uid || 'unknown' },
          user?.uid || 'unknown'
        );
      }

      dispatch({ type: 'SET_SUCCESS', payload: true });
      setTimeout(() => navigate('/admin/products'), 1000);
    } catch (err) {
      console.error('Save failed:', err);
      alert('Failed to save product.');
    } finally {
      dispatch({ type: 'SET_UPLOADING', payload: false });
    }
  };

  return (
    <Box sx={{ height: '100vh', overflow: 'auto', px: 2, pt: 2, pb: 4, bgcolor: 'background.default' }}>
      <Typography variant="h4" gutterBottom>
        {isEdit ? 'Edit Product' : 'Add Product'}
      </Typography>

      <Paper sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset disabled={uploading || isUploadingImages} style={{ border: 'none' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Product Name"
                  {...register('name', { required: true })}
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name && 'Name is required'}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Stock"
                  type="number"
                  {...register('stock', { required: true })}
                  fullWidth
                  error={!!errors.stock}
                  helperText={errors.stock && 'Stock is required'}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  {...register('description', { required: true })}
                  fullWidth
                  multiline
                  rows={3}
                  error={!!errors.description}
                  helperText={errors.description && 'Description is required'}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="price"
                  control={control}
                  rules={{
                    required: 'Price is required',
                    pattern: {
                      value: /^\d{1,6}(\.\d{0,2})?$/,
                      message: 'Invalid price format',
                    },
                  }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="Price"
                      type="number"
                      fullWidth
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        inputProps: { step: '0.01', min: '0', pattern: '\\d*(\\.\\d{0,2})?' },
                      }}
                      InputLabelProps={{ shrink: true }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Category"
                  select
                  {...register('categoryId', {
                    required: 'Category is required',
                    validate: (val) => val !== '' || 'Please select a category',
                  })}
                  fullWidth
                  error={!!errors.categoryId}
                  helperText={errors.categoryId?.message}
                  InputLabelProps={{ shrink: true }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>

            <Box mt={3}>
              <ImageUploader
                keepImageUrls={keepImageUrls}
                previews={previews}
                progress={progress}
                uploadedUrls={uploadedUrls}
                uploading={isUploadingImages}
                onDrop={handleImageDrop}
                onRemoveExisting={handleRemoveExisting}
                onRemoveNew={handleRemoveNew}
                errorMessage={errorMessage}
                showSnackbar={showSnackbar}
                onCloseSnackbar={() => setShowSnackbar(false)}
              />
            </Box>

            <Box mt={3} display="flex" alignItems="center" gap={2}>
              <Button type="submit" variant="contained" disabled={uploading || isUploadingImages}>
                {uploading || isUploadingImages
                  ? 'Uploading...'
                  : isEdit
                  ? 'Save Changes'
                  : 'Add Product'}
              </Button>
              {(uploading || isUploadingImages) && <CircularProgress size={24} />}
            </Box>
          </fieldset>
        </form>
      </Paper>

      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => dispatch({ type: 'SET_SUCCESS', payload: false })}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Product {isEdit ? 'updated' : 'created'} successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
}
