import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './api/queryClient';
import { StoreConfigContext, defaultConfig } from './context/StoreConfigContext';
import { ErrorBoundary } from '@sentry/react';
import { StoreBoundThemeProvider } from './providers/StoreBoundThemeProvider';
import { BrowserRouter } from 'react-router-dom';
import { loadStoreConfig } from './utils/loadStoreConfig';
import { RedirectProvider } from './context/RedirectContext';
import { AuthProvider } from './context/AuthContext';
import { useStoreSettings } from './stores/useStoreSettings';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import './index.css';

const storeId = localStorage.getItem('storeId') || 'store1'; // fallback to useStoreSettings not possible in module scope
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
