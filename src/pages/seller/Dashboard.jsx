import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Menu, LogOut, LayoutDashboard, Package, ShoppingCart, BarChart2, Settings } from 'lucide-react';
import { authService } from '../../services/authService';
import { logoutUser } from '../../store/authSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export default function SellerDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.logout();
      dispatch(logoutUser());
      navigate('/login');
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/seller/dashboard', active: false },
    { icon: Package, label: 'My Products', path: '/seller/products', active: true },
    { icon: ShoppingCart, label: 'Orders', path: '/seller/orders', active: false },
    { icon: BarChart2, label: 'Analytics', path: '/seller/analytics', active: false },
    { icon: Settings, label: 'Settings', path: '/seller/settings', active: false },
  ];

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      <aside className={`fixed inset-y-0 left-0 bg-[#0F172A] w-64 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out z-20`}>
        <div className="flex h-16 items-center px-6 text-white font-bold text-xl border-b border-gray-700">
          ShopPro Seller
        </div>
        <nav className="p-4 space-y-2">
          {navItems.map((item, idx) => (
            <button 
              key={idx} 
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${item.active ? 'bg-[#F97316] text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <div className="flex-1 md:ml-64 flex flex-col min-h-screen transition-all duration-300">
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-4 sm:px-6 z-10">
          <button className="md:hidden text-gray-500" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <Menu className="w-6 h-6" />
          </button>
          <div className="md:hidden font-bold text-[#0F172A] text-lg">ShopPro</div>
          <div className="ml-auto flex items-center space-x-4">
            <span className="text-sm font-medium text-[#0F172A] hidden sm:block">{user?.name}</span>
            <div className="w-8 h-8 rounded-full bg-[#0F172A] text-white flex items-center justify-center font-bold">
              {user?.name?.charAt(0) || 'S'}
            </div>
            <button onClick={handleLogout} className="text-gray-500 hover:text-[#F97316] transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 z-0">
          <h1 className="text-2xl font-bold text-[#0F172A] mb-6">Welcome Seller 👋</h1>
        </main>
      </div>
      
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>
      )}
    </div>
  );
}
