// src/api/theme.ts

export type ThemeSettings = {
  darkMode: boolean;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  maxWidth: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  storeName?: string;
  font?: string;
  fontSize?: number;
  fontWeight?: number;
  logoUrl?: string;
  homepageLayout?: 'hero' | 'grid' | 'list';
  productCardVariant?: 'compact' | 'detailed';
  categoryStyle?: 'tabs' | 'dropdown';
  showSidebar?: boolean;
  stickyHeader?: boolean;
  // optionally add footerLinks, announcementBar, etc.
};
