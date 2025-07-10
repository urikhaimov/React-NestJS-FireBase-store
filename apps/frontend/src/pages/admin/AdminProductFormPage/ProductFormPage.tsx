import React, { useEffect, useReducer } from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import ReactQuill from 'react-quill';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import ImageUploader, { CombinedImage } from '../../../components/ImageUploader';
import { productFormReducer, initialProductFormState } from './productFormReducer';
import FormTextField from '../../../components/FormTextField';

// Firebase imports and initialization
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { firebaseApp } from '../../../firebase'; // Adjust this path if needed

const storage = getStorage(firebaseApp);

// Define your Product type (adjust fields as per your schema)
type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  images: string[];
};

// FormState uses strings for price and stock because inputs handle strings
type FormState = {
  name: string;
  description: string;
  price: string;
  stock: string;
  categoryId: string;
  images: string[];
};

// Fetch product by ID
async function fetchProduct(productId: string): Promise<Product> {
  const res = await fetch(`/api/products/${productId}`);
  if (!res.ok) throw new Error('Failed to fetch product');
  return res.json();
}

// Save product API
async function saveProductApi(productId: string | null, data: FormState) {
  const method = productId ? 'PUT' : 'POST';
  const url = productId ? `/api/products/${productId}` : '/api/products';
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to save product');
  }
  return res.json();
}

export default function ProductFormPage({ mode }: { mode: 'add' | 'edit' }) {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [state, dispatch] = useReducer(productFormReducer, initialProductFormState);

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
      images: [],
    },
  });

  // Load categories
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch('/api/categories');
        if (!res.ok) throw new Error('Failed to fetch categories');
        const categories = await res.json();
        dispatch({ type: 'SET_CATEGORIES', payload: categories });
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    }
    loadCategories();
  }, []);

  // Load product data for editing
  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ['product', productId],
    queryFn: () => fetchProduct(productId!),
    enabled: !!productId && mode === 'edit',
  });

  // When product loads, populate form and images state
  useEffect(() => {
    if (product) {
      dispatch({ type: 'SET_PRODUCT', payload: product });

      const images: CombinedImage[] = product.images.map((url) => ({
        id: url,
        url,
        type: 'existing',
      }));

      dispatch({ type: 'SET_COMBINED_IMAGES', payload: images });

      reset({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        stock: product.stock.toString(),
        categoryId: product.categoryId || '',
        images: product.images,
      });
      dispatch({ type: 'SET_READY', payload: true });
    }
  }, [product, reset]);

  // Mutation hook to save product data
  const saveProductMutation = useMutation<
    unknown,
    Error,
    FormState
  >({
    mutationFn: (formData) => saveProductApi(productId || null, formData),
    onSuccess: () => {
      if (productId) {
        queryClient.invalidateQueries({ queryKey: ['product', productId] });
      } else {
        queryClient.invalidateQueries({ queryKey: ['products'] });
      }
      alert('Product saved successfully!');
      navigate('/admin/products');
    },
    onError: (error) => {
      alert(error.message || 'Failed to save product');
    },
  });

  // Handle new image files dropped
  const handleImageDrop = (files: File[]) => {
    const newImages: CombinedImage[] = files.map((file) => ({
      id: URL.createObjectURL(file),
      url: URL.createObjectURL(file),
      type: 'new',
      file,
      progress: 0,
    }));
    dispatch({ type: 'ADD_COMBINED_IMAGES', payload: newImages });
  };

  // Upload a single file to Firebase Storage
  async function uploadFile(file: File, productDocId: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, `products/${productDocId}/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed',
        (snapshot) => {
          // Optional: handle progress here
        },
        (error) => {
          console.error('Upload failed:', error);
          reject(error);
        },
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(url);
        }
      );
    });
  }

  // On form submit
  const onSubmit = async (data: FormState) => {
    try {
      // Generate productDocId if adding new
      const productDocId = productId || crypto.randomUUID();

      // Upload new images and get URLs
      const newImages = state.combinedImages.filter((img) => img.type === 'new');
      const uploadedUrls = await Promise.all(
        newImages.map((img) => {
          if (!img.file) throw new Error('Missing file for upload');
          return uploadFile(img.file, productDocId);
        })
      );

      // Existing image URLs from state
      const existingUrls = state.combinedImages
        .filter((img) => img.type === 'existing')
        .map((img) => img.url);

      // Combine all image URLs
      const allImageUrls = [...existingUrls, ...uploadedUrls];

      // Call mutation to save product
      saveProductMutation.mutate({
        ...data,
        images: allImageUrls,
      });
    } catch (error: any) {
      alert(error.message || 'Failed to upload images');
    }
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
                disabled={isSubmitting || saveProductMutation.status === 'pending'}
              >
                Save
              </Button>
            </Box>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}
