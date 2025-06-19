// src/AppBootstrapper.tsx
import React from 'react';
import { StoreBoundThemeProvider } from './providers/StoreBoundThemeProvider';
import { StoreConfigContext, defaultConfig } from './context/StoreConfigContext';
import { loadStoreConfig } from './utils/loadStoreConfig';
import { useStoreSettings } from './stores/useStoreSettings';
import App from './App';

export const AppBootstrapper = () => {
  const storeId = useStoreSettings((s) => s.storeId);
  const config = loadStoreConfig(storeId) ?? defaultConfig;

  return (
    <StoreConfigContext.Provider value={config}>
      <StoreBoundThemeProvider>
        <App />
      </StoreBoundThemeProvider>
    </StoreConfigContext.Provider>
  );
};
