import React, { useEffect, useMemo, useReducer, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  Divider,
  Snackbar,
  Alert,
  Stack,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import AdminStickyPage from '../../../layouts/AdminStickyPage';
import { useAllCategories, Category } from '../../../hooks/useAllCategories';
import { fetchProductsPage } from '../../../hooks/fetchProductsPage';
import { deleteProduct } from '../../../hooks/deleteProduct';
import { Product } from '../../../types/firebase';
import { initialState, reducer } from './LocalReducer';
import ProductAdminCard from './ProductAdminCard';
import ProductFilters from './ProductFilters';

export default function AdminProductsPage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const deleteTimerRef = useRef<NodeJS.Timeout | null>(null);
  const { data: categories = [] } = useAllCategories() as { data: Category[] };
  const navigate = useNavigate();

  /* --------------------------------------------------
   * Firestore Fetch Helpers
   * -------------------------------------------------- */
  const loadNextPage = async () => {
    if (state.loading || !state.hasMore) return;
    dispatch({ type: 'SET_LOADING', payload: true });

    const { products: next, lastVisible } = await fetchProductsPage(state.lastDoc, {
      categoryId: state.selectedCategoryId || undefined,
      createdAfter: state.createdAfter?.toDate?.(),
    });

    dispatch({
      type: state.page === 1 ? 'SET_PRODUCTS' : 'ADD_PRODUCTS',
      payload: next,
    });
    dispatch({ type: 'SET_LAST_DOC', payload: lastVisible });
    dispatch({ type: 'SET_HAS_MORE', payload: !!lastVisible });
    dispatch({ type: 'SET_LOADING', payload: false });
  };

  /* --------------------------------------------------
   * Effect: page change
   * -------------------------------------------------- */
  useEffect(() => {
    loadNextPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.page]);

  /* --------------------------------------------------
   * Effect: filters change (category / date / searchTerm)
   * -------------------------------------------------- */
  useEffect(() => {
    // Reset pagination slice then load first page again
    dispatch({ type: 'SET_PRODUCTS', payload: [] });
    dispatch({ type: 'SET_LAST_DOC', payload: null });
    dispatch({ type: 'SET_HAS_MORE', payload: true });
    dispatch({ type: 'SET_LOADING', payload: false });
    dispatch({ type: 'DECREMENT_PAGE' }); // ensure page becomes 1 without extra guard
    dispatch({ type: 'INCREMENT_PAGE' }); // triggers loadNextPage via page effect
  }, [state.selectedCategoryId, state.createdAfter, state.searchTerm]);

  /* --------------------------------------------------
   * Client-side filtering (search text + date guard)
   * -------------------------------------------------- */
  const filteredProducts = useMemo(() => {
    const term = state.searchTerm.toLowerCase();
    return state.products.filter((p) => {
      const matchesText =
        p.name.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term);
      const matchesCategory =
        !state.selectedCategoryId || p.categoryId === state.selectedCategoryId;
      const matchesDate =
        !state.createdAfter ||
        (p.createdAt?.toDate?.() &&
          p.createdAt.toDate().getTime() >= state.createdAfter.valueOf());
      return matchesText && matchesCategory && matchesDate;
    });
  }, [state.products, state.searchTerm, state.selectedCategoryId, state.createdAfter]);

  /* --------------------------------------------------
   * Group products by category name for UI
   * -------------------------------------------------- */
  const groupedProducts = useMemo(() => {
    const categoryMap = new Map(categories.map((c) => [c.id, c.name]));
    return filteredProducts.reduce<Record<string, Product[]>>((acc, product) => {
      const catName = categoryMap.get(product.categoryId) || 'Uncategorized';
      (acc[catName] ||= []).push(product);
      return acc;
    }, {});
  }, [filteredProducts, categories]);

  /* --------------------------------------------------
   * Undo delete handler
   * -------------------------------------------------- */
  const handleUndo = () => {
    if (state.pendingDelete) {
      if (deleteTimerRef.current) clearTimeout(deleteTimerRef.current);
      dispatch({ type: 'SET_PRODUCTS', payload: [state.pendingDelete, ...state.products] });
      dispatch({ type: 'SET_PENDING_DELETE', payload: null });
    }
  };

  /* --------------------------------------------------
   * Render
   * -------------------------------------------------- */
  return (
    <AdminStickyPage
      title="Products"
      filters={
        <ProductFilters
          state={state}
          dispatch={dispatch}
          categories={categories}
          onAddProduct={() => navigate('/admin/products/add')}
        />
      }
    >
      {Object.entries(groupedProducts).map(([cat, items]) => (
        <Box key={cat} mb={4}>
          <Divider sx={{ mb: 2 }}>
            <Typography variant="h6">{cat}</Typography>
          </Divider>
          <Stack spacing={2}>
            {items.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, translateY: 12 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ProductAdminCard
                  product={product}
                  onConfirmDelete={(id) => {
                    const deleted = state.products.find((p) => p.id === id);
                    if (!deleted) return;
                    dispatch({ type: 'REMOVE_PRODUCT', payload: id });
                    dispatch({ type: 'SET_PENDING_DELETE', payload: deleted });
                    deleteTimerRef.current = setTimeout(async () => {
                      try {
                        await deleteProduct(id);
                        dispatch({ type: 'SET_SUCCESS_MESSAGE', payload: 'Product deleted.' });
                      } catch (err) {
                        console.error(err);
                      }
                      dispatch({ type: 'SET_PENDING_DELETE', payload: null });
                    }, 4000);
                  }}
                />
              </motion.div>
            ))}
          </Stack>
        </Box>
      ))}

      {/* Pagination Controls */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mt={4}>
        <Button variant="outlined" disabled={state.page === 1} onClick={() => dispatch({ type: 'DECREMENT_PAGE' })}>
          Previous
        </Button>
        <Typography variant="body2">Page {state.page}</Typography>
        <Button variant="contained" disabled={!state.hasMore} onClick={() => dispatch({ type: 'INCREMENT_PAGE' })}>
          Next
        </Button>
      </Box>

      {/* Edge States */}
      {!state.loading && !state.hasMore && state.products.length > 0 && (
        <Typography variant="caption" color="text.secondary" display="block" textAlign="center" mt={2}>
          No more products to load.
        </Typography>
      )}

      {!state.loading && filteredProducts.length === 0 && (
        <Typography variant="body2" color="text.secondary" display="block" textAlign="center" mt={2}>
          No products match your filters.
        </Typography>
      )}

      {/* Snackbars */}
      <Snackbar open={!!state.successMessage} autoHideDuration={3000} onClose={() => dispatch({ type: 'CLEAR_SUCCESS_MESSAGE' })}>
        <Alert severity="success" sx={{ width: '100%' }}>{state.successMessage}</Alert>
      </Snackbar>

      <Snackbar
        open={!!state.pendingDelete}
        autoHideDuration={4000}
        onClose={() => dispatch({ type: 'SET_PENDING_DELETE', payload: null })}
        message={`Deleted ${state.pendingDelete?.name}`}
        action={<Button color="secondary" size="small" onClick={handleUndo}>UNDO</Button>}
      />
    </AdminStickyPage>
  );
}