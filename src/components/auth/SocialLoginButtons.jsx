import React from 'react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

const SocialLoginButtons = () => {
  const handleSocialLogin = async (provider) => {
    try {
      const response = await api.get(`/auth/social/${provider}/redirect`);
      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (err) {
      toast.error(`Failed to initialize ${provider} login`);
    }
  };

  return (
    <div className="space-y-4 w-full">
      <div className="relative flex items-center justify-center py-4">
        <div className="border-t border-slate-100 w-full"></div>
        <span className="absolute bg-white px-4 text-xs font-bold text-slate-300 uppercase tracking-widest">Or continue with</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => handleSocialLogin('google')}
          className="flex items-center justify-center space-x-3 py-3 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all font-bold text-slate-600"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
          <span>Google</span>
        </button>

        <button 
          onClick={() => handleSocialLogin('facebook')}
          className="flex items-center justify-center space-x-3 py-3 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all font-bold text-slate-600"
        >
          <img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg" className="w-5 h-5" alt="Facebook" />
          <span>Facebook</span>
        </button>
      </div>
    </div>
  );
};

export default SocialLoginButtons;
