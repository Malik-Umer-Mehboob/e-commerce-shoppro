import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
    Bell, CheckCheck, Package, Truck, Gift, Star, 
    ShoppingCart, AlertTriangle, UserPlus, X, Filter,
    Search, Trash2, Settings, ShieldAlert, CreditCard,
    MessageSquare, RefreshCcw
} from 'lucide-react';
import { 
    fetchNotifications, 
    markNotificationRead, 
    markAllNotificationsRead,
    deleteNotification 
} from '../../store/notificationSlice';

const typeIcons = {
    order_placed: Package,
    order_shipped: Truck,
    order_delivered: CheckCheck,
    order_cancelled: X,
    order_refunded: AlertTriangle,
    welcome: UserPlus,
    promotion: Gift,
    review_request: Star,
    abandoned_cart: ShoppingCart,
    low_stock: ShieldAlert,
    payment_success: CreditCard,
    ticket_updated: MessageSquare,
    security_alert: ShieldAlert,
    restock_alert: RefreshCcw
};

const priorityColors = {
    low: 'text-slate-500 bg-slate-500/10',
    medium: 'text-blue-500 bg-blue-500/10',
    high: 'text-orange-500 bg-orange-500/10',
    critical: 'text-red-500 bg-red-500/10 border border-red-500/20'
};

const NotificationCenter = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items, pagination, loading } = useSelector((state) => state.notifications);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        dispatch(fetchNotifications(1));
    }, [dispatch]);

    const handleMarkAllRead = () => {
        dispatch(markAllNotificationsRead());
    };

    const handleDelete = (id) => {
        dispatch(deleteNotification(id));
    };

    const filteredItems = items.filter(item => {
        const matchesFilter = filter === 'all' || (filter === 'unread' && !item.read_at);
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             item.message.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-[#0F172A] pt-24 pb-20 px-4 md:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-white uppercase tracking-wider mb-2">Notification Center</h1>
                        <p className="text-slate-400 text-sm">Manage your system alerts and account activities.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={handleMarkAllRead}
                            className="px-4 py-2 bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all border border-slate-700"
                        >
                            Mark all as read
                        </button>
                        <button 
                            onClick={() => navigate('/notifications/preferences')}
                            className="p-2.5 bg-slate-800 text-slate-400 hover:text-white rounded-xl border border-slate-700 transition-all"
                        >
                            <Settings size={18} />
                        </button>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="md:col-span-2 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input 
                            type="text"
                            placeholder="Search notifications..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                        />
                    </div>
                    <div className="relative">
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <select 
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all appearance-none"
                        >
                            <option value="all">All Notifications</option>
                            <option value="unread">Unread Only</option>
                        </select>
                    </div>
                </div>

                {/* Notifications List */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] overflow-hidden backdrop-blur-xl">
                    {loading && filteredItems.length === 0 ? (
                        <div className="py-20 flex flex-col items-center justify-center">
                            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4" />
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Syncing Archive...</p>
                        </div>
                    ) : filteredItems.length === 0 ? (
                        <div className="py-32 flex flex-col items-center justify-center text-center">
                            <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center mb-6 border border-slate-800">
                                <Bell className="w-8 h-8 text-slate-700" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Clean Slate!</h3>
                            <p className="text-slate-500 max-w-xs mx-auto text-sm">You've cleared all your notifications. We'll alert you when something new arrives.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-800/50">
                            {filteredItems.map((item) => {
                                const Icon = typeIcons[item.type] || Bell;
                                const priorityStyle = priorityColors[item.priority] || priorityColors.medium;
                                
                                return (
                                    <div 
                                        key={item.id}
                                        className={`group p-6 flex flex-col md:flex-row md:items-center gap-6 transition-all hover:bg-white/[0.02] relative
                                            ${!item.read_at ? 'bg-orange-500/[0.03]' : ''}`}
                                    >
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 duration-500 ${priorityStyle}`}>
                                            <Icon size={24} />
                                        </div>
                                        
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${priorityStyle}`}>
                                                    {item.priority}
                                                </span>
                                                <span className="text-[11px] text-slate-500 font-medium">
                                                    {new Date(item.created_at).toLocaleString()}
                                                </span>
                                            </div>
                                            <h4 className={`text-lg mb-1 truncate ${!item.read_at ? 'text-white font-bold' : 'text-slate-400 font-medium'}`}>
                                                {item.title}
                                            </h4>
                                            <p className="text-slate-500 text-sm leading-relaxed max-w-2xl">
                                                {item.message}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {item.link && (
                                                <button 
                                                    onClick={() => navigate(item.link)}
                                                    className="px-4 py-2 bg-orange-500 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20"
                                                >
                                                    View Detail
                                                </button>
                                            )}
                                            {!item.read_at && (
                                                <button 
                                                    onClick={() => dispatch(markNotificationRead(item.id))}
                                                    className="p-2.5 bg-slate-800 text-slate-400 hover:text-emerald-500 rounded-xl border border-slate-700 transition-all"
                                                    title="Mark as read"
                                                >
                                                    <CheckCheck size={18} />
                                                </button>
                                            )}
                                            <button 
                                                onClick={() => handleDelete(item.id)}
                                                className="p-2.5 bg-slate-800 text-slate-400 hover:text-red-500 rounded-xl border border-slate-700 transition-all"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>

                                        {!item.read_at && (
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500 shadow-[2px_0_10px_#F97316]" />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
                
                {/* Pagination (Simplified) */}
                {pagination && pagination.last_page > 1 && (
                    <div className="mt-8 flex justify-center gap-2">
                        {/* Pagination component would go here */}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationCenter;
