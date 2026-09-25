import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    port: 5173,
    hmr: true,
  },

  build: {
    sourcemap: false,
    minify: 'oxc',
    // PERFORMANCE FIX:
    // Pehle yahan custom manualChunks tha. Us ki wajah se 550 KB ka "charts"
    // chunk (recharts + chart.js + d3) HAR page par load hota tha, customer
    // home page par bhi. Saare pages App.jsx mein pehle se lazy() hain,
    // is liye Vite khud heavy libraries ko sirf un pages ke saath load karta hai
    // jin ko un ki zaroorat hai.
  },

  optimizeDeps: {
    include: [
      'react', 'react-dom', 'react-router-dom',
      '@reduxjs/toolkit', 'react-redux', 'axios', 'lucide-react',
    ]
  }
});
