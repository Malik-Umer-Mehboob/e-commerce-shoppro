import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import cartReducer from './cartSlice';
import wishlistReducer from './wishlistSlice';
import searchReducer from './searchSlice';
import notificationReducer from './notificationSlice';
import reportReducer from './slices/reportSlice';
import localizationReducer from './localizationSlice';
import affiliateReducer from './affiliateSlice';
import referralReducer from './referralSlice';
import blogReducer from './blogSlice';
import comparisonReducer from './comparisonSlice';
import loyaltyReducer from './loyaltySlice';
import giftCardReducer from './giftCardSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    search: searchReducer,
    notifications: notificationReducer,
    reports: reportReducer,
    localization: localizationReducer,
    affiliate: affiliateReducer,
    referral: referralReducer,
    blog: blogReducer,
    comparison: comparisonReducer,
    loyalty: loyaltyReducer,
    giftCards: giftCardReducer,
  },
});
