import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
    Activity, Search, Filter, Calendar, Clock, 
    User, Shield, Package, ShoppingCart, RefreshCw,
    ChevronLeft, ChevronRight, AlertCircle, Info
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Pagination from '../../components/shared/Pagination';

export default function SystemLogs() {
    const [logs, setLogs] = useState([]);
    const [stats, setStats] = useState({
        today_activities: 0,
        week_activities: 0,
        today_logins: 0
    });
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        total: 0
    });
    const [filters, setFilters] = useState({
        search: '',
        user_role: '',
        action: '',
        date_from: '',
        date_to: ''
    });

    const fetchLogs = async (page = 1) => {
        setLoading(true);
        try {
            const response = await api.get('/admin/activity-logs', { 
                params: { ...filters, page } 
            });
            if (response.data.success) {
                setLogs(response.data.data.data);
                setPagination({
                    current_page: response.data.data.current_page,
                    last_page: response.data.data.last_page,
                    total: response.data.data.total
                });
            }
        } catch (error) {
            toast.error('Failed to fetch system logs');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await api.get('/admin/activity-logs/stats');
            if (response.data.success) {
                setStats(response.data.data);
            }
        } catch (error) {
            
        }
    };

    useEffect(() => {
        fetchLogs();
        fetchStats();
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
        // Automatically reset the current page to Page 1 when filters change
        setPagination(prev => ({ ...prev, current_page: 1 }));
    };

    const applyFilters = () => {
        fetchLogs(1);
    };

    const clearFilters = () => {
        const resetFilters = {
            search: '',
            user_role: '',
            action: '',
            date_from: '',
            date_to: ''
        };
        setFilters(resetFilters);
        // We need to fetch with reset filters
        setLoading(true);
        api.get('/admin/activity-logs', { params: { ...resetFilters, page: 1 } })
            .then(response => {
                if (response.data.success) {
                    setLogs(response.data.data.data);
                    setPagination({
                        current_page: response.data.data.current_page,
                        last_page: response.data.data.last_page,
                        total: response.data.data.total
                    });
                }
            })
            .finally(() => setLoading(false));
    };

    const getActionColor = (action) => {
        if (action.includes('auth.')) return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
        if (action.includes('product.')) return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
        if (action.includes('order.')) return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
        if (action.includes('user.')) return 'bg-red-500/10 text-red-500 border-red-500/20';
        return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    };

    const getRoleColor = (role) => {
        switch (role?.toLowerCase()) {
            case 'admin': return 'bg-red-500/10 text-red-500 border-red-500/20';
            case 'seller': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
            case 'customer': return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'support': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'rider': return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20';
            default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
        }
    };

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-[#0F172A] mb-2">System Logs</h1>
                <p className="text-gray-500 font-medium">Monitor all system activity and user actions in real-time.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Today's Activities", value: stats.today_activities, icon: Activity, color: "text-blue-500", bg: "bg-blue-50" },
                    { label: "This Week", value: stats.week_activities, icon: Calendar, color: "text-purple-500", bg: "bg-purple-50" },
                    { label: "Today's Logins", value: stats.today_logins, icon: Shield, color: "text-orange-500", bg: "bg-orange-50" }
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center space-x-4">
                        <div className={`w-14 h-14 ${stat.bg} rounded-2xl flex items-center justify-center`}>
                            <stat.icon className={`w-7 h-7 ${stat.color}`} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                            <p className="text-2xl font-black text-[#0F172A]">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                <div className="flex items-center space-x-2 text-slate-900 font-bold mb-2">
                    <Filter className="w-5 h-5 text-orange-500" />
                    <span>Advanced Filters</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Search Description</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input 
                                type="text"
                                name="search"
                                value={filters.search}
                                onChange={handleFilterChange}
                                placeholder="Keywords..."
                                className="w-full bg-slate-50 border-none rounded-xl pl-10 py-3 text-sm focus:ring-2 focus:ring-orange-500/20 outline-none font-medium"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase ml-2">User Role</label>
                        <select 
                            name="user_role"
                            value={filters.user_role}
                            onChange={handleFilterChange}
                            className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500/20 outline-none font-medium appearance-none"
                        >
                            <option value="">All Roles</option>
                            <option value="admin">Admin</option>
                            <option value="seller">Seller</option>
                            <option value="customer">Customer</option>
                            <option value="support">Support</option>
                            <option value="rider">Rider</option>
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Action Type</label>
                        <select 
                            name="action"
                            value={filters.action}
                            onChange={handleFilterChange}
                            className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500/20 outline-none font-medium appearance-none"
                        >
                            <option value="">All Actions</option>
                            <option value="auth.login">Logins</option>
                            <option value="product">Products</option>
                            <option value="order">Orders</option>
                            <option value="user">Users</option>
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase ml-2">From Date</label>
                        <input 
                            type="date"
                            name="date_from"
                            value={filters.date_from}
                            onChange={handleFilterChange}
                            className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500/20 outline-none font-medium"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase ml-2">To Date</label>
                        <input 
                            type="date"
                            name="date_to"
                            value={filters.date_to}
                            onChange={handleFilterChange}
                            className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500/20 outline-none font-medium"
                        />
                    </div>
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                    <button 
                        onClick={clearFilters}
                        className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-slate-50 transition-all border border-slate-100"
                    >
                        Clear Filters
                    </button>
                    <button 
                        onClick={applyFilters}
                        className="px-8 py-3 rounded-xl font-bold text-white bg-orange-500 hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20"
                    >
                        Apply Filters
                    </button>
                </div>
            </div>

            {/* Logs Table */}
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Time</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">User</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Action</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Description</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">IP Address</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="5" className="px-6 py-6">
                                            <div className="h-6 bg-slate-50 rounded-lg w-full"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : logs.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center">
                                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                                                <AlertCircle className="w-8 h-8 text-gray-300" />
                                            </div>
                                            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No activity logs found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                logs.map((log) => (
                                    <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black text-[#0F172A]">{log.time_ago}</span>
                                                <span className="text-[10px] text-gray-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity" title={log.created_at}>{log.created_at}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500">
                                                    {log.user_name?.[0] || 'S'}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black text-[#0F172A]">{log.user_name}</p>
                                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase border ${getRoleColor(log.user_role)}`}>
                                                        {log.user_role}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <span className={`text-[10px] px-3 py-1.5 rounded-xl font-black uppercase border ${getActionColor(log.action)}`}>
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center space-x-2">
                                                <p className="text-xs font-medium text-gray-600 line-clamp-1">{log.description}</p>
                                                {log.model_type && (
                                                    <span className="flex-shrink-0 text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md font-bold">
                                                        {log.model_type} #{log.model_id}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap text-center">
                                            <span className="text-[10px] font-mono text-gray-400 bg-slate-50 px-2 py-1 rounded-md">{log.ip_address || '0.0.0.0'}</span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {!loading && pagination.last_page > 1 && (
                    <Pagination 
                        currentPage={pagination.current_page}
                        lastPage={pagination.last_page}
                        total={pagination.total}
                        itemCount={logs.length}
                        onPageChange={(page) => fetchLogs(page)}
                    />
                )}
            </div>
        </div>
    );
}
