export interface ThemeConfig {
  storeName: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  mode: 'light' | 'dark';
  homeLayout?: 'grid' | 'list'; // ✅ optional, extend as needed
  features?: {
    enableAnimations?: boolean;
    showHeroBanner?: boolean;
    [key: string]: boolean | undefined; // Allow more feature flags
  };
}
