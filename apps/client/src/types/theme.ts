// src/types/theme.ts
export type ThemeSettings = {
  primaryColor: string;
  secondaryColor: string;
  darkMode: boolean;
  fontFamily: string;
  storeName: string;
  font: string;
  fontSize: number;
  fontWeight: number;
  logoUrl: string;
  homepageLayout: 'hero' | 'grid' | 'list';
  productCardVariant: 'compact' | 'detailed';
  categoryStyle: 'tabs' | 'dropdown';
  showSidebar: boolean;
  maxWidth: 'sm' | 'md' | 'lg' | 'xl';
  stickyHeader: boolean;
};
