// libs/config/vite/base.config.ts
import { defineConfig, UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { csp } from './csp';

export const createBaseViteConfig = (overrides?: UserConfig): UserConfig => {
  return defineConfig({
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), 'src'),
        '@components': path.resolve(process.cwd(), 'src/components'),
        '@pages': path.resolve(process.cwd(), 'src/pages'),
        '@utils': path.resolve(process.cwd(), 'src/utils'),
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
      outDir: path.resolve(process.cwd(), '../../dist', path.basename(process.cwd())),
    },
    ...overrides,
  });
};
