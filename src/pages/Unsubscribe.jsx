import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Mail, Frown, CheckCircle2, Home, ArrowLeft } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export default function Unsubscribe() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('confirming'); // confirming, success, error
  const email = searchParams.get('email');

  const handleUnsubscribe = async () => {
    setStatus('processing');
    try {
      // In a real app, you'd use a signed URL or hash to prevent unauthorized unsubscriptions
      await axios.post(`${API_URL}/newsletter/unsubscribe`, { email });
      setStatus('success');
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-12 rounded-[3rem] shadow-2xl border border-gray-100 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-gray-100 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
          <Mail className="w-10 h-10 text-[#0F172A]" />
        </div>

        {status === 'confirming' && (
          <div className="space-y-6">
            <h1 className="text-3xl font-black text-[#0F172A]">We're sorry to see you go!</h1>
            <p className="text-gray-500 font-medium leading-relaxed">
              Are you sure you want to unsubscribe {email ? <span className="font-bold text-[#0F172A]">{email}</span> : 'from our list'}? You'll miss out on our latest updates and exclusive deals.
            </p>
            <div className="pt-4 space-y-3">
              <button 
                onClick={handleUnsubscribe}
                className="w-full bg-[#0F172A] text-white py-4 rounded-2xl font-black shadow-xl shadow-[#0F172A]/20 hover:bg-black transition-all"
              >
                Yes, Unsubscribe Me
              </button>
              <Link to="/" className="block w-full py-4 rounded-2xl font-black text-gray-500 hover:bg-gray-50 transition-all">
                Nevermind, I'll stay
              </Link>
            </div>
          </div>
        )}

        {status === 'processing' && (
          <div className="py-12 space-y-4">
            <div className="w-12 h-12 border-4 border-[#0F172A] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="font-black text-[#0F172A] uppercase tracking-widest text-xs">Processing Request...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-6 animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-black text-[#0F172A]">Successfully Unsubscribed</h1>
            <p className="text-gray-500 font-medium">
              You've been removed from our mailing list. It may take up to 24 hours to process fully.
            </p>
            <div className="pt-6">
              <Link 
                to="/" 
                className="inline-flex items-center space-x-2 bg-gray-100 text-[#0F172A] px-8 py-4 rounded-2xl font-black hover:bg-gray-200 transition-all"
              >
                <Home className="w-5 h-5" />
                <span>Return to Shop</span>
              </Link>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-6 animate-in shake duration-500">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <Frown className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-black text-[#0F172A]">Something went wrong</h1>
            <p className="text-gray-500 font-medium">
              We couldn't process your request. Please try again or contact support if the problem persists.
            </p>
            <div className="pt-6">
              <button 
                onClick={() => setStatus('confirming')}
                className="inline-flex items-center space-x-2 bg-[#0F172A] text-white px-8 py-4 rounded-2xl font-black hover:bg-black transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Try Again</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
