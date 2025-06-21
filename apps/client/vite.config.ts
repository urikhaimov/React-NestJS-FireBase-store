import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      'Content-Security-Policy': `
        default-src 'self';
        script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com;
        style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
        font-src 'self' https://fonts.gstatic.com;
        connect-src 'self' http://localhost:3000 https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://firebase.googleapis.com https://firestore.googleapis.com https://www.googleapis.com https://accounts.google.com https://apis.google.com https://api.stripe.com https://js.stripe.com https://us-central1-onlinestoretemplate-59d3e.cloudfunctions.net;
        frame-src https://js.stripe.com https://hooks.stripe.com;
        worker-src 'self' blob: https://js.stripe.com;
        img-src 'self' data: https://firebasestorage.googleapis.com;
      `.replace(/\n/g, ''),
    },
    proxy: {
      '/orders': {
        target: 'http://localhost:3000',
        changeOrigin: true,
       
      },
      '/admin': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/products': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/users': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
