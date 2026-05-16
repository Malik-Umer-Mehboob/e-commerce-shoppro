import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Truck, 
  Package, 
  MapPin, 
  Phone, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Menu,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import RiderLayout from '../../components/rider/Layout';
import NotificationBell from '../../components/notifications/NotificationBell';

export default function RiderDashboard() {
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
    <RiderLayout>
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 z-10 sticky top-0 border-b border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="font-black text-[#0F172A] text-lg uppercase tracking-tight">Overview</span>
              <div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div>
              <span className="text-xs font-bold text-gray-400">Today</span>
            </div>
          </div>
          <div className="flex items-center space-x-4 ml-auto">
            <NotificationBell />
            <div className="text-right">
              <p className="text-sm font-black text-[#0F172A]">{user?.name}</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Rider Panel</p>
            </div>
          </div>
        </header>

        <main className="p-6 md:p-8 space-y-8 max-w-5xl mx-auto w-full">
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="relative z-10">
              <h1 className="text-3xl font-black text-[#0F172A]">Hi, {user?.name.split(' ')[0]}! 👋</h1>
              <p className="text-gray-500 font-medium mt-1">You have {assignments.length} pending tasks for today.</p>
            </div>
            <div className="absolute right-0 top-0 w-32 h-32 bg-orange-50 rounded-bl-[4rem] flex items-center justify-center">
                <Truck className="w-12 h-12 text-orange-200" />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center space-x-4 hover:border-orange-200 transition-all">
              <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl"><CheckCircle2 className="w-6 h-6" /></div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-nowrap">Today's Done</p>
                <h4 className="text-2xl font-black text-[#0F172A]">{stats.today_deliveries}</h4>
              </div>
            </div>
            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center space-x-4 hover:border-orange-200 transition-all">
              <div className="p-4 bg-orange-50 text-orange-600 rounded-2xl"><Clock className="w-6 h-6" /></div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Tasks</p>
                <h4 className="text-2xl font-black text-[#0F172A]">{stats.active_deliveries}</h4>
              </div>
            </div>
            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center space-x-4 hover:border-orange-200 transition-all">
              <div className="p-4 bg-green-50 text-green-600 rounded-2xl"><Package className="w-6 h-6" /></div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">All Time</p>
                <h4 className="text-2xl font-black text-[#0F172A]">{stats.total_deliveries}</h4>
              </div>
            </div>
          </div>

          {/* Active Assignments */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-[#0F172A]">Deliveries to Complete</h2>
              <button 
                onClick={() => navigate('/rider/deliveries')}
                style={{
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#EA6F10'}
                onMouseLeave={e => e.currentTarget.style.color = '#F97316'}
                className="text-xs font-black text-orange-600 uppercase tracking-widest hover:underline"
              >
                View All History
              </button>
            </div>

            {assignments.length === 0 ? (
              <div className="bg-white rounded-[2rem] border border-dashed border-gray-200 p-12 text-center">
                <Truck className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-400 font-bold">Great job! No active deliveries remaining.</p>
                <button 
                    onClick={fetchDashboardData} 
                    style={{
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = '#EA6F10'}
                    onMouseLeave={e => e.currentTarget.style.color = '#F97316'}
                    className="text-[#F97316] font-black text-xs uppercase tracking-widest mt-2 hover:underline"
                >
                    Refresh
                </button>
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
                                {(() => {
                                  const addr = a.delivery_address;
                                  if (!addr) return 'Address not available';
                                  const parts = [
                                    addr.address_line_1,
                                    addr.address_line_2,
                                    addr.city,
                                    addr.country,
                                  ].filter(Boolean);
                                  return parts.length > 0 ? parts.join(', ') : 'Address not available';
                                })()}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-6">
                          <div className="flex items-center space-x-2 text-gray-500">
                            <div>
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer</p>
                              <p className="text-xs font-bold text-[#0F172A]">{a.customer_name}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-500">
                            <div>
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact</p>
                              <p className="text-xs font-bold text-[#0F172A]">{a.customer_phone}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 flex gap-3">
                        {a.status === 'assigned' || a.status === 'pending' ? (
                          <button 
                            onClick={() => updateDeliveryStatus(a.id, 'picked_up')}
                            style={{
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                backgroundColor: '#F97316',
                            }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#EA6F10'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#F97316'}
                            className="flex-1 text-white py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-[#F97316]/20 hover:scale-[1.02] transition-all flex items-center justify-center space-x-2"
                          >
                            <Package className="w-4 h-4" />
                            <span>Mark Picked Up</span>
                          </button>
                        ) : (
                          <button 
                            onClick={() => updateDeliveryStatus(a.id, 'delivered')}
                            style={{
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                backgroundColor: '#10B981',
                            }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#059669'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#10B981'}
                            className="flex-1 text-white py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-green-500/20 hover:scale-[1.02] transition-all flex items-center justify-center space-x-2"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Mark Delivered</span>
                          </button>
                        )}
                        <button 
                            style={{
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                            className="p-3 bg-gray-50 text-gray-400 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all"
                        >
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
    </RiderLayout>
  );
}
