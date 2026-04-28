import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  User, 
  Mail, 
  Lock, 
  Camera, 
  Eye, 
  EyeOff, 
  LayoutDashboard,
  Truck,
  LogOut,
  Settings as SettingsIcon,
  Menu
} from 'lucide-react';
import api from '../../services/api';
import { updateUser, logoutUser } from '../../store/authSlice';
import { authService } from '../../services/authService';
import { toast } from 'react-hot-toast';
import { NavLink, useNavigate } from 'react-router-dom';
import ThemeToggle from '../../components/ThemeToggle';

export default function RiderSettings() {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
      console.error('Failed to fetch profile:', error);
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

  const handleLogout = async () => {
    try {
      await authService.logout();
      dispatch(logoutUser());
      navigate('/login');
    } catch (error) {}
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      {/* Sidebar - Same as Dashboard */}
      <aside className={`fixed inset-y-0 left-0 bg-[#0F172A] w-64 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out z-20 shadow-2xl`}>
        <div className="flex h-16 items-center px-6 text-white font-black text-xl border-b border-white/5">
          ShopPro <span className="text-[#F97316] ml-2">Rider</span>
        </div>
        <nav className="p-4 space-y-2">
          <NavLink to="/rider/dashboard" className={({isActive}) => `w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-bold ${isActive ? 'bg-[#F97316] text-white shadow-lg shadow-[#F97316]/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </NavLink>
          <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all font-bold">
            <Truck className="w-5 h-5" />
            <span>My Deliveries</span>
          </button>
          <NavLink to="/rider/settings" className={({isActive}) => `w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-bold ${isActive ? 'bg-[#F97316] text-white shadow-lg shadow-[#F97316]/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
            <SettingsIcon className="w-5 h-5" />
            <span>Settings</span>
          </NavLink>
        </nav>
        <div className="absolute bottom-0 w-full p-4 border-t border-white/5">
          <button onClick={handleLogout} className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl text-red-400 font-bold hover:bg-red-500/10 transition-all border border-red-500/20">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 z-10 sticky top-0">
          <button className="md:hidden text-gray-500" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-4 ml-auto">
            <ThemeToggle />
            <div className="text-right">
              <p className="text-sm font-black text-[#0F172A]">{user?.name}</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Delivery Rider</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#0F172A] text-white flex items-center justify-center font-black border-2 border-white shadow-lg overflow-hidden">
              {avatar ? <img src={avatar} alt="Avatar" className="w-full h-full object-cover" /> : user?.name?.charAt(0)}
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-8 max-w-5xl mx-auto w-full">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-[#0F172A]">Account Settings</h1>
            <p className="text-gray-500 font-medium mt-1">Manage your rider profile</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Profile Settings Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
                <div className="flex flex-col sm:flex-row items-center gap-8 mb-8">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full border-4 border-white shadow-xl overflow-hidden bg-[#0F172A] text-white flex items-center justify-center font-bold text-[28px]">
                      {uploadingAvatar ? (
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      ) : avatar ? (
                        <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        user?.name?.charAt(0).toUpperCase()
                      )}
                    </div>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 p-2 bg-[#F97316] text-white rounded-full shadow-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
                      disabled={uploadingAvatar}
                    >
                      <Camera className="w-4 h-4" />
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
                    <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="w-5 h-5 text-gray-400" />
                      </div>
                      <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-[#F97316] outline-none transition-all text-sm font-medium"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="w-5 h-5 text-gray-400" />
                      </div>
                      <input 
                        type="email" 
                        value={user?.email || ''}
                        disabled
                        className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-400 cursor-not-allowed outline-none text-sm font-medium"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <Lock className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 font-medium">Email cannot be changed</p>
                  </div>

                  <button 
                    onClick={handleSaveProfile}
                    disabled={savingProfile}
                    className="w-full bg-[#F97316] hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    {savingProfile ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <span>Save Changes</span>
                    )}
                  </button>
                </div>
              </div>

              {/* Password Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
                <h2 className="text-xl font-black text-[#0F172A] mb-1">Change Password</h2>
                <p className="text-sm text-gray-500 font-medium mb-6">Update your account password</p>
                
                {passwordError && (
                  <div className="p-3 bg-red-50 text-red-500 text-sm rounded-lg mb-6 font-medium">
                    {passwordError}
                  </div>
                )}

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Current Password</label>
                    <div className="relative">
                      <input 
                        type={showCurrent ? "text" : "password"} 
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full pl-4 pr-10 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F97316] outline-none text-sm"
                        placeholder="Enter current password"
                      />
                      <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                        {showCurrent ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">New Password</label>
                    <div className="relative">
                      <input 
                        type={showNew ? "text" : "password"} 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full pl-4 pr-10 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F97316] outline-none text-sm"
                        placeholder="Enter new password"
                      />
                      <button type="button" onClick={() => setShowNew(!showNew)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                        {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Confirm New Password</label>
                    <div className="relative">
                      <input 
                        type={showConfirm ? "text" : "password"} 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-4 pr-10 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F97316] outline-none text-sm"
                        placeholder="Confirm new password"
                      />
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                        {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <button 
                    onClick={handleSavePassword}
                    disabled={savingPassword}
                    className="w-full bg-[#F97316] hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 mt-2"
                  >
                    {savingPassword ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <span>Change Password</span>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Account Info Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 sticky top-24">
                <h3 className="text-lg font-black text-[#0F172A] mb-6">Account Information</h3>
                
                <div className="space-y-6">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Role</p>
                    <div className="inline-flex items-center space-x-2 bg-orange-50 px-3 py-1.5 rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-[#F97316]"></div>
                      <span className="text-sm font-black text-orange-600">Delivery Rider</span>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Member Since</p>
                    <p className="text-sm font-bold text-[#0F172A]">{user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}</p>
                  </div>
                  
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Account Status</p>
                    <div className="inline-flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-sm font-bold text-[#0F172A]">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {isSidebarOpen && (
        <div className="fixed inset-0 bg-[#0F172A]/60 z-10 md:hidden backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsSidebarOpen(false)}></div>
      )}
    </div>
  );
}
