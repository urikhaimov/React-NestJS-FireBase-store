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
} from '@mui/material';
import { useEffect, useReducer, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { fetchCategories } from '../../../api/categories';
import { getProductById, createProduct, updateProduct } from '../../../api/products';
import type { Category } from '../../../types/firebase';
import { productFormReducer, initialProductFormState } from './productFormReducer';
import ProductImageManagerWithDropzone from './ProductImageManagerWithDropzone';
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
  const { product, keepImageUrls, newFiles, uploading, success } = state;
  const [categories, setCategories] = useState<Category[]>([]);

  const {
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
        setValue('categoryId', ''); // Leave blank initially to allow deselect
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

  const onSubmit = async (data: FormState) => {
    if (!data.categoryId) return; // prevent invalid submission

    dispatch({ type: 'SET_UPLOADING', payload: true });

    try {
      const payload = {
        name: data.name,
        description: data.description,
        price: Number(data.price),
        stock: Number(data.stock),
        categoryId: data.categoryId,
      };

      if (isEdit && productId) {
        await updateProduct(productId, {
          data: payload,
          keepImageUrls,
          newImages: newFiles,
        });
      } else {
        await createProduct(
          { ...payload, images: newFiles, createdBy: user?.uid || 'unknown' },
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

  if (isEdit && product === undefined) return <CircularProgress sx={{ mt: 4 }} />;
  if (isEdit && product === null)
    return <Typography sx={{ mt: 4 }}>❌ Product not found.</Typography>;

  return (
    <Box
      sx={{
        height: '100vh',
        overflowY: 'auto',
        px: 2,
        pt: { xs: 0.5, sm: 3 },
        pb: { xs: 1, sm: 3 },
        bgcolor: 'background.default',
      }}
    >
      <Typography variant="h4" gutterBottom>
        {isEdit ? 'Edit Product' : 'Add Product'}
      </Typography>

      <Paper sx={{ p: { xs: 2, sm: 3 }, maxWidth: 1200, mx: 'auto' }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Product Name"
            {...register('name', { required: true })}
            fullWidth
            margin="normal"
            error={!!errors.name}
            helperText={errors.name && 'Name is required'}
          />
          <TextField
            label="Description"
            {...register('description', { required: true })}
            fullWidth
            margin="normal"
            error={!!errors.description}
            helperText={errors.description && 'Description is required'}
          />
          <TextField
            label="Price"
            type="number"
            {...register('price', { required: true })}
            fullWidth
            margin="normal"
            error={!!errors.price}
            helperText={errors.price && 'Price is required'}
          />
          <TextField
            label="Stock"
            type="number"
            {...register('stock', { required: true })}
            fullWidth
            margin="normal"
            error={!!errors.stock}
            helperText={errors.stock && 'Stock is required'}
          />
          <TextField
            label="Category"
            select
            {...register('categoryId', {
              required: 'Category is required',
              validate: (val) => val !== '' || 'Please select a category',
            })}
            fullWidth
            margin="normal"
            error={!!errors.categoryId}
            helperText={errors.categoryId?.message}
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

          <Box mt={2}>
            <ProductImageManagerWithDropzone
              initialImageUrls={keepImageUrls}
              onChange={({ keepImageUrls, newFiles }) => {
                dispatch({ type: 'SET_KEEP_IMAGE_URLS', payload: keepImageUrls });
                dispatch({ type: 'SET_NEW_FILES', payload: newFiles });
              }}
            />
          </Box>

          <Box mt={3}>
            <Button type="submit" variant="contained" disabled={uploading}>
              {uploading ? 'Uploading...' : isEdit ? 'Save Changes' : 'Add Product'}
            </Button>
          </Box>
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
