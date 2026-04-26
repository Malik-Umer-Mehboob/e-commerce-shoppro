import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  LayoutDashboard, 
  Truck, 
  LogOut, 
  Package, 
  MapPin, 
  Phone, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Menu,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { authService } from '../../services/authService';
import { logoutUser } from '../../store/authSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import ThemeToggle from '../../components/ThemeToggle';

export default function RiderDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/rider/dashboard');
      setData(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      dispatch(logoutUser());
      navigate('/login');
    } catch (error) {}
  };

  const updateDeliveryStatus = async (id, status) => {
    try {
      await api.patch(`/rider/assignments/${id}/status`, { status });
      toast.success(`Delivery marked as ${status.replace('_', ' ')}`);
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F97316]"></div>
      </div>
    );
  }

  const stats = data?.stats || { total_deliveries: 0, active_deliveries: 0, today_deliveries: 0 };
  const assignments = data?.active_assignments || [];

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 bg-[#0F172A] w-64 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out z-20 shadow-2xl`}>
        <div className="flex h-16 items-center px-6 text-white font-black text-xl border-b border-white/5">
          ShopPro <span className="text-[#F97316] ml-2">Rider</span>
        </div>
        <nav className="p-4 space-y-2">
          <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl bg-[#F97316] text-white shadow-lg shadow-[#F97316]/20 transition-all font-bold">
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all font-bold">
            <Truck className="w-5 h-5" />
            <span>My Deliveries</span>
          </button>
        </nav>
        <div className="absolute bottom-0 w-full p-4 border-t border-white/5">
          <button onClick={handleLogout} className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl text-red-400 font-bold hover:bg-red-500/10 transition-all border border-red-500/20">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 z-10 sticky top-0">
          <button className="md:hidden text-gray-500" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-4 ml-auto">
            <ThemeToggle />
            <div className="text-right">
              <p className="text-sm font-black text-[#0F172A]">{user?.name}</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Delivery Rider</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#0F172A] text-white flex items-center justify-center font-black border-2 border-white shadow-lg">
              {user?.name?.charAt(0)}
            </div>
          </div>
        </header>

        <main className="p-6 md:p-8 space-y-8 max-w-5xl mx-auto w-full">
          <div>
            <h1 className="text-3xl font-black text-[#0F172A]">Welcome, {user?.name.split(' ')[0]}!</h1>
            <p className="text-gray-500 font-medium mt-1">Your active deliveries for today</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center space-x-4">
              <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl"><CheckCircle2 className="w-6 h-6" /></div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-nowrap">Today's Done</p>
                <h4 className="text-2xl font-black text-[#0F172A]">{stats.today_deliveries}</h4>
              </div>
            </div>
            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center space-x-4">
              <div className="p-4 bg-orange-50 text-orange-600 rounded-2xl"><Clock className="w-6 h-6" /></div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active</p>
                <h4 className="text-2xl font-black text-[#0F172A]">{stats.active_deliveries}</h4>
              </div>
            </div>
            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center space-x-4">
              <div className="p-4 bg-green-50 text-green-600 rounded-2xl"><Package className="w-6 h-6" /></div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Done</p>
                <h4 className="text-2xl font-black text-[#0F172A]">{stats.total_deliveries}</h4>
              </div>
            </div>
          </div>

          {/* Active Assignments */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-[#0F172A]">Pending Deliveries</h2>
              <span className="px-3 py-1 bg-gray-100 text-gray-500 text-[10px] font-black rounded-full uppercase tracking-widest">
                {assignments.length} Tasks
              </span>
            </div>

            {assignments.length === 0 ? (
              <div className="bg-white rounded-[2rem] border border-dashed border-gray-200 p-12 text-center">
                <Truck className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-400 font-bold">No active deliveries assigned to you</p>
                <button onClick={fetchDashboardData} className="text-[#F97316] font-black text-xs uppercase tracking-widest mt-2 hover:underline">Refresh List</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {assignments.map((a) => (
                  <div key={a.id} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden group hover:border-[#F97316]/30 transition-all duration-300">
                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 bg-[#0F172A] text-white text-[10px] font-black rounded-lg uppercase tracking-widest">
                          {a.order_number}
                        </span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center">
                          <Clock className="w-3 h-3 mr-1" /> {a.assigned_at}
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <div className="p-2 bg-gray-50 rounded-lg text-gray-400"><MapPin className="w-4 h-4" /></div>
                          <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Delivery Address</p>
                            <p className="text-xs font-bold text-[#0F172A] mt-0.5 line-clamp-2">
                              {a.delivery_address.street}, {a.delivery_address.city}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-6">
                          <div className="flex items-center space-x-2 text-gray-500">
                            <div className="p-2 bg-gray-50 rounded-lg text-gray-400"><LayoutDashboard className="w-4 h-4" /></div>
                            <div>
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer</p>
                              <p className="text-xs font-bold text-[#0F172A]">{a.customer_name}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-500">
                            <div className="p-2 bg-gray-50 rounded-lg text-gray-400"><Phone className="w-4 h-4" /></div>
                            <div>
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact</p>
                              <p className="text-xs font-bold text-[#0F172A]">{a.customer_phone}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 flex gap-3">
                        {a.status === 'assigned' ? (
                          <button 
                            onClick={() => updateDeliveryStatus(a.id, 'picked_up')}
                            className="flex-1 bg-[#F97316] text-white py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-[#F97316]/20 hover:scale-[1.02] transition-all flex items-center justify-center space-x-2"
                          >
                            <Package className="w-4 h-4" />
                            <span>Mark Picked Up</span>
                          </button>
                        ) : (
                          <button 
                            onClick={() => updateDeliveryStatus(a.id, 'delivered')}
                            className="flex-1 bg-green-500 text-white py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-green-500/20 hover:scale-[1.02] transition-all flex items-center justify-center space-x-2"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Mark Delivered</span>
                          </button>
                        )}
                        <button className="p-3 bg-gray-50 text-gray-400 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all">
                          <XCircle className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
