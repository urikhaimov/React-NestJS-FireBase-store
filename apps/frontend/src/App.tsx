import React, { useEffect, useRef } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import {
  ThemeProvider as MuiThemeProvider,
  CssBaseline,
  CircularProgress,
  Box,
} from '@mui/material';

import { ProtectedRoute, AdminProtectedRoute } from './components/ProtectedRoutes';
import HomePage from './pages/HomePage/HomePage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MyOrdersPage from './pages/MyOrdersPage';
import UserProfilePage from './pages/UserProfilePage';
import OrderDetailPage from './pages/OrderDetailPage';
import NotFoundPage from './pages/NotFoundPage';
import ThankYouPage from './pages/ThankYouPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

import Layout from './layouts/MainLayout';
import AdminDashboardLayout from './layouts/AdminDashboardLayout';
import AdminThemePage from './pages/admin/AdminThemePage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminLogsPage from './pages/admin/AdminLogsPage';
import { ProductFormPage, AdminProductsPage } from './pages/admin/AdminProductsPage';
import AdminHomePage from './pages/admin/AdminHomePage';

import { useRedirect } from './context/RedirectContext';
import { useAuthStore } from './stores/useAuthStore';
import { useThemeContext } from './context/ThemeContext';
import { StripeProvider } from './stripe/StripeProvider';
import './App.css';

export default function App() {
  const navigate = useNavigate();
  const {
    user,
    loading,
    authInitialized,
    initializeAuth,
  } = useAuthStore();
  const { consumeRedirect } = useRedirect();
  const { theme, isLoading } = useThemeContext();
  const hasRedirected = useRef(false);

  // ✅ Init Firebase auth listener and Zustand state hydration
  useEffect(() => {
    const unsubscribe = initializeAuth();
    return () => unsubscribe();
  }, [initializeAuth]);

  // ✅ Handle unauthenticated redirect
  useEffect(() => {
    if (authInitialized && !user && !hasRedirected.current) {
      const next = consumeRedirect();
      navigate('/login' + (next ? `?redirect=${next}` : ''));
      hasRedirected.current = true;
    }
  }, [authInitialized, user, consumeRedirect, navigate]);

  if (isLoading || !theme || !authInitialized) {
    return (
      <Box
        height="100vh"
        width="100vw"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bgcolor={theme?.palette.background.default || '#fff'}
      >
        <CircularProgress size={60} color="primary" />
      </Box>
    );
  }

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <StripeProvider>
                  <CheckoutPage />
                </StripeProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/order/:id"
            element={
              <ProtectedRoute>
                <OrderDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-orders"
            element={
              <ProtectedRoute>
                <MyOrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/thank-you"
            element={
              <ProtectedRoute>
                <ThankYouPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/*"
            element={
              <AdminProtectedRoute>
                <AdminDashboardLayout />
              </AdminProtectedRoute>
            }
          >
            <Route index element={<AdminHomePage />} />
            <Route path="categories" element={<AdminCategoriesPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="logs" element={<AdminLogsPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="products/add" element={<ProductFormPage mode="add" />} />
            <Route path="products/edit/:productId" element={<ProductFormPage mode="edit" />} />
            <Route path="theme" element={<AdminThemePage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </MuiThemeProvider>
  );
}
