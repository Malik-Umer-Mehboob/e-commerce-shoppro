import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Menu, 
  LogOut, 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  BarChart2, 
  Settings, 
  Globe, 
  ChevronRight,
  Tag
} from 'lucide-react';
import { authService } from '../../services/authService';
import { logoutUser } from '../../store/authSlice';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import NotificationBell from '../notifications/NotificationBell';

export default function SellerLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await authService.logout();
      dispatch(logoutUser());
      navigate('/login');
      toast.success('Logged out successfully');
    } catch (error) {
      dispatch(logoutUser());
      navigate('/login');
    }
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/seller/dashboard' },
    { icon: Package, label: 'My Products', path: '/seller/products' },
    { icon: ShoppingCart, label: 'Orders', path: '/seller/orders' },
    { icon: Tag, label: 'Request Category', path: '/seller/category-request' },
    { icon: BarChart2, label: 'Analytics', path: '/seller/analytics' },
    { icon: Settings, label: 'Settings', path: '/seller/settings' },
  ];

  const isActive = (path) => {
    if (path === '/seller/dashboard') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 bg-[#0F172A] w-72 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out z-30 shadow-2xl shadow-black/50 overflow-y-auto custom-scrollbar`}>
        <div className="flex h-20 items-center px-8 text-white font-black text-2xl border-b border-white/5 sticky top-0 bg-[#0F172A] z-10">
          <div className="w-10 h-10 bg-[#F97316] rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-[#F97316]/20">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <span className="tracking-tighter">ShopPro <span className="text-[#F97316]">Seller</span></span>
        </div>
        
        <nav className="p-6 space-y-1">
          {navItems.map((item, idx) => {
            const active = isActive(item.path);
            return (
              <Link 
                key={idx} 
                to={item.path}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all group ${active ? 'bg-[#F97316] text-white shadow-xl shadow-[#F97316]/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className={`w-5 h-5 transition-colors ${active ? 'text-white' : 'text-gray-500 group-hover:text-white'}`} />
                  <span className="font-bold text-sm">{item.label}</span>
                </div>
                {active && <ChevronRight className="w-4 h-4 animate-in slide-in-from-left-2" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-white/5 mt-auto">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-2xl text-red-400 font-bold hover:bg-red-500/10 transition-all border border-red-500/20"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-72 flex flex-col min-h-screen transition-all duration-300">
        <header className="h-20 bg-white/80 backdrop-blur-md sticky top-0 flex items-center justify-between px-8 z-20 border-b border-gray-100">
          <button className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-xl" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="ml-auto flex items-center space-x-6">
            <NotificationBell />
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-[#0F172A]">{user?.name}</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Seller Panel</p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#0F172A] to-slate-800 text-white flex items-center justify-center font-black border-2 border-white shadow-lg overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user?.name?.[0] || 'S'
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-8 lg:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {children}
        </main>
      </div>
      
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-[#0F172A]/60 z-20 md:hidden backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsSidebarOpen(false)}></div>
      )}
    </div>
  );
}
