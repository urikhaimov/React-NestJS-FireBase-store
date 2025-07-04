// src/pages/HomePage/ProductList.tsx
import React from 'react';
import {
  Box,
  Typography,
  Divider,
  Stack,
  Button,
  Card,
  CardContent,
  CardMedia,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Product, Category } from '../../types/firebase';
import { useCartStore } from '../../store/cartStore';

type Props = {
  products: Product[];
  categories: Category[];
};

export default function ProductList({ products, categories }: Props) {
  const cart = useCartStore();

  const categoryMap = new Map(categories.map((c) => [c.id, c.name]));
  const grouped = products.reduce<Record<string, Product[]>>((acc, p) => {
    const name = categoryMap.get(p.categoryId) || 'Uncategorized';
    if (!acc[name]) acc[name] = [];
    acc[name].push(p);
    return acc;
  }, {});

  return (
    <Box component="section">
      {Object.entries(grouped).map(([category, items]) => (
        <Box key={category} mb={4}>
          <Divider sx={{ mb: 2 }}>
            <Typography variant="h6">{category}</Typography>
          </Divider>
          <Stack spacing={2}>
            {items.map((p) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card sx={{ display: 'flex', gap: 2, alignItems: 'center', p: 2 }}>
                  <CardMedia
                    component="img"
                    sx={{ width: 120, height: 120, objectFit: 'cover' }}
                    image={p.images?.[0] || '/placeholder.png'}
                    alt={p.name}
                  />
                  <CardContent sx={{ flex: 1 }}>
                    <Typography variant="h6">{p.name}</Typography>
                    <Typography variant="body2" color="text.secondary" mb={1}>
                      {p.description}
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      ${p.price}
                    </Typography>
                  </CardContent>
                  <Button
                    variant="contained"
                    onClick={() =>
                      cart.addToCart({
                        id: p.id,
                        name: p.name,
                        price: p.price,
                        stock: p.stock || 100,
                        images: p.images || [],
                        categoryId: p.categoryId,
                        createdAt: p.createdAt,
                        updatedAt: p.updatedAt,
                        createdBy: p.createdBy,
                        description: p.description,
                      })
                    }
                  >
                    Add to Cart
                  </Button>
                </Card>
              </motion.div>
            ))}
          </Stack>
        </Box>
      ))}

      {products.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          No products match your filters.
        </Typography>
      )}
    </Box>
  );
}
