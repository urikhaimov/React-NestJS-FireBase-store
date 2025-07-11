import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import { defineConfig, UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { csp } from './csp';
import path from 'node:path';

const rootDir = process.cwd(); // safer than hardcoding apps/frontend

export const createBaseViteConfig = (overrides?: UserConfig): UserConfig => {
  return defineConfig({
    cacheDir: '../../node_modules/.vite/apps/client',
    test: {
      watch: false,
      globals: true,
      environment: 'jsdom',
      include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      reporters: ['default'],
      coverage: {
        reportsDirectory: '../../coverage/apps/client',
        provider: 'v8' as const,
      },
    },
    plugins: [react(), nxViteTsPaths(), nxCopyAssetsPlugin(['*.md'])],
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
      rollupOptions: {
        external: ['motion-dom'], // only if you're not using it directly
      },
      outDir: '../../dist/apps/client',
      reportCompressedSize: true,
      commonjsOptions: { transformMixedEsModules: true },
    },
    ...overrides,
  });
};

export default createBaseViteConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@config': path.resolve(__dirname, '../../libs/config'),
    },
  },
});
