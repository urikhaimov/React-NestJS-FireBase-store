// src/components/ProductCard.tsx
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material';
import { IProduct } from '@common/types';

type Props = {
  product: IProduct;
};

export default function ProductCard({ product }: Props) {
  console.log('Rendering ProductCard:', product);
  const formattedPrice = Number(product.price).toFixed(2);
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {product.imageUrl && product.images && (
        <CardMedia
          component="img"
          height="180"
          image={
            product.images.length > 0 ? product.images[0] : product.imageUrl
          }
          alt={product.name}
          sx={{ objectFit: 'cover' }}
        />
      )}

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          ${formattedPrice}
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
