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
  IconButton,
  Grid,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import { fetchCategories } from '../../../api/categories';
import { getProductById, updateProduct, createProduct } from '../../../api/products';

import { uploadFilesAndReturnUrls } from '../../../utils/uploadFilesAndReturnUrls';
import type { Category, Product } from '../../../types/firebase';
import PageWithStickyFilters from '../../../layouts/PageWithStickyFilters';

type FormState = {
  name: string;
  description: string;
  price: string;
  stock: string;
  categoryId: string;
  imageUrls: string[];
};

type Props = {
  mode: 'add' | 'edit';
};

export default function ProductFormPage({ mode }: Props) {
  const isEdit = mode === 'edit';
  const { productId } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [product, setProduct] = useState<Product | null | undefined>(isEdit ? undefined : null);
  const [success, setSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FormState>({
    defaultValues: {
      name: '',
      description: '',
      price: '',
      stock: '',
      categoryId: '',
      imageUrls: [],
    },
  });

  useEffect(() => {
    fetchCategories().then(setCategories);

    if (isEdit && productId) {
      getProductById(productId)
        .then((prod) => {
          if (prod) {
            setProduct(prod);
            const defaults = {
              name: prod.name,
              description: prod.description,
              price: String(prod.price),
              stock: String(prod.stock),
              categoryId: prod.categoryId,
              imageUrls: prod.imageUrls || [],
            };
            Object.entries(defaults).forEach(([key, val]) =>
              setValue(key as keyof FormState, val ?? '')
            );
            setPreviewUrls(prod.imageUrls || []);
          } else {
            setProduct(null);
          }
        })
        .catch(() => setProduct(null));
    }
  }, [isEdit, productId, setValue]);

  const onDrop = async (acceptedFiles: File[]) => {
    const MAX_IMAGES = 5;
    const MAX_FILE_SIZE = 2 * 1024 * 1024;
    const currentUrls = getValues('imageUrls');

    if (currentUrls.length + acceptedFiles.length > MAX_IMAGES) {
      alert('Max 5 images allowed');
      return;
    }

    const validFiles = acceptedFiles.filter((file) => {
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not a valid image.`);
        return false;
      }
      if (file.size > MAX_FILE_SIZE) {
        alert(`${file.name} is too large (max 2MB).`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setUploading(true);
    try {
      const urls = await uploadFilesAndReturnUrls(validFiles, 'products');
      const updatedUrls = [...currentUrls, ...urls];
      setValue('imageUrls', updatedUrls);
      setPreviewUrls(updatedUrls);
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Image upload failed. Try again.');
    }
    setUploading(false);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const onSubmit = async (data: FormState) => {
    try {
      const payload = {
        name: data.name,
        description: data.description,
        price: Number(data.price),
        stock: Number(data.stock),
        categoryId: data.categoryId,
        imageUrls: data.imageUrls,
      };

      if (isEdit && productId) {
        await updateProduct(productId, payload);
      } else {
        await createProduct({ ...payload, images: [] }); // images already uploaded
      }

      setSuccess(true);
      setTimeout(() => navigate('/admin/products'), 1000);
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  if (isEdit && product === undefined) return <CircularProgress sx={{ mt: 4 }} />;
  if (isEdit && product === null)
    return <Typography sx={{ mt: 4 }}>❌ Product not found.</Typography>;

  return (
    <PageWithStickyFilters >

      <Typography variant="h4" gutterBottom>
        {isEdit ? 'Edit Product' : 'Add Product'}
      </Typography>
      <Paper sx={{ p: 3, maxWidth: 700 }}>
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
            {...register('categoryId', { required: true })}
            fullWidth
            margin="normal"
            error={!!errors.categoryId}
            helperText={errors.categoryId && 'Category is required'}
          >
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </TextField>

          <Box mt={2}>
            <Typography variant="subtitle1">Product Images</Typography>
            <Box
              {...getRootProps()}
              sx={{
                border: '1px dashed grey',
                p: 2,
                mt: 1,
                cursor: 'pointer',
                bgcolor: '#fafafa',
              }}
            >
              <input {...getInputProps()} />
              <Typography>Drag & drop or click to upload (max 5)</Typography>
            </Box>
          </Box>

          <Grid container spacing={2} sx={{ mt: 1 }}>
            {previewUrls.map((url, index) => (
              <Grid item key={url}>
                <Box position="relative">
                  <img
                    src={url}
                    alt={`preview-${index}`}
                    width={100}
                    height={100}
                    style={{ borderRadius: 8 }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => {
                      const filtered = getValues('imageUrls').filter((u) => u !== url);
                      setValue('imageUrls', filtered);
                      setPreviewUrls((prev) => prev.filter((p) => p !== url));
                    }}
                    sx={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      bgcolor: 'white',
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Grid>
            ))}
          </Grid>

          <Box mt={3}>
            <Button type="submit" variant="contained" disabled={uploading}>
              {uploading ? 'Uploading...' : isEdit ? 'Save Changes' : 'Add Product'}
            </Button>
          </Box>
        </form>
      </Paper>

      <Snackbar open={success} autoHideDuration={3000} onClose={() => setSuccess(false)}>
        <Alert severity="success" sx={{ width: '100%' }}>
          Product {isEdit ? 'updated' : 'created'} successfully!
        </Alert>
      </Snackbar>
    </PageWithStickyFilters>
  );
}
