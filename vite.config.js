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
    chunkSizeWarningLimit: 1500,
    sourcemap: false,
    minify: 'oxc',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {

            // React core
            if (id.includes('react-dom'))         return 'react-dom';
            if (id.includes('react-router'))      return 'router';
            if (id.includes('react-is'))          return 'react';
            if (id.includes('react'))             return 'react';

            // State
            if (id.includes('@reduxjs'))          return 'redux';
            if (id.includes('react-redux'))       return 'redux';

            // Charts — heavy, sirf chart pages pe chahiye
            if (id.includes('recharts'))          return 'charts';
            if (id.includes('chart.js'))          return 'charts';
            if (id.includes('react-chartjs'))     return 'charts';
            if (id.includes('d3'))                return 'charts';

            // Animation — heavy
            if (id.includes('framer-motion'))     return 'animation';

            // Editor — react-quill bada hai
            if (id.includes('quill'))             return 'editor';
            if (id.includes('react-quill'))       return 'editor';

            // i18n
            if (id.includes('i18next'))           return 'i18n';
            if (id.includes('react-i18next'))     return 'i18n';

            // UI libraries
            if (id.includes('swiper'))            return 'swiper';
            if (id.includes('sweetalert2'))       return 'ui';
            if (id.includes('lucide'))            return 'ui';
            if (id.includes('react-hot-toast'))   return 'ui';
            if (id.includes('@headlessui'))       return 'ui';
            if (id.includes('@heroicons'))        return 'ui';

            // Forms
            if (id.includes('react-hook-form'))   return 'forms';
            if (id.includes('@hookform'))         return 'forms';
            if (id.includes('zod'))               return 'forms';

            // Utils
            if (id.includes('axios'))             return 'utils';
            if (id.includes('date-fns'))          return 'utils';
            if (id.includes('dompurify'))         return 'utils';
            if (id.includes('@tanstack'))         return 'utils';

            return 'vendor';
          }
        }
      }
    }
  },

  optimizeDeps: {
    include: [
      'react', 'react-dom', 'react-router-dom',
      '@reduxjs/toolkit', 'react-redux', 'axios', 'lucide-react',
    ]
  }
});