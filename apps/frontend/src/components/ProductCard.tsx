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
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {product.imageUrl && (
        <CardMedia
          component="img"
          height="180"
          image={product.imageUrl}
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
