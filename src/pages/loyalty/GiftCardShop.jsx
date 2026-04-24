import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { buyGiftCard } from '../../store/giftCardSlice';
import Header from '../../components/layout/Header';
import { Gift, CreditCard, Send, Sparkles, Image as ImageIcon, MessageSquare } from 'lucide-react';

const GiftCardShop = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    amount: 50,
    recipient_email: '',
    message: '',
    image_url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48', // Default gift card image
  });

  const amounts = [25, 50, 100, 250, 500];

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(buyGiftCard(formData));
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Header />
      
      <div className="bg-slate-900 text-white pt-32 pb-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-black mb-6">Gift <span className="text-orange-500">ShopPro</span></h1>
          <p className="text-slate-400 text-xl max-w-2xl mx-auto italic">Give the gift of premium choices. Digital gift cards delivered instantly to their inbox.</p>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
      </div>

      <main className="max-w-7xl mx-auto px-4 -mt-12 relative z-20">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Card Customization */}
          <section className="bg-white p-8 md:p-12 rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100">
            <h2 className="text-3xl font-black text-slate-900 mb-10 flex items-center space-x-3">
              <Sparkles className="text-orange-500" />
              <span>Customize Card</span>
            </h2>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Select Amount</label>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                  {amounts.map(amt => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setFormData({...formData, amount: amt})}
                      className={`py-4 rounded-2xl font-black transition-all ${
                        formData.amount === amt 
                          ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' 
                          : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      ${amt}
                    </button>
                  ))}
                  <div className="col-span-3 md:col-span-2 relative">
                    <input 
                      type="number" 
                      placeholder="Other" 
                      className="w-full h-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-4 font-black outline-none focus:ring-2 focus:ring-orange-500"
                      onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">$</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Recipient Details</label>
                <div className="relative">
                  <input 
                    type="email" 
                    placeholder="Recipient's Email Address" 
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 font-medium"
                    value={formData.recipient_email}
                    onChange={(e) => setFormData({...formData, recipient_email: e.target.value})}
                    required
                  />
                  <Send size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
                <div className="relative">
                  <textarea 
                    rows="4" 
                    placeholder="Add a personalized message..." 
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 font-medium"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  ></textarea>
                  <MessageSquare size={20} className="absolute left-4 top-4 text-slate-400" />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black text-lg flex items-center justify-center space-x-3 hover:bg-slate-800 transition-all shadow-2xl hover:translate-y-[-2px]"
              >
                <CreditCard size={24} />
                <span>Buy Gift Card Now</span>
              </button>
            </form>
          </section>

          {/* Preview Area */}
          <section className="sticky top-24 h-fit">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Live Preview</h2>
            <div className="relative aspect-[1.6/1] bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl shadow-slate-900/20 group">
              <img 
                src={formData.image_url} 
                className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-1000 group-hover:scale-110" 
                alt="Gift card design"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
              
              <div className="absolute inset-0 p-10 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center">
                    <Gift size={32} className="text-orange-500" />
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Digital Value</p>
                    <p className="text-5xl font-black text-white">${formData.amount}</p>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-2">To: {formData.recipient_email || 'Recipient'}</p>
                  <p className="text-lg font-medium text-white line-clamp-2 italic">"{formData.message || 'Happy Gifting from ShopPro!'}"</p>
                </div>
              </div>

              <div className="absolute bottom-6 right-10 flex items-center space-x-2">
                <div className="w-2 h-2 bg-white/20 rounded-full"></div>
                <div className="w-12 h-2 bg-orange-500 rounded-full"></div>
                <div className="w-2 h-2 bg-white/20 rounded-full"></div>
              </div>
            </div>

            <div className="mt-12 p-8 bg-white rounded-3xl border border-slate-100">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center space-x-2">
                <ImageIcon size={14} className="text-orange-500" />
                <span>Card Designs</span>
              </h3>
              <div className="grid grid-cols-4 gap-4">
                {[
                  'https://images.unsplash.com/photo-1549465220-1a8b9238cd48',
                  'https://images.unsplash.com/photo-1513201099705-a9746e1e201f',
                  'https://images.unsplash.com/photo-1521478413844-0bb7ca5010a3',
                  'https://images.unsplash.com/photo-1513885535751-8b9238cd48'
                ].map((url, i) => (
                  <button 
                    key={i}
                    onClick={() => setFormData({...formData, image_url: url})}
                    className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all ${formData.image_url === url ? 'border-orange-500 scale-95' : 'border-transparent hover:scale-105'}`}
                  >
                    <img src={url} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default GiftCardShop;
