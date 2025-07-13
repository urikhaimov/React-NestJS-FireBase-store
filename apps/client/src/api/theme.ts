// src/api/theme.ts

export type ThemeSettings = {
  storeName: string;
  darkMode: boolean;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
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
  // optionally add footerLinks, announcementBar, etc.
};
