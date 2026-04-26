import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Camera, Lock, CheckCircle2, Loader2, Shield, Mail, Calendar } from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { updateUser } from '../../store/authSlice';
import Header from '../../components/layout/Header';

export default function CustomerProfile() {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || null,
    role: 'customer',
    created_at: '',
    subscribed_to_newsletter: false
  });

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: ''
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/customer/profile');
      if (response.data?.success) {
        setProfileData(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const response = await api.put('/customer/profile', { name: profileData.name });
      if (response.data?.success) {
        toast.success('Profile updated!');
        dispatch(updateUser({ name: profileData.name }));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      setUploading(true);
      const response = await api.post('/customer/profile/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (response.data?.success) {
        setProfileData(prev => ({ ...prev, avatar: response.data.data.avatar }));
        dispatch(updateUser({ avatar: response.data.data.avatar }));
        toast.success('Avatar updated!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload avatar');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.new_password_confirmation) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwordData.new_password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    try {
      setPasswordSaving(true);
      const response = await api.post('/customer/profile/change-password', passwordData);
      if (response.data?.success) {
        toast.success('Password changed successfully');
        setPasswordData({
          current_password: '',
          new_password: '',
          new_password_confirmation: ''
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleNewsletterToggle = async () => {
    const newValue = !profileData.subscribed_to_newsletter;
    try {
      const response = await api.post('/customer/profile/newsletter', { subscribed: newValue });
      if (response.data?.success) {
        setProfileData(prev => ({ ...prev, subscribed_to_newsletter: newValue }));
        toast.success(newValue ? 'Subscribed!' : 'Unsubscribed');
      }
    } catch (error) {
      toast.error('Failed to update preference');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <Header />
        <div className="flex justify-center items-center h-[60vh]">
          <Loader2 className="w-12 h-12 animate-spin text-[#F97316]" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-[#0F172A]">My Profile</h1>
          <p className="text-gray-500 font-medium mt-1">Manage your account settings</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="md:col-span-2 space-y-8">
            {/* Section 1 - Avatar & Name */}
            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
              <form onSubmit={handleProfileUpdate}>
                <div className="flex flex-col items-center mb-8">
                  <div className="relative">
                    {profileData.avatar ? (
                      <img 
                        src={profileData.avatar} 
                        alt="Profile" 
                        className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-[#0F172A] text-white flex items-center justify-center text-3xl font-bold shadow-lg">
                        {profileData.name.charAt(0)}
                      </div>
                    )}
                    
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="absolute bottom-0 right-0 bg-[#F97316] text-white p-2 rounded-full shadow-lg hover:bg-[#ea580c] transition-colors disabled:opacity-50"
                    >
                      {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                    </button>
                    <input 
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                    />
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                    <input 
                      type="text"
                      required
                      className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-[#F97316]/20 outline-none transition-all"
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                    <div className="relative">
                      <input 
                        type="email"
                        disabled
                        className="w-full pl-4 pr-10 py-3 bg-gray-100 border-none rounded-xl text-sm font-bold text-gray-500 cursor-not-allowed"
                        value={profileData.email}
                      />
                      <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                    <p className="text-[10px] font-bold text-gray-400 ml-1">Email cannot be changed</p>
                  </div>

                  <button 
                    type="submit"
                    disabled={saving}
                    className="w-full py-3 bg-[#F97316] text-white rounded-xl font-bold text-sm shadow-lg shadow-[#F97316]/20 hover:bg-[#ea580c] transition-all flex items-center justify-center disabled:opacity-50"
                  >
                    {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : 'Save Profile'}
                  </button>
                </div>
              </form>
            </div>

            {/* Section 2 - Change Password */}
            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
              <h2 className="text-xl font-black text-[#0F172A] mb-6">Change Password</h2>
              
              <form onSubmit={handlePasswordChange} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Current Password</label>
                  <div className="relative">
                    <input 
                      type={showCurrentPassword ? "text" : "password"}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-[#F97316]/20 outline-none transition-all pr-12"
                      value={passwordData.current_password}
                      onChange={(e) => setPasswordData({...passwordData, current_password: e.target.value})}
                    />
                    <button 
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400 hover:text-[#F97316] uppercase"
                    >
                      {showCurrentPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">New Password</label>
                  <div className="relative">
                    <input 
                      type={showNewPassword ? "text" : "password"}
                      required
                      minLength={8}
                      className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-[#F97316]/20 outline-none transition-all pr-12"
                      value={passwordData.new_password}
                      onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})}
                    />
                    <button 
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400 hover:text-[#F97316] uppercase"
                    >
                      {showNewPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Confirm New Password</label>
                  <div className="relative">
                    <input 
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      minLength={8}
                      className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-[#F97316]/20 outline-none transition-all pr-12"
                      value={passwordData.new_password_confirmation}
                      onChange={(e) => setPasswordData({...passwordData, new_password_confirmation: e.target.value})}
                    />
                    <button 
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400 hover:text-[#F97316] uppercase"
                    >
                      {showConfirmPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={passwordSaving}
                  className="w-full py-3 bg-[#0F172A] text-white rounded-xl font-bold text-sm shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center disabled:opacity-50"
                >
                  {passwordSaving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Updating...</> : 'Update Password'}
                </button>
              </form>
            </div>
          </div>

          <div className="space-y-8">
            {/* Section 3 - Newsletter */}
            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
              <h2 className="text-xl font-black text-[#0F172A] mb-6">Email Preferences</h2>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm text-[#0F172A]">Subscribe to Newsletter</p>
                  <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">Receive updates & offers</p>
                </div>
                <button
                  type="button"
                  onClick={handleNewsletterToggle}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    profileData.subscribed_to_newsletter ? 'bg-[#F97316]' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      profileData.subscribed_to_newsletter ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Section 4 - Account Info */}
            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
              <h2 className="text-xl font-black text-[#0F172A] mb-6">Account Info</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 text-gray-500">
                    <Shield className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">Role</span>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                    {profileData.role}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">Member Since</span>
                  </div>
                  <span className="text-sm font-bold text-[#0F172A]">{profileData.created_at}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 text-gray-500">
                    <Mail className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">Email Status</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-sm font-bold text-[#0F172A]">Verified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
