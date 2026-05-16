import { useState, useEffect, useRef } from 'react';
import { 
    Bell, 
    Package, 
    ShoppingBag, 
    AlertTriangle, 
    CheckCircle, 
    X, 
    Info, 
    XCircle, 
    MessageSquare,
    Truck,
    Clock
} from 'lucide-react';
import api from '../../services/api';

export default function NotificationBell({ isDark = false }) {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);

    // Fetch unread count every 30 seconds (polling)
    useEffect(() => {
        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 30000);
        return () => clearInterval(interval);
    }, []);

    // Close on outside click
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const fetchUnreadCount = async () => {
        try {
            const res = await api.get('/notifications/unread-count');
            setUnreadCount(res.data?.data?.unread_count ?? 0);
        } catch {}
    };

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const res = await api.get('/notifications');
            setNotifications(res.data?.data?.notifications ?? []);
            setUnreadCount(res.data?.data?.unread_count ?? 0);
        } catch {}
        finally { setLoading(false); }
    };

    const handleOpen = () => {
        if (!isOpen) fetchNotifications();
        setIsOpen(!isOpen);
    };

    const handleMarkRead = async (id) => {
        try {
            await api.post(`/notifications/${id}/read`);
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, is_read: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch {}
    };

    const handleMarkAllRead = async () => {
        try {
            await api.post('/notifications/mark-all-read');
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
            setUnreadCount(0);
        } catch {}
    };

    const getNotificationStyles = (type) => {
        const t = type?.toLowerCase() || '';
        
        // Success Roles (Green)
        if (t.includes('placed') || t.includes('delivered') || t.includes('success')) {
            return {
                icon: <CheckCircle className="w-4 h-4" />,
                bg: 'bg-emerald-50 dark:bg-emerald-500/10',
                text: 'text-emerald-600 dark:text-emerald-400',
                border: 'border-emerald-100 dark:border-emerald-500/20',
                dot: 'bg-emerald-500'
            };
        }
        
        // Info Roles (Blue)
        if (t.includes('shipped') || t.includes('processing') || t.includes('update')) {
            return {
                icon: <Truck className="w-4 h-4" />,
                bg: 'bg-blue-50 dark:bg-blue-500/10',
                text: 'text-blue-600 dark:text-blue-400',
                border: 'border-blue-100 dark:border-blue-500/20',
                dot: 'bg-blue-500'
            };
        }
        
        // Warning Roles (Orange)
        if (t.includes('stock') || t.includes('low') || t.includes('delay')) {
            return {
                icon: <AlertTriangle className="w-4 h-4" />,
                bg: 'bg-amber-50 dark:bg-amber-500/10',
                text: 'text-amber-600 dark:text-amber-400',
                border: 'border-amber-100 dark:border-amber-500/20',
                dot: 'bg-amber-500'
            };
        }
        
        // Error Roles (Red)
        if (t.includes('cancel') || t.includes('fail') || t.includes('error')) {
            return {
                icon: <XCircle className="w-4 h-4" />,
                bg: 'bg-rose-50 dark:bg-rose-500/10',
                text: 'text-rose-600 dark:text-rose-400',
                border: 'border-rose-100 dark:border-rose-500/20',
                dot: 'bg-rose-500'
            };
        }

        // Support Roles (Purple)
        if (t.includes('ticket') || t.includes('reply') || t.includes('message')) {
            return {
                icon: <MessageSquare className="w-4 h-4" />,
                bg: 'bg-purple-50 dark:bg-purple-500/10',
                text: 'text-purple-600 dark:text-purple-400',
                border: 'border-purple-100 dark:border-purple-500/20',
                dot: 'bg-purple-500'
            };
        }

        // Default
        return {
            icon: <Bell className="w-4 h-4" />,
            bg: 'bg-slate-50 dark:bg-slate-500/10',
            text: 'text-slate-600 dark:text-slate-400',
            border: 'border-slate-100 dark:border-slate-500/20',
            dot: 'bg-slate-500'
        };
    };

    return (
        <div ref={dropdownRef} className="relative inline-block">
            {/* Bell Button */}
            <button
                onClick={handleOpen}
                className={`relative p-2.5 rounded-full transition-all duration-300 group
                    ${unreadCount > 0 ? 'animate-bounce-short' : ''}
                    ${isDark 
                        ? 'bg-slate-800/50 hover:bg-slate-700 border border-slate-700 text-slate-100' 
                        : 'bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-900'}`}
                aria-label="Toggle notifications"
            >
                <Bell className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'scale-110' : 'group-hover:scale-110'}`} />
                
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75"></span>
                        <span className="relative inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-slate-900">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute right-0 top-full z-[100] mt-3 w-[calc(100vw-32px)] sm:w-[380px] origin-top-right overflow-hidden rounded-[1.5rem] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] ring-1 ring-slate-100 transition-all dark:bg-slate-900 dark:ring-slate-800 animate-in fade-in zoom-in-95 duration-200">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-slate-50 bg-slate-50/50 px-6 py-4 dark:border-slate-800 dark:bg-slate-800/50">
                        <div className="flex items-center gap-2.5">
                            <h3 className="text-[15px] font-black tracking-tight text-slate-900 dark:text-white uppercase">
                                Notifications
                            </h3>
                            {unreadCount > 0 && (
                                <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-[10px] font-black text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 uppercase tracking-wider">
                                    {unreadCount} New
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            {unreadCount > 0 && (
                                <button
                                    onClick={handleMarkAllRead}
                                    className="text-xs font-bold text-orange-500 transition-colors hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300"
                                >
                                    Clear all
                                </button>
                            )}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* List */}
                    <div className="custom-scrollbar max-h-[420px] overflow-y-auto">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center gap-3 py-16">
                                <div className="h-6 w-6 animate-spin rounded-full border-2 border-orange-500 border-t-transparent"></div>
                                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Updating inbox...</p>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center px-8">
                                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-50 dark:bg-slate-800/50">
                                    <Bell className="h-8 w-8 text-slate-200 dark:text-slate-700" />
                                </div>
                                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">All caught up!</h4>
                                <p className="mt-1 text-xs font-medium text-slate-400">You don't have any notifications at the moment.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                {notifications.map((n) => {
                                    const styles = getNotificationStyles(n.type);
                                    return (
                                        <div
                                            key={n.id}
                                            onClick={() => !n.is_read && handleMarkRead(n.id)}
                                            className={`group relative flex cursor-pointer gap-4 px-6 py-4 transition-all duration-200 
                                                ${n.is_read 
                                                    ? 'bg-white hover:bg-slate-50/50 dark:bg-slate-900 dark:hover:bg-slate-800/50' 
                                                    : 'bg-orange-50/30 hover:bg-orange-50/50 dark:bg-orange-500/5 dark:hover:bg-orange-500/10'}`}
                                        >
                                            {/* Icon */}
                                            <div className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border transition-transform duration-300 group-hover:scale-110 
                                                ${styles.bg} ${styles.text} ${styles.border}`}
                                            >
                                                {styles.icon}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <h4 className={`text-[13px] leading-snug transition-colors 
                                                        ${n.is_read 
                                                            ? 'font-bold text-slate-600 dark:text-slate-400' 
                                                            : 'font-black text-slate-900 dark:text-white'}`}
                                                    >
                                                        {n.title}
                                                    </h4>
                                                    {!n.is_read && (
                                                        <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.1)] ${styles.dot}`}></span>
                                                    )}
                                                </div>
                                                <p className="mt-1 text-xs leading-relaxed text-slate-500 line-clamp-2 dark:text-slate-400/80">
                                                    {n.message}
                                                </p>
                                                <div className="mt-2.5 flex items-center gap-3">
                                                    <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400">
                                                        <Clock className="w-3 h-3" />
                                                        {n.time_ago}
                                                    </div>
                                                    {!n.is_read && (
                                                        <span className="text-[10px] font-black uppercase tracking-wider text-orange-500">
                                                            New Alert
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="border-t border-slate-50 bg-slate-50/30 px-6 py-3 dark:border-slate-800 dark:bg-slate-800/30">
                        <button 
                            className="w-full text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-200"
                            onClick={() => setIsOpen(false)}
                        >
                            View Activity History
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
