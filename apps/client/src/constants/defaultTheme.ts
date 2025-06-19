import { ThemeConfig } from '../types/ThemeConfig';

export const defaultThemeConfig: ThemeConfig = {
  storeName: 'My Online Store',
  logoUrl: '/logo.png',
  primaryColor: '#1976d2',
  secondaryColor: '#f50057',
  fontFamily: 'Roboto',
  mode: 'light',
  homeLayout: 'grid',
  features: {
    showHeroSlider: true,
    enableRatings: true,
  },
};
