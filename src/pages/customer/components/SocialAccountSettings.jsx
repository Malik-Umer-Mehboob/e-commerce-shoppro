import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { toast } from 'react-hot-toast';
import { Share2, Link as LinkIcon, Unlink, CheckCircle } from 'lucide-react';

const SocialAccountSettings = () => {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchConnections = async () => {
    try {
      const response = await api.get('/auth/user'); // Assuming this returns social info
      setConnections(response.data.social_accounts || []);
    } catch (err) {
      
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  const handleConnect = async (provider) => {
    try {
      const response = await api.get(`/auth/social/${provider}/redirect`);
      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (err) {
      toast.error(`Failed to connect ${provider}`);
    }
  };

  const handleDisconnect = async (provider) => {
    if (!window.confirm(`Disconnect from ${provider}?`)) return;

    try {
      await api.post(`/auth/social/${provider}/disconnect`);
      toast.success(`Disconnected from ${provider}`);
      fetchConnections();
    } catch (err) {
      toast.error('Failed to disconnect');
    }
  };

  const isConnected = (provider) => connections.some(c => c.provider === provider);

  const providers = [
    { id: 'google', name: 'Google', icon: 'https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg' },
    { id: 'facebook', name: 'Facebook', icon: 'https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg' }
  ];

  return (
    <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
      <div className="flex items-center space-x-3 mb-10">
        <div className="p-3 bg-orange-50 text-orange-500 rounded-2xl">
          <Share2 size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900">Social Connections</h2>
          <p className="text-slate-500 text-sm">Sync your account with social media for easier login.</p>
        </div>
      </div>

      <div className="space-y-6">
        {providers.map((p) => (
          <div key={p.id} className="flex items-center justify-between p-6 rounded-[2rem] bg-slate-50 border border-transparent hover:border-slate-100 transition-all">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                <img src={p.icon} className="w-6 h-6" alt={p.name} />
              </div>
              <div>
                <p className="font-bold text-slate-900">{p.name}</p>
                {isConnected(p.id) ? (
                  <span className="text-[10px] font-black text-green-500 uppercase tracking-widest flex items-center gap-1">
                    <CheckCircle size={10} /> Connected
                  </span>
                ) : (
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Not connected</span>
                )}
              </div>
            </div>

            {isConnected(p.id) ? (
              <button 
                onClick={() => handleDisconnect(p.id)}
                className="flex items-center space-x-2 px-6 py-3 bg-white text-red-500 rounded-xl font-bold text-sm border border-red-50 shadow-sm hover:bg-red-50 transition-all"
              >
                <Unlink size={16} />
                <span>Disconnect</span>
              </button>
            ) : (
              <button 
                onClick={() => handleConnect(p.id)}
                className="flex items-center space-x-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-lg hover:bg-slate-800 transition-all"
              >
                <LinkIcon size={16} />
                <span>Connect</span>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SocialAccountSettings;
