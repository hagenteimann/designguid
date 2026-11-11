import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5174,
    strictPort: false,
    open: true
  },
  build: {
    target: 'ES2020',
    minify: 'terser',
    sourcemap: false,
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: 'src/editor.html',
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]'
      }
    }
  },
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname
    }
  }
});
