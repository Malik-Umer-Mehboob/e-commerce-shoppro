import { useState } from 'react';
import { Mail, Send, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export default function NewsletterSignup({ variant = 'default' }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Assuming a public endpoint exists or just uses the generic preference update if logged in
      // For public signup, we might need a specific endpoint
      await axios.post(`${API_URL}/newsletter/subscribe`, { email });
      setSubscribed(true);
      toast.success('Thanks for subscribing!');
    } catch (error) {
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (subscribed) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-green-50 rounded-2xl border border-green-100 text-center animate-in zoom-in duration-300">
        <CheckCircle2 className="w-10 h-10 text-green-500 mb-2" />
        <p className="font-black text-green-800">You're on the list!</p>
        <p className="text-xs text-green-600 font-medium">Watch your inbox for exciting updates.</p>
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-black text-white">Join the Community</h3>
        <p className="text-gray-400 text-xs font-medium">Get exclusive deals and the latest fashion news delivered to your inbox.</p>
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <div className="relative flex-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              required
              type="email" 
              placeholder="Your email address" 
              className="w-full pl-10 pr-4 py-3 bg-[#1E293B] border-none rounded-xl text-sm text-white focus:ring-2 focus:ring-[#F97316] outline-none transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="bg-[#F97316] text-white p-3 rounded-xl hover:bg-[#ea6a0f] transition-all transform hover:scale-105"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Send className="w-5 h-5" />}
          </button>
        </form>
      </div>
    );
  }

  return (
    <section className="bg-[#0F172A] p-12 rounded-[3rem] relative overflow-hidden shadow-2xl">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#F97316]/20 rounded-full -mr-32 -mt-32 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full -ml-24 -mb-24 blur-3xl"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="text-center md:text-left space-y-4 max-w-xl">
          <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">Stay ahead of the <span className="text-[#F97316]">trends.</span></h2>
          <p className="text-gray-400 text-lg font-medium">Subscribe to our newsletter and get <span className="text-white font-bold">10% OFF</span> your first order.</p>
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-md bg-white/5 p-2 rounded-[2rem] backdrop-blur-md border border-white/10 flex items-center shadow-xl">
          <input 
            required
            type="email" 
            placeholder="Enter your email" 
            className="flex-1 bg-transparent border-none px-6 py-4 text-white placeholder-gray-500 focus:ring-0 outline-none text-lg font-medium"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button 
            type="submit"
            disabled={loading}
            className="bg-[#F97316] text-white px-8 py-4 rounded-[1.5rem] font-black text-lg shadow-lg shadow-[#F97316]/30 hover:bg-[#ea6a0f] transition-all transform active:scale-95"
          >
            {loading ? "..." : "Join Now"}
          </button>
        </form>
      </div>
    </section>
  );
}
