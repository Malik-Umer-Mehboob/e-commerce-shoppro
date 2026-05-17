import { useState, useEffect } from 'react';
import { 
  Users as UsersIcon, 
  Search, 
  Lock, 
  Unlock, 
  Eye, 
  UserCheck,
  UserX,
  ShoppingBag,
  Clock,
  Loader2,
  X,
  Store,
  Headphones,
  Truck,
  ShieldAlert
} from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    role: 'all',
    status: 'all'
  });
  const [stats, setStats] = useState({
    total: 0,
    customers: 0,
    sellers: 0,
    support: 0,
    riders: 0,
    blocked: 0
  });
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  // Modal states
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockReason, setBlockReason] = useState('');
  const [blocking, setBlocking] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/users', { 
        params: { 
            search: filters.search,
            role: filters.role,
            status: filters.status,
            page 
        } 
      });
      
      const userData = response.data?.data?.users;
      setUsers(userData?.data ?? []);
      setLastPage(userData?.last_page ?? 1);
      
      setStats(response.data?.data?.stats ?? {
        total: 0,
        customers: 0,
        sellers: 0,
        support: 0,
        riders: 0,
        blocked: 0,
      });
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    setPage(1);
    fetchUsers();
  };

  const handleBlockUser = async () => {
    if (!selectedUser) return;
    try {
      setBlocking(true);
      await api.post(`/admin/users/${selectedUser.id}/block`, { reason: blockReason });
      toast.success(`${selectedUser.name} has been blocked`);
      setShowBlockModal(false);
      setBlockReason('');
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to block user');
    } finally {
      setBlocking(false);
    }
  };

  const handleUnblockUser = async (user) => {
    if (!window.confirm(`Are you sure you want to unblock ${user.name}?`)) return;
    try {
      await api.post(`/admin/users/${user.id}/unblock`);
      toast.success(`${user.name} has been unblocked`);
      fetchUsers();
    } catch (error) {
      toast.error('Failed to unblock user');
    }
  };

  const getRoleBadgeStyle = (role) => {
    switch(role?.toLowerCase()) {
        case 'admin':
            return { backgroundColor: '#FEE2E2', color: '#991B1B' };
        case 'seller':
            return { backgroundColor: '#FED7AA', color: '#9A3412' };
        case 'customer':
            return { backgroundColor: '#DBEAFE', color: '#1E40AF' };
        case 'support':
            return { backgroundColor: '#EDE9FE', color: '#5B21B6' };
        case 'rider':
            return { backgroundColor: '#D1FAE5', color: '#065F46' };
        default:
            return { backgroundColor: '#F1F5F9', color: '#475569' };
    }
  };

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || 'U';
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#0F172A]">User Management</h1>
          <p className="text-gray-500 font-medium">Manage all registered users and their access</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
        {[
          { label: 'Total Users', value: stats.total ?? 0, icon: UsersIcon, color: '#0F172A', bg: '#F1F5F9' },
          { label: 'Customers', value: stats.customers ?? 0, icon: ShoppingBag, color: '#1E40AF', bg: '#DBEAFE' },
          { label: 'Sellers', value: stats.sellers ?? 0, icon: Store, color: '#F97316', bg: '#FED7AA' },
          { label: 'Support', value: stats.support ?? 0, icon: Headphones, color: '#5B21B6', bg: '#EDE9FE' },
          { label: 'Riders', value: stats.riders ?? 0, icon: Truck, color: '#065F46', bg: '#D1FAE5' },
          { label: 'Blocked', value: stats.blocked ?? 0, icon: UserX, color: '#EF4444', bg: '#FEE2E2' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col xl:flex-row items-center xl:space-x-3 space-y-3 xl:space-y-0 text-center xl:text-left">
            <div 
                className="p-3 rounded-2xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: stat.bg, color: stat.color }}
            >
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-tight mb-1">{stat.label}</p>
              <h4 className="text-xl font-black text-[#0F172A] leading-tight">{stat.value}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text"
              name="search"
              placeholder="Search by name or email..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-bold"
              value={filters.search}
              onChange={handleFilterChange}
            />
          </div>
          <div className="grid grid-cols-2 lg:flex gap-4">
            <select 
              name="role"
              className="px-4 py-3 rounded-xl bg-gray-50 border-none outline-none font-bold text-gray-600 min-w-[140px]"
              value={filters.role}
              onChange={handleFilterChange}
            >
              <option value="all">All Roles</option>
              <option value="customer">Customer</option>
              <option value="seller">Seller</option>
              <option value="support">Support</option>
              <option value="rider">Rider</option>
            </select>
            <select 
              name="status"
              className="px-4 py-3 rounded-xl bg-gray-50 border-none outline-none font-bold text-gray-600 min-w-[140px]"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
            </select>
            <button 
              onClick={applyFilters}
              className="bg-[#F97316] text-white px-8 py-3 rounded-xl font-black shadow-lg shadow-[#F97316]/20 hover:bg-[#ea6a0f] transition-all"
            >
              Apply
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">User</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Email</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Role</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Joined</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-8 py-20 text-center">
                    <Loader2 className="w-10 h-10 animate-spin text-[#F97316] mx-auto mb-4" />
                    <p className="text-gray-400 font-bold">Loading users...</p>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-8 py-20 text-center text-gray-400 font-bold">
                    No users found matching your filters.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#0F172A] flex items-center justify-center text-white font-black text-sm">
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                          ) : (
                            getInitials(user.name)
                          )}
                        </div>
                        <span className="font-bold text-[#0F172A]">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 font-medium text-gray-500">{user.email}</td>
                    <td className="px-8 py-5">
                      <span 
                        className="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest"
                        style={getRoleBadgeStyle(user.role)}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      {user.is_blocked ? (
                        <span className="flex items-center text-red-500 font-black text-[10px] uppercase tracking-widest">
                          <Lock className="w-3 h-3 mr-1.5" />
                          Blocked
                        </span>
                      ) : (
                        <span className="flex items-center text-green-500 font-black text-[10px] uppercase tracking-widest">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                          Active
                        </span>
                      )}
                    </td>
                    <td className="px-8 py-5 font-medium text-gray-400">{user.created_at}</td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => {
                            setSelectedUser(user);
                            setShowDetailModal(true);
                          }}
                          className="p-2 text-gray-400 hover:text-[#0F172A] hover:bg-white rounded-lg transition-all"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        {user.is_blocked ? (
                          <button 
                            onClick={() => handleUnblockUser(user)}
                            className="p-2 text-green-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                          >
                            <Unlock className="w-5 h-5" />
                          </button>
                        ) : (
                          <button 
                            onClick={() => {
                              setSelectedUser(user);
                              setShowBlockModal(true);
                            }}
                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Lock className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {lastPage > 1 && (
          <div className="px-8 py-6 border-t border-gray-50 flex items-center justify-between">
            <button 
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="px-4 py-2 rounded-xl border border-gray-200 font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-all"
            >
              Previous
            </button>
            <span className="font-black text-[10px] text-gray-400 uppercase tracking-widest">
              Page {page} of {lastPage}
            </span>
            <button 
              disabled={page === lastPage}
              onClick={() => setPage(p => p + 1)}
              className="px-4 py-2 rounded-xl border border-gray-200 font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-all"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* User Detail Modal */}
      {showDetailModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="relative h-32 bg-[#0F172A]">
              <button 
                onClick={() => setShowDetailModal(false)}
                className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute -bottom-10 left-8">
                <div className="w-24 h-24 rounded-[2rem] bg-white p-2 shadow-xl">
                  <div className="w-full h-full rounded-[1.5rem] bg-[#F97316] flex items-center justify-center text-white text-2xl font-black">
                    {selectedUser.avatar ? (
                      <img src={selectedUser.avatar} alt={selectedUser.name} className="w-full h-full object-cover rounded-[1.5rem]" />
                    ) : (
                      getInitials(selectedUser.name)
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-8 pt-14 space-y-6">
              <div>
                <h3 className="text-2xl font-black text-[#0F172A]">{selectedUser.name}</h3>
                <p className="text-gray-500 font-medium">{selectedUser.email}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-2xl">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Role</p>
                  <span 
                    className="px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest"
                    style={getRoleBadgeStyle(selectedUser.role)}
                  >
                    {selectedUser.role}
                  </span>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Joined</p>
                  <p className="font-bold text-[#0F172A]">{selectedUser.created_at}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Orders</p>
                  <div className="flex items-center text-[#F97316]">
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    <span className="font-bold text-[#0F172A]">{selectedUser.total_orders ?? 0}</span>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</p>
                  {selectedUser.is_blocked ? (
                    <span className="text-red-500 font-black text-[9px] uppercase tracking-widest flex items-center">
                      <Lock className="w-3 h-3 mr-1" /> Blocked
                    </span>
                  ) : (
                    <span className="text-green-500 font-black text-[9px] uppercase tracking-widest flex items-center">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></div> Active
                    </span>
                  )}
                </div>
              </div>

              {selectedUser.is_blocked && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl">
                  <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1">Block Reason</p>
                  <p className="text-red-600 font-bold text-sm italic">"{selectedUser.block_reason}"</p>
                  <p className="text-[9px] text-red-400 mt-2 font-medium flex items-center">
                    <Clock className="w-3 h-3 mr-1" /> {selectedUser.blocked_at}
                  </p>
                </div>
              )}

              <div className="pt-4 border-t border-gray-50 flex gap-4">
                <button 
                  onClick={() => setShowDetailModal(false)}
                  className="flex-1 px-6 py-4 rounded-2xl font-black bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
                >
                  Close
                </button>
                {selectedUser.is_blocked ? (
                  <button 
                    onClick={() => {
                      setShowDetailModal(false);
                      handleUnblockUser(selectedUser);
                    }}
                    className="flex-1 px-6 py-4 rounded-2xl font-black bg-green-500 text-white shadow-lg shadow-green-500/20 hover:bg-green-600 transition-all"
                  >
                    Unblock User
                  </button>
                ) : (
                  <button 
                    onClick={() => {
                      setShowDetailModal(false);
                      setShowBlockModal(true);
                    }}
                    className="flex-1 px-6 py-4 rounded-2xl font-black bg-red-500 text-white shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all"
                  >
                    Block User
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Block Reason Modal */}
      {showBlockModal && selectedUser && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-md rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-8 space-y-6">
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto text-red-500">
                <ShieldAlert className="w-8 h-8" />
              </div>
              
              <div className="text-center">
                <h3 className="text-xl font-black text-[#0F172A]">Block {selectedUser.name}?</h3>
                <p className="text-gray-500 font-medium mt-2">
                  The user will be logged out from all devices and will not be able to log in until unblocked.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Reason for blocking</label>
                <textarea 
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-red-500/10 outline-none transition-all font-bold min-h-[100px]"
                  placeholder="E.g. Fraudulent activity, policy violation..."
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                />
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setShowBlockModal(false)}
                  className="flex-1 px-6 py-4 rounded-2xl font-black bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleBlockUser}
                  disabled={blocking}
                  className="flex-1 px-6 py-4 rounded-2xl font-black bg-red-500 text-white shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all flex items-center justify-center"
                >
                  {blocking ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : 'Confirm Block'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
