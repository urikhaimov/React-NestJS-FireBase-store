import { storesConfig } from '../config/store.config';
import type { StoreConfig } from '../types/StoreConfig';

export function loadStoreConfig(storeId: string): StoreConfig {
  return storesConfig[storeId] ?? storesConfig['tech-store'];
}