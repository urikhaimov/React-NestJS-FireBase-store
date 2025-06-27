import {
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  Button,
  Box,
} from '@mui/material';
import { useCartStore } from '../../store/cartStore';
import type { Props } from './CardReducer';

export default function ProductCard({ product }: Props) {
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: 'center',
        gap: 1,
        p: 1,
      }}
    >
      <CardMedia
        component="img"
        sx={{
          width: 80,
          height: 80,
          borderRadius: 1,
          objectFit: 'cover',
          mx: { xs: 'auto', sm: 0 },
        }}
        image={product.images?.[0] || 'https://picsum.photos/seed/fallback/100/100'}
        alt={product.name}
      />

      <CardContent
        sx={{
          flex: 1,
          textAlign: { xs: 'center', sm: 'left' },
          px: 1,
        }}
      >
        <Typography variant="subtitle1" fontWeight="bold">
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          ${product?.price?.toFixed(2) ?? 'N/A'} • Stock: {product?.stock ?? 'N/A'}
        </Typography>
      </CardContent>

      <CardActions
        sx={{
          justifyContent: { xs: 'center', sm: 'flex-end' },
          px: 1,
        }}
      >
        <Button
          variant="contained"
          size="small"
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
        >
          Add to Cart
        </Button>
      </CardActions>
    </Card>
  );
}
