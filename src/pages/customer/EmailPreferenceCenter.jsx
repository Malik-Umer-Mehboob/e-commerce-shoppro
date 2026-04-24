import { useState, useEffect } from 'react';
import { 
  Mail, 
  Bell, 
  Settings, 
  Shield, 
  CheckCircle2, 
  XCircle,
  Save,
  Clock,
  Zap,
  Info
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export default function EmailPreferenceCenter() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState({
    subscribed_to_newsletter: false,
    email_preferences: {}
  });

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const response = await axios.get(`${API_URL}/email-preferences`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setData(response.data.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load preferences');
    }
  };

  const handleTogglePreference = (key) => {
    setData({
      ...data,
      email_preferences: {
        ...data.email_preferences,
        [key]: !data.email_preferences[key]
      }
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put(`${API_URL}/email-preferences`, data, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Preferences updated successfully');
    } catch (error) {
      toast.error('Failed to update preferences');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="w-12 h-12 border-4 border-[#F97316] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-black text-[#0F172A]">Email Preferences</h1>
        <p className="text-gray-500 font-medium">Control what you hear from us and how often</p>
      </div>

      {/* Main Newsletter Subscription */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group">
        <div className="absolute right-0 top-0 w-32 h-32 bg-[#F97316]/5 rounded-full -mr-16 -mt-16 blur-3xl transition-all group-hover:bg-[#F97316]/10"></div>
        
        <div className="flex items-center justify-between relative">
          <div className="flex items-center space-x-6">
            <div className="w-16 h-16 bg-[#F97316]/10 rounded-2xl flex items-center justify-center text-[#F97316]">
              <Mail className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-black text-[#0F172A]">Newsletter Subscription</h3>
              <p className="text-gray-500 text-sm font-medium">Weekly updates on new arrivals, sales, and exclusive offers.</p>
            </div>
          </div>
          <button 
            onClick={() => setData({...data, subscribed_to_newsletter: !data.subscribed_to_newsletter})}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:ring-offset-2 ${data.subscribed_to_newsletter ? 'bg-[#F97316]' : 'bg-gray-200'}`}
          >
            <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${data.subscribed_to_newsletter ? 'translate-x-7' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>

      {/* Detailed Preferences */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 bg-gray-50/50">
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-gray-400" />
            <h3 className="text-sm font-black text-[#0F172A] uppercase tracking-widest">Notification Categories</h3>
          </div>
        </div>

        <div className="divide-y divide-gray-50">
          {[
            { key: 'order_updates', label: 'Order Status Updates', desc: 'Real-time updates about your purchases and shipments.', icon: Zap },
            { key: 'promotions', label: 'Promotions & Sales', desc: 'Get early access to our seasonal sales and discount codes.', icon: Info },
            { key: 'review_requests', label: 'Review Requests', desc: 'Help others by sharing your feedback on products you\'ve bought.', icon: Bell },
            { key: 'cart_reminders', label: 'Cart Reminders', desc: 'Don\'t miss out on items you\'ve left in your shopping cart.', icon: Clock },
            { key: 'account_updates', label: 'Security & Account', desc: 'Important updates regarding your account security.', icon: Shield, locked: true },
          ].map((pref) => (
            <div key={pref.key} className="p-8 flex items-center justify-between hover:bg-gray-50/30 transition-colors">
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${data.email_preferences[pref.key] || pref.locked ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                  <pref.icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-[#0F172A]">{pref.label}</h4>
                  <p className="text-xs text-gray-400 font-medium">{pref.desc}</p>
                </div>
              </div>
              
              {pref.locked ? (
                <div className="flex items-center text-[10px] font-black text-blue-600 uppercase tracking-widest">
                  <CheckCircle2 className="w-4 h-4 mr-1.5" />
                  Mandatory
                </div>
              ) : (
                <button 
                  onClick={() => handleTogglePreference(pref.key)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${data.email_preferences[pref.key] ? 'bg-blue-600' : 'bg-gray-200'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${data.email_preferences[pref.key] ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
        <div className="flex items-center text-sm text-gray-500 font-medium italic">
          <Info className="w-4 h-4 mr-2 text-[#F97316]" />
          Last updated: {new Date().toLocaleDateString()}
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-[#0F172A] text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-[#0F172A]/20 hover:bg-black transition-all transform hover:-translate-y-1 flex items-center space-x-2"
        >
          {saving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Save className="w-5 h-5" />}
          <span>Save Changes</span>
        </button>
      </div>

      <div className="text-center pt-8">
        <button className="text-xs font-black text-red-500 uppercase tracking-widest hover:underline flex items-center mx-auto">
          <XCircle className="w-4 h-4 mr-2" />
          Unsubscribe from all marketing emails
        </button>
      </div>
    </div>
  );
}
