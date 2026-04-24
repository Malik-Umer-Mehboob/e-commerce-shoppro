import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLoyaltyStatus, fetchRewards, redeemReward } from '../../store/loyaltySlice';
import Header from '../../components/layout/Header';
import { Award, Zap, Gift, Trophy, ArrowUpRight, History, Sparkles, ChevronRight } from 'lucide-react';

const LoyaltyDashboard = () => {
  const dispatch = useDispatch();
  const { points, currentTier, nextTier, history, rewards, loading } = useSelector((state) => state.loyalty);

  useEffect(() => {
    dispatch(fetchLoyaltyStatus());
    dispatch(fetchRewards());
  }, [dispatch]);

  const progressPercent = nextTier 
    ? Math.min(100, (points / nextTier.threshold) * 100)
    : 100;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Header />
      
      <div className="bg-slate-900 text-white pt-32 pb-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <span className="bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                  Loyalty Program
                </span>
                <span className="text-slate-400 text-xs font-bold">ID: #SP-{auth?.user?.id?.toString().padStart(5, '0')}</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black mb-4">Welcome, <span className="text-orange-500">{currentTier?.name || 'Member'}</span></h1>
              <p className="text-slate-400 text-xl max-w-xl">You're doing great! Keep shopping to unlock exclusive rewards and higher tiers.</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[3rem] w-full md:w-96">
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 bg-orange-500/20 text-orange-500 rounded-2xl flex items-center justify-center">
                  <Zap size={24} fill="currentColor" />
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Available Balance</p>
                  <p className="text-4xl font-black">{points.toLocaleString()} <span className="text-orange-500 text-lg">Pts</span></p>
                </div>
              </div>
              
              {nextTier && (
                <div className="space-y-4">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                    <span className="text-slate-400">Progress to {nextTier.name}</span>
                    <span className="text-orange-500">{(nextTier.threshold - points).toLocaleString()} pts left</span>
                  </div>
                  <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-orange-500 transition-all duration-1000" 
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>
      </div>

      <main className="max-w-7xl mx-auto px-4 -mt-16 relative z-20">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Rewards Area */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white p-8 rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-2xl font-black text-slate-900 flex items-center space-x-3">
                  <Gift className="text-orange-500" />
                  <span>Redeem Rewards</span>
                </h2>
                <button className="text-sm font-bold text-slate-400 hover:text-orange-500 transition-colors uppercase tracking-widest">View All</button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {rewards.map((reward) => (
                  <div key={reward.id} className="group p-6 rounded-3xl border border-slate-100 hover:border-orange-500 transition-all hover:shadow-lg">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-orange-50 group-hover:text-orange-500 transition-colors">
                        <Award size={24} />
                      </div>
                      <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest group-hover:bg-orange-500 group-hover:text-white transition-colors">
                        {reward.points_required} Pts
                      </span>
                    </div>
                    <h3 className="text-lg font-black text-slate-900 mb-2">{reward.name}</h3>
                    <p className="text-sm text-slate-500 mb-6">{reward.description}</p>
                    <button 
                      onClick={() => dispatch(redeemReward(reward.id))}
                      disabled={points < reward.points_required}
                      className={`w-full py-3 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all ${
                        points >= reward.points_required 
                          ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg' 
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <span>Redeem Now</span>
                      <ArrowUpRight size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white p-8 rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100">
              <h2 className="text-2xl font-black text-slate-900 mb-10 flex items-center space-x-3">
                <History className="text-orange-500" />
                <span>Points History</span>
              </h2>
              <div className="space-y-4">
                {history.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-all">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${log.points > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        {log.points > 0 ? <Plus size={18} /> : <Minus size={18} />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{log.description}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{new Date(log.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className={`font-black text-sm ${log.points > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {log.points > 0 ? '+' : ''}{log.points} Pts
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-orange-500 p-8 rounded-[3rem] text-white shadow-xl shadow-orange-500/20">
              <h3 className="text-2xl font-black mb-4">Refer & Earn</h3>
              <p className="text-orange-100 text-sm mb-8">Invite your friends to ShopPro and earn 500 bonus points for every successful purchase they make.</p>
              <div className="bg-white/10 p-4 rounded-2xl flex items-center justify-between mb-8">
                <span className="text-xs font-bold truncate pr-4">shoppro.com/ref/user772</span>
                <button className="bg-white text-orange-500 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg">Copy</button>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-white/20">
                <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-orange-500 bg-slate-200 overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?img=${i+10}`} />
                    </div>
                  ))}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">12 Friends Joined</span>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100">
              <h3 className="text-xl font-black text-slate-900 mb-8">Tier Benefits</h3>
              <div className="space-y-6">
                {currentTier?.benefits?.map((benefit, i) => (
                  <div key={i} className="flex items-start space-x-3">
                    <div className="mt-1 w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check size={12} strokeWidth={4} />
                    </div>
                    <span className="text-sm font-medium text-slate-600">{benefit}</span>
                  </div>
                ))}
              </div>
              <button className="w-full mt-10 py-4 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-900 font-bold text-sm transition-all flex items-center justify-center space-x-2">
                <span>See All Benefits</span>
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Internal icons since they weren't all imported
import { Plus, Minus, Check } from 'lucide-react';

export default LoyaltyDashboard;
