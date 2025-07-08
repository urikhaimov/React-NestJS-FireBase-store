// src/theme/theme.model.ts
export interface ThemeSettings {
  storeName: string;
  darkMode: boolean;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  homepageLayout?: string;
  logoUrl?: string;
  backgroundImageUrl?: string;
  [key: string]: any; // for future extensions
}
