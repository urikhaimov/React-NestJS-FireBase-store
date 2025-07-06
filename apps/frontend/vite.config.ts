import path from 'path';
import { createBaseViteConfig } from '../../libs/config/vite/base.config';

export default createBaseViteConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@config': path.resolve(__dirname, '../../libs/config')
    }
  }
});
