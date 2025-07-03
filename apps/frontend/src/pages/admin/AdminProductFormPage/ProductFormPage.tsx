// src/pages/admin/AdminProductFormPage/ProductFormPage.tsx
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Snackbar,
  Alert,
} from '@mui/material';
import { useEffect, useReducer, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  getProductById,
  createProduct,
  updateProduct,
  arraysEqual,
} from '../../../api/products';
import { fetchCategories } from '../../../api/categories';
import ImageUploader, { CombinedImage } from '../../../components/ImageUploader';
import { useSafeAuth } from '../../../hooks/getSafeAuth';
import type { Category } from '../../../types/firebase';
import {
  productFormReducer,
  initialProductFormState,
} from './productFormReducer';
import { generateId } from '../../../utils/generateId'; // helper to create random IDs

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
  const { productId } = useParams();
  const navigate = useNavigate();
  const { user } = useSafeAuth();

  const [categories, setCategories] = useState<Category[]>([]);
  const [state, dispatch] = useReducer(productFormReducer, initialProductFormState);
  const [showSnackbar, setShowSnackbar] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FormState>();

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  useEffect(() => {
    if (mode === 'edit' && productId && categories.length) {
      getProductById(productId).then((product) => {
        if (product) {
          const validCategory = categories.find((c) => c.id === product.categoryId);
          reset({
            name: product.name,
            description: product.description,
            price: product.price.toString(),
            stock: product.stock.toString(),
            categoryId: validCategory ? validCategory.id : '',
          });

          // initialize images
          const images: CombinedImage[] = product.images.map((url) => ({
            id: url,
            url,
            type: 'existing',
          }));
          dispatch({ type: 'SET_PRODUCT', payload: product });
          dispatch({ type: 'SET_COMBINED_IMAGES', payload: images });
        }
      });
    }
  }, [mode, productId, categories, reset]);

  const handleImageDrop = (acceptedFiles: File[]) => {
    const newImages: CombinedImage[] = acceptedFiles.map((file) => ({
      id: generateId(),
      url: URL.createObjectURL(file),
      type: 'new',
      file,
      progress: 0,
    }));

    dispatch({ type: 'ADD_COMBINED_IMAGES', payload: newImages });
  };

  const onSubmit = async (data: FormState) => {
    const payload = {
      name: data.name.trim(),
      description: data.description.trim(),
      price: Number(data.price),
      stock: Number(data.stock),
      categoryId: data.categoryId,
    };

    if (!user) return;

    const keepImageUrls = state.combinedImages
      .filter((img) => img.type === 'existing')
      .map((img) => img.url);

    const newFiles = state.combinedImages
      .filter((img) => img.type === 'new' && img.file)
      .map((img) => img.file!);

    if (mode === 'add') {
      await createProduct({
        ...payload,
        images: [],
        createdBy: user.uid,
      }, user.uid);
      navigate('/admin/products');
    }

    if (mode === 'edit' && productId && state.product) {
      const existing = state.product;

      const formChanged =
        payload.name !== existing.name ||
        payload.description !== existing.description ||
        payload.price !== existing.price ||
        payload.stock !== existing.stock ||
        payload.categoryId !== existing.categoryId;

      const imageChanged =
        !arraysEqual(existing.images, keepImageUrls) ||
        newFiles.length > 0;

      if (!formChanged && !imageChanged) {
        setShowSnackbar(true);
        setTimeout(() => {
          navigate('/admin/products');
        }, 1500);
        return;
      }

      await updateProduct(productId, {
        data: formChanged ? payload : {},
        keepImageUrls,
        newImageFiles: newFiles,
      });

      navigate('/admin/products');
    }
  };

  return (
    <Box p={3} height="100%" overflow="auto">
      <Typography variant="h6" mb={2}>
        {mode === 'add' ? 'Add New Product' : 'Edit Product'}
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <TextField label="Name" fullWidth margin="normal" {...register('name', { required: true })} />
        <TextField label="Description" fullWidth margin="normal" {...register('description')} />
        <TextField label="Price" fullWidth margin="normal" type="number" {...register('price', { required: true })} />
        <TextField label="Stock" fullWidth margin="normal" type="number" {...register('stock')} />

        <TextField label="Category" select fullWidth margin="normal" {...register('categoryId')}>
          {categories.map((cat) => (
            <MenuItem key={cat.id} value={cat.id}>
              {cat.name}
            </MenuItem>
          ))}
        </TextField>

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
          showSnackbar={showSnackbar}
          onCloseSnackbar={() => setShowSnackbar(false)}
        />

        <Box display="flex" justifyContent="flex-end" px={3}>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting || state.isUploadingImages}
            sx={{ mt: 3 }}
          >
            Save
          </Button>
        </Box>
      </form>
    </Box>
  );
}
