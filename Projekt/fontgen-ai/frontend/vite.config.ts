import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'ES2020',
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          query: ['@tanstack/react-query']
        }
      }
    },
    sourcemap: false,
    chunkSizeWarningLimit: 500
  },
  server: {
    port: 5173,
    strictPort: false
  }
})
