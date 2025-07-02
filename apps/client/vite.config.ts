import path from 'path';
import { defineConfig } from 'vite';
import { createBaseViteConfig } from '../../libs/config/vite/base.config';

export default createBaseViteConfig({
  resolve: {
    alias: {
      '@config': path.resolve(__dirname, '../../libs/config'),
    },
  },
});