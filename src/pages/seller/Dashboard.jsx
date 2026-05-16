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
  Tag,
  Clock,
  XCircle
} from 'lucide-react';
import { authService } from '../../services/authService';
import { logoutUser, updateUser } from '../../store/authSlice';
import { useNavigate, NavLink, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import NotificationBell from '../../components/notifications/NotificationBell';
import ReApplyModal from './components/ReApplyModal';

export default function SellerDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [stats, setStats] = useState({});
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [assignedCategories, setAssignedCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReApplyModal, setShowReApplyModal] = useState(false);
  
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get('/seller/dashboard');
        if (response.data?.success) {
          setStats(response.data.data.stats || {});
          setRecentOrders(response.data.data.recent_orders || []);
          setLowStock(response.data.data.low_stock_products || []);
          setAssignedCategories(response.data.data.assigned_categories || []);
          
          // Sync account status if backend returns a different one
          if (response.data.data.account_status && response.data.data.account_status !== user?.seller_status) {
            dispatch(updateUser({ seller_status: response.data.data.account_status }));
          }
        }
      } catch (error) {
        if (error.response?.status === 403) {
          // Access restricted - user likely pending/rejected
          // No toast needed, the UI handles this via seller_status
        } else {
          toast.error('Failed to fetch dashboard data');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.seller_status]);

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
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
    }).format(amount || 0).replace('PKR', 'Rs.');
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
    <>
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm">
          <div className="w-12 h-12 border-4 border-[#F97316]/20 border-t-[#F97316] rounded-full animate-spin mb-4" />
          <p className="text-gray-400 font-bold">Verifying your store status...</p>
        </div>
      ) : user?.seller_status !== 'approved' ? (
        <>
          <div className="mb-10">
            <h1 className="text-3xl font-black text-[#0F172A] mb-2">Welcome back, {user?.name}!</h1>
            <p className="text-gray-400 font-bold">Here&apos;s what&apos;s happening with your store today.</p>
          </div>
          <div className={`p-8 rounded-[2.5rem] mb-10 border-2 shadow-xl animate-in zoom-in duration-500 ${
          user?.seller_status === 'pending' ? 'bg-amber-50 border-amber-200 text-amber-900' :
          user?.seller_status === 'rejected' ? 'bg-red-50 border-red-200 text-red-900' :
          'bg-gray-50 border-gray-200 text-gray-900'
        }`}>
          <div className="flex items-center space-x-6">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${
              user?.seller_status === 'pending' ? 'bg-amber-500 text-white shadow-amber-500/20' :
              user?.seller_status === 'rejected' ? 'bg-red-500 text-white shadow-red-500/20' :
              'bg-gray-500 text-white shadow-gray-500/20'
            }`}>
              {user?.seller_status === 'pending' ? <Clock className="w-8 h-8" /> : 
               user?.seller_status === 'rejected' ? <XCircle className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-black uppercase tracking-tight">
                Account Status: <span className="underline decoration-wavy decoration-2">{user?.seller_status}</span>
              </h2>
              <div className="mt-2 space-y-4">
                <p className="font-bold opacity-70 max-w-2xl">
                  {user?.seller_status === 'pending' && "Your application is currently being reviewed by our team. You'll receive a notification once your account is approved. Until then, dashboard access is restricted."}
                  {user?.seller_status === 'rejected' && (
                    <>
                      Unfortunately, your seller application was rejected. 
                      {user.rejection_reason && (
                        <div className="mt-3 p-4 bg-white/50 rounded-2xl border border-red-100 italic font-medium">
                          <span className="font-black text-red-600 block mb-1 uppercase text-[10px] tracking-widest not-italic">Reason for Rejection:</span>
                          "{user.rejection_reason}"
                        </div>
                      )}
                    </>
                  )}
                  {user?.seller_status === 'suspended' && "Your seller account has been suspended due to a policy violation. Please contact the administrator for further details."}
                </p>
                <div className="flex flex-wrap gap-4">
                  {user?.seller_status === 'rejected' && (
                    <button 
                      onClick={() => setShowReApplyModal(true)}
                      className="px-8 py-3 bg-[#F97316] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-[#F97316]/20 hover:bg-[#ea6a0f] transition-all"
                    >
                      Re-Apply Now
                    </button>
                  )}
                  <button 
                    onClick={() => window.location.href = 'mailto:support@shoppro.com'}
                    className={`px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                      user?.seller_status === 'pending' ? 'bg-amber-500 text-white hover:bg-amber-600' :
                      user?.seller_status === 'rejected' ? 'bg-white text-red-600 border border-red-200 hover:bg-red-50' :
                      'bg-gray-500 text-white hover:bg-gray-600'
                    }`}
                  >
                    Contact Support
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
      ) : (
        <>
          <div className="mb-10">
            <h1 className="text-3xl font-black text-[#0F172A] mb-2">Welcome back, {user?.name}!</h1>
            <p className="text-gray-400 font-bold mb-4">Here&apos;s what&apos;s happening with your store today.</p>
            
            {assignedCategories.length > 0 && (
              <div className="flex flex-wrap items-center gap-3 animate-in fade-in slide-in-from-left-4 duration-700 delay-200">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mr-2">Authorized Seller of:</span>
                {assignedCategories.map((cat) => (
                  <span key={cat.id} className="px-4 py-1.5 bg-[#0F172A] text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-[#0F172A]/10 border border-white/10 hover:scale-105 transition-transform cursor-default">
                    {cat.name}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <StatCard 
              title="Total Products" 
              value={stats.total_products} 
              subText={`${stats.approved_products || 0} Approved · ${stats.pending_products || 0} Pending`}
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
        </>
      )}
      <ReApplyModal isOpen={showReApplyModal} onClose={() => setShowReApplyModal(false)} user={user} />
    </>
  );
}
