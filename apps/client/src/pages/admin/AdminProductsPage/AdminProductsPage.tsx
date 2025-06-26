// src/pages/admin/AdminProductsPage/AdminProductsPage.tsx
import React, { useReducer, useMemo, useEffect, useState, useRef } from 'react';
import {
  Box,
  Divider,
  useMediaQuery,
  useTheme,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { DndContext, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';

import AdminStickyPage from '../../../layouts/AdminStickyPage';
import { useAllCategories } from '../../../hooks/useAllCategories';
import { initialState, reducer } from './LocalReducer';
import SortableProductCard from './SortableProductCard';
import AdminProductFilters from './AdminProductFilters';
import { fetchAllProducts } from '../../../api/productApi';
import { auth } from '../../../firebase';
import LoadingProgress from '../../../components/LoadingProgress';
import { useProductMutations } from '../../../hooks/useProductMutations';
import { useInView } from 'react-intersection-observer';

export default function AdminProductsPage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { data: categories = [] } = useAllCategories();
  const navigate = useNavigate();
  const { reorder } = useProductMutations();
  const { ref: sentinelRef, inView } = useInView();

  const sensors = useSensors(useSensor(PointerSensor));
  const [reorderPending, setReorderPending] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(10);

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
        (p.createdAt &&
          p.createdAt.toDate().getTime() >= state.createdAfter.valueOf()


        );
      return matchesText && matchesCategory && matchesDate;
    });
  }, [state.products, state.searchTerm, state.selectedCategoryId, state.createdAfter]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  const handleAddProduct = () => {
    navigate('/admin/products/add');
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = state.products.findIndex((p) => p.id === active.id);
    const newIndex = state.products.findIndex((p) => p.id === over.id);
    const reordered = arrayMove(state.products, oldIndex, newIndex);
    dispatch({ type: 'SET_PRODUCTS', payload: reordered });

    const orderList = reordered.map((p, i) => ({ id: p.id, order: i }));
    const token = await auth.currentUser?.getIdToken();

    if (token) {
      setReorderPending(true);
      try {
        await reorder.mutateAsync({ orderList, token });
        setSnackbarOpen(true);
      } catch (error) {
        console.error('Reorder failed', error);
      } finally {
        setReorderPending(false);
      }
    }
  };

  useEffect(() => {
    async function loadProducts() {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const user = auth.currentUser;
        if (!user) throw new Error('User not authenticated');
        const token = await user.getIdToken();
        const { data } = await fetchAllProducts(token);
        dispatch({ type: 'SET_PRODUCTS', payload: data });
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    }
    loadProducts();
  }, []);

  useEffect(() => {
    if (inView && visibleCount < filteredProducts.length) {
      const timeout = setTimeout(() => {
        setVisibleCount((prev) => prev + 10);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [inView, filteredProducts.length, visibleCount]);

  return (
    <AdminStickyPage
      title="Admin Products"
      filters={
        <AdminProductFilters
          state={state}
          dispatch={dispatch}
          categories={categories}
          onAddProduct={handleAddProduct}
        />
      }
    >
      <Divider sx={{ mb: 2 }} />

      {state.loading ? (
        <LoadingProgress />
      ) : (
        <Box
          sx={{
            flexGrow: 1,
            overflowY: 'auto', // ✅ enable scrolling
            maxHeight: '40vh', // ✅ ensures height to trigger scroll
            px: 2,
          }}
        >
          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <SortableContext
              items={filteredProducts.map((p) => p.id)}
              strategy={verticalListSortingStrategy}
            >
              {visibleProducts.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Box mb={2} sx={{ opacity: reorderPending ? 0.4 : 1 }}>
                    <SortableProductCard
                      product={product}
                      disabled={reorderPending}
                      onConfirmDelete={(id) =>
                        dispatch({ type: 'REMOVE_PRODUCT', payload: id })
                      }
                    />
                  </Box>
                </motion.div>
              ))}

              <Box ref={sentinelRef} display="flex" justifyContent="center" py={3}>
                {visibleCount < filteredProducts.length && <CircularProgress size={28} />}
              </Box>
            </SortableContext>
          </DndContext>
        </Box>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled">Product order updated</Alert>
      </Snackbar>
    </AdminStickyPage>
  );
}