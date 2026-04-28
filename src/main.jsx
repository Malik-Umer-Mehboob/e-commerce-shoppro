import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from './store';
import App from './App';
import './index.css';
import './i18n';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

import { HelmetProvider } from 'react-helmet-async';

// Migration: clear old token keys if exist
const oldToken = localStorage.getItem('token');
const oldUser = localStorage.getItem('user');
if (oldToken && !localStorage.getItem('shoppro_token')) {
    localStorage.setItem('shoppro_token', oldToken);
}
if (oldUser && !localStorage.getItem('shoppro_user')) {
    localStorage.setItem('shoppro_user', oldUser);
}
// Remove old keys
localStorage.removeItem('token');
localStorage.removeItem('user');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <App />
            <Toaster position="top-right" toastOptions={{
              style: {
                background: '#0F172A',
                color: '#fff',
              },
              success: {
                iconTheme: {
                  primary: '#F97316',
                  secondary: '#fff',
                },
              },
            }} />
          </BrowserRouter>
        </QueryClientProvider>
      </Provider>
    </HelmetProvider>
  </React.StrictMode>
);
