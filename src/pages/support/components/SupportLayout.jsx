import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Menu, 
  LogOut, 
  Home, 
  MessageSquare, 
  Book, 
  ShoppingBag,
  ChevronRight,
  Settings,
  Bell,
  Search
} from 'lucide-react';
import { authService } from '../../../services/authService.js';
import { logoutUser } from '../../../store/authSlice.js';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import ThemeToggle from '../../../components/ThemeToggle';

export default function SupportLayout({ children }) {
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
    { icon: Home, label: 'Dashboard', path: '/support/dashboard' },
    { icon: MessageSquare, label: 'Tickets', path: '/support/tickets' },
    { icon: Book, label: 'Knowledge Base', path: '/support/kb' },
    { icon: ShoppingBag, label: 'Store Front', path: '/home' },
  ];

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 bg-[#0F172A] w-72 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out z-30 shadow-2xl shadow-black/50`}>
        <div className="flex h-20 items-center px-8 text-white font-black text-2xl border-b border-white/5">
          <div className="w-10 h-10 bg-[#F97316] rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-[#F97316]/20">
            <ShoppingBag className="w-6 h-6 text-white" />
          </div>
          <span className="tracking-tighter">ShopPro <span className="text-[#F97316]">Support</span></span>
        </div>
        
        <nav className="p-6 space-y-2 flex-1">
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4 ml-4">Main Menu</p>
          {navItems.map((item, idx) => {
            const isActive = location.pathname === item.path || (item.path !== '/support/dashboard' && location.pathname.startsWith(item.path));
            return (
              <Link 
                key={idx} 
                to={item.path}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all group ${isActive ? 'bg-[#F97316] text-white shadow-xl shadow-[#F97316]/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-white'}`} />
                  <span className="font-bold text-sm">{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-white/5 space-y-4">
          <div className="bg-white/5 rounded-2xl p-4 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F97316] to-orange-400 flex items-center justify-center font-black text-white shadow-lg">
              {user?.name?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{user?.role} Mode</p>
            </div>
          </div>
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
        {/* Navbar */}
        <header className="h-20 bg-white/80 backdrop-blur-md sticky top-0 flex items-center justify-between px-8 z-20 border-b border-gray-100">
          <div className="flex items-center space-x-4">
            <button className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-xl" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden lg:flex items-center bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100 focus-within:ring-2 focus-within:ring-[#F97316]/20 transition-all w-80">
              <Search className="w-4 h-4 text-gray-400 mr-2" />
              <input type="text" placeholder="Search anything..." className="bg-transparent text-sm font-medium outline-none w-full" />
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <button className="relative p-2 text-gray-400 hover:text-[#F97316] transition-colors rounded-xl hover:bg-gray-50">
              <Bell className="w-6 h-6" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <button className="p-2 text-gray-400 hover:text-[#F97316] transition-colors rounded-xl hover:bg-gray-50">
              <Settings className="w-6 h-6" />
            </button>
            <div className="h-8 w-px bg-gray-100 mx-2"></div>
            <div className="flex items-center space-x-3">
              <ThemeToggle />
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-[#0F172A]">{user?.name}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Support Agent</p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-[#0F172A] text-white flex items-center justify-center font-black border-2 border-white shadow-lg">
                {user?.name?.[0]}
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 p-8 lg:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {children}
        </main>
      </div>
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-[#0F172A]/60 z-20 md:hidden backdrop-blur-sm animate-in fade-in duration-300" 
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}
