// src/constants/themePresets.ts
import { ThemeSettings } from '../api/theme';

export const themePresets: Record<string, ThemeSettings> = {
  light: {
    primaryColor: '#1976d2',
    secondaryColor: '#dc004e',
    darkMode: false,
    fontFamily: 'Roboto, sans-serif',
    maxWidth: '1280px'
  },
  dark: {
    primaryColor: '#90caf9',
    secondaryColor: '#f48fb1',
    darkMode: true,
    fontFamily: 'Open Sans, sans-serif',
    maxWidth: '1280px'
  },
  business: {
    primaryColor: '#0d47a1',
    secondaryColor: '#ff6f00',
    darkMode: false,
    fontFamily: 'Inter, sans-serif',
    maxWidth: '1440px'
  },
  gaming: {
    primaryColor: '#ff1744',
    secondaryColor: '#651fff',
    darkMode: true,
    fontFamily: 'Orbitron, sans-serif',
    maxWidth: '1600px'
  },
};

// src/utils/loadGoogleFont.ts
export function loadGoogleFont(font: string) {
  const fontName = font.split(',')[0].replace(/\s+/g, '+');
  const fontUrl = `https://fonts.googleapis.com/css2?family=${fontName}:wght@400;700&display=swap`;

  const existing = document.querySelector(`link[href="${fontUrl}"]`);
  if (!existing) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = fontUrl;
    document.head.appendChild(link);
  }
}  

// Usage Example in ThemeProvider or Form
// loadGoogleFont(themeSettings.fontFamily);