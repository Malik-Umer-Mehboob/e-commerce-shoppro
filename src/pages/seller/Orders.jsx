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
  ChevronRight,
  Search,
  Filter,
  Download,
  Tag
} from 'lucide-react';
import { authService } from '../../services/authService';
import { logoutUser } from '../../store/authSlice';
import { useNavigate, NavLink, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../services/api';

export default function SellerOrders() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get('/seller/orders');
      if (response.data?.success) {
        setOrders(response.data.data.data || []);
      }
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

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

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.product_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-[#0F172A] mb-2">My Orders</h1>
          <p className="text-gray-400 font-bold">Manage orders containing your products</p>
        </div>
        <button className="flex items-center space-x-2 px-6 py-3 bg-white border border-gray-100 text-[#0F172A] font-bold rounded-2xl shadow-sm hover:shadow-md transition-all">
          <Download className="w-4 h-4" />
          <span>Export Orders</span>
        </button>
      </div>

      <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by order #, customer, or product..." 
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#F97316]/20 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative flex-shrink-0">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select 
                className="pl-12 pr-10 py-3 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#F97316]/20 outline-none transition-all appearance-none cursor-pointer"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Order Info</th>
                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Product</th>
                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer</th>
                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Qty/Price</th>
                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Total</th>
                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="7" className="px-8 py-6 h-20 bg-gray-50/20"></td>
                  </tr>
                ))
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center">
                      <ShoppingCart className="w-12 h-12 text-gray-200 mb-4" />
                      <p className="text-gray-400 font-bold">No orders yet. Start selling products to see orders here.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <p className="font-black text-xs text-[#0F172A]">{order.order_number}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter mt-0.5">PAYMENT: {order.payment_status}</p>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-50 overflow-hidden flex-shrink-0 border border-gray-100">
                          {order.product_thumbnail ? (
                            <img src={order.product_thumbnail} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <Package className="w-full h-full p-2 text-gray-300" />
                          )}
                        </div>
                        <p className="font-bold text-xs text-[#0F172A] line-clamp-1">{order.product_name}</p>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-xs font-black text-[#0F172A]">{order.customer_name}</p>
                      <p className="text-[10px] text-gray-400 font-bold truncate max-w-[120px]">{order.customer_email}</p>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-xs font-bold text-gray-600">{order.quantity} x {formatPrice(order.price)}</p>
                    </td>
                    <td className="px-8 py-5 font-black text-xs text-[#F97316]">{formatPrice(order.total)}</td>
                    <td className="px-8 py-5 text-xs">
                      <span className={`px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-tighter ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-600' :
                        order.status === 'processing' ? 'bg-blue-100 text-blue-600' :
                        order.status === 'shipped' ? 'bg-purple-100 text-purple-600' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-600' :
                        'bg-yellow-100 text-yellow-600'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-xs font-bold text-gray-400 whitespace-nowrap">{order.created_at}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Simple Pagination Placeholder */}
        {!loading && filteredOrders.length > 0 && (
          <div className="px-8 py-6 border-t border-gray-50 flex items-center justify-between">
            <p className="text-xs font-bold text-gray-400">Showing {filteredOrders.length} results</p>
            <div className="flex space-x-2">
              <button className="px-4 py-2 border border-gray-100 rounded-xl text-xs font-bold text-gray-400 cursor-not-allowed">Previous</button>
              <button className="px-4 py-2 bg-orange-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-orange-500/20">1</button>
              <button className="px-4 py-2 border border-gray-100 rounded-xl text-xs font-bold text-[#0F172A] hover:bg-gray-50 transition-colors">Next</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
