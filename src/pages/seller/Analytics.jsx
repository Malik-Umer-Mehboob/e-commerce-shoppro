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
  TrendingUp,
  DollarSign,
  PieChart as PieChartIcon,
  Calendar,
  Tag
} from 'lucide-react';
import { authService } from '../../services/authService';
import { logoutUser } from '../../store/authSlice';
import { useNavigate, NavLink } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

export default function SellerAnalytics() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [ordersByStatus, setOrdersByStatus] = useState([]);
  
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/seller/analytics');
        if (response.data?.success) {
          setMonthlyRevenue(response.data.data.monthly_revenue || []);
          setTopProducts(response.data.data.top_products || []);
          setOrdersByStatus(response.data.data.orders_by_status || []);
        }
      } catch (error) {
        toast.error('Failed to fetch analytics data');
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
      currency: 'PKR',
    }).format(amount || 0).replace('PKR', 'Rs.');
  };

  const statusColors = {
    pending: 'bg-yellow-500',
    processing: 'bg-blue-500',
    shipped: 'bg-purple-500',
    delivered: 'bg-green-500',
    cancelled: 'bg-red-500'
  };

  return (
    <>
      <div className="mb-10">
        <h1 className="text-3xl font-black text-[#0F172A] mb-2">Analytics</h1>
        <p className="text-gray-400 font-bold">Track your store performance and sales trends</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* Monthly Revenue Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm min-w-0">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-orange-100 text-orange-600 rounded-2xl">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="font-black text-[#0F172A]">Monthly Revenue</h3>
            </div>
            <div className="flex items-center space-x-2 text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1.5 rounded-xl">
              <Calendar className="w-3.5 h-3.5" />
              <span>Last 6 Months</span>
            </div>
          </div>
          
          <div className="h-[350px] w-full">
            {loading ? (
              <div className="w-full h-full bg-gray-50 animate-pulse rounded-2xl"></div>
            ) : monthlyRevenue.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }}
                    tickFormatter={(value) => `Rs. ${value}`}
                  />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ 
                      borderRadius: '16px', 
                      border: 'none', 
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                      padding: '12px 16px'
                    }}
                    itemStyle={{ fontWeight: 800, color: '#0F172A' }}
                    labelStyle={{ fontWeight: 800, color: '#94a3b8', marginBottom: '4px' }}
                    formatter={(value) => [formatPrice(value), 'Revenue']}
                  />
                  <Bar 
                    dataKey="revenue" 
                    fill="#F97316" 
                    radius={[6, 6, 0, 0]} 
                    barSize={40}
                  >
                    {monthlyRevenue.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === monthlyRevenue.length - 1 ? '#F97316' : '#fdba74'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 font-bold bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                <TrendingUp className="w-8 h-8 mb-2 opacity-20" />
                <p className="uppercase tracking-widest text-[10px]">No revenue data found</p>
              </div>
            )}
          </div>
        </div>

        {/* Orders by Status */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
              <PieChartIcon className="w-5 h-5" />
            </div>
            <h3 className="font-black text-[#0F172A]">Order Distribution</h3>
          </div>
          
          <div className="space-y-4 flex-1 flex flex-col justify-center">
            {loading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="h-12 bg-gray-50 animate-pulse rounded-2xl"></div>
              ))
            ) : ordersByStatus.length === 0 ? (
              <div className="text-center py-10 text-gray-400 font-bold text-sm">No status data available</div>
            ) : (
              ordersByStatus.map((status, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${statusColors[status.status] || 'bg-gray-400'}`}></div>
                    <span className="text-sm font-black text-[#0F172A] capitalize">{status.status}</span>
                  </div>
                  <span className="text-sm font-black text-[#0F172A]">{status.count}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Top Selling Products */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-50 flex items-center space-x-3">
          <div className="p-2.5 bg-green-100 text-green-600 rounded-xl">
            <DollarSign className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-black text-[#0F172A]">Top Selling Products</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Product Name</th>
                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Units Sold</th>
                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Total Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array(3).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="3" className="px-8 py-6 h-16 bg-gray-50/20"></td>
                  </tr>
                ))
              ) : topProducts.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-8 py-12 text-center text-gray-400 font-bold">No sales data yet</td>
                </tr>
              ) : (
                topProducts.map((product, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-5">
                      <p className="font-black text-xs text-[#0F172A]">{product.product_name}</p>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className="px-3 py-1 bg-gray-100 text-[#0F172A] text-xs font-black rounded-full">
                        {product.total_sold} units
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right font-black text-xs text-[#F97316]">
                      {formatPrice(product.total_revenue)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
