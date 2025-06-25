import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com https://js.stripe.com",
  "connect-src 'self' http://localhost:3000 https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://firestore.googleapis.com https://firebase.googleapis.com https://firebasestorage.googleapis.com https://storage.googleapis.com",
  "frame-src https://js.stripe.com https://hooks.stripe.com",
  "worker-src 'self' blob: https://js.stripe.com",
  "img-src 'self' data: https://firebasestorage.googleapis.com"
].join('; '); // ✅ No newline characters

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
