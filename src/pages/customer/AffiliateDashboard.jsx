import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAffiliateDashboard } from '../../store/affiliateSlice';
import { BarChart, Link as LinkIcon, Users, DollarSign, ExternalLink, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AffiliateDashboard = () => {
  const dispatch = useDispatch();
  const { dashboard, loading, error } = useSelector((state) => state.affiliate);

  useEffect(() => {
    dispatch(fetchAffiliateDashboard());
  }, [dispatch]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Referral link copied!');
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;
  if (!dashboard) return null;

  const { affiliate, stats, referral_url } = dashboard;

  const statCards = [
    { title: 'Total Clicks', value: stats.clicks, icon: <LinkIcon className="text-blue-500" />, bg: 'bg-blue-50' },
    { title: 'Conversions', value: stats.orders, icon: <Users className="text-purple-500" />, bg: 'bg-purple-50' },
    { title: 'Total Earned', value: `$${stats.total_commission}`, icon: <DollarSign className="text-green-500" />, bg: 'bg-green-50' },
    { title: 'Pending', value: `$${stats.pending_commission}`, icon: <Clock className="text-orange-500" />, bg: 'bg-orange-50' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900">Affiliate Dashboard</h1>
            <p className="text-slate-500">Welcome back, {affiliate.user?.name}</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
              affiliate.status === 'active' ? 'bg-green-100 text-green-700' : 
              affiliate.status === 'pending' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
            }`}>
              {affiliate.status} Status
            </span>
          </div>
        </div>

        {/* Quick Link Card */}
        <div className="bg-slate-900 rounded-3xl p-6 md:p-8 mb-8 text-white shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-2">Your Unique Referral Link</h2>
              <p className="text-slate-400 text-sm mb-4">Share this link with your audience to earn commissions.</p>
              <div className="flex items-center space-x-2 bg-slate-800 p-3 rounded-xl border border-slate-700">
                <code className="text-orange-400 break-all">{referral_url}</code>
                <button 
                  onClick={() => copyToClipboard(referral_url)}
                  className="ml-auto p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                >
                  <LinkIcon size={18} />
                </button>
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="bg-orange-500 p-6 rounded-2xl text-center">
                <div className="text-3xl font-black">{affiliate.commission_rate}%</div>
                <div className="text-xs font-bold uppercase opacity-80">Commission Rate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, i) => (
            <div key={i} className={`${stat.bg} p-6 rounded-3xl border border-white/50 shadow-sm`}>
              <div className="mb-4">{stat.icon}</div>
              <div className="text-2xl font-black text-slate-900">{stat.value}</div>
              <div className="text-sm font-medium text-slate-500">{stat.title}</div>
            </div>
          ))}
        </div>

        {/* Payout Info & Recent Activity */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Recent Referrals</h3>
              <div className="space-y-4">
                {/* Placeholder for real orders list */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-slate-200 rounded-xl flex items-center justify-center">
                      <CheckCircle className="text-slate-400" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">Order #ORD-1234</div>
                      <div className="text-xs text-slate-500">2 hours ago</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-slate-900">$12.50</div>
                    <div className="text-[10px] font-bold text-orange-500 uppercase">Pending</div>
                  </div>
                </div>
              </div>
              <button className="w-full mt-6 py-3 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">
                View All Activity
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Payout Settings</h3>
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-2xl">
                  <div className="text-xs font-bold text-slate-400 uppercase mb-1">PayPal Account</div>
                  <div className="font-medium text-slate-900 truncate">{affiliate.payout_details?.paypal_email || 'Not set'}</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl">
                  <div className="text-xs font-bold text-slate-400 uppercase mb-1">Payout Threshold</div>
                  <div className="font-medium text-slate-900">${affiliate.payout_threshold}</div>
                </div>
                <button className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-sm transition-all">
                  Edit Payout Details
                </button>
              </div>
            </div>

            <div className="bg-orange-50 rounded-3xl p-6 border border-orange-100">
              <AlertCircle className="text-orange-500 mb-4" size={24} />
              <h4 className="font-bold text-orange-900 mb-2">Need Marketing Help?</h4>
              <p className="text-sm text-orange-700 mb-4">Download our brand kit and banners to use in your promotions.</p>
              <button className="flex items-center space-x-2 text-sm font-black text-orange-600 hover:text-orange-700">
                <span>View Brand Assets</span>
                <ExternalLink size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AffiliateDashboard;
