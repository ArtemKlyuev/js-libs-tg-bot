import { defineConfig, splitVendorChunkPlugin } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [splitVendorChunkPlugin(), tsconfigPaths(), react()],
  build: {
    chunkSizeWarningLimit: 200,
    target: 'esnext',
    polyfillModulePreload: false,
    cssCodeSplit: true,
  },
});
