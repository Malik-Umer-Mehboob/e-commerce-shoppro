import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPreferences, updatePreferences } from '../../store/notificationSlice';
import Header from '../../components/layout/Header';
import { Bell, Mail, Smartphone, Save, Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

const preferenceLabels = {
    order_updates: { label: 'Order Updates', desc: 'Confirmation, cancellation, and refund notifications' },
    shipping_updates: { label: 'Shipping Updates', desc: 'Shipped and delivered notifications' },
    promotions: { label: 'Promotions & Offers', desc: 'Sales, discounts, and coupon codes' },
    price_drops: { label: 'Price Drop Alerts', desc: 'Notifications when wishlisted items go on sale' },
    review_requests: { label: 'Review Requests', desc: 'Reminders to review purchased products' },
    account_updates: { label: 'Account Updates', desc: 'Password changes and profile updates' },
    low_stock_alerts: { label: 'Low Stock Alerts', desc: 'Alerts when your products are running low (sellers)' },
    cart_reminders: { label: 'Cart Reminders', desc: 'Reminders about items left in your cart' },
};

const NotificationPreferences = () => {
    const dispatch = useDispatch();
    const { preferences, preferencesLoading } = useSelector((state) => state.notifications);
    const [localPrefs, setLocalPrefs] = useState({});
    const [mobileNumber, setMobileNumber] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        dispatch(fetchPreferences());
    }, [dispatch]);

    useEffect(() => {
        setLocalPrefs(preferences.email_preferences || {});
        setMobileNumber(preferences.mobile_number || '');
    }, [preferences]);

    const handleToggle = (key) => {
        setLocalPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await dispatch(updatePreferences({
                email_preferences: localPrefs,
                mobile_number: mobileNumber || null,
            })).unwrap();
            toast.success('Preferences saved successfully!');
        } catch {
            toast.error('Failed to save preferences');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0B1120]">
            <Header />
            <div className="max-w-2xl mx-auto px-4 py-8">
                {/* Page header */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-[#F97316]/10 rounded-2xl flex items-center justify-center">
                        <Bell className="w-6 h-6 text-[#F97316]" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Notification Preferences</h1>
                        <p className="text-gray-400 text-sm">Choose what notifications you'd like to receive</p>
                    </div>
                </div>

                {preferencesLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-[#F97316]" />
                    </div>
                ) : (
                    <>
                        {/* Email Preferences */}
                        <div className="bg-[#1E293B] rounded-2xl border border-gray-700/50 p-6 mb-6">
                            <div className="flex items-center gap-2 mb-6">
                                <Mail className="w-5 h-5 text-[#F97316]" />
                                <h2 className="text-lg font-semibold text-white">Email Notifications</h2>
                            </div>

                            <div className="space-y-1">
                                {Object.entries(preferenceLabels).map(([key, { label, desc }]) => (
                                    <div
                                        key={key}
                                        className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-white/5 transition-colors"
                                    >
                                        <div>
                                            <p className="text-sm font-medium text-white">{label}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                                        </div>
                                        <button
                                            onClick={() => handleToggle(key)}
                                            className={`relative w-12 h-6 rounded-full transition-all duration-300 ${localPrefs[key] !== false
                                                    ? 'bg-[#F97316]'
                                                    : 'bg-gray-600'
                                                }`}
                                        >
                                            <span
                                                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300 ${localPrefs[key] !== false ? 'translate-x-6' : 'translate-x-0.5'
                                                    }`}
                                            />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Mobile Number */}
                        <div className="bg-[#1E293B] rounded-2xl border border-gray-700/50 p-6 mb-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Smartphone className="w-5 h-5 text-[#F97316]" />
                                <h2 className="text-lg font-semibold text-white">SMS Notifications</h2>
                            </div>
                            <p className="text-xs text-gray-500 mb-3">Add your phone number to receive SMS alerts for urgent notifications (optional).</p>
                            <input
                                type="tel"
                                value={mobileNumber}
                                onChange={(e) => setMobileNumber(e.target.value)}
                                placeholder="+92 300 1234567"
                                className="w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#F97316] transition-colors"
                                id="mobile-number-input"
                            />
                        </div>

                        {/* Save */}
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="w-full bg-[#F97316] hover:bg-[#ea580c] text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-[#F97316]/20 disabled:opacity-50 flex items-center justify-center gap-2"
                            id="save-preferences-btn"
                        >
                            {saving ? (
                                <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</>
                            ) : (
                                <><Save className="w-5 h-5" /> Save Preferences</>
                            )}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default NotificationPreferences;
