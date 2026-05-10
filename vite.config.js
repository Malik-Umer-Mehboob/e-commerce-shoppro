import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
    ],
    server: {
        port: 5173,
        hmr: true,
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    'react-vendor': [
                        'react',
                        'react-dom',
                        'react-router-dom',
                    ],
                    'redux-vendor': [
                        '@reduxjs/toolkit',
                        'react-redux',
                    ],
                    'ui-vendor': [
                        'lucide-react',
                        'react-hot-toast',
                    ],
                },
            },
        },
        chunkSizeWarningLimit: 1500,
        sourcemap: false,
        minify: 'esbuild',
    },
    optimizeDeps: {
        include: [
            'react',
            'react-dom',
            'react-router-dom',
            '@reduxjs/toolkit',
            'react-redux',
            'axios',
            'lucide-react',
        ],
    },
});