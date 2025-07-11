import nx from '@nx/eslint-plugin';
import tseslint from 'typescript-eslint';

export default tseslint.config({
  extends: ['../../eslint.config.mjs'],
  ignores: ['eslint.config.mjs'],
});
