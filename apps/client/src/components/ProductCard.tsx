// src/components/ProductCard.tsx
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
  product: Product;
};

export default function ProductCard({ product }: Props) {
  console.log('Rendering ProductCard:', product);
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {product.imageUrl && product.images && (
        <CardMedia
          component="img"
          height="180"
          image={product.images.length > 0 ? product.images[0] : product.imageUrl }
          alt={product.name}
          sx={{ objectFit: 'cover' }}
        />
      )}

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          ${product.price?.toFixed(2)}
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
