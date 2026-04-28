import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  MessageSquare, 
  Clock, 
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Users,
  Package,
  Book
} from 'lucide-react';
import api from '../../services/api';

export default function SupportDashboard() {
  const { user } = useSelector(state => state.auth);
  const [metrics, setMetrics] = useState({
    open_tickets: 0,
    pending_tickets: 0,
    resolved_today: 0,
    active_chats: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await api.get(`/support/metrics`);
      setMetrics(response.data.data);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: 'Open Tickets', value: metrics.open_tickets, icon: MessageSquare, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Pending', value: metrics.pending_tickets, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Resolved Today', value: metrics.resolved_today, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Active Chats', value: metrics.active_chats, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="text-[10px] font-black text-[#F97316] uppercase tracking-[0.3em] mb-3">Support Overview</p>
          <h1 className="text-4xl font-black text-[#0F172A] leading-tight">
            Welcome back, <br />
            <span className="text-[#F97316]">{user?.name}</span> 👋
          </h1>
        </div>
        <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="text-right">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Shift Progress</p>
            <p className="text-sm font-bold text-[#0F172A]">65% Complete</p>
          </div>
          <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="w-[65%] h-full bg-[#F97316]"></div>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col transition-all hover:shadow-xl hover:-translate-y-1 group">
            <div className={`w-14 h-14 ${stat.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              <stat.icon className={`w-7 h-7 ${stat.color}`} />
            </div>
            <span className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">{stat.label}</span>
            <span className={`text-4xl font-black text-[#0F172A]`}>{loading ? '...' : stat.value}</span>
          </div>
        ))}
      </div>

      {/* Charts or Secondary Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[2rem] border border-gray-100 shadow-sm p-10">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-xl font-black text-[#0F172A]">Performance Metrics</h2>
            <select className="text-xs font-bold bg-gray-50 border-none rounded-xl px-4 py-2 outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-64 flex items-end justify-between space-x-4">
            {[45, 65, 35, 85, 55, 75, 60].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center group">
                <div 
                  className="w-full bg-[#F97316]/10 rounded-t-xl group-hover:bg-[#F97316]/20 transition-all relative"
                  style={{ height: `${h}%` }}
                >
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#0F172A] text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {h} Tickets
                  </div>
                </div>
                <span className="text-[10px] font-black text-gray-400 mt-4 uppercase">Day {i+1}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#0F172A] rounded-[2rem] shadow-2xl p-10 text-white relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#F97316]/10 rounded-full blur-3xl"></div>
          <h2 className="text-xl font-black mb-8 relative">Quick Links</h2>
          <div className="space-y-4 relative">
            {[
              { label: 'View All Tickets', icon: MessageSquare, path: '/support/tickets' },
              { label: 'Search Customers', icon: Users, path: '/support/customers' },
              { label: 'Manage KB Articles', icon: Book, path: '/support/kb' },
              { label: 'Recent Orders', icon: Package, path: '/support/orders' },
            ].map((link, i) => (
              <button 
                key={i}
                className="w-full flex items-center space-x-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-white/5 group"
              >
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-[#F97316]/20 group-hover:text-[#F97316] transition-colors">
                  <link.icon className="w-5 h-5" />
                </div>
                <span className="font-bold text-sm">{link.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
