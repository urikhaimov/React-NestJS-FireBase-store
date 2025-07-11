// src/pages/ProductsPage/ProductsPage.tsx
import React, { useReducer, useMemo, useEffect, useRef, useCallback, useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { Dayjs } from 'dayjs';

import { fetchAllProducts } from '../../api/products';
import { useAuthReady } from '../../hooks/useAuthReady';
import { useCategories } from '../../hooks/useCategories';
import { useCartStore } from '../../stores/useCartStore';
import PageWithStickyFilters from '../../layouts/PageWithStickyFilters';
import UserProductFilters from './UserProductFilters';
import ProductCardContainer from './ProductCardContainer';
import LoadingProgress from '../../components/LoadingProgress';
import type { Product } from '../../types/firebase';

import { reducer, initialState, State, Action } from './LocalReducer';

export default function ProductsPage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [products, setProducts] = useState<Product[]>([]);
  const [visibleCount, setVisibleCount] = useState(initialState.pageSize);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const { user, ready } = useAuthReady();
  const { data: categories = [] } = useCategories();
  const cart = useCartStore();

  useEffect(() => {
    const loadProducts = async () => {
      if (!ready || !user) return;
      try {
        const token = await user.getIdToken();
        const res = await fetchAllProducts(token);

        if (!Array.isArray(res.data)) {
          console.error('❌ Invalid product response (not an array):', res.data);
          setProducts([]);
          return;
        }

        setProducts(res.data);
      } catch (err) {
        console.error('❌ Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [ready, user]);

  const isDate = (val: unknown): val is Date => val instanceof Date;

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const txt = state.search.toLowerCase();
      const inText =
        p.name.toLowerCase().includes(txt) ||
        (p.description?.toLowerCase().includes(txt) ?? false);

      const inCat =
        !state.selectedCategoryId || p.categoryId === state.selectedCategoryId;

      const inDate =
        !state.createdAfter ||
        (() => {
          if (!p.createdAt) return false;

          let productDate: Date | null = null;

          if (typeof p.createdAt === 'string') {
            productDate = new Date(p.createdAt);
          } else if (
            p.createdAt !== null &&
            typeof p.createdAt === 'object' &&
            typeof (p.createdAt as any)?.toDate === 'function'
          ) {
            productDate = (p.createdAt as any).toDate();
          } else if (isDate(p.createdAt)) {
            productDate = p.createdAt;
          }

          if (!productDate) return false;

          return productDate.getTime() >= state.createdAfter!.toDate().getTime();
        })();

      const inStock = !state.inStockOnly || p.stock > 0;

      const inPriceRange =
        (state.minPrice === null || p.price >= state.minPrice) &&
        (state.maxPrice === null || p.price <= state.maxPrice);

      return inText && inCat && inDate && inStock && inPriceRange;
    });
  }, [products, state]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];
      if (entry.isIntersecting && visibleCount < filteredProducts.length) {
        setVisibleCount((prev) => prev + state.pageSize);
      }
    },
    [filteredProducts.length, visibleCount, state.pageSize]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersect, {
      rootMargin: '100px',
    });

    if (observerRef.current) observer.observe(observerRef.current);

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [handleIntersect]);

  if (loading) return <LoadingProgress />;

  return (
    <PageWithStickyFilters>
      <Typography variant="h4" gutterBottom>
        Products
      </Typography>

      <UserProductFilters
        state={state}
        dispatch={dispatch}
        categories={categories}
      />

      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          maxHeight: 'calc(100vh - 240px)',
          px: 1,
          position: 'relative',
          scrollbarWidth: 'thin',
          scrollbarColor: '#888 #2c2c2c',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#2c2c2c',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#888',
            borderRadius: '8px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#aaa',
          },
        }}
      >
        {visibleProducts.length === 0 ? (
          <Typography>No products found.</Typography>
        ) : (
          <>
            {visibleProducts.map((p) => (
              <Box mb={2} key={p.id}>
                <ProductCardContainer
                  product={p}
                  disabled={false}
                  onAddToCart={() => setSnackbarOpen(true)}
                  onConfirmDelete={() => {}}
                />
              </Box>
            ))}
            {visibleCount < filteredProducts.length && (
              <Box
                ref={observerRef}
                display="flex"
                justifyContent="center"
                mt={2}
              >
                <CircularProgress />
              </Box>
            )}
          </>
        )}
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled">
          Product added to cart
        </Alert>
      </Snackbar>
    </PageWithStickyFilters>
  );
}
