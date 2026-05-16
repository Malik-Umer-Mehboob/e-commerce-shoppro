import { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  Truck, 
  Search, 
  Mail, 
  Phone, 
  MapPin, 
  CreditCard, 
  Activity, 
  CheckCircle, 
  XCircle, 
  Loader2,
  ChevronRight,
  User,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  X,
  ShoppingBag,
  Package,
  DollarSign,
  Clock
} from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

export default function StaffManagement() {
  const [activeTab, setActiveTab] = useState('support');
  const [supportStaff, setSupportStaff] = useState([]);
  const [riders, setRiders] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Detail Modal States
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [riderStats, setRiderStats] = useState(null);
  const [recentDeliveries, setRecentDeliveries] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    mobile_number: '',
    vehicle_type: '',
    cnic: '',
    delivery_zone: '',
    staff_status: 'active',
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const metricsRes = await api.get('/admin/staff/metrics');
      setMetrics(metricsRes.data.data);

      if (activeTab === 'support') {
        const res = await api.get('/admin/staff/support');
        setSupportStaff(res.data.data);
      } else {
        const res = await api.get('/admin/staff/riders');
        setRiders(res.data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch staff data');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await api.patch(`/admin/staff/${id}/toggle-status`);
      toast.success('Status updated successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleEditClick = (staff) => {
    setSelectedStaff(staff);
    setIsEditing(true);
    setFormData({
      name: staff.name,
      email: staff.email,
      password: '', // Password is only for creation or if explicitly reset
      password_confirmation: '',
      mobile_number: staff.mobile_number || '',
      vehicle_type: staff.vehicle_type || '',
      cnic: staff.cnic || '',
      delivery_zone: staff.delivery_zone || '',
      staff_status: staff.staff_status || 'active',
    });
    setShowModal(true);
  };

  const handleViewRider = async (rider) => {
    setSelectedStaff(rider);
    setShowDetailModal(true);
    setLoadingDetails(true);
    try {
      const res = await api.get(`/admin/staff/riders/${rider.id}`);
      setRiderStats(res.data.data.stats);
      setRecentDeliveries(res.data.data.recent_deliveries);
    } catch (error) {
      toast.error('Failed to fetch rider details');
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleDeleteStaff = async (id) => {
    if (!window.confirm('Are you sure you want to delete this staff member?')) return;
    try {
      await api.delete(`/admin/staff/${id}`);
      toast.success('Staff deleted successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete staff');
    }
  };

  const handleCnicChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').substring(0, 13);
    setFormData({ ...formData, cnic: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // CNIC Validation for riders
    if (activeTab === 'rider' && formData.cnic.length !== 13) {
      toast.error('CNIC must be exactly 13 digits');
      return;
    }

    try {
      setSubmitting(true);
      if (isEditing) {
        await api.put(`/admin/staff/${selectedStaff.id}`, formData);
        toast.success('Staff details updated!');
      } else {
        const endpoint = activeTab === 'support' ? '/admin/staff/support' : '/admin/staff/riders';
        await api.post(endpoint, formData);
        toast.success(`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} account created!`);
      }
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (error) {
      const message = error.response?.data?.message || 'Validation failed';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      mobile_number: '',
      vehicle_type: '',
      cnic: '',
      delivery_zone: '',
      staff_status: 'active',
    });
    setIsEditing(false);
    setSelectedStaff(null);
    setShowPassword(false);
  };

  const StatCard = ({ title, value, icon: Icon, colorClass }) => (
    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center space-x-6">
      <div className={`w-14 h-14 rounded-2xl ${colorClass} bg-opacity-10 flex items-center justify-center`}>
        <Icon className={`w-7 h-7 ${colorClass.replace('bg-', 'text-')}`} />
      </div>
      <div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{title}</p>
        <p className="text-2xl font-black text-[#0F172A]">{loading ? '...' : value}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-[#0F172A]">Staff Management</h1>
          <p className="text-gray-500 font-bold">Manage support agents and delivery riders</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center space-x-2 bg-[#F97316] text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-[#F97316]/20 hover:bg-[#ea6a0f] transition-all transform hover:-translate-y-1"
        >
          <UserPlus className="w-5 h-5" />
          <span>Add New {activeTab === 'support' ? 'Agent' : 'Rider'}</span>
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Support" value={metrics?.total_support || 0} icon={ShieldCheck} colorClass="bg-blue-500" />
        <StatCard title="Active Support" value={metrics?.active_support || 0} icon={Activity} colorClass="bg-green-500" />
        <StatCard title="Total Riders" value={metrics?.total_riders || 0} icon={Truck} colorClass="bg-purple-500" />
        <StatCard title="Active Riders" value={metrics?.active_riders || 0} icon={CheckCircle} colorClass="bg-orange-500" />
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-gray-100 rounded-2xl w-fit">
        <button 
          onClick={() => setActiveTab('support')}
          className={`px-8 py-3 rounded-xl font-black text-sm transition-all ${activeTab === 'support' ? 'bg-white text-[#F97316] shadow-sm' : 'text-gray-500 hover:text-[#0F172A]'}`}
        >
          Support Staff
        </button>
        <button 
          onClick={() => setActiveTab('rider')}
          className={`px-8 py-3 rounded-xl font-black text-sm transition-all ${activeTab === 'rider' ? 'bg-white text-[#F97316] shadow-sm' : 'text-gray-500 hover:text-[#0F172A]'}`}
        >
          Delivery Riders
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Name / Email</th>
                {activeTab === 'rider' && (
                  <>
                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Vehicle / Zone</th>
                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact / CNIC</th>
                  </>
                )}
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-8 py-20 text-center text-gray-400 font-bold">
                    <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4 text-[#F97316]" />
                    Loading staff data...
                  </td>
                </tr>
              ) : (activeTab === 'support' ? supportStaff : riders).length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-8 py-20 text-center text-gray-400 font-bold">No staff members found</td>
                </tr>
              ) : (activeTab === 'support' ? supportStaff : riders).map((staff) => (
                <tr key={staff.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#0F172A] flex items-center justify-center text-white font-black">
                        {staff.name[0]}
                      </div>
                      <div>
                        <p className="font-black text-[#0F172A]">{staff.name}</p>
                        <p className="text-xs text-gray-400 font-bold">{staff.email}</p>
                      </div>
                    </div>
                  </td>
                  {activeTab === 'rider' && (
                    <>
                      <td className="px-8 py-6">
                        <p className="text-sm font-black text-[#0F172A]">{staff.vehicle_type}</p>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{staff.delivery_zone}</p>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-xs font-bold text-gray-600 flex items-center">
                          <Phone className="w-3 h-3 mr-2" /> {staff.mobile_number}
                        </p>
                        <p className="text-[10px] text-gray-400 font-bold mt-1">CNIC: {staff.cnic || 'N/A'}</p>
                      </td>
                    </>
                  )}
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${staff.staff_status === 'active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      {staff.staff_status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {activeTab === 'rider' && (
                        <button 
                          onClick={() => handleViewRider(staff)}
                          className="p-2 text-gray-400 hover:text-[#0F172A] hover:bg-white rounded-xl transition-all"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      )}
                      <button 
                        onClick={() => handleEditClick(staff)}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                        title="Edit Details"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleToggleStatus(staff.id)}
                        className={`p-2 rounded-xl transition-all ${staff.staff_status === 'active' ? 'text-red-500 hover:bg-red-50' : 'text-green-500 hover:bg-green-50'}`}
                        title={staff.staff_status === 'active' ? 'Disable Account' : 'Enable Account'}
                      >
                        {staff.staff_status === 'active' ? <XCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                      </button>
                      <button 
                        onClick={() => handleDeleteStaff(staff.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        title="Delete Account"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Staff Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-10">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-black text-[#0F172A]">{isEditing ? 'Edit' : 'Add New'} {activeTab === 'support' ? 'Support Agent' : 'Delivery Rider'}</h3>
                  <p className="text-gray-400 font-bold">{isEditing ? 'Update existing staff details' : 'Create an internal staff account'}</p>
                </div>
                <button onClick={() => setShowModal(false)} className="p-3 hover:bg-gray-100 rounded-2xl transition-all">
                  <XCircle className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input 
                        required
                        type="text" 
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-4 focus:ring-orange-500/10 font-bold transition-all"
                        placeholder="e.g. John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input 
                        required
                        type="email" 
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-4 focus:ring-orange-500/10 font-bold transition-all"
                        placeholder="staff@shoppro.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>

                  {!isEditing && (
                    <>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Password</label>
                        <div className="relative">
                          <input 
                            required={!isEditing}
                            type={showPassword ? "text" : "password"} 
                            className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-4 focus:ring-orange-500/10 font-bold transition-all"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                          />
                          <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0F172A]"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Confirm Password</label>
                        <input 
                          required={!isEditing}
                          type={showPassword ? "text" : "password"} 
                          className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-4 focus:ring-orange-500/10 font-bold transition-all"
                          placeholder="••••••••"
                          value={formData.password_confirmation}
                          onChange={(e) => setFormData({...formData, password_confirmation: e.target.value})}
                        />
                      </div>
                    </>
                  )}

                  {isEditing && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Staff Status</label>
                      <select 
                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-4 focus:ring-orange-500/10 font-bold transition-all"
                        value={formData.staff_status}
                        onChange={(e) => setFormData({...formData, staff_status: e.target.value})}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  )}

                  {activeTab === 'rider' && (
                    <>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Phone Number</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input 
                            required
                            type="text" 
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-4 focus:ring-orange-500/10 font-bold transition-all"
                            placeholder="+92 300 1234567"
                            value={formData.mobile_number}
                            onChange={(e) => setFormData({...formData, mobile_number: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Vehicle Type</label>
                        <div className="relative">
                          <Truck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input 
                            required
                            type="text" 
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-4 focus:ring-orange-500/10 font-bold transition-all"
                            placeholder="e.g. Bike, Pickup"
                            value={formData.vehicle_type}
                            onChange={(e) => setFormData({...formData, vehicle_type: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">CNIC (13 Digits)</label>
                        <div className="relative">
                          <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input 
                            required
                            type="text" 
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-4 focus:ring-orange-500/10 font-bold transition-all"
                            placeholder="e.g. 4210112345678"
                            value={formData.cnic}
                            onChange={handleCnicChange}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Delivery Zone</label>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input 
                            required
                            type="text" 
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-4 focus:ring-orange-500/10 font-bold transition-all"
                            placeholder="e.g. Karachi South"
                            value={formData.delivery_zone}
                            onChange={(e) => setFormData({...formData, delivery_zone: e.target.value})}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="pt-6 flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-8 py-4 rounded-2xl font-black bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    disabled={submitting}
                    type="submit"
                    className="flex-1 px-8 py-4 rounded-2xl font-black bg-[#F97316] text-white shadow-xl shadow-[#F97316]/20 hover:bg-[#ea6a0f] transition-all flex items-center justify-center"
                  >
                    {submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : `${isEditing ? 'Update' : 'Create'} ${activeTab === 'support' ? 'Agent' : 'Rider'}`}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* Rider Detail Modal */}
      {showDetailModal && selectedStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="relative h-40 bg-[#0F172A]">
              <button 
                onClick={() => { setShowDetailModal(false); setRiderStats(null); }}
                className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute -bottom-12 left-10 flex items-end space-x-6">
                <div className="w-28 h-28 rounded-[2rem] bg-white p-2 shadow-2xl">
                    <div className="w-full h-full rounded-[1.5rem] bg-[#F97316] flex items-center justify-center text-white text-3xl font-black uppercase">
                        {selectedStaff.name[0]}
                    </div>
                </div>
                <div className="pb-4">
                    <h3 className="text-3xl font-black text-white drop-shadow-sm">{selectedStaff.name}</h3>
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest inline-block mt-2 ${selectedStaff.staff_status === 'active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        {selectedStaff.staff_status}
                    </span>
                </div>
              </div>
            </div>
            
            <div className="p-10 pt-16 space-y-8 max-h-[70vh] overflow-y-auto">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                      <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Contact Number</p>
                          <p className="font-black text-[#0F172A] flex items-center">
                              <Phone className="w-4 h-4 mr-2 text-[#F97316]" /> {selectedStaff.mobile_number}
                          </p>
                      </div>
                      <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Email Address</p>
                          <p className="font-bold text-gray-600">{selectedStaff.email}</p>
                      </div>
                      <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">CNIC Number</p>
                          <p className="font-bold text-gray-600 flex items-center">
                              <CreditCard className="w-4 h-4 mr-2 text-gray-400" /> {selectedStaff.cnic || 'N/A'}
                          </p>
                      </div>
                  </div>
                  <div className="space-y-4">
                      <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Vehicle Type</p>
                          <p className="font-black text-[#0F172A] flex items-center">
                              <Truck className="w-4 h-4 mr-2 text-blue-500" /> {selectedStaff.vehicle_type}
                          </p>
                      </div>
                      <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Delivery Zone</p>
                          <p className="font-black text-[#0F172A] flex items-center">
                              <MapPin className="w-4 h-4 mr-2 text-orange-500" /> {selectedStaff.delivery_zone}
                          </p>
                      </div>
                  </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-4 gap-4">
                  {[
                      { label: 'Total', value: riderStats?.total_assigned || 0, icon: ShoppingBag, bg: '#F1F5F9', color: '#0F172A' },
                      { label: 'Delivered', value: riderStats?.delivered_count || 0, icon: CheckCircle, bg: '#D1FAE5', color: '#059669' },
                      { label: 'Processing', value: riderStats?.processing_count || 0, icon: Package, bg: '#FEF3C7', color: '#D97706' },
                      { label: 'Pending', value: riderStats?.pending_count || 0, icon: Clock, bg: '#FEE2E2', color: '#991B1B' },
                  ].map((stat, i) => (
                      <div key={i} className="p-4 rounded-[1.5rem] border border-gray-100 bg-white shadow-sm flex flex-col items-center text-center space-y-2">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: stat.bg, color: stat.color }}>
                              <stat.icon className="w-5 h-5" />
                          </div>
                          <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                          <h4 className="text-lg font-black text-[#0F172A]">{loadingDetails ? '...' : stat.value}</h4>
                      </div>
                  ))}
              </div>

              {/* Recent Deliveries */}
              <div className="space-y-4">
                <h4 className="text-sm font-black text-[#0F172A] uppercase tracking-widest">Recent Deliveries</h4>
                <div className="space-y-3">
                  {loadingDetails ? (
                    <div className="flex items-center justify-center py-10">
                      <Loader2 className="w-8 h-8 animate-spin text-[#F97316]" />
                    </div>
                  ) : recentDeliveries.length === 0 ? (
                    <p className="text-center py-10 text-gray-400 font-bold bg-gray-50 rounded-3xl">No deliveries recorded yet</p>
                  ) : recentDeliveries.map((delivery) => (
                    <div key={delivery.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                          <ShoppingBag className="w-5 h-5 text-gray-400" />
                        </div>
                        <div>
                          <p className="font-black text-sm text-[#0F172A]">{delivery.order_number}</p>
                          <p className="text-[10px] text-gray-400 font-bold">{delivery.customer_name} • {delivery.assigned_at}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-sm text-[#0F172A]">PKR {parseFloat(delivery.grand_total).toLocaleString()}</p>
                        <span className={`text-[9px] font-black uppercase tracking-widest ${delivery.status === 'delivered' ? 'text-green-500' : 'text-orange-500'}`}>
                          {delivery.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <button 
                  onClick={() => setShowDetailModal(false)}
                  className="w-full px-8 py-4 rounded-2xl font-black bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
                >
                  Close Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
