import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, CheckCheck, Package, Truck, Gift, Star, ShoppingCart, AlertTriangle, UserPlus, X } from 'lucide-react';
import { fetchNotifications, fetchUnreadCount, markNotificationRead, markAllNotificationsRead } from '../../store/notificationSlice';

const typeIcons = {
    order_placed: Package,
    order_shipped: Truck,
    order_delivered: Check,
    order_cancelled: X,
    order_refunded: AlertTriangle,
    welcome: UserPlus,
    promotion: Gift,
    review_request: Star,
    abandoned_cart: ShoppingCart,
    low_stock: AlertTriangle,
    new_order_seller: Package,
    price_drop: Gift,
    back_in_stock: Package,
};

const typeColors = {
    order_placed: 'text-blue-400 bg-blue-400/10',
    order_shipped: 'text-purple-400 bg-purple-400/10',
    order_delivered: 'text-emerald-400 bg-emerald-400/10',
    order_cancelled: 'text-red-400 bg-red-400/10',
    order_refunded: 'text-yellow-400 bg-yellow-400/10',
    welcome: 'text-[#F97316] bg-[#F97316]/10',
    promotion: 'text-pink-400 bg-pink-400/10',
    review_request: 'text-amber-400 bg-amber-400/10',
    abandoned_cart: 'text-cyan-400 bg-cyan-400/10',
    low_stock: 'text-orange-400 bg-orange-400/10',
    new_order_seller: 'text-indigo-400 bg-indigo-400/10',
};

const NotificationBell = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items, unreadCount, loading } = useSelector((state) => state.notifications);
    const { isAuthenticated } = useSelector((state) => state.auth);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    // Fetch unread count periodically
    useEffect(() => {
        if (!isAuthenticated) return;
        dispatch(fetchUnreadCount());
        const interval = setInterval(() => dispatch(fetchUnreadCount()), 30000);
        return () => clearInterval(interval);
    }, [dispatch, isAuthenticated]);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleToggle = () => {
        if (!showDropdown) {
            dispatch(fetchNotifications(1));
        }
        setShowDropdown(!showDropdown);
    };

    const handleNotificationClick = (notification) => {
        if (!notification.read_at) {
            dispatch(markNotificationRead(notification.id));
        }
        setShowDropdown(false);
        if (notification.link) {
            navigate(notification.link);
        }
    };

    const handleMarkAllRead = () => {
        dispatch(markAllNotificationsRead());
    };

    const getTimeAgo = (dateStr) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return 'Just now';
        if (mins < 60) return `${mins}m ago`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        if (days < 7) return `${days}d ago`;
        return new Date(dateStr).toLocaleDateString();
    };

    if (!isAuthenticated) return null;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={handleToggle}
                className="relative p-2 text-gray-300 hover:text-white transition-colors"
                title="Notifications"
                id="notification-bell"
            >
                <Bell size={22} />
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg animate-pulse">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {showDropdown && (
                <div className="absolute right-0 top-full mt-2 w-96 max-h-[480px] bg-[#1E293B] border border-gray-700 rounded-2xl shadow-2xl overflow-hidden z-50" id="notification-dropdown">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700 bg-gray-800/50">
                        <h3 className="text-white font-semibold text-sm">Notifications</h3>
                        <div className="flex items-center gap-3">
                            {unreadCount > 0 && (
                                <button
                                    onClick={handleMarkAllRead}
                                    className="text-xs text-[#F97316] hover:text-[#ea580c] font-medium flex items-center gap-1 transition-colors"
                                >
                                    <CheckCheck className="w-3.5 h-3.5" />
                                    Mark all read
                                </button>
                            )}
                            <button
                                onClick={() => { setShowDropdown(false); navigate('/notifications/preferences'); }}
                                className="text-xs text-gray-400 hover:text-white transition-colors"
                            >
                                Settings
                            </button>
                        </div>
                    </div>

                    {/* List */}
                    <div className="overflow-y-auto max-h-[400px]">
                        {loading ? (
                            <div className="text-center py-10 text-gray-500 text-sm">Loading...</div>
                        ) : items.length === 0 ? (
                            <div className="text-center py-12">
                                <Bell className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                                <p className="text-gray-500 text-sm">No notifications yet</p>
                            </div>
                        ) : (
                            items.map((notification) => {
                                const Icon = typeIcons[notification.type] || Bell;
                                const colorClass = typeColors[notification.type] || 'text-gray-400 bg-gray-400/10';
                                return (
                                    <button
                                        key={notification.id}
                                        onClick={() => handleNotificationClick(notification)}
                                        className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-white/5 border-b border-gray-700/50 last:border-b-0
                      ${!notification.read_at ? 'bg-[#F97316]/5' : ''}`}
                                    >
                                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                                            <Icon className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm leading-tight ${!notification.read_at ? 'text-white font-medium' : 'text-gray-300'}`}>
                                                {notification.title}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-0.5 truncate">{notification.message}</p>
                                            <p className="text-[11px] text-gray-600 mt-1">{getTimeAgo(notification.created_at)}</p>
                                        </div>
                                        {!notification.read_at && (
                                            <div className="w-2 h-2 rounded-full bg-[#F97316] flex-shrink-0 mt-2" />
                                        )}
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
