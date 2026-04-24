import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReferrals } from '../../store/referralSlice';
import { Share2, Gift, UserPlus, Trophy, Copy, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ReferralProgram = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.referral);

  useEffect(() => {
    dispatch(fetchReferrals());
  }, [dispatch]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Referral code copied!');
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;
  if (!data) return null;

  const { referrals, rewards, stats, referral_code } = data;
  const referralLink = `${window.location.origin}/register?ref=${referral_code}`;

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Hero Section */}
        <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden mb-12 border border-slate-100">
          <div className="grid md:grid-cols-2">
            <div className="p-8 md:p-16 flex flex-col justify-center">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-bold uppercase mb-6 w-fit">
                <Trophy size={14} />
                <span>Give $10, Get $20</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
                Invite friends and <span className="text-orange-500">earn rewards</span>
              </h1>
              <p className="text-slate-500 text-lg mb-8">
                Share your love for ShopPro. When a friend joins and makes their first purchase, you both get rewarded.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
                  <div className="flex-1 px-4 font-mono text-sm text-slate-600 truncate">{referralLink}</div>
                  <button 
                    onClick={() => copyToClipboard(referralLink)}
                    className="p-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all flex items-center space-x-2"
                  >
                    <Copy size={18} />
                    <span className="hidden sm:inline font-bold text-sm">Copy Link</span>
                  </button>
                </div>
                <div className="flex items-center justify-center space-x-4">
                  <button className="p-3 bg-[#1877F2] text-white rounded-xl hover:opacity-90 transition-all">
                    <Share2 size={20} />
                  </button>
                  <button className="p-3 bg-[#1DA1F2] text-white rounded-xl hover:opacity-90 transition-all">
                    <Share2 size={20} />
                  </button>
                </div>
              </div>
            </div>
            <div className="bg-orange-500 p-12 flex items-center justify-center relative overflow-hidden">
              <div className="relative z-10 grid grid-cols-2 gap-4">
                <div className="bg-white/20 backdrop-blur-md p-6 rounded-3xl text-white">
                  <UserPlus size={32} className="mb-4" />
                  <div className="text-2xl font-black">{stats.total_referrals}</div>
                  <div className="text-xs font-bold uppercase opacity-80">Referrals</div>
                </div>
                <div className="bg-white/20 backdrop-blur-md p-6 rounded-3xl text-white">
                  <Gift size={32} className="mb-4" />
                  <div className="text-2xl font-black">${stats.total_earned}</div>
                  <div className="text-xs font-bold uppercase opacity-80">Earned</div>
                </div>
              </div>
              {/* Decorative Circles */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-400 rounded-full -ml-32 -mb-32 blur-3xl"></div>
            </div>
          </div>
        </div>

        {/* How it Works */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {[
            { step: '01', title: 'Share Link', desc: 'Send your unique referral link to friends.', icon: <Share2 /> },
            { step: '02', title: 'Friend Signs Up', desc: 'They get a $10 discount on their first order.', icon: <UserPlus /> },
            { step: '03', title: 'Get Reward', desc: 'You get $20 store credit after their first purchase.', icon: <Gift /> },
          ].map((item, i) => (
            <div key={i} className="text-center group">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-orange-500 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </div>
              <div className="text-xs font-black text-orange-500 mb-2">{item.step}</div>
              <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
              <p className="text-sm text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* History Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-50">
            <h3 className="text-lg font-bold text-slate-900">Your Referral History</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Friend</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Reward</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {referrals.map((ref) => (
                  <tr key={ref.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{ref.referee?.name || ref.referee_email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                        ref.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {ref.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-black text-slate-900">
                        {ref.status === 'completed' ? '+$20.00' : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(ref.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {referrals.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-slate-400">
                      You haven't referred any friends yet. Start sharing to earn rewards!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralProgram;
