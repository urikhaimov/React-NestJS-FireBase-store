import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
} from '@mui/material';
import type { Product } from '../types/firebase';

type Props = {
  product?: Product | null;
};

export default function ProductCard({ product }: Props) {
  if (!product) return null;

  console.log('ProductCard product:', product);

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="180"
        image={
          Array.isArray(product.images) && product.images.length > 0
            ? product.images[0]
            : typeof product.imageUrl === 'string'
              ? product.imageUrl
              : 'https://via.placeholder.com/180'
        }
        alt={product.name ?? 'Product'}
        sx={{ objectFit: 'cover' }}
      />

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          {product.name ?? 'Unnamed product'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          ${typeof product.price === 'number' ? product.price.toFixed(2) : 'N/A'}
        </Typography>
      </CardContent>

      <CardActions>
        <Button size="small" variant="outlined" fullWidth>
          View
        </Button>
      </CardActions>
    </Card>
  );
}
