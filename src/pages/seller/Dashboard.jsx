import { useState, useEffect } from 'react';
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
  TrendingUp, 
  DollarSign, 
  AlertCircle,
  ChevronRight,
  Tag
} from 'lucide-react';
import { authService } from '../../services/authService';
import { logoutUser } from '../../store/authSlice';
import { useNavigate, NavLink, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../services/api';

export default function SellerDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [stats, setStats] = useState({});
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/seller/dashboard');
        if (response.data?.success) {
          setStats(response.data.data.stats || {});
          setRecentOrders(response.data.data.recent_orders || []);
          setLowStock(response.data.data.low_stock_products || []);
        }
      } catch (error) {
        toast.error('Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
    { icon: LayoutDashboard, label: 'Dashboard', path: '/seller/dashboard', end: true },
    { icon: Package, label: 'My Products', path: '/seller/products' },
    { icon: ShoppingCart, label: 'Orders', path: '/seller/orders' },
    { icon: Tag, label: 'Request Category', path: '/seller/category-request' },
    { icon: BarChart2, label: 'Analytics', path: '/seller/analytics' },
    { icon: Settings, label: 'Settings', path: '/seller/settings' },
  ];

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0);
  };

  const StatCard = ({ title, value, subText, icon: Icon, colorClass, subColorClass = "text-gray-400" }) => (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-2xl ${colorClass} bg-opacity-10`}>
          <Icon className={`w-6 h-6 ${colorClass.replace('bg-', 'text-')}`} />
        </div>
      </div>
      <div>
        <h3 className="text-gray-500 text-xs font-black uppercase tracking-widest mb-1">{title}</h3>
        <p className="text-2xl font-black text-[#0F172A]">{loading ? '...' : value}</p>
        <p className={`text-xs font-bold mt-1 ${subColorClass}`}>{loading ? 'Loading...' : subText}</p>
      </div>
    </div>
  );

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
          {navItems.map((item, idx) => (
            <NavLink 
              key={idx} 
              to={item.path}
              end={item.end}
              className={({ isActive }) => `w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all group ${isActive ? 'bg-[#F97316] text-white shadow-xl shadow-[#F97316]/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
              onClick={() => setIsSidebarOpen(false)}
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center space-x-3">
                    <item.icon className={`w-5 h-5 transition-colors`} />
                    <span className="font-bold text-sm">{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 animate-in slide-in-from-left-2" />}
                </>
              )}
            </NavLink>
          ))}
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
          <div className="mb-10">
            <h1 className="text-3xl font-black text-[#0F172A] mb-2">Welcome back, {user?.name}!</h1>
            <p className="text-gray-400 font-bold">Here&apos;s what&apos;s happening with your store today.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <StatCard 
              title="Total Products" 
              value={stats.total_products} 
              subText={`${stats.published_products} published · ${stats.draft_products} drafts`}
              icon={Package}
              colorClass="bg-blue-500"
            />
            <StatCard 
              title="Total Orders" 
              value={stats.total_orders} 
              subText={`${stats.this_month_orders} this month`}
              icon={ShoppingCart}
              colorClass="bg-purple-500"
            />
            <StatCard 
              title="Total Revenue" 
              value={formatPrice(stats.total_revenue)} 
              subText={`${formatPrice(stats.this_month_revenue)} this month`}
              icon={DollarSign}
              colorClass="bg-green-500"
              subColorClass="text-green-600"
            />
            <StatCard 
              title="Out of Stock" 
              value={stats.out_of_stock} 
              subText="Products need restocking"
              icon={AlertCircle}
              colorClass="bg-red-500"
              subColorClass={stats.out_of_stock > 0 ? "text-red-500" : "text-gray-400"}
            />
          </div>

          {lowStock.length > 0 && (
            <div className="bg-orange-50 border border-orange-100 p-6 rounded-[2rem] mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-orange-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-orange-900">{lowStock.length} products are running low on stock</h3>
                  <p className="text-orange-700/70 text-sm font-bold">Some items are below their threshold. Restock soon to avoid losing sales.</p>
                </div>
              </div>
              <Link to="/seller/products" className="px-6 py-3 bg-orange-500 text-white rounded-2xl font-black text-sm shadow-xl shadow-orange-500/20 hover:bg-orange-600 transition-all">
                Manage Inventory
              </Link>
            </div>
          )}

          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
              <h3 className="text-lg font-black text-[#0F172A]">Recent Orders</h3>
              <Link to="/seller/orders" className="text-xs font-black text-[#F97316] hover:underline uppercase tracking-widest">View All Orders</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Order #</th>
                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Product</th>
                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer</th>
                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Qty</th>
                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Total</th>
                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-8 py-10 text-center text-gray-400 font-bold">No orders yet</td>
                    </tr>
                  ) : (
                    recentOrders.map((order, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-8 py-5 font-black text-xs text-[#0F172A]">{order.order_number}</td>
                        <td className="px-8 py-5">
                          <p className="font-bold text-xs text-[#0F172A] group-hover:text-[#F97316] transition-colors">{order.product_name}</p>
                        </td>
                        <td className="px-8 py-5 text-xs font-bold text-gray-600">{order.customer_name}</td>
                        <td className="px-8 py-5 text-xs font-bold text-gray-500">{order.quantity}</td>
                        <td className="px-8 py-5 font-black text-xs text-[#0F172A]">{formatPrice(order.total)}</td>
                        <td className="px-8 py-5 text-xs">
                          <span className={`px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-tighter ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-600' :
                            order.status === 'processing' ? 'bg-blue-100 text-blue-600' :
                            order.status === 'cancelled' ? 'bg-red-100 text-red-600' :
                            'bg-yellow-100 text-yellow-600'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-xs font-bold text-gray-400">{order.created_at}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
      
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-[#0F172A]/60 z-20 md:hidden backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsSidebarOpen(false)}></div>
      )}
    </div>
  );
}
