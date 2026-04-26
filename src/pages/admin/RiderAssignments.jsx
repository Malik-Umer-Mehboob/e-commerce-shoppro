import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
    Truck, User, Mail, Calendar, Clock, 
    CheckCircle, AlertCircle, Package, 
    Filter, RefreshCw, ChevronLeft, ChevronRight,
    Search, MessageSquare
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function RiderAssignments() {
    const [assignments, setAssignments] = useState([]);
    const [stats, setStats] = useState({
        assigned: 0,
        picked_up: 0,
        delivered: 0,
        failed: 0,
    });
    const [riders, setRiders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        status: '',
        rider_id: '',
    });
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        total: 0
    });

    const fetchData = async (page = 1) => {
        try {
            setLoading(true);
            const [assignmentsRes, ridersRes] = await Promise.all([
                api.get('/admin/rider-assignments', { params: { ...filters, page } }),
                api.get('/admin/riders'),
            ]);
            
            if (assignmentsRes.data?.success) {
                setAssignments(assignmentsRes.data.data.assignments.data || []);
                setStats(assignmentsRes.data.data.stats || {
                    assigned: 0,
                    picked_up: 0,
                    delivered: 0,
                    failed: 0,
                });
                setPagination({
                    current_page: assignmentsRes.data.data.assignments.current_page,
                    last_page: assignmentsRes.data.data.assignments.last_page,
                    total: assignmentsRes.data.data.assignments.total
                });
            }
            
            if (ridersRes.data?.success) {
                setRiders(ridersRes.data.data || []);
            }
        } catch (error) {
            toast.error('Failed to load rider assignments');
            setAssignments([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const applyFilters = () => {
        fetchData(1);
    };

    const clearFilters = () => {
        setFilters({ status: '', rider_id: '' });
        // We need to fetch with cleared filters
        setLoading(true);
        api.get('/admin/rider-assignments', { params: { page: 1 } })
            .then(res => {
                if (res.data?.success) {
                    setAssignments(res.data.data.assignments.data || []);
                    setStats(res.data.data.stats);
                    setPagination({
                        current_page: res.data.data.assignments.current_page,
                        last_page: res.data.data.assignments.last_page,
                        total: res.data.data.assignments.total
                    });
                }
            })
            .finally(() => setLoading(false));
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'assigned':
                return <span className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase bg-yellow-50 text-yellow-600 border border-yellow-100">Assigned</span>;
            case 'picked_up':
                return <span className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase bg-blue-50 text-blue-600 border border-blue-100">Picked Up</span>;
            case 'delivered':
                return <span className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase bg-green-50 text-green-600 border border-green-100">Delivered</span>;
            case 'failed':
                return <span className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase bg-red-50 text-red-600 border border-red-100">Failed</span>;
            default:
                return <span className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase bg-slate-50 text-slate-600 border border-slate-100">{status}</span>;
        }
    };

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-[#0F172A] mb-2">Rider Assignments</h1>
                <p className="text-gray-500 font-medium">Track all delivery assignments and rider activity</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Assigned', value: stats.assigned, icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50' },
                    { label: 'Picked Up', value: stats.picked_up, icon: Package, color: 'text-blue-500', bg: 'bg-blue-50' },
                    { label: 'Delivered', value: stats.delivered, icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50' },
                    { label: 'Failed', value: stats.failed, icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center space-x-4">
                        <div className={`w-14 h-14 ${stat.bg} rounded-2xl flex items-center justify-center`}>
                            <stat.icon className={`w-7 h-7 ${stat.color}`} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                            <p className="text-2xl font-black text-[#0F172A]">{loading ? '...' : stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-wrap items-center gap-4">
                <div className="flex items-center space-x-2 text-slate-900 font-bold mr-4">
                    <Filter className="w-5 h-5 text-orange-500" />
                    <span>Filters</span>
                </div>

                <select 
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-orange-500/20 outline-none appearance-none min-w-[150px]"
                >
                    <option value="">All Status</option>
                    <option value="assigned">Assigned</option>
                    <option value="picked_up">Picked Up</option>
                    <option value="delivered">Delivered</option>
                    <option value="failed">Failed</option>
                </select>

                <select 
                    name="rider_id"
                    value={filters.rider_id}
                    onChange={handleFilterChange}
                    className="bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-orange-500/20 outline-none appearance-none min-w-[200px]"
                >
                    <option value="">All Riders</option>
                    {riders.map(rider => (
                        <option key={rider.id} value={rider.id}>{rider.name}</option>
                    ))}
                </select>

                <div className="flex items-center space-x-2 ml-auto">
                    <button 
                        onClick={clearFilters}
                        className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-slate-50 transition-all border border-slate-100"
                    >
                        Clear
                    </button>
                    <button 
                        onClick={applyFilters}
                        className="px-8 py-3 rounded-xl font-bold text-white bg-[#F97316] hover:bg-[#ea580c] transition-all shadow-lg shadow-orange-500/20"
                    >
                        Apply Filters
                    </button>
                </div>
            </div>

            {/* Assignments Table */}
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Order#</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Rider</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Assigned At</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Picked Up</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Delivered</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Notes</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="8" className="px-6 py-8">
                                            <div className="h-12 bg-slate-50 rounded-2xl w-full"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : assignments.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="px-6 py-24 text-center">
                                        <div className="flex flex-col items-center">
                                            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-4">
                                                <Truck className="w-10 h-10 text-gray-300" />
                                            </div>
                                            <h3 className="text-xl font-bold text-[#0F172A] mb-2">No rider assignments found</h3>
                                            <p className="text-gray-500 font-medium">Assign riders to orders from the Orders page.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                assignments.map((assignment) => (
                                    <tr key={assignment.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-6">
                                            <span className="bg-[#0F172A] text-white px-3 py-1.5 rounded-lg text-[10px] font-black">
                                                {assignment.order_number}
                                            </span>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 font-black text-sm">
                                                    {assignment.customer_name?.[0]}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-[#0F172A]">{assignment.customer_name}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold">{assignment.customer_email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                                                    <User size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-[#0F172A]">{assignment.rider_name}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold">{assignment.rider_email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 text-center">
                                            {getStatusBadge(assignment.status)}
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-[#0F172A]">{assignment.assigned_at || '—'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-[#0F172A]">{assignment.picked_up_at || '—'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-[#0F172A]">{assignment.delivered_at || '—'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex items-center space-x-2 text-gray-400 max-w-[150px]">
                                                <MessageSquare size={14} className="flex-shrink-0" />
                                                <span className="text-[10px] font-medium truncate" title={assignment.delivery_notes}>
                                                    {assignment.delivery_notes ? (assignment.delivery_notes.length > 50 ? assignment.delivery_notes.substring(0, 50) + '...' : assignment.delivery_notes) : '—'}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {!loading && pagination.last_page > 1 && (
                    <div className="px-6 py-6 border-t border-slate-100 flex items-center justify-between">
                        <p className="text-xs font-bold text-gray-400">
                            Showing <span className="text-[#0F172A]">{assignments.length}</span> of <span className="text-[#0F172A]">{pagination.total}</span> assignments
                        </p>
                        <div className="flex items-center space-x-2">
                            <button 
                                onClick={() => fetchData(pagination.current_page - 1)}
                                disabled={pagination.current_page === 1}
                                className="p-2 rounded-xl border border-slate-100 text-gray-400 hover:text-orange-500 disabled:opacity-50 transition-all"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            {Array.from({ length: pagination.last_page }).map((_, i) => (
                                <button 
                                    key={i + 1}
                                    onClick={() => fetchData(i + 1)}
                                    className={`w-9 h-9 rounded-xl text-xs font-black transition-all ${
                                        pagination.current_page === i + 1 
                                            ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' 
                                            : 'text-gray-400 hover:text-[#0F172A] border border-slate-100'
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button 
                                onClick={() => fetchData(pagination.current_page + 1)}
                                disabled={pagination.current_page === pagination.last_page}
                                className="p-2 rounded-xl border border-slate-100 text-gray-400 hover:text-orange-500 disabled:opacity-50 transition-all"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
