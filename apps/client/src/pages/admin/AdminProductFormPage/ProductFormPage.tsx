import {
  Box,
  Button,
  MenuItem,
  Snackbar,
  Alert,
  Typography,
  Paper,
  Stack,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
} from '@mui/material';
import { useEffect, useReducer } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import ReactQuill from 'react-quill';

import {
  getProductById,
  createProduct,
  updateProduct,
  arraysEqual,
} from '../../../api/products';
import { fetchCategories } from '../../../api/categories';
import ImageUploader, { CombinedImage } from '../../../components/ImageUploader';
import { useSafeAuth } from '../../../hooks/getSafeAuth';
import { productFormReducer, initialProductFormState } from './productFormReducer';
import { generateId } from '../../../utils/generateId';
import FormTextField from '../../../components/FormTextField';

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
    },
  });

  useEffect(() => {
    fetchCategories().then((categories) =>
      dispatch({ type: 'SET_CATEGORIES', payload: categories })
    );
  }, []);

  useEffect(() => {
    const load = async () => {
      if (mode === 'edit' && productId && state.categories.length > 0) {
        const product = await getProductById(productId);
        if (!product) return;

        dispatch({ type: 'SET_PRODUCT', payload: product });

        reset({
          name: product.name,
          description: product.description,
          price: product.price.toString(),
          stock: product.stock.toString(),
          categoryId: product.categoryId ?? '',
        });

        const images: CombinedImage[] = product.images.map((url) => ({
          id: url,
          url,
          type: 'existing',
        }));

        dispatch({ type: 'SET_COMBINED_IMAGES', payload: images });
        dispatch({ type: 'SET_READY', payload: true });
      }

      if (mode === 'add' && state.categories.length > 0) {
        dispatch({ type: 'SET_READY', payload: true });
      }
    };

    load();
  }, [mode, productId, state.categories.length, reset]);

  const handleImageDrop = (acceptedFiles: File[]) => {
    const currentCount = state.combinedImages.length;
    if (currentCount + acceptedFiles.length > 4) {
      dispatch({ type: 'SET_SHOW_LIMIT_SNACKBAR', payload: true });
      return;
    }

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
      await createProduct(
        { ...payload, images: [], createdBy: user.uid },
        user.uid
      );
      navigate('/admin/products');
    }

    if (mode === 'edit' && productId && state.product) {
      const existing = state.product;
      const formChanged = Object.keys(payload).some(
        (key) =>
          payload[key as keyof typeof payload] !==
          existing[key as keyof typeof payload]
      );
      const imageChanged =
        !arraysEqual(existing.images, keepImageUrls) || newFiles.length > 0;

      if (!formChanged && !imageChanged) {
        dispatch({ type: 'SET_SHOW_SUCCESS_SNACKBAR', payload: true });
        setTimeout(() => navigate('/admin/products'), 1500);
        return;
      }

      await updateProduct(productId, {
        data: formChanged ? payload : {},
        keepImageUrls,
        newImageFiles: newFiles,
      });

      dispatch({ type: 'SET_SHOW_SUCCESS_SNACKBAR', payload: true });
      setTimeout(() => navigate('/admin/products'), 1500);
    }
  };

  if (!state.ready) {
    return (
      <Box p={3}>
        <Typography>Loading...</Typography>
      </Box>
    );
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
                onCloseSnackbar={() => { }}
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

      <Snackbar
        open={state.showSuccessSnackbar}
        autoHideDuration={3000}
        onClose={() =>
          dispatch({ type: 'SET_SHOW_SUCCESS_SNACKBAR', payload: false })
        }
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() =>
            dispatch({ type: 'SET_SHOW_SUCCESS_SNACKBAR', payload: false })
          }
          severity="success"
          sx={{ width: '100%' }}
        >
          Product saved successfully
        </Alert>
      </Snackbar>

      <Snackbar
        open={state.showLimitSnackbar}
        autoHideDuration={4000}
        onClose={() =>
          dispatch({ type: 'SET_SHOW_LIMIT_SNACKBAR', payload: false })
        }
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() =>
            dispatch({ type: 'SET_SHOW_LIMIT_SNACKBAR', payload: false })
          }
          severity="error"
          sx={{ width: '100%' }}
        >
          You can only upload up to 4 images.
        </Alert>
      </Snackbar>
    </Box>
  );
}
