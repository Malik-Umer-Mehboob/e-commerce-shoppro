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
  const [stats, setStats] = useState({
    total_tickets: 0,
    open_tickets: 0,
    in_progress_tickets: 0,
    resolved_tickets: 0,
    closed_tickets: 0,
    resolved_today: 0,
    total_today: 0,
    shift_progress: 0,
    active_chats: 0,
    performance_metrics: [],
    total_handled_by_agent: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/support/dashboard');
      const data = response.data?.data;
      setStats({
        total_tickets: data?.total_tickets ?? 0,
        open_tickets: data?.open_tickets ?? 0,
        in_progress_tickets: data?.in_progress_tickets ?? 0,
        resolved_tickets: data?.resolved_tickets ?? 0,
        closed_tickets: data?.closed_tickets ?? 0,
        resolved_today: data?.resolved_today ?? 0,
        total_today: data?.total_today ?? 0,
        shift_progress: data?.shift_progress ?? 0,
        active_chats: data?.active_chats ?? 0,
        performance_metrics: data?.performance_metrics ?? [],
        total_handled_by_agent: data?.total_handled_by_agent ?? 0,
      });
    } catch (error) {
      
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Total Tickets', value: stats.total_tickets, icon: Package, color: 'text-[#0F172A]', bg: 'bg-gray-100' },
    { label: 'Open Tickets', value: stats.open_tickets, icon: MessageSquare, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'In Progress', value: stats.in_progress_tickets, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Resolved', value: stats.resolved_tickets, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
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
            <p className="text-sm font-bold text-[#0F172A]">{stats.shift_progress}% Complete</p>
          </div>
          <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#F97316]" style={{ width: `${stats.shift_progress}%` }}></div>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {statCards.map((stat, idx) => (
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
            <div>
              <h2 className="text-xl font-black text-[#0F172A]">Performance Metrics</h2>
              <p className="text-xs font-bold text-gray-400 mt-1">{stats.total_handled_by_agent} Total Tickets Handled</p>
            </div>
            <select className="text-xs font-bold bg-gray-50 border-none rounded-xl px-4 py-2 outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-72 flex items-end justify-between space-x-2 sm:space-x-4 relative pt-10">
            {/* Y-Axis Guideline (Subtle) */}
            <div className="absolute inset-x-0 bottom-0 top-10 border-b border-gray-50 flex flex-col justify-between pointer-events-none">
              <div className="border-t border-gray-50 w-full h-0"></div>
              <div className="border-t border-gray-50 w-full h-0"></div>
              <div className="border-t border-gray-50 w-full h-0"></div>
            </div>

            {stats.performance_metrics.length > 0 ? (
              stats.performance_metrics.map((m, i) => {
                const maxCount = Math.max(...stats.performance_metrics.map(d => d.count), 5);
                const height = (m.count / maxCount) * 100;
                
                return (
                  <div key={i} className="flex-1 flex flex-col items-center group relative z-10">
                    <span className="text-[10px] font-black text-[#F97316] mb-2">{m.count}</span>
                    <div 
                      className="w-full bg-[#F97316]/20 rounded-t-xl group-hover:bg-[#F97316] transition-all relative border-x border-t border-[#F97316]/10"
                      style={{ height: `${Math.max(height, 2)}%` }}
                    >
                    </div>
                    <div className="mt-4 flex flex-col items-center">
                      <span className="text-[10px] font-black text-[#0F172A] uppercase">{m.day}</span>
                      <span className="text-[8px] font-bold text-gray-400 mt-1">{m.date.split('-').slice(1).join('/')}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              [45, 65, 35, 85, 55, 75, 60].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center animate-pulse">
                  <div className="w-full bg-gray-50 rounded-t-xl" style={{ height: `${h}%` }}></div>
                  <span className="text-[10px] font-black text-gray-200 mt-4 uppercase">...</span>
                </div>
              ))
            )}
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
