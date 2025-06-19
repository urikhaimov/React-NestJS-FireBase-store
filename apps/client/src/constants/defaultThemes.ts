import type { ThemeConfig } from '../types/ThemeConfig';

export const defaultThemes: Record<string, ThemeConfig> = {
  store1: {
    storeName: 'Urban Outfitters',
    logoUrl: '/logos/store1.png',
    primaryColor: '#1976d2',
    secondaryColor: '#f50057',
    fontFamily: 'Roboto',
    mode: 'light',
  },
  store2: {
    storeName: 'Gadget Hub',
    logoUrl: '/logos/store2.png',
    primaryColor: '#2e7d32',
    secondaryColor: '#ff7043',
    fontFamily: 'Open Sans',
    mode: 'dark',
  },
  store3: {
    storeName: 'Fresh Mart',
    logoUrl: '/logos/store3.png',
    primaryColor: '#512da8',
    secondaryColor: '#03a9f4',
    fontFamily: 'Lato',
    mode: 'light',
  },
  default: {
    storeName: 'My Online Store',
    logoUrl: '/logos/default.png',
    primaryColor: '#607d8b',
    secondaryColor: '#ff9800',
    fontFamily: 'Arial',
    mode: 'light',
  },
};
