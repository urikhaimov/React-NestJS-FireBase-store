import React, {
  useMemo,
  useReducer,
  useEffect,
  useState,
  useRef,
  useCallback,
} from 'react';
import {
  Box,
  Typography,
  Divider,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import { useCategories } from '../../hooks/useCategories';
import { useCartStore } from '../../store/cartStore';
import PageWithStickyFilters from '../../layouts/PageWithStickyFilters';
import { reducer, initialState } from './LocalReducer';
import UserProductFilters from './UserProductFilters';
import { fetchAllProducts } from '../../api/productApi';
import { useAuthReady } from '../../hooks/useAuthReady';
import ProductCardContainer from './ProductCardContainer';
import LoadingProgress from '../../components/LoadingProgress';
import type { Product } from '../../types/firebase'; // Adjust this import path as needed

export default function ProductsPage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [products, setProducts] = useState<Product[]>([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const observerRef = useRef(null);
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

  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];

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
          p.createdAt.toDate().getTime() >=
          state.createdAfter.toDate().getTime());

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
        setVisibleCount((prev) => prev + 10);
      }
    },
    [filteredProducts.length, visibleCount]
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
          scrollbarWidth: 'thin', // Firefox
          scrollbarColor: '#888 #2c2c2c', // Firefox
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
                  onConfirmDelete={() => { }}
                />
              </Box>
            ))}
            {visibleCount < filteredProducts.length && (
              <Box ref={observerRef} display="flex" justifyContent="center" mt={2}>
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
