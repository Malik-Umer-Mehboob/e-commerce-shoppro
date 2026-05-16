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
import { useState, useRef, useEffect } from 'react';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

          {/* Main Navigation */}
          <div className="hidden lg:flex items-center space-x-8 px-4 border-r border-slate-700">
            <Link to="/shop" className="text-sm font-bold text-slate-300 hover:text-orange-500 transition-colors uppercase tracking-widest">
              Shop
            </Link>
            <Link to="/blog" className="text-sm font-bold text-slate-300 hover:text-orange-500 transition-colors uppercase tracking-widest">
              Blog
            </Link>
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

            <NotificationBell isDark={true} />
            <CartIcon />

            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white border-l border-gray-700 pl-3 focus:outline-none transition-colors"
                >
                  {user?.avatar ? (
                    <img src={user.avatar.startsWith('http') ? user.avatar : `http://localhost:8000/storage/${user.avatar}`} className="w-8 h-8 rounded-full border border-slate-700 object-cover" alt={user.name} />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#1E293B] flex items-center justify-center border border-slate-700">
                      <User className="w-4 h-4 text-gray-300" />
                    </div>
                  )}
                  <span className="font-medium text-sm hidden lg:block">{user?.name}</span>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-2 border-b border-gray-50 mb-2">
                      <p className="text-sm font-bold text-[#0F172A] truncate">{user?.name}</p>
                      <p className="text-[10px] font-medium text-gray-400 truncate">{user?.email}</p>
                    </div>
                    
                    <Link to="/profile" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-[#F97316] transition-colors">
                      My Profile
                    </Link>
                    <Link to="/user/orders" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-[#F97316] transition-colors">
                      My Orders
                    </Link>
                    <Link to="/my-tickets" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-[#F97316] transition-colors">
                      My Tickets
                    </Link>
                    <Link to="/returns" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-[#F97316] transition-colors">
                      My Returns
                    </Link>
                    <Link to="/wishlist" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-[#F97316] transition-colors">
                      Wishlist
                    </Link>
                    <Link to="/compare" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-[#F97316] transition-colors">
                      Compare
                    </Link>
                    <Link to="/help" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-[#F97316] transition-colors">
                      Help Center
                    </Link>
                    <Link to="/help/contact" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-[#F97316] transition-colors border-b border-gray-50 mb-1 pb-3">
                      Contact Support
                    </Link>
                    
                    <button
                      onClick={() => { setIsDropdownOpen(false); handleLogout(); }}
                      className="w-full text-left px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
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
