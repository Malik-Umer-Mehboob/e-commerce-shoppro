import React, { useState } from 'react';
import api from '../../services/api';
import Header from '../../components/layout/Header';
import { Search, CreditCard, Calendar, ShieldCheck, AlertCircle } from 'lucide-react';

const GiftCardBalance = () => {
  const [code, setCode] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await api.post('/gift-cards/check', { code });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to check balance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <div className="max-w-xl mx-auto px-4 pt-48 pb-20">
        <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 text-center">
          <div className="w-20 h-20 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-8">
            <CreditCard size={40} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Check Balance</h1>
          <p className="text-slate-500 mb-10">Enter your 12-digit gift card code below.</p>

          <form onSubmit={handleCheck} className="space-y-6">
            <div className="relative">
              <input 
                type="text" 
                placeholder="XXXX-XXXX-XXXX" 
                className="w-full pl-6 pr-12 py-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 font-black text-center text-xl tracking-widest placeholder:tracking-normal placeholder:font-bold"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                maxLength={14}
                required
              />
              <Search size={24} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300" />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg shadow-xl hover:bg-slate-800 transition-all disabled:opacity-50"
            >
              {loading ? 'Checking...' : 'View Balance'}
            </button>
          </form>

          {result && (
            <div className="mt-12 p-8 bg-green-50 border border-green-100 rounded-3xl animate-in zoom-in-95 duration-300">
              <div className="flex items-center justify-center space-x-2 text-green-600 mb-4">
                <ShieldCheck size={20} />
                <span className="text-xs font-black uppercase tracking-widest">Valid Gift Card</span>
              </div>
              <p className="text-5xl font-black text-slate-900 mb-6">${result.balance}</p>
              <div className="flex items-center justify-center space-x-2 text-slate-500 text-sm font-bold">
                <Calendar size={16} />
                <span>Expires: {new Date(result.expires_at).toLocaleDateString()}</span>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-12 p-8 bg-red-50 border border-red-100 rounded-3xl text-red-600 flex flex-col items-center animate-in shake duration-500">
              <AlertCircle size={32} className="mb-2" />
              <p className="font-bold">{error}</p>
            </div>
          )}
        </div>
        
        <p className="text-center mt-12 text-slate-400 text-xs font-bold uppercase tracking-widest">
          Secure verification by ShopPro Financial
        </p>
      </div>
    </div>
  );
};

export default GiftCardBalance;
