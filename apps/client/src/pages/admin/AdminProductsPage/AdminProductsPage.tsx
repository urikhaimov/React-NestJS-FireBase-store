// src/pages/admin/AdminProductsPage/AdminProductsPage.tsx
import React, { useReducer, useMemo, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Divider,
  useMediaQuery,
  useTheme,
  Pagination,
} from '@mui/material';
import { FixedSizeList as VirtualList, ListChildComponentProps } from 'react-window';
import { motion } from 'framer-motion';

import AdminStickyPage from '../../../layouts/AdminStickyPage';
import { useAllCategories } from '../../../hooks/useAllCategories';
import { initialState, reducer } from './LocalReducer';
import ProductAdminCard from './ProductAdminCard';
import ProductFilters from './ProductFilters';
import { fetchAllProducts } from '../../../api/productApi';
import { auth } from '../../../firebase'; // 👈 import Firebase auth
import { useNavigate } from 'react-router-dom';

export default function AdminProductsPage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { data: categories = [] } = useAllCategories();
const navigate = useNavigate();
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

  const renderRow = ({ index, style }: ListChildComponentProps) => {
    const product = paginatedProducts[index];
    return (
      <motion.div
        key={product.id}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={style}
      >
        <Paper
          sx={{
            p: 2,
            m: 1,
            borderRadius: 2,
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[2],
          }}
        >
          <ProductAdminCard
            product={product}
            onConfirmDelete={(id) =>
              dispatch({ type: 'REMOVE_PRODUCT', payload: id })
            }
          />
        </Paper>
      </motion.div>
    );
  };
const handleAddProduct = () => {
  navigate('/admin/products/add'); // 🔁 adjust path to match your router config
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
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <VirtualList
            style={{ overflowX: 'hidden' }}
            height={isMobile ? 400 : 550}
            width="100%"
            itemCount={paginatedProducts.length}
            itemSize={isMobile ? 220 : 180}
          >
            {renderRow}
          </VirtualList>

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
        </>
      )}
    </AdminStickyPage>
  );
}
