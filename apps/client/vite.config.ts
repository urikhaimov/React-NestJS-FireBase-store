import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://apis.google.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com https://js.stripe.com",
  "connect-src 'self' http://localhost:3000 https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://firestore.googleapis.com https://firebase.googleapis.com https://www.googleapis.com https://firebasestorage.googleapis.com https://apis.google.com",
  "img-src 'self' data: blob: https://firebasestorage.googleapis.com",
  "media-src 'self' data: blob: https://firebasestorage.googleapis.com",
  "frame-src https://js.stripe.com https://hooks.stripe.com",
  "worker-src 'self' blob: https://js.stripe.com"
].join('; ');

export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      'Content-Security-Policy': csp,
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
