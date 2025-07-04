import React from 'react';
import { Card, CardMedia, CardContent, Typography, CardActions, Button } from '@mui/material';
import type { Product } from '../types/firebase'; // Adjust if needed

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  return (
    <Card>
      {product.imageUrl && (
        <CardMedia
          component="img"
          height="180"
          image={product.imageUrl}
          alt={product.name}
        />
      )}
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          ${product.price?.toFixed(2)}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" variant="contained">
          View
        </Button>
      </CardActions>
    </Card>
  );
}
