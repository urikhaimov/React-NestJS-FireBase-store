import React, { useReducer, useMemo, useEffect, useRef, useState } from 'react';
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
import { DndContext, useSensor, useSensors, PointerSensor, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import AdminStickyPage from '../../../layouts/AdminStickyPage';
import { useAllCategories } from '../../../hooks/useAllCategories';
import { initialState, reducer } from './LocalReducer';
import SortableProductCard from './SortableProductCard';
import AdminProductFilters from './AdminProductFilters';
import { fetchAllProducts } from '../../../api/products';
import { auth } from '../../../firebase';
import LoadingProgress from '../../../components/LoadingProgress';
import { useProductMutations } from '../../../hooks/useProductMutations';
import { useInView } from 'react-intersection-observer';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import type { Product } from '../../../types/firebase';
import { db } from '../../../firebase';
import { debounce } from 'lodash';


export default function AdminProductsPage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { data: categories = [] } = useAllCategories();
  const navigate = useNavigate();
  const { reorder } = useProductMutations();
  const { ref: sentinelRef, inView } = useInView();
  const sensors = useSensors(useSensor(PointerSensor));
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
          p.createdAt.toDate().getTime() >= state.createdAfter.valueOf());
      return matchesText && matchesCategory && matchesDate;
    });
  }, [state.products, state.searchTerm, state.selectedCategoryId, state.createdAfter]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  const handleAddProduct = () => {
    navigate('/admin/products/add');
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = visibleProducts.findIndex((p) => p.id === active.id);
    const newIndex = visibleProducts.findIndex((p) => p.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const reorderedVisible = arrayMove(visibleProducts, oldIndex, newIndex);

    const updatedProducts = [...state.products];
    reorderedVisible.forEach((product, idx) => {
      const globalIndex = updatedProducts.findIndex((p) => p.id === product.id);
      if (globalIndex !== -1) {
        updatedProducts.splice(globalIndex, 1);
        updatedProducts.splice(
          idx + state.products.indexOf(visibleProducts[0]),
          0,
          product
        );
      }
    });

    const uniqueUpdated = Array.from(
      new Map(updatedProducts.map((p) => [p.id, p])).values()
    );

    dispatch({ type: 'SET_PRODUCTS', payload: uniqueUpdated });

    const orderList = uniqueUpdated.map((p, i) => ({ id: p.id, order: i }));
    const token = await auth.currentUser?.getIdToken();

    if (token) {
      dispatch({ type: 'SET_REORDER_PENDING', payload: true });
      try {
        await reorder.mutateAsync({ orderList, token });
        setSnackbarOpen(true);
      } catch (error) {
        console.error('❌ Reorder failed', error);
      } finally {
        dispatch({ type: 'SET_REORDER_PENDING', payload: false });
      }
    }
  };

  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('order'));

    // Debounced state update
    const debouncedSetProducts = debounce((products: Product[]) => {
      dispatch({ type: 'SET_PRODUCTS_SORTED', payload: products });
    }, 300); // adjust debounce time as needed

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const products: Product[] = snapshot.docs.map((doc) => ({

        ...(doc.data() as Product),
        id: doc.id,
      }));

      debouncedSetProducts(products);
    });

    return () => {
      unsubscribe();
      debouncedSetProducts.cancel();
    };
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
        <Box sx={{ flexGrow: 1, overflowY: 'auto', maxHeight: '40vh', px: 2 }}>
          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <SortableContext
              items={state.products.map((p) => p.id)}
              strategy={verticalListSortingStrategy}
            >
              {visibleProducts.map((product) => (
                <Box
                  key={product.id}
                  mb={2}
                  sx={{ opacity: state.reorderPending ? 0.4 : 1 }}
                >
                  <SortableProductCard
                    product={product}
                    disabled={state.reorderPending}
                    onConfirmDelete={(id) =>
                      dispatch({ type: 'REMOVE_PRODUCT', payload: id })
                    }
                  />
                </Box>
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
        <Alert severity="success" variant="filled">
          Product order updated
        </Alert>
      </Snackbar>
    </AdminStickyPage>
  );
}
