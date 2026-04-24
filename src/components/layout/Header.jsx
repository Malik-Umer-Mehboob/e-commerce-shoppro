import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, LogOut, User, Heart } from 'lucide-react';
import { logoutUser } from '../../store/authSlice';
import { authService } from '../../services/authService';
import { toast } from 'react-hot-toast';
import CartIcon from './CartIcon';
import { clearCartState } from '../../store/cartSlice';
import { clearWishlistState } from '../../store/wishlistSlice';
import SearchBar from '../search/SearchBar';
import NotificationBell from '../notifications/NotificationBell';
import LanguageSwitcher from './LanguageSwitcher';
import CurrencySwitcher from './CurrencySwitcher';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await authService.logout();
      dispatch(logoutUser());
      dispatch(clearCartState());
      dispatch(clearWishlistState());
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      dispatch(logoutUser());
      dispatch(clearCartState());
      dispatch(clearWishlistState());
      navigate('/login');
    }
  };

  return (
    <nav className="bg-[#0F172A] text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center gap-4">
          {/* Logo */}
          <Link to="/home" className="flex items-center space-x-2 flex-shrink-0">
            <div className="bg-[#F97316] p-1.5 rounded-lg">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight hidden sm:block">ShopPro</span>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl hidden md:block">
            <SearchBar />
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-2 md:space-x-3 flex-shrink-0">
            <div className="hidden lg:flex items-center space-x-2 border-r border-slate-700 pr-3">
              <LanguageSwitcher />
              <CurrencySwitcher />
            </div>

            <Link
              to="/wishlist"
              className="p-2 text-gray-300 hover:text-white transition-colors"
              title="Wishlist"
            >
              <Heart size={22} />
            </Link>

            <NotificationBell />
            <CartIcon />

            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="hidden lg:flex items-center space-x-2 text-gray-300 border-l border-gray-700 pl-3">
                  {user?.avatar ? (
                    <img src={user.avatar} className="w-8 h-8 rounded-full border border-slate-700" alt={user.name} />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                  <span className="font-medium text-sm">{user?.name}</span>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1.5 bg-[#F97316] hover:bg-[#ea580c] text-white px-3 py-1.5 rounded-lg font-medium transition-all shadow-md hover:shadow-lg text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-[#F97316] hover:bg-[#ea580c] text-white px-4 py-2 rounded-lg font-medium transition-all text-sm"
              >
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Mobile search bar */}
        <div className="md:hidden pb-3">
          <SearchBar compact />
        </div>
      </div>
    </nav>
  );
};

export default Header;
