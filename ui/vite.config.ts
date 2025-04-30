import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import autoprefixer from 'autoprefixer'
import path from 'node:path'
import { defineConfig } from 'vite'

// eslint-disable-next-line no-restricted-syntax
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    //
    react(),
    tailwindcss(),
  ],
  css: {
    postcss: {
      plugins: [autoprefixer()],
    },
  },
  server: {
    port: 3000,
    open: true,
    host: true,
  },
  build: {
    chunkSizeWarningLimit: Infinity,
  },
})
