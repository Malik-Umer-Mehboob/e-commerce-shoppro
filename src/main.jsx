import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { store } from './store';
import App from './App';
import './index.css';
import './i18n';

const token = localStorage.getItem('token');
const user = localStorage.getItem('user');
if (token && !user) {
  localStorage.removeItem('token');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
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
    </Provider>
  </React.StrictMode>
);
