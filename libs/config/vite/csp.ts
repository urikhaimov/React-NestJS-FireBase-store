// libs/config/vite/csp.ts
export const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://www.googletagmanager.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com https://js.stripe.com https://cdn.jsdelivr.net",
  "img-src 'self' data: blob: https://firebasestorage.googleapis.com https://firebasestorage-download.googleapis.com https://storage.googleapis.com",
  "connect-src 'self' http://localhost:3000 https://api.stripe.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://firestore.googleapis.com https://firebase.googleapis.com https://www.googleapis.com https://apis.google.com",
  "frame-src https://js.stripe.com https://hooks.stripe.com https://onlinestoretemplate-59d3e.firebaseapp.com",
  "worker-src 'self' blob:"
].join('; ');
