import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  CircularProgress,
} from '@mui/material';
import { useCartStore } from '../../stores/useCartStore';
import PageWithStickyFilters from '../../layouts/PageWithStickyFilters';
import DOMPurify from 'dompurify';
import ImageGallery from '../../components/ImageGallery';
import { useProductById } from '../../hooks/useProductById';

export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const addToCart = useCartStore((state) => state.addToCart);
  const {
    data: product,
    isLoading,
    error,
  } = useProductById(id ? decodeURIComponent(id) : undefined);

  if (isLoading) return <CircularProgress />;
  if (error || !product) return <Typography>Product not found.</Typography>;

  return (
    <PageWithStickyFilters>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <ImageGallery images={product.images || []} />
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              {product.name}
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              ${Number(product.price).toFixed(2)}
            </Typography>
            <Box
              sx={{ mb: 2 }}
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(product.description || ''),
              }}
            />
            <Typography sx={{ mb: 1 }}>
              Stock: {product.stock > 0 ? product.stock : 'Out of stock'}
            </Typography>
            <Button
              variant="contained"
              disabled={product.stock <= 0}
              onClick={() => addToCart(product)}
            >
              Add to Cart
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </PageWithStickyFilters>
  );
}
