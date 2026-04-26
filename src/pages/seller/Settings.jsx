import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  User, 
  Mail, 
  Lock, 
  Camera, 
  ShieldCheck, 
  Calendar, 
  Loader2, 
  Eye, 
  EyeOff, 
  CheckCircle2,
  AlertCircle,
  Menu,
  LogOut,
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart2,
  Settings as SettingsIcon,
  Globe,
  ChevronRight
} from 'lucide-react';
import api from '../../services/api';
import { updateUser, logoutUser } from '../../store/authSlice';
import { authService } from '../../services/authService';
import { toast } from 'react-hot-toast';
import { useNavigate, NavLink } from 'react-router-dom';
import ThemeToggle from '../../components/ThemeToggle';

export default function SellerSettings() {
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

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setProfileLoading(true);
      const response = await api.get('/seller/profile');
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

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Avatar must be less than 2MB');
      return;
    }

    setUploadingAvatar(true);
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const response = await api.post('/seller/profile/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const data = response.data?.data;
      setAvatar(data.avatar);
      dispatch(updateUser({ avatar: data.avatar, name: data.name }));
      toast.success('Avatar updated!');
    } catch (error) {
      toast.error('Failed to upload avatar');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (name.length < 2) {
      toast.error('Name must be at least 2 characters');
      return;
    }

    setSavingProfile(true);
    try {
      const response = await api.put('/seller/profile', { name });
      const data = response.data?.data;
      dispatch(updateUser({ name: data.name }));
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('All password fields are required');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }

    setSavingPassword(true);
    try {
      await api.post('/seller/profile/change-password', {
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword
      });
      toast.success('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      dispatch(logoutUser());
      navigate('/login');
      toast.success('Logged out successfully');
    } catch (error) {
      dispatch(logoutUser());
      navigate('/login');
    }
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/seller/dashboard', end: true },
    { icon: Package, label: 'My Products', path: '/seller/products' },
    { icon: ShoppingCart, label: 'Orders', path: '/seller/orders' },
    { icon: BarChart2, label: 'Analytics', path: '/seller/analytics' },
    { icon: SettingsIcon, label: 'Settings', path: '/seller/settings' },
  ];

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 bg-[#0F172A] w-72 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out z-30 shadow-2xl shadow-black/50 overflow-y-auto custom-scrollbar`}>
        <div className="flex h-20 items-center px-8 text-white font-black text-2xl border-b border-white/5 sticky top-0 bg-[#0F172A] z-10">
          <div className="w-10 h-10 bg-[#F97316] rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-[#F97316]/20">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <span className="tracking-tighter">ShopPro <span className="text-[#F97316]">Seller</span></span>
        </div>
        
        <nav className="p-6 space-y-1">
          {navItems.map((item, idx) => (
            <NavLink 
              key={idx} 
              to={item.path}
              end={item.end}
              className={({ isActive }) => `w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all group ${isActive ? 'bg-[#F97316] text-white shadow-xl shadow-[#F97316]/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
              onClick={() => setIsSidebarOpen(false)}
            >
              <div className="flex items-center space-x-3">
                <item.icon className={`w-5 h-5 transition-colors`} />
                <span className="font-bold text-sm">{item.label}</span>
              </div>
              {({ isActive }) => isActive && <ChevronRight className="w-4 h-4 animate-in slide-in-from-left-2" />}
            </NavLink>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5 mt-auto">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-2xl text-red-400 font-bold hover:bg-red-500/10 transition-all border border-red-500/20"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-72 flex flex-col min-h-screen transition-all duration-300">
        <header className="h-20 bg-white/80 backdrop-blur-md sticky top-0 flex items-center justify-between px-8 z-20 border-b border-gray-100">
          <button className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-xl" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="ml-auto flex items-center space-x-6">
            <ThemeToggle />
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-[#0F172A]">{user?.name}</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Seller Panel</p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#0F172A] to-slate-800 text-white flex items-center justify-center font-black border-2 border-white shadow-lg overflow-hidden">
              {avatar ? (
                <img src={avatar} alt={user?.name} className="w-full h-full object-cover" />
              ) : (
                user?.name?.[0] || 'S'
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-8 lg:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="max-w-4xl mx-auto space-y-8">
            <div>
              <h1 className="text-3xl font-black text-[#0F172A]">Seller Account Settings</h1>
              <p className="text-gray-500 font-medium">Manage your seller profile and security</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Card */}
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
                  <h3 className="text-xl font-black text-[#0F172A] mb-8 flex items-center">
                    <User className="w-5 h-5 mr-3 text-[#F97316]" />
                    Personal Information
                  </h3>

                  <div className="flex flex-col items-center mb-10">
                    <div className="relative group">
                      <div className="w-32 h-32 rounded-[2.5rem] bg-[#0F172A] flex items-center justify-center text-white text-4xl font-black border-4 border-white shadow-2xl overflow-hidden ring-4 ring-gray-50">
                        {uploadingAvatar ? (
                          <Loader2 className="w-8 h-8 animate-spin" />
                        ) : avatar ? (
                          <img src={avatar} alt={name} className="w-full h-full object-cover" />
                        ) : (
                          name?.[0] || user?.name?.[0] || 'S'
                        )}
                      </div>
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute -bottom-2 -right-2 bg-[#F97316] text-white p-3 rounded-2xl shadow-xl hover:bg-[#ea6a0f] transition-all transform hover:scale-110 border-4 border-white"
                      >
                        <Camera className="w-5 h-5" />
                      </button>
                      <input 
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleAvatarChange}
                      />
                    </div>
                    <p className="mt-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Click to update avatar</p>
                  </div>

                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input 
                          type="text"
                          required
                          className="w-full pl-14 pr-6 py-4 rounded-2xl bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-[#F97316]/10 outline-none transition-all font-bold text-[#0F172A]"
                          placeholder="Your Name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input 
                          type="email"
                          disabled
                          className="w-full pl-14 pr-6 py-4 rounded-2xl bg-gray-100 border-none outline-none font-bold text-gray-400 cursor-not-allowed"
                          value={user?.email || ''}
                        />
                        <Lock className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
                      </div>
                      <div className="flex items-center space-x-1.5 ml-1 mt-1 text-red-500 font-bold">
                          <AlertCircle className="w-3 h-3" />
                          <span className="text-[10px] uppercase tracking-widest">Email cannot be changed</span>
                      </div>
                    </div>

                    <button 
                      type="submit"
                      disabled={savingProfile}
                      className="w-full bg-[#F97316] text-white py-4 rounded-2xl font-black shadow-xl shadow-[#F97316]/20 hover:bg-[#ea6a0f] transition-all transform hover:-translate-y-1 flex items-center justify-center disabled:opacity-50"
                    >
                      {savingProfile ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : 'Save Changes'}
                    </button>
                  </form>
                </div>

                <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
                  <h3 className="text-xl font-black text-[#0F172A] mb-8 flex items-center">
                    <ShieldCheck className="w-5 h-5 mr-3 text-[#F97316]" />
                    Security Settings
                  </h3>

                  <form onSubmit={handleChangePassword} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Current Password</label>
                      <div className="relative">
                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input 
                          type={showCurrent ? "text" : "password"}
                          required
                          className="w-full pl-14 pr-14 py-4 rounded-2xl bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-[#F97316]/10 outline-none transition-all font-bold text-[#0F172A]"
                          placeholder="••••••••"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                        <button 
                          type="button"
                          onClick={() => setShowCurrent(!showCurrent)}
                          className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0F172A]"
                        >
                          {showCurrent ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">New Password</label>
                        <div className="relative">
                          <input 
                            type={showNew ? "text" : "password"}
                            required
                            className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-[#F97316]/10 outline-none transition-all font-bold text-[#0F172A]"
                            placeholder="Min 8 chars"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                          />
                          <button 
                            type="button"
                            onClick={() => setShowNew(!showNew)}
                            className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0F172A]"
                          >
                            {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Confirm Password</label>
                        <input 
                          type={showNew ? "text" : "password"}
                          required
                          className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-[#F97316]/10 outline-none transition-all font-bold text-[#0F172A]"
                          placeholder="Repeat password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>
                    </div>

                    <button 
                      type="submit"
                      disabled={savingPassword}
                      className="w-full bg-[#0F172A] text-white py-4 rounded-2xl font-black shadow-xl shadow-[#0F172A]/20 hover:bg-black transition-all transform hover:-translate-y-1 flex items-center justify-center disabled:opacity-50"
                    >
                      {savingPassword ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : 'Update Password'}
                    </button>
                  </form>
                </div>
              </div>

              {/* Info Cards Sidebar */}
              <div className="space-y-8">
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-orange-500 rounded-full opacity-5 blur-3xl group-hover:opacity-10 transition-opacity"></div>
                  <h3 className="text-lg font-black text-[#0F172A] mb-6 flex items-center">
                    <Calendar className="w-5 h-5 mr-3 text-[#F97316]" />
                    Account Info
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Role</span>
                      <span className="px-3 py-1 bg-orange-100 text-[#F97316] text-[10px] font-black uppercase tracking-widest rounded-lg">Seller</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Joined</span>
                      <span className="text-xs font-bold text-[#0F172A]">{user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Unknown'}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</span>
                      <div className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                          <span className="text-xs font-black text-green-600 uppercase tracking-widest">Active</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0F172A] p-8 rounded-[2.5rem] text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-[#F97316] rounded-full opacity-20 blur-3xl"></div>
                  <div className="relative z-10">
                      <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                          <ShieldCheck className="w-6 h-6 text-[#F97316]" />
                      </div>
                      <h4 className="text-xl font-black mb-3">Seller Security</h4>
                      <p className="text-gray-400 text-sm leading-relaxed mb-6 font-medium">
                          Your account is currently protected with a strong password. Keep your credentials safe.
                      </p>
                      <div className="flex items-center space-x-2 text-[#F97316] font-black text-xs uppercase tracking-widest">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Verified Seller</span>
                      </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-[#0F172A]/60 z-20 md:hidden backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsSidebarOpen(false)}></div>
      )}
    </div>
  );
}
