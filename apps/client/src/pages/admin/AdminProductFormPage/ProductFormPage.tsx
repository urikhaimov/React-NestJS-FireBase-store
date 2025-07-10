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

import { storage, db } from '../../../firebase'; // Adjust your import paths
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, setDoc, updateDoc, serverTimestamp, collection } from 'firebase/firestore';

import { useProduct } from '../../../hooks/useProduct';
import ImageUploader, { CombinedImage } from '../../../components/ImageUploader';
import { productFormReducer, initialProductFormState } from './productFormReducer';
import FormTextField from '../../../components/FormTextField';

// Fetch categories from API or replace with your API call
async function fetchCategories() {
  const res = await fetch('/api/categories'); // Adjust API endpoint
  if (!res.ok) throw new Error('Failed to fetch categories');
  return await res.json();
}

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

  useEffect(() => {
    async function loadCategories() {
      try {
        const categories = await fetchCategories();
        dispatch({ type: 'SET_CATEGORIES', payload: categories });
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    }
    loadCategories();
  }, []);

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
      id: URL.createObjectURL(file),
      url: URL.createObjectURL(file),
      type: 'new',
      file,
      progress: 0,
    }));
    dispatch({ type: 'ADD_COMBINED_IMAGES', payload: newImages });
  };

  // Helper to upload a single file to Firebase Storage
  async function uploadFile(file: File, productDocId: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, `products/${productDocId}/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Optional: dispatch upload progress if desired
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          // e.g. dispatch({ type: 'SET_UPLOAD_PROGRESS', payload: { id: file.name, progress } });
        },
        (error) => {
          reject(error);
        },
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(url);
        }
      );
    });
  }

  const onSubmit = async (data: FormState) => {
    try {
      dispatch({ type: 'SET_UPLOADING_IMAGES', payload: true });

      // Generate product ID for new product
      let productDocId = productId ?? '';
      if (mode === 'add' && !productDocId) {
        const newDocRef = doc(collection(db, 'products'));
        productDocId = newDocRef.id;
      }

      // Upload new images
      const newImages = state.combinedImages.filter((img) => img.type === 'new');
      const uploadedUrls = await Promise.all(
        newImages.map((img) => {
          if (!img.file) throw new Error('Missing file for upload');
          return uploadFile(img.file, productDocId);
        })
      );

      // Combine existing images + uploaded URLs
      const existingUrls = state.combinedImages
        .filter((img) => img.type === 'existing')
        .map((img) => img.url);

      const allImageUrls = [...existingUrls, ...uploadedUrls];

      // Prepare product data
      const productData = {
        name: data.name,
        description: data.description,
        price: Number(data.price),
        stock: Number(data.stock),
        categoryId: data.categoryId,
        images: allImageUrls,
        updatedAt: serverTimestamp(),
      };

      // Save to Firestore
      if (mode === 'edit' && productId) {
        const productRef = doc(db, 'products', productId);
        await updateDoc(productRef, productData);
      } else {
        // New product
        const newDocRef = doc(db, 'products', productDocId);
        await setDoc(newDocRef, {
          ...productData,
          createdAt: serverTimestamp(),
        });
      }

      dispatch({ type: 'SET_SHOW_SUCCESS_SNACKBAR', payload: true });
      dispatch({ type: 'SET_UPLOADING_IMAGES', payload: false });

      alert('Product saved successfully!');
      navigate('/admin/products');
    } catch (error) {
      console.error('Failed to save product:', error);
      dispatch({ type: 'SET_UPLOADING_IMAGES', payload: false });
      alert('Failed to save product. Check console for details.');
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
                disabled={isSubmitting || state.isUploadingImages}
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
