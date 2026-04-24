import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerAffiliate } from '../../store/affiliateSlice';
import { toast } from 'react-hot-toast';
import { DollarSign, Rocket, ShieldCheck, Target } from 'lucide-react';

const AffiliateRegistration = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.affiliate);
  
  const [formData, setFormData] = useState({
    paypal_email: '',
    website: '',
    marketing_plan: '',
    agreed: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.agreed) {
      toast.error('You must agree to the terms and conditions');
      return;
    }

    try {
      await dispatch(registerAffiliate(formData)).unwrap();
      toast.success('Affiliate application submitted successfully!');
      navigate('/affiliate/dashboard');
    } catch (err) {
      toast.error(err.message || 'Failed to register');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex p-3 bg-orange-100 rounded-2xl mb-4">
            <Rocket className="w-8 h-8 text-orange-600" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-4">Join the ShopPro Affiliate Program</h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Earn up to 10% commission on every sale you refer. Share your favorite products and get paid for your influence.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: <DollarSign />, title: 'High Commissions', desc: 'Get 10% on every successful referral.' },
            { icon: <Target />, title: 'Easy Tracking', desc: 'Real-time dashboard to monitor your performance.' },
            { icon: <ShieldCheck />, title: 'Secure Payouts', desc: 'Reliable monthly payments via PayPal.' },
          ].map((benefit, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-700 mb-4">
                {benefit.icon}
              </div>
              <h3 className="font-bold text-slate-900 mb-2">{benefit.title}</h3>
              <p className="text-sm text-slate-500">{benefit.desc}</p>
            </div>
          ))}
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">PayPal Email (for payouts)</label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                    placeholder="your@paypal.com"
                    value={formData.paypal_email}
                    onChange={(e) => setFormData({...formData, paypal_email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Website / Social Media Profile</label>
                  <input
                    type="url"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                    placeholder="https://instagram.com/yourprofile"
                    value={formData.website}
                    onChange={(e) => setFormData({...formData, website: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">How do you plan to promote us?</label>
                <textarea
                  rows="4"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                  placeholder="Tell us about your audience and marketing strategies..."
                  value={formData.marketing_plan}
                  onChange={(e) => setFormData({...formData, marketing_plan: e.target.value})}
                ></textarea>
              </div>

              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="agreed"
                  className="mt-1 w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
                  checked={formData.agreed}
                  onChange={(e) => setFormData({...formData, agreed: e.target.checked})}
                />
                <label htmlFor="agreed" className="text-sm text-slate-500">
                  I agree to the <span className="text-orange-600 font-semibold cursor-pointer">Affiliate Terms & Conditions</span>. I understand that payouts are subject to approval and minimum threshold requirements.
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                {loading ? 'Submitting Application...' : 'Apply to be an Affiliate'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AffiliateRegistration;
