import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  pages:{
    index: {
      entry:'./src/main.js',
      template:'index.html'
    },
    check: {
      entry: './src/check.js',
      template: 'check.html'
    },
    admin: {
      entry: './src/admin.js',
      template: 'admin.html'
    }
  }
})
