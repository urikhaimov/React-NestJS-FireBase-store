import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';


import { db } from '../../firebase';
import { useCartStore } from '../../stores/useCartStore';
import ImageGallery from '../../components/ImageGallery';
import DOMPurify from 'dompurify';
import PageWithStickyFilters from '../../layouts/PageWithStickyFilters';

export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!id) return;
        const ref = doc(db, 'products', decodeURIComponent(id));
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setProduct({ id: snap.id, ...snap.data() });
        }
      } catch (error) {
        console.error('Error loading product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <Typography>Loading...</Typography>;
  if (!product) return <Typography>Product not found.</Typography>;
  console.log('Product details:', product);
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
              ${product.price?.toFixed(2)}
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

// ✅ Inline ImageGallery component
