// ✅ src/pages/admin/AdminProductsPage/AdminProductsPage.tsx
import React, { useReducer, useMemo, useEffect } from 'react';
import {
  Box,
  Typography,
  Divider,
  useMediaQuery,
  useTheme,
  Pagination,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { DndContext, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';

import AdminStickyPage from '../../../layouts/AdminStickyPage';
import { useAllCategories } from '../../../hooks/useAllCategories';
import { initialState, reducer } from './LocalReducer';
import SortableProductCard from './SortableProductCard';
import ProductFilters from './ProductFilters';
import { fetchAllProducts, reorderProducts } from '../../../api/productApi';
import { auth } from '../../../firebase';
import LoadingProgress from '../../../components/LoadingProgress';

export default function AdminProductsPage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { data: categories = [] } = useAllCategories();
  const navigate = useNavigate();

  const sensors = useSensors(useSensor(PointerSensor));

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
          new Date(p.createdAt).getTime() >= state.createdAfter.valueOf());
      return matchesText && matchesCategory && matchesDate;
    });
  }, [state.products, state.searchTerm, state.selectedCategoryId, state.createdAfter]);

  const paginatedProducts = filteredProducts.slice(
    (state.page - 1) * state.pageSize,
    state.page * state.pageSize
  );

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
    if (token) await reorderProducts(orderList, token);
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

  return (
    <AdminStickyPage
      title="Admin Products"
      filters={
        <ProductFilters
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
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <SortableContext
            items={filteredProducts.map((p) => p.id)}
            strategy={verticalListSortingStrategy}
          >
            {paginatedProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Box mb={2}>
                  <SortableProductCard
                    product={product}
                    onConfirmDelete={(id) =>
                      dispatch({ type: 'REMOVE_PRODUCT', payload: id })
                    }
                  />
                </Box>
              </motion.div>
            ))}
          </SortableContext>

          <Box mt={2} display="flex" justifyContent="center">
            <Pagination
              count={Math.ceil(filteredProducts.length / state.pageSize)}
              page={state.page}
              onChange={(_, value) =>
                dispatch({ type: 'SET_PAGE', payload: value })
              }
              color="primary"
            />
          </Box>
        </DndContext>
      )}
    </AdminStickyPage>
  );
}