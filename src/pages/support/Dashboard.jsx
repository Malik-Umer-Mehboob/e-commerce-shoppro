import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Menu, 
  LogOut, 
  Home, 
  Package, 
  Users, 
  Settings, 
  ShoppingBag 
} from 'lucide-react';
import { authService } from '../../services/authService';
import { logoutUser } from '../../store/authSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export default function SupportDashboard() {
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
      dispatch(logoutUser());
      navigate('/login');
      toast.success('Logged out');
    }
  };

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/support/dashboard', active: true },
    { icon: Package, label: 'Orders', path: '/support/orders', active: false },
    { icon: Users, label: 'Customers', path: '/support/customers', active: false },
    { icon: Settings, label: 'Settings', path: '/support/settings', active: false },
  ];

  const stats = [
    { label: 'Open Tickets', value: '12', color: 'text-blue-600' },
    { label: 'Orders Today', value: '48', color: 'text-green-600' },
    { label: 'Customers', value: '1,240', color: 'text-purple-600' },
  ];

  const recentOrders = [
    { id: '#ORD-7741', customer: 'John Doe', status: 'Pending', date: '2024-04-18' },
    { id: '#ORD-7742', customer: 'Jane Smith', status: 'Processing', date: '2024-04-18' },
    { id: '#ORD-7743', customer: 'Mike Johnson', status: 'Shipped', date: '2024-04-17' },
    { id: '#ORD-7744', customer: 'Sarah Wilson', status: 'Delivered', date: '2024-04-17' },
    { id: '#ORD-7745', customer: 'Chris Brown', status: 'Cancelled', date: '2024-04-16' },
  ];

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 bg-[#0F172A] w-64 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out z-20`}>
        <div className="flex h-16 items-center px-6 text-white font-bold text-xl border-b border-gray-700">
          <ShoppingBag className="w-6 h-6 mr-2 text-[#F97316]" />
          <span>ShopPro Support</span>
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

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen transition-all duration-300">
        {/* Navbar */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-4 sm:px-6 z-10">
          <button className="md:hidden text-gray-500" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex items-center space-x-4">
            <span className="bg-[#F97316]/10 text-[#F97316] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider hidden sm:block">
              Support Panel
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-[#0F172A]">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role} Account</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#0F172A] text-white flex items-center justify-center font-bold border-2 border-white shadow-sm">
              {user?.name?.split(' ').map(n => n[0]).join('') || 'S'}
            </div>
            <button 
              onClick={handleLogout} 
              className="p-2 text-gray-400 hover:text-[#F97316] transition-colors rounded-lg hover:bg-gray-50"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#0F172A]">Welcome, Support Staff 👋</h1>
            <p className="text-gray-500 mt-1">You can view orders and manage customer queries</p>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center transition-all hover:shadow-md">
                <span className="text-gray-500 text-sm font-semibold mb-1 uppercase tracking-tight">{stat.label}</span>
                <span className={`text-4xl font-black ${stat.color}`}>{stat.value}</span>
              </div>
            ))}
          </div>

          {/* Recent Orders Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-[#0F172A]">Recent Orders</h2>
              <button className="text-sm text-[#F97316] font-semibold hover:underline">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentOrders.map((order, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-sm text-[#0F172A]">{order.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{order.customer}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                          order.status === 'Pending' ? 'bg-orange-100 text-orange-700' :
                          order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{order.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-10 md:hidden backdrop-blur-sm" 
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}
