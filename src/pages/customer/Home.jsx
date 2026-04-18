import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, LogOut, User } from 'lucide-react';
import { logoutUser } from '../../store/authSlice';
import { authService } from '../../services/authService';
import { toast } from 'react-hot-toast';

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await authService.logout();
      dispatch(logoutUser());
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      // Even if API fails, clear local state
      dispatch(logoutUser());
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Navbar */}
      <nav className="bg-[#0F172A] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="bg-[#F97316] p-1.5 rounded-lg">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">ShopPro</span>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-gray-300">
                <User className="w-5 h-5" />
                <span className="font-medium">{user?.name}</span>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-[#F97316] hover:bg-[#ea580c] text-white px-4 py-2 rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-extrabold text-[#0F172A] mb-4">
          Welcome to ShopPro, {user?.name}!
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
          We're working hard to bring you the best shopping experience. Stay tuned for our full selection of premium products.
        </p>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow animate-pulse">
              <div className="h-40 bg-gray-100 rounded-xl mb-4"></div>
              <div className="h-6 bg-gray-100 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-100 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
