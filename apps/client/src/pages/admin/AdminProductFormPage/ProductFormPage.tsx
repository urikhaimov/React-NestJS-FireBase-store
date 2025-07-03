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
} from '../../../api/products';
import { fetchCategories } from '../../../api/categories';
import ImageUploader from '../../../components/ImageUploader';
import { useSafeAuth } from '../../../hooks/getSafeAuth';
import { arraysEqual } from '../../../api/products';
import type { Category } from '../../../types/firebase';
import {
  productFormReducer,
  initialProductFormState,
} from './productFormReducer';

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
  const [state, dispatch] = useReducer(
    productFormReducer,
    initialProductFormState
  );
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
          dispatch({ type: 'SET_PRODUCT', payload: product });
        }
      });
    }
  }, [mode, productId, categories, reset]);

  const handleImageDrop = (acceptedFiles: File[]) => {
    const previews = acceptedFiles.map((file) => URL.createObjectURL(file));
    dispatch({ type: 'SET_NEW_FILES', payload: acceptedFiles });
    dispatch({ type: 'SET_PREVIEWS', payload: previews });
  };

  const onSubmit = async (data: FormState) => {
    console.log('Form submitted:', data);
    const payload = {
      name: data.name.trim(),
      description: data.description.trim(),
      price: Number(data.price),
      stock: Number(data.stock),
      categoryId: data.categoryId,
    };
    console.log('Form payload:', payload);
    console.log('user:', user);
    if (!user) return;

    if (mode === 'add') {
      await createProduct({
        ...payload,
        images: [],
        createdBy: user.uid,
      }, user.uid);
      navigate('/admin/products');
    }
    console.log('mode:', mode);
    console.log('productId:', productId);
    console.log('state.product:', state.product);

    if (mode === 'edit' && productId && state.product) {
      const existing = state.product;
      console.log('edit prodtuct:', existing);
      const formChanged =
        payload.name !== existing.name ||
        payload.description !== existing.description ||
        payload.price !== existing.price ||
        payload.stock !== existing.stock ||
        payload.categoryId !== existing.categoryId;

      const imageChanged =
        !arraysEqual(existing.images, state.keepImageUrls) ||
        state.newFiles.length > 0;
      console.log(imageChanged, 'imageChanged')
      console.log(formChanged, 'formChanged')
      if (!formChanged && !imageChanged) {
        setShowSnackbar(true);
        setTimeout(() => {
          navigate('/admin/products');
        }, 1500); // allow snackbar to appear briefly before navigation
        return;
      }

      await updateProduct(productId, {
        data: formChanged ? payload : {},
        keepImageUrls: state.keepImageUrls,
        newImageFiles: state.newFiles,
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
          keepImageUrls={state.keepImageUrls}
          previews={state.previews}
          progress={state.progress}
          uploadedUrls={state.uploadedUrls}
          uploading={state.uploading}
          onDrop={handleImageDrop}
          onRemoveExisting={(url) => dispatch({ type: 'SET_KEEP_IMAGE_URLS', payload: state.keepImageUrls.filter(u => u !== url) })}
          onRemoveNew={(index) => {
            const updatedFiles = [...state.newFiles];
            updatedFiles.splice(index, 1);
            const updatedPreviews = [...state.previews];
            updatedPreviews.splice(index, 1);
            dispatch({ type: 'SET_NEW_FILES', payload: updatedFiles });
            dispatch({ type: 'SET_PREVIEWS', payload: updatedPreviews });
          }}
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
