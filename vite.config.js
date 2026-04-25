import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom', 'react-redux', '@reduxjs/toolkit'],
          'vendor-ui': ['lucide-react', 'framer-motion', 'sweetalert2', 'react-hot-toast'],
          'vendor-charts': ['chart.js', 'react-chartjs-2', 'recharts'],
          'vendor-utils': ['axios', 'date-fns', 'i18next', 'react-i18next', 'zod', 'react-hook-form'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    minify: 'esbuild',
  },
})