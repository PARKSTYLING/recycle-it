import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Fix for React refresh preamble detection
      include: "**/*.{jsx,tsx}",
      fastRefresh: true,
    })
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  // Ensure proper module resolution
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
