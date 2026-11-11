import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    target: 'ES2020',
    minify: 'terser',
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          query: ['@tanstack/react-query']
        },
        entryFileNames: '[name].[hash].js',
        chunkFileNames: '[name].[hash].js',
        assetFileNames: '[name].[hash][extname]'
      }
    },
    sourcemap: false,
    chunkSizeWarningLimit: 500,
    emptyOutDir: true,
    reportCompressedSize: true
  },
  server: {
    port: 5173,
    strictPort: false
  }
})
