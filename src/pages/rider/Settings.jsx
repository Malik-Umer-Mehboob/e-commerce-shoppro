import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  User, 
  Mail, 
  Lock, 
  Camera, 
  Eye, 
  EyeOff, 
} from 'lucide-react';
import api from '../../services/api';
import { updateUser } from '../../store/authSlice';
import { toast } from 'react-hot-toast';
import ThemeToggle from '../../components/ThemeToggle';
import RiderLayout from '../../components/rider/Layout';

export default function RiderSettings() {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  
  const [name, setName] = useState(user?.name ?? '');
  const [avatar, setAvatar] = useState(user?.avatar ?? null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setProfileLoading(true);
      const response = await api.get('/rider/profile');
      const data = response.data?.data;
      if (data) {
        setName(data.name);
        setAvatar(data.avatar);
        dispatch(updateUser({ avatar: data.avatar, name: data.name }));
      }
    } catch (error) {
      
    } finally {
      setProfileLoading(false);
    }
  };

  const handleAvatarSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be less than 2MB');
      return;
    }

    try {
      setUploadingAvatar(true);
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await api.post('/rider/profile/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data?.success) {
        const newAvatar = response.data.data.avatar;
        setAvatar(newAvatar);
        dispatch(updateUser({ avatar: newAvatar }));
        toast.success('Avatar updated successfully!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload avatar');
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      toast.error('Name is required');
      return;
    }

    try {
      setSavingProfile(true);
      const response = await api.put('/rider/profile', { name });
      if (response.data?.success) {
        toast.success('Profile updated successfully!');
        dispatch(updateUser({ name }));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSavePassword = async () => {
    setPasswordError('');
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('All password fields are required');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    try {
      setSavingPassword(true);
      await api.post('/rider/profile/change-password', {
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword
      });

      toast.success('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to change password';
      setPasswordError(msg);
      toast.error(msg);
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <RiderLayout>
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 z-10 sticky top-0">
          <div className="flex items-center space-x-2">
            <span className="font-black text-[#0F172A] text-lg uppercase tracking-tight">Settings</span>
            <div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div>
          </div>
          <div className="flex items-center space-x-4 ml-auto">
            <ThemeToggle />
            <div className="text-right">
              <p className="text-sm font-black text-[#0F172A]">{user?.name}</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Account Security</p>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-8 max-w-5xl mx-auto w-full">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-[#0F172A]">Account Settings</h1>
            <p className="text-gray-500 font-medium mt-1">Manage your rider profile and security</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Profile Settings Card */}
              <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6 md:p-8">
                <div className="flex flex-col sm:flex-row items-center gap-8 mb-8">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-3xl border-4 border-white shadow-xl overflow-hidden bg-[#0F172A] text-white flex items-center justify-center font-bold text-[32px]">
                      {uploadingAvatar ? (
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                      ) : avatar ? (
                        <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        user?.name?.charAt(0).toUpperCase()
                      )}
                    </div>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#EA6F10'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = '#F97316'}
                      className="absolute bottom-[-10px] right-[-10px] p-3 bg-[#F97316] text-white rounded-2xl shadow-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
                      disabled={uploadingAvatar}
                    >
                      <Camera className="w-5 h-5" />
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleAvatarSelect}
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-[#0F172A]">Profile Picture</h3>
                    <p className="text-sm text-gray-500 font-medium">JPG, PNG or WEBP. Max size of 2MB.</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-black text-gray-700 mb-2 uppercase tracking-widest text-[10px]">Full Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="w-5 h-5 text-gray-300" />
                      </div>
                      <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-[#F97316]/30 focus:ring-4 focus:ring-[#F97316]/5 outline-none transition-all text-sm font-bold"
                        placeholder="Your full name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-black text-gray-700 mb-2 uppercase tracking-widest text-[10px]">Email Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="w-5 h-5 text-gray-300" />
                      </div>
                      <input 
                        type="email" 
                        value={user?.email || ''}
                        disabled
                        className="w-full pl-12 pr-12 py-4 bg-gray-100/50 border border-transparent rounded-2xl text-gray-400 cursor-not-allowed outline-none text-sm font-bold"
                      />
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                        <Lock className="w-4 h-4 text-gray-300" />
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-2 font-black uppercase tracking-widest pl-2">Email cannot be changed for security</p>
                  </div>

                  <button 
                    onClick={handleSaveProfile}
                    disabled={savingProfile}
                    style={{
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'black'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#0F172A'}
                    className="w-full bg-[#0F172A] hover:bg-black text-white font-black text-xs uppercase tracking-widest py-4 px-6 rounded-2xl transition-all flex items-center justify-center space-x-2 shadow-lg shadow-gray-200"
                  >
                    {savingProfile ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <span>Update Profile Info</span>
                    )}
                  </button>
                </div>
              </div>

              {/* Password Card */}
              <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6 md:p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-3 bg-red-50 text-red-500 rounded-xl"><Lock className="w-5 h-5" /></div>
                  <div>
                    <h2 className="text-xl font-black text-[#0F172A]">Security Settings</h2>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Change your password</p>
                  </div>
                </div>
                
                {passwordError && (
                  <div className="p-4 bg-red-50 text-red-500 text-xs rounded-xl mb-6 font-black uppercase tracking-widest">
                    {passwordError}
                  </div>
                )}

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-black text-gray-700 mb-2 uppercase tracking-widest text-[10px]">Current Password</label>
                    <div className="relative">
                      <input 
                        type={showCurrent ? "text" : "password"} 
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-[#F97316]/30 focus:ring-4 focus:ring-[#F97316]/5 outline-none text-sm font-bold"
                        placeholder="••••••••"
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowCurrent(!showCurrent)} 
                        style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-300 hover:text-gray-600"
                      >
                        {showCurrent ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-black text-gray-700 mb-2 uppercase tracking-widest text-[10px]">New Password</label>
                      <div className="relative">
                        <input 
                          type={showNew ? "text" : "password"} 
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-[#F97316]/30 focus:ring-4 focus:ring-[#F97316]/5 outline-none text-sm font-bold"
                          placeholder="••••••••"
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowNew(!showNew)} 
                          style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-300 hover:text-gray-600"
                        >
                          {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-black text-gray-700 mb-2 uppercase tracking-widest text-[10px]">Confirm New</label>
                      <div className="relative">
                        <input 
                          type={showConfirm ? "text" : "password"} 
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-[#F97316]/30 focus:ring-4 focus:ring-[#F97316]/5 outline-none text-sm font-bold"
                          placeholder="••••••••"
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowConfirm(!showConfirm)} 
                          style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-300 hover:text-gray-600"
                        >
                          {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={handleSavePassword}
                    disabled={savingPassword}
                    style={{
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#EA6F10'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#F97316'}
                    className="w-full bg-[#F97316] hover:bg-orange-600 text-white font-black text-xs uppercase tracking-widest py-4 px-6 rounded-2xl transition-all flex items-center justify-center space-x-2 mt-2 shadow-lg shadow-orange-100"
                  >
                    {savingPassword ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <span>Update Password</span>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Account Info Card */}
            <div className="lg:col-span-1">
              <div className="bg-[#0F172A] rounded-[2.5rem] p-8 sticky top-24 shadow-2xl shadow-blue-900/20 text-white">
                <h3 className="text-xl font-black mb-8 border-b border-white/5 pb-4">Rider Status</h3>
                
                <div className="space-y-8">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                      <div className="w-3 h-3 rounded-full bg-orange-500 animate-pulse"></div>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Role</p>
                      <p className="text-sm font-black text-white uppercase tracking-tight">Delivery Professional</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                      <User className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Member Since</p>
                      <p className="text-sm font-black text-white">{user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center border border-green-500/20">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Account Status</p>
                      <p className="text-sm font-black text-green-400 uppercase tracking-widest">Active & Verified</p>
                    </div>
                  </div>
                </div>

                <div className="mt-12 p-6 bg-white/5 rounded-3xl border border-white/5">
                    <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-2">Need help?</p>
                    <p className="text-xs text-gray-400 font-medium leading-relaxed">If you're having trouble with your rider account, contact our fleet support team.</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </RiderLayout>
  );
}
