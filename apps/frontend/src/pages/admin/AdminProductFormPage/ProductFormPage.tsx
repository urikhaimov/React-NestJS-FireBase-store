import React, { useEffect, useReducer } from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import ReactQuill from 'react-quill';

import { useProduct, Product } from '../../../hooks/useProduct';
import ImageUploader, { CombinedImage } from '../../../components/ImageUploader';
import { productFormReducer, initialProductFormState } from './productFormReducer';
import FormTextField from '../../../components/FormTextField';

type FormState = {
  name: string;
  description: string;
  price: string;
  stock: string;
  categoryId: string;
};

export default function ProductFormPage({ mode }: { mode: 'add' | 'edit' }) {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(productFormReducer, initialProductFormState);

  const { data: product, isLoading } = useProduct(productId);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<FormState>({
    defaultValues: {
      name: '',
      description: '',
      price: '',
      stock: '',
      categoryId: '',
    },
  });

  // Load product data into form and reducer state when fetched
  useEffect(() => {
    if (!product) return;

    reset({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      stock: product.stock.toString(),
      categoryId: product.categoryId || '',
    });

    dispatch({ type: 'SET_PRODUCT', payload: product });

    const images: CombinedImage[] = product.images.map((url) => ({
      id: url,
      url,
      type: 'existing',
    }));

    dispatch({ type: 'SET_COMBINED_IMAGES', payload: images });
    dispatch({ type: 'SET_READY', payload: true });
  }, [product, reset]);

  const handleImageDrop = (files: File[]) => {
    const newImages: CombinedImage[] = files.map((file) => ({
      id: URL.createObjectURL(file), // generate unique id for demo, ideally a UUID
      url: URL.createObjectURL(file),
      type: 'new',
      file,
      progress: 0,
    }));
    dispatch({ type: 'ADD_COMBINED_IMAGES', payload: newImages });
  };

  const onSubmit = async (data: FormState) => {
    // Implement your submit logic, e.g., create or update product
    // You can access state.combinedImages for images info
  };

  if (isLoading) {
    return <Typography>Loading product...</Typography>;
  }

  return (
    <Box p={3} height="100%" overflow="auto">
      <Paper elevation={1} sx={{ p: 3, maxWidth: 700, mx: 'auto' }}>
        <Typography variant="h6" mb={2}>
          {mode === 'add' ? 'Add New Product' : 'Edit Product'}
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack spacing={2}>
            <FormTextField
              label="Name"
              register={register('name', { required: 'Name is required' })}
              errorObject={errors.name}
            />

            <Controller
              control={control}
              name="description"
              defaultValue=""
              render={({ field }) => (
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Description
                  </Typography>
                  <Box
                    sx={{
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 1,
                      overflow: 'hidden',
                      '& .ql-toolbar': {
                        bgcolor: 'background.paper',
                        borderBottom: 1,
                        borderColor: 'divider',
                      },
                      '& .ql-container': {
                        bgcolor: 'background.default',
                        color: 'text.primary',
                        minHeight: 200,
                      },
                      '& .ql-editor': {
                        fontFamily: 'inherit',
                        fontSize: '1rem',
                        px: 2,
                        py: 1,
                      },
                    }}
                  >
                    <ReactQuill theme="snow" value={field.value} onChange={field.onChange} />
                  </Box>
                </Box>
              )}
            />

            <FormTextField
              label="Price"
              type="number"
              register={register('price', { required: 'Price is required' })}
              errorObject={errors.price}
            />

            <FormTextField
              label="Stock"
              type="number"
              register={register('stock')}
              errorObject={errors.stock}
            />
            <FormTextField
              label="Category"
              name="categoryId"
              control={control}
              errorObject={errors.categoryId}
              isSelect
              required
              selectOptions={state.categories.map((cat) => ({
                label: cat.name,
                value: cat.id,
              }))}
            />

            <Box>
              <Typography variant="subtitle2" mb={1}>
                Product Images
              </Typography>
              <ImageUploader
                images={state.combinedImages}
                onDrop={handleImageDrop}
                onRemove={(id) =>
                  dispatch({
                    type: 'SET_COMBINED_IMAGES',
                    payload: state.combinedImages.filter((img) => img.id !== id),
                  })
                }
                onReorderAll={(newOrder) =>
                  dispatch({ type: 'SET_COMBINED_IMAGES', payload: newOrder })
                }
                showSnackbar={false}
                onCloseSnackbar={() => {}}
              />
            </Box>

            <Box textAlign="right">
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting || state.isUploadingImages}
              >
                Save
              </Button>
            </Box>
          </Stack>
        </form>
      </Paper>

      {/* Snackbars etc here as before */}
    </Box>
  );
}
