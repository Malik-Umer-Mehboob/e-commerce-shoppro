import { useState, useEffect } from 'react';
import { 
  Store, 
  Search, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  User, 
  Eye, 
  Loader2,
  X,
  Clock,
  Briefcase,
  Tags,
  ChevronRight,
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Package,
  Trash2,
  ShieldAlert
} from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

export default function SellerManagement() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    status: ''
  });
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  // Modal states
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [sellerStats, setSellerStats] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchSellers();
    fetchCategories();
  }, [page, filters.status]);

  const fetchSellers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/sellers', { 
        params: { 
            search: filters.search,
            status: filters.status,
            page 
        } 
      });
      setSellers(response.data?.data?.data || []);
      setLastPage(response.data?.data?.last_page || 1);
    } catch (error) {
      toast.error('Failed to fetch sellers');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      // The API returns { success: true, data: { categories: [...] } }
      const fetched = response.data?.data?.categories || response.data?.data || [];
      setCategories(Array.isArray(fetched) ? fetched : []);
    } catch (error) {
      console.error('Failed to fetch categories');
      setCategories([]);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    let rejectionReason = null;
    
    if (status === 'rejected') {
      rejectionReason = window.prompt('Please provide a reason for rejection:');
      if (rejectionReason === null) return; // User cancelled
      if (!rejectionReason.trim()) {
        toast.error('Rejection reason is required');
        return;
      }
    }

    try {
      setUpdating(true);
      await api.patch(`/admin/sellers/${id}/status`, { 
        status,
        rejection_reason: rejectionReason 
      });
      toast.success(`Seller status updated to ${status}`);
      fetchSellers();
      if (selectedSeller?.id === id) {
          setShowDetailModal(false);
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update status';
      toast.error(message);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteSeller = async (force = false) => {
    if (!selectedSeller) return;
    try {
      setDeleting(true);
      await api.delete(`/admin/sellers/${selectedSeller.id}`, { 
        data: { force } 
      });
      toast.success(`Seller ${force ? 'permanently deleted' : 'soft deleted'}`);
      setShowDeleteModal(false);
      setSelectedSeller(null);
      fetchSellers();
    } catch (error) {
      toast.error('Failed to delete seller');
    } finally {
      setDeleting(false);
    }
  };

  const handleUpdateCategories = async (categories) => {
    try {
      setUpdating(true);
      await api.patch(`/admin/sellers/${selectedSeller.id}/categories`, { categories });
      toast.success('Categories updated successfully');
      setShowCategoryModal(false);
      fetchSellers();
    } catch (error) {
      toast.error('Failed to update categories');
    } finally {
      setUpdating(false);
    }
  };

  const viewDetails = async (seller) => {
    setSelectedSeller(seller);
    setShowDetailModal(true);
    try {
        const response = await api.get(`/admin/sellers/${seller.id}`);
        setSellerStats(response.data?.data?.stats);
    } catch (error) {
        console.error('Failed to fetch seller stats');
    }
  };

  const getStatusBadgeStyle = (status) => {
    switch(status?.toLowerCase()) {
        case 'approved':
            return { backgroundColor: '#D1FAE5', color: '#065F46' };
        case 'pending':
            return { backgroundColor: '#FEF3C7', color: '#92400E' };
        case 'rejected':
            return { backgroundColor: '#FEE2E2', color: '#991B1B' };
        case 'suspended':
            return { backgroundColor: '#F1F5F9', color: '#475569' };
        default:
            return { backgroundColor: '#F1F5F9', color: '#475569' };
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#0F172A]">Seller Management</h1>
          <p className="text-gray-500 font-medium">Approve and manage marketplace vendors</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text"
              placeholder="Search by store name, owner or email..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-orange-500/10 outline-none transition-all font-bold"
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
              onKeyPress={(e) => e.key === 'Enter' && fetchSellers()}
            />
          </div>
          <div className="grid grid-cols-2 lg:flex gap-4">
            <select 
              className="px-4 py-3 rounded-xl bg-gray-50 border-none outline-none font-bold text-gray-600 min-w-[140px]"
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="suspended">Suspended</option>
            </select>
            <button 
              onClick={() => { setPage(1); fetchSellers(); }}
              className="bg-[#F97316] text-white px-8 py-3 rounded-xl font-black shadow-lg shadow-[#F97316]/20 hover:bg-[#ea6a0f] transition-all"
            >
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Sellers Table */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Store / Owner</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Categories</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Business Type</th>
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
                    <p className="text-gray-400 font-bold">Loading sellers...</p>
                  </td>
                </tr>
              ) : sellers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-8 py-20 text-center text-gray-400 font-bold">
                    No sellers found matching your filters.
                  </td>
                </tr>
              ) : (
                sellers.map((seller) => (
                  <tr key={seller.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#0F172A] p-0.5 shadow-sm">
                           {seller.store_logo ? (
                               <img src={seller.store_logo} alt={seller.store_name} className="w-full h-full object-cover rounded-[0.9rem]" />
                           ) : (
                               <div className="w-full h-full rounded-[0.9rem] bg-[#F97316] flex items-center justify-center text-white font-black text-xs uppercase">
                                   {seller.store_name?.substring(0, 2)}
                               </div>
                           )}
                        </div>
                        <div>
                          <div className="font-black text-[#0F172A] leading-tight">{seller.store_name}</div>
                          <div className="text-[10px] text-gray-400 font-bold flex items-center mt-1">
                              <User className="w-3 h-3 mr-1" /> {seller.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {seller.assigned_categories?.slice(0, 2).map(cat => (
                                <span key={cat.id} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-lg text-[9px] font-black uppercase tracking-widest whitespace-nowrap">
                                    {cat.name}
                                </span>
                            ))}
                            {seller.assigned_categories?.length > 2 && (
                                <span className="px-2 py-0.5 bg-[#F97316]/10 text-[#F97316] rounded-lg text-[9px] font-black uppercase tracking-widest">
                                    +{seller.assigned_categories.length - 2} More
                                </span>
                            )}
                            {(!seller.assigned_categories || seller.assigned_categories.length === 0) && (
                                <span className="text-gray-300 text-[10px] font-bold italic">No categories assigned</span>
                            )}
                        </div>
                    </td>
                    <td className="px-8 py-5">
                        <div className="flex items-center text-gray-500 font-bold text-xs">
                            <Briefcase className="w-3 h-3 mr-2 text-gray-400" />
                            {seller.business_type || 'N/A'}
                        </div>
                    </td>
                    <td className="px-8 py-5">
                      <span 
                        className="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest"
                        style={getStatusBadgeStyle(seller.seller_status)}
                      >
                        {seller.seller_status}
                      </span>
                    </td>
                    <td className="px-8 py-5 font-medium text-gray-400 text-xs">{new Date(seller.created_at).toLocaleDateString()}</td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => viewDetails(seller)}
                          className="p-2 text-gray-400 hover:text-[#0F172A] hover:bg-white rounded-lg transition-all"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        {seller.seller_status === 'pending' && (
                            <>
                                <button 
                                    onClick={() => handleUpdateStatus(seller.id, 'approved')}
                                    className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-all"
                                    title="Approve"
                                >
                                    <CheckCircle className="w-5 h-5" />
                                </button>
                                <button 
                                    onClick={() => handleUpdateStatus(seller.id, 'rejected')}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                    title="Reject"
                                >
                                    <XCircle className="w-5 h-5" />
                                </button>
                            </>
                        )}
                        {seller.seller_status === 'approved' && (
                             <button 
                                onClick={() => handleUpdateStatus(seller.id, 'suspended')}
                                className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all"
                                title="Suspend"
                            >
                                <AlertCircle className="w-5 h-5" />
                            </button>
                        )}
                        {seller.seller_status === 'suspended' && (
                             <button 
                                onClick={() => handleUpdateStatus(seller.id, 'approved')}
                                className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-all"
                                title="Unsuspend"
                            >
                                <CheckCircle className="w-5 h-5" />
                            </button>
                        )}
                        <button 
                            onClick={() => { setSelectedSeller(seller); setShowDeleteModal(true); }}
                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Delete Seller"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
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

      {/* Seller Detail Modal */}
      {showDetailModal && selectedSeller && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="relative h-40 bg-[#0F172A]">
              <button 
                onClick={() => { setShowDetailModal(false); setSellerStats(null); }}
                className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute -bottom-12 left-10 flex items-end space-x-6">
                <div className="w-28 h-28 rounded-[2rem] bg-white p-2 shadow-2xl">
                    <div className="w-full h-full rounded-[1.5rem] bg-[#F97316] flex items-center justify-center text-white text-3xl font-black uppercase">
                        {selectedSeller.store_logo ? (
                            <img src={selectedSeller.store_logo} alt={selectedSeller.store_name} className="w-full h-full object-cover rounded-[1.5rem]" />
                        ) : (
                            selectedSeller.store_name?.substring(0, 2)
                        )}
                    </div>
                </div>
                <div className="pb-4">
                    <h3 className="text-3xl font-black text-white drop-shadow-sm">{selectedSeller.store_name}</h3>
                    <span 
                        className="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest inline-block mt-2"
                        style={getStatusBadgeStyle(selectedSeller.seller_status)}
                    >
                        {selectedSeller.seller_status}
                    </span>
                </div>
              </div>
            </div>
            
            <div className="p-10 pt-16 space-y-8 max-h-[70vh] overflow-y-auto">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                      <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Owner Name</p>
                          <p className="font-black text-[#0F172A] flex items-center">
                              <User className="w-4 h-4 mr-2 text-[#F97316]" /> {selectedSeller.name}
                          </p>
                      </div>
                      <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Email Address</p>
                          <p className="font-bold text-gray-600">{selectedSeller.email}</p>
                      </div>
                      <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Business Type</p>
                          <p className="font-bold text-gray-600 flex items-center">
                              <Briefcase className="w-4 h-4 mr-2 text-gray-400" /> {selectedSeller.business_type || 'N/A'}
                          </p>
                      </div>
                  </div>
                  <div className="space-y-4">
                      <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Store Description</p>
                          <p className="text-sm text-gray-500 font-medium leading-relaxed italic line-clamp-3">
                              "{selectedSeller.store_description || 'No description provided'}"
                          </p>
                      </div>
                      <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Assigned Categories</p>
                          <div className="flex flex-wrap gap-2">
                              {selectedSeller.assigned_categories?.map(cat => (
                                  <span key={cat.id} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-xl text-[10px] font-black uppercase tracking-widest">
                                      {cat.name}
                                  </span>
                              ))}
                              <button 
                                onClick={() => setShowCategoryModal(true)}
                                className="px-3 py-1 border-2 border-dashed border-gray-200 text-gray-400 hover:border-[#F97316] hover:text-[#F97316] rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                              >
                                + Edit
                              </button>
                          </div>
                      </div>
                  </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-6">
                  {[
                      { label: 'Products', value: sellerStats?.total_products || 0, icon: Package, bg: '#F1F5F9', color: '#0F172A' },
                      { label: 'Total Orders', value: sellerStats?.total_orders || 0, icon: ShoppingBag, bg: '#FEF3C7', color: '#D97706' },
                      { label: 'Total Revenue', value: `PKR ${parseFloat(sellerStats?.total_revenue || 0).toLocaleString()}`, icon: DollarSign, bg: '#D1FAE5', color: '#059669' },
                  ].map((stat, i) => (
                      <div key={i} className="p-4 rounded-[1.5rem] border border-gray-100 bg-white shadow-sm flex flex-col items-center text-center space-y-2">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: stat.bg, color: stat.color }}>
                              <stat.icon className="w-5 h-5" />
                          </div>
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                          <h4 className="text-lg font-black text-[#0F172A]">{stat.value}</h4>
                      </div>
                  ))}
              </div>

              {/* Action Buttons */}
              <div className="pt-8 border-t border-gray-100 flex gap-4">
                  {selectedSeller.seller_status === 'pending' ? (
                      <>
                        <button 
                            disabled={updating}
                            onClick={() => handleUpdateStatus(selectedSeller.id, 'rejected')}
                            className="flex-1 px-6 py-4 rounded-2xl font-black bg-red-50 text-red-500 hover:bg-red-100 transition-all flex items-center justify-center"
                        >
                            {updating ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : 'Reject Application'}
                        </button>
                        <button 
                            disabled={updating}
                            onClick={() => handleUpdateStatus(selectedSeller.id, 'approved')}
                            className="flex-1 px-6 py-4 rounded-2xl font-black bg-[#F97316] text-white shadow-xl shadow-[#F97316]/20 hover:bg-[#ea6a0f] transition-all flex items-center justify-center"
                        >
                            {updating ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : 'Approve Seller'}
                        </button>
                      </>
                  ) : (
                      <button 
                        onClick={() => setShowDetailModal(false)}
                        className="w-full px-6 py-4 rounded-2xl font-black bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
                      >
                        Close
                      </button>
                  )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category Selection Modal */}
      {showCategoryModal && selectedSeller && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
             <div className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="p-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-black text-[#0F172A]">Edit Categories</h3>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">For {selectedSeller.store_name}</p>
                        </div>
                        <button onClick={() => setShowCategoryModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-all">
                            <X className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto p-2">
                        {Array.isArray(categories) && categories.map(cat => {
                            const isSelected = selectedSeller.assigned_categories?.some(c => c.id === cat.id);
                            return (
                                <label key={cat.id} className={`flex items-center p-3 rounded-2xl border-2 transition-all cursor-pointer ${isSelected ? 'border-[#F97316] bg-[#F97316]/5' : 'border-gray-50 bg-gray-50/50 hover:border-gray-200'}`}>
                                    <input 
                                        type="checkbox" 
                                        className="hidden"
                                        checked={isSelected}
                                        onChange={(e) => {
                                            const current = selectedSeller.assigned_categories || [];
                                            const updated = e.target.checked 
                                                ? [...current, cat]
                                                : current.filter(c => c.id !== cat.id);
                                            setSelectedSeller({...selectedSeller, assigned_categories: updated});
                                        }}
                                    />
                                    <span className={`text-xs font-black uppercase tracking-widest ${isSelected ? 'text-[#F97316]' : 'text-gray-500'}`}>
                                        {cat.name}
                                    </span>
                                </label>
                            );
                        })}
                    </div>

                    <div className="flex gap-4">
                        <button 
                            onClick={() => setShowCategoryModal(false)}
                            className="flex-1 px-6 py-4 rounded-2xl font-black bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
                        >
                            Cancel
                        </button>
                        <button 
                            disabled={updating}
                            onClick={() => handleUpdateCategories(selectedSeller.assigned_categories.map(c => c.id))}
                            className="flex-1 px-6 py-4 rounded-2xl font-black bg-[#F97316] text-white shadow-xl shadow-[#F97316]/20 hover:bg-[#ea6a0f] transition-all flex items-center justify-center"
                        >
                            {updating ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : 'Save Changes'}
                        </button>
                    </div>
                </div>
             </div>
          </div>
      )}
      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedSeller && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
             <div className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="p-8 space-y-6">
                    <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto text-red-500">
                        <ShieldAlert className="w-10 h-10" />
                    </div>
                    
                    <div className="text-center">
                        <h3 className="text-2xl font-black text-[#0F172A]">Delete {selectedSeller.store_name}?</h3>
                        <p className="text-gray-500 font-medium mt-2">
                            Are you sure you want to remove this seller? This action will restrict their access to the platform.
                        </p>
                        <div className="mt-4 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                            <p className="text-[10px] text-amber-700 font-black uppercase tracking-widest flex items-center justify-center">
                                <AlertCircle className="w-3 h-3 mr-2" /> Warning: This action cannot be undone
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <button 
                            disabled={deleting}
                            onClick={() => handleDeleteSeller(false)}
                            className="w-full px-6 py-4 rounded-2xl font-black bg-red-50 text-red-600 hover:bg-red-100 transition-all flex items-center justify-center"
                        >
                            {deleting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : 'Soft Delete (Deactivate)'}
                        </button>
                        <button 
                            disabled={deleting}
                            onClick={() => {
                                if(window.confirm('PERMANENT DELETE: This will remove all seller data permanently. Continue?')) {
                                    handleDeleteSeller(true);
                                }
                            }}
                            className="w-full px-6 py-4 rounded-2xl font-black text-gray-400 hover:text-red-700 hover:bg-red-50 transition-all flex items-center justify-center text-xs"
                        >
                            Force Delete (Permanent)
                        </button>
                    </div>

                    <button 
                        onClick={() => setShowDeleteModal(false)}
                        className="w-full px-6 py-4 rounded-2xl font-black bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
                    >
                        Cancel
                    </button>
                </div>
             </div>
          </div>
      )}
    </div>
  );
}
