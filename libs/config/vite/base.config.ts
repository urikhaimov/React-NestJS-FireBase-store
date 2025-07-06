// libs/config/vite/base.config.ts
import { defineConfig, UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { csp } from './csp';

const rootDir = process.cwd(); // safer than hardcoding apps/frontend

export const createBaseViteConfig = (overrides?: UserConfig): UserConfig => {
  return defineConfig({
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(rootDir, 'src'),
        '@components': path.resolve(rootDir, 'src/components'),
        '@pages': path.resolve(rootDir, 'src/pages'),
        '@utils': path.resolve(rootDir, 'src/utils'),
      },
    },
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
    build: {
      outDir: path.resolve(rootDir, '../../dist/frontend'),
      rollupOptions: {
        external: ['motion-dom'], // only if you're not using it directly
      },
    },
    ...overrides,
  });
};
