import { defineConfig, splitVendorChunkPlugin } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [splitVendorChunkPlugin(), tsconfigPaths(), react()],
  envPrefix: 'APP_EXPOSE_',
  build: {
    chunkSizeWarningLimit: 250,
    target: 'esnext',
    polyfillModulePreload: false,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'common-vendor': [
            'react',
            'react-dom/client',
            'react-router-dom',
            '@tanstack/react-query',
          ],
          'common-forms': ['react-hook-form', '@hookform/resolvers/zod', 'zod'],
        },
      },
    },
  },
});
