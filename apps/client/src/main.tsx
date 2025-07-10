import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from '@sentry/react';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './api/queryClient';

import { StoreBoundThemeProvider } from './providers/StoreBoundThemeProvider';
import { StoreConfigContext, defaultConfig } from './context/StoreConfigContext';
import { RedirectProvider } from './context/RedirectContext';
import { AuthProvider } from './context/AuthContext';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { loadStoreConfig } from './utils/loadStoreConfig';

import './index.css';
import 'react-quill/dist/quill.snow.css';

// 💡 Store ID from localStorage, fallback to default
const storeId = localStorage.getItem('storeId') || 'store1';
const storeConfig = loadStoreConfig(storeId) ?? defaultConfig;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ErrorBoundary fallback={<p>⚠ Something went wrong. Our team has been notified!</p>}>
        <StoreConfigContext.Provider value={storeConfig}>
          <StoreBoundThemeProvider>
            <AuthProvider>
              <QueryClientProvider client={queryClient}>
                <RedirectProvider>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <App />
                  </LocalizationProvider>
                </RedirectProvider>
              </QueryClientProvider>
            </AuthProvider>
          </StoreBoundThemeProvider>
        </StoreConfigContext.Provider>
      </ErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>
);
