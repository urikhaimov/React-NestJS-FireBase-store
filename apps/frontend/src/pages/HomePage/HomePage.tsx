import React, { useMemo, useReducer } from 'react';
import { Box, Typography, Card, CardContent, CardMedia, Button, Divider, Pagination } from '@mui/material';
import { VariableSizeList, ListChildComponentProps } from 'react-window';
import { useAllProducts } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';
import { useCartStore } from '../../store/cartStore';
import PageWithStickyFilters from '../../layouts/PageWithStickyFilters';
import { Product } from '../../types/firebase';
import { reducer, initialState } from './LocalReducer';
import ProductFilters from './ProductFilters'; // 👈 your reusable filter UI

export default function HomePage() {
  const { data: products = [] } = useAllProducts();
  const { data: categories = [] } = useCategories();
  const [state, dispatch] = useReducer(reducer, initialState);
  const cart = useCartStore();

  const categoryMap = useMemo(() => {
    return new Map(categories.map((c) => [c.id, c.name]));
  }, [categories]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const txt = state.search.toLowerCase();
      const inText =
        p.name.toLowerCase().includes(txt) ||
        p.description?.toLowerCase().includes(txt);

      const inCat =
        !state.selectedCategoryId || p.categoryId === state.selectedCategoryId;

      const inDate =
        !state.createdAfter ||
        (p.createdAt?.toDate &&
          p.createdAt.toDate().getTime() >= state.createdAfter.toDate().getTime());

      return inText && inCat && inDate;
    });
  }, [products, state]);

  const paginatedProducts = useMemo(() => {
    const start = (state.page - 1) * state.pageSize;
    return filteredProducts.slice(start, start + state.pageSize);
  }, [filteredProducts, state.page, state.pageSize]);

  const totalPages = Math.ceil(filteredProducts.length / state.pageSize);

  const flatList = useMemo(() => {
    const grouped = paginatedProducts.reduce<Record<string, Product[]>>((acc, p) => {
      const name = categoryMap.get(p.categoryId) || 'Uncategorized';
      if (!acc[name]) acc[name] = [];
      acc[name].push(p);
      return acc;
    }, {});

    const result: { type: 'header' | 'product'; category?: string; product?: Product }[] = [];

    for (const [category, items] of Object.entries(grouped)) {
      result.push({ type: 'header', category });
      for (const p of items) {
        result.push({ type: 'product', product: p });
      }
    }

    return result;
  }, [paginatedProducts, categoryMap]);

  const getItemSize = (index: number) => {
    return flatList[index].type === 'header' ? 70 : 190;
  };

  const Row = ({ index, style }: ListChildComponentProps) => {
    const item = flatList[index];
    if (item.type === 'header') {
      return (
        <Box style={style} px={2} py={0.5}>
          <Divider sx={{ mb: 0.5 }}>
            <Typography variant="subtitle2" fontWeight="bold">
              {item.category}
            </Typography>
          </Divider>
        </Box>
      );
    }

    const p = item.product!;
    return (
      <Box style={style} px={2}>
        <Card
          sx={{
            display: 'flex',
            gap: 2,
            alignItems: 'center',
            p: 2,
            flexWrap: 'wrap',
          }}
        >
          <CardMedia
            component="img"
            sx={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 1 }}
            image={p.imageUrls?.[0] || '/placeholder.png'}
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
                quantity: p.quantity || 0,
                stock: p.stock || 100,
                categoryId: p.categoryId,
              })
            }
          >
            Add to Cart
          </Button>
        </Card>
      </Box>
    );
  };

  return (
    <PageWithStickyFilters>
      <Typography variant="h4" gutterBottom>
        Products
      </Typography>

      <ProductFilters state={state} dispatch={dispatch} categories={categories} />

      {flatList.length === 0 ? (
        <Typography>No products found.</Typography>
      ) : (
        <>
          <VariableSizeList
            height={600}
            width="100%"
            itemCount={flatList.length}
            itemSize={getItemSize}
          >
            {Row}
          </VariableSizeList>

          <Box display="flex" justifyContent="center" mt={4}>
            <Pagination
              count={totalPages}
              page={state.page}
              onChange={(_, val) => dispatch({ type: 'SET_PAGE', payload: val })}
              color="primary"
            />
          </Box>
        </>
      )}
    </PageWithStickyFilters>
  );
}
