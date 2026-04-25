import { useState, useEffect } from 'react';
import { 
  Search, 
  TrendingUp, 
  AlertCircle, 
  BarChart3, 
  History, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  Download,
  MoreVertical,
  HelpCircle
} from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

export default function SearchAnalytics() {
  const [stats, setStats] = useState({
    today_searches: 0,
    month_searches: 0,
    unique_queries: 0,
    no_results_count: 0,
  });
  const [topKeywords, setTopKeywords] = useState([]);
  const [noResults, setNoResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/search-analytics');
      const resData = response.data?.data;
      setStats(resData?.stats ?? {
        today_searches: 0,
        month_searches: 0,
        unique_queries: 0,
        no_results_count: 0,
      });
      setTopKeywords(resData?.top_keywords ?? []);
      setNoResults(resData?.no_results ?? []);
    } catch (error) {
      toast.error('Failed to load search analytics');
    } finally {
      setLoading(false);
    }
  };

  const getMaxCount = () => {
    if (topKeywords.length === 0) return 1;
    return Math.max(...topKeywords.map(k => k.search_count));
  };

  const maxSearchCount = getMaxCount();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#0F172A]">Search Analytics</h1>
          <p className="text-gray-500 font-medium">Monitor what your customers are searching for</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-500 hover:bg-gray-50 transition-all shadow-sm">
            <Filter className="w-5 h-5" />
          </button>
          <button className="bg-[#0F172A] text-white px-6 py-3 rounded-2xl font-black flex items-center space-x-2 shadow-xl shadow-[#0F172A]/20 hover:bg-black transition-all transform hover:-translate-y-1">
            <Download className="w-5 h-5" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Today's Searches", value: stats.today_searches, icon: History, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+12%', up: true },
          { label: 'This Month', value: stats.month_searches, icon: BarChart3, color: 'text-purple-600', bg: 'bg-purple-50', trend: '+5%', up: true },
          { label: 'Unique Queries', value: stats.unique_queries, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50', trend: '+8%', up: true },
          { label: 'No Results', value: stats.no_results_count, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50', trend: '-2%', up: false },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden group">
            <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
            {loading ? (
              <div className="h-8 w-24 bg-gray-100 animate-pulse rounded-lg"></div>
            ) : (
              <div className="flex items-baseline space-x-2">
                <p className="text-3xl font-black text-[#0F172A]">{stat.value.toLocaleString()}</p>
                <span className={`text-[10px] font-black flex items-center ${stat.up ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.up ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                  {stat.trend}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Keywords Table */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-8 border-b border-gray-50 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-[#0F172A]">Top Keywords</h2>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Last 30 Days</p>
            </div>
            <button className="p-2 text-gray-300 hover:text-gray-500 transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest w-20">Rank</th>
                  <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Keyword</th>
                  <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Searches</th>
                  <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Avg Results</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  [1, 2, 3, 4, 5].map(i => (
                    <tr key={i}>
                      <td colSpan="4" className="px-8 py-4 h-12 animate-pulse bg-white"></td>
                    </tr>
                  ))
                ) : topKeywords.length === 0 ? (
                    <tr>
                        <td colSpan="4" className="px-8 py-20 text-center text-gray-400 italic">No search data available</td>
                    </tr>
                ) : topKeywords.map((k, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <span className="w-6 h-6 bg-[#0F172A] text-white text-[10px] font-black flex items-center justify-center rounded-lg">
                        {idx + 1}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div>
                        <p className="font-bold text-[#0F172A]">{k.query}</p>
                        <div className="mt-1.5 w-full bg-gray-100 h-1 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#F97316] rounded-full transition-all duration-1000"
                            style={{ width: `${(k.search_count / maxSearchCount) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className="text-sm font-black text-[#0F172A]">{k.search_count}</span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <span className={`text-xs font-black ${k.avg_results > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {Math.round(k.avg_results)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Zero Results Table */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-8 border-b border-gray-50 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-red-600 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Zero Results
              </h2>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Queries needing attention</p>
            </div>
            <HelpCircle className="w-5 h-5 text-gray-300 cursor-help" />
          </div>
          
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-red-50/30">
                  <th className="px-8 py-4 text-[10px] font-black text-red-400 uppercase tracking-widest">Keyword</th>
                  <th className="px-8 py-4 text-[10px] font-black text-red-400 uppercase tracking-widest text-right">Times Searched</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                   [1, 2, 3, 4, 5].map(i => (
                    <tr key={i}>
                      <td colSpan="2" className="px-8 py-4 h-12 animate-pulse bg-white"></td>
                    </tr>
                  ))
                ) : noResults.length === 0 ? (
                  <tr>
                    <td colSpan="2" className="px-8 py-20 text-center">
                        <div className="w-12 h-12 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ArrowUpRight className="w-6 h-6" />
                        </div>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Great! All searches return results</p>
                    </td>
                  </tr>
                ) : noResults.map((k, idx) => (
                  <tr key={idx} className="hover:bg-red-50/10 transition-colors group">
                    <td className="px-8 py-5">
                      <p className="font-bold text-[#0F172A]">{k.query}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Consider adding products</p>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <span className="px-3 py-1 bg-red-100 text-red-600 rounded-lg text-xs font-black">
                        {k.search_count}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
