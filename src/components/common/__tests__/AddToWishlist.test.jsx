import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

// Asal API calls band — test sirf component ka behaviour check karta hai
vi.mock('../../../services/api', () => ({
  default: {
    get: vi.fn(() => Promise.resolve({ data: { items: [] } })),
    post: vi.fn(() => Promise.resolve({ data: {} })),
    delete: vi.fn(() => Promise.resolve({ data: {} })),
  },
}));

import api from '../../../services/api';
import wishlistReducer from '../../../store/wishlistSlice';
import AddToWishlist from '../AddToWishlist';

const makeStore = ({ isAuthenticated, items = [] }) =>
  configureStore({
    reducer: {
      auth: (state = { isAuthenticated, user: isAuthenticated ? { id: 1 } : null }) => state,
      wishlist: wishlistReducer,
    },
    preloadedState: {
      wishlist: { wishlist: { items }, sharedWishlist: null, loading: false, error: null },
    },
  });

const renderButton = (store) =>
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/shop']}>
        <Routes>
          <Route path="/shop" element={<AddToWishlist product={{ id: 7, name: 'Test' }} />} />
          <Route path="/login" element={<p>Login Page</p>} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );

describe('AddToWishlist', () => {
  beforeEach(() => vi.clearAllMocks());

  it('login na ho to login page par bhejta hai', async () => {
    renderButton(makeStore({ isAuthenticated: false }));
    await userEvent.click(screen.getByRole('button'));
    expect(await screen.findByText('Login Page')).toBeInTheDocument();
    expect(api.post).not.toHaveBeenCalled();
  });

  it('login ho to product wishlist mein add karta hai', async () => {
    renderButton(makeStore({ isAuthenticated: true }));
    await userEvent.click(screen.getByRole('button'));
    expect(api.post).toHaveBeenCalledWith('/wishlist', { product_id: 7 });
  });

  it('wishlist mein pehle se ho to bina crash ke remove karta hai', async () => {
    // Yahi case pehle "Invalid hook call" se crash hota tha
    renderButton(makeStore({ isAuthenticated: true, items: [{ id: 55, product_id: 7 }] }));
    await userEvent.click(screen.getByRole('button'));
    expect(api.delete).toHaveBeenCalledWith('/wishlist/55');
  });
});
