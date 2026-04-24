import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { Search, TrendingUp, AlertCircle, MousePointer2, BarChart3, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const AdminSearchDashboard = () => {
  const [stats, setStats] = useState({ top_searches: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/search/top?limit=10');
        setStats(response.data);
      } catch (err) {
        console.error('Failed to fetch search stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const metrics = [
    { name: 'Total Searches', value: '12,482', change: '+12%', positive: true, icon: Search },
    { name: 'Zero Results Rate', value: '4.2%', change: '-2%', positive: true, icon: AlertCircle },
    { name: 'Click-Through Rate', value: '68%', change: '+5%', positive: true, icon: MousePointer2 },
    { name: 'Avg. Results per Query', value: '24', change: '-1%', positive: false, icon: BarChart3 }
  ];

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-slate-900">Search Analytics</h1>
        <p className="text-slate-500 font-medium">Understand what your customers are looking for.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {metrics.map((m, i) => (
          <div key={i} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-50 text-orange-500 rounded-2xl">
                <m.icon size={20} />
              </div>
              <div className={`flex items-center text-xs font-black ${m.positive ? 'text-green-500' : 'text-red-500'}`}>
                {m.change} {m.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              </div>
            </div>
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">{m.name}</p>
            <p className="text-2xl font-black text-slate-900">{m.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Top Searches Table */}
        <div className="lg:col-span-2 bg-white rounded-[3rem] p-8 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <TrendingUp size={20} className="text-orange-500" />
              Popular Search Terms
            </h3>
            <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-orange-500">View Full Report</button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50">
                  <th className="pb-4 px-4">Search Term</th>
                  <th className="pb-4 px-4 text-center">Volume</th>
                  <th className="pb-4 px-4 text-center">Avg. Results</th>
                  <th className="pb-4 px-4 text-right">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {stats.top_searches.map((s, i) => (
                  <tr key={i} className="group hover:bg-slate-50 transition-colors">
                    <td className="py-5 px-4 font-bold text-slate-900">{s.query}</td>
                    <td className="py-5 px-4 text-center font-black text-slate-600">{s.total}</td>
                    <td className="py-5 px-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black ${s.avg_results > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                        {Math.round(s.avg_results)} items
                      </span>
                    </td>
                    <td className="py-5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        {[40, 60, 30, 80, 50, 90, 70].map((h, j) => (
                          <div key={j} className="w-1 bg-orange-200 rounded-full group-hover:bg-orange-500 transition-colors" style={{ height: `${h / 4}px` }}></div>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Opportunity Panel */}
        <div className="space-y-8">
          <div className="bg-slate-900 rounded-[3rem] p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-orange-500 rounded-full opacity-20 blur-3xl"></div>
            <h3 className="text-xl font-black mb-4 flex items-center gap-2">
              <Sparkles size={20} className="text-orange-500" />
              Insights
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 font-medium">
              We've noticed a <span className="text-white font-bold">24% increase</span> in searches for "Organic Cotton" this week. Consider featuring these products in your next campaign.
            </p>
            <button className="w-full py-4 bg-orange-500 rounded-2xl font-black text-sm hover:bg-orange-600 transition-all">Create Promotion</button>
          </div>

          <div className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
              <AlertCircle size={20} className="text-red-500" />
              Zero Result Queries
            </h3>
            <div className="space-y-4">
              {['Smart Glasses', 'Reusable Straws', 'Holographic stickers'].map((q, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-slate-100 transition-all">
                  <span className="font-bold text-slate-700">{q}</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{i + 12} times</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSearchDashboard;
