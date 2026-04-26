import { useState, useEffect } from 'react';
import { RefreshCcw, Search, Filter, CheckCircle, XCircle, AlertCircle, DollarSign, Package } from 'lucide-react';
import api from '../../services/api';
import AdminLayout from '../../components/layout/AdminLayout';
import toast from 'react-hot-toast';

export default function AdminReturns() {
  const [returns, setReturns] = useState([]);
  const [stats, setStats] = useState({ pending: 0, approved: 0, refunded: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  // Modals state
  const [approvalModal, setApprovalModal] = useState({ isOpen: false, requestId: null });
  const [rejectionModal, setRejectionModal] = useState({ isOpen: false, requestId: null });
  
  const [approvalData, setApprovalData] = useState({ refund_type: 'original_payment', refund_amount: '', admin_notes: '' });
  const [rejectionData, setRejectionData] = useState({ admin_notes: '' });

  useEffect(() => {
    fetchReturns();
  }, [filter]);

  const fetchReturns = async () => {
    try {
      setLoading(true);
      const query = filter !== 'all' ? `?status=${filter}` : '';
      const response = await api.get(`/admin/returns${query}`);
      
      if (response.data?.success) {
        setReturns(response.data.data.returns || response.data.data);
        if (response.data.data.stats) {
          setStats(response.data.data.stats);
        }
      }
    } catch (error) {
      toast.error('Failed to fetch returns');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(`/admin/returns/${approvalModal.requestId}/approve`, approvalData);
      if (response.data?.success) {
        toast.success('Return request approved');
        setApprovalModal({ isOpen: false, requestId: null });
        fetchReturns();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to approve request');
    }
  };

  const handleReject = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(`/admin/returns/${rejectionModal.requestId}/reject`, rejectionData);
      if (response.data?.success) {
        toast.success('Return request rejected');
        setRejectionModal({ isOpen: false, requestId: null });
        fetchReturns();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject request');
    }
  };

  const handleMarkRefunded = async (id) => {
    if (!window.confirm('Are you sure you want to mark this return as refunded? This will update the order payment status.')) return;
    
    try {
      const response = await api.post(`/admin/returns/${id}/refund`);
      if (response.data?.success) {
        toast.success('Return marked as refunded');
        fetchReturns();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to mark refunded');
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending': return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-black uppercase tracking-widest rounded-full">Pending</span>;
      case 'approved': return <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-black uppercase tracking-widest rounded-full">Approved</span>;
      case 'rejected': return <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-black uppercase tracking-widest rounded-full">Rejected</span>;
      case 'refunded': return <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-black uppercase tracking-widest rounded-full">Refunded</span>;
      case 'picked_up': return <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-black uppercase tracking-widest rounded-full">Picked Up</span>;
      default: return <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-black uppercase tracking-widest rounded-full">{status}</span>;
    }
  };

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Return Requests</h1>
            <p className="text-slate-500 font-medium">Manage and process customer RMAs</p>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-500">Pending</p>
                <p className="text-3xl font-black text-amber-600 mt-1">{stats.pending || 0}</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
                <AlertCircle size={24} />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-500">Approved</p>
                <p className="text-3xl font-black text-blue-600 mt-1">{stats.approved || 0}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                <CheckCircle size={24} />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-500">Refunded</p>
                <p className="text-3xl font-black text-emerald-600 mt-1">{stats.refunded || 0}</p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                <DollarSign size={24} />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-500">Rejected</p>
                <p className="text-3xl font-black text-rose-600 mt-1">{stats.rejected || 0}</p>
              </div>
              <div className="p-3 bg-rose-50 rounded-xl text-rose-600">
                <XCircle size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50">
            <div className="flex items-center gap-2">
              <Filter className="text-slate-400" size={20} />
              <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)}
                className="bg-white border border-slate-300 text-slate-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 font-medium"
              >
                <option value="all">All Returns</option>
                <option value="pending">Pending Review</option>
                <option value="approved">Approved</option>
                <option value="refunded">Refunded</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input 
                type="text" 
                placeholder="Search orders..." 
                className="bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 p-2.5 font-medium"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-500">
              <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                <tr>
                  <th className="px-6 py-4 font-black">Order / Customer</th>
                  <th className="px-6 py-4 font-black">Item & Reason</th>
                  <th className="px-6 py-4 font-black">Status</th>
                  <th className="px-6 py-4 font-black">Date</th>
                  <th className="px-6 py-4 font-black text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                      </div>
                    </td>
                  </tr>
                ) : returns.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-slate-500 font-medium">
                      No return requests found.
                    </td>
                  </tr>
                ) : (
                  returns.map((req) => (
                    <tr key={req.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">Order #{req.order_number || req.order?.order_number || req.order_id}</div>
                        <div className="text-xs text-slate-500 mt-1">{req.user?.name || `User #${req.user_id}`}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-2 max-w-xs">
                          <Package className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-slate-700 capitalize">{req.reason.replace('_', ' ')}</span>
                            {req.description && (
                              <p className="text-xs text-slate-500 mt-1 truncate" title={req.description}>
                                "{req.description}"
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(req.status)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-slate-600">{new Date(req.created_at).toLocaleDateString()}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {req.status === 'pending' && (
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => {
                                setApprovalData({...approvalData, refund_amount: req.order?.grand_total || ''});
                                setApprovalModal({ isOpen: true, requestId: req.id });
                              }}
                              className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg font-bold text-xs hover:bg-indigo-100 transition-colors border border-indigo-200"
                            >
                              Approve
                            </button>
                            <button 
                              onClick={() => setRejectionModal({ isOpen: true, requestId: req.id })}
                              className="px-3 py-1.5 bg-rose-50 text-rose-700 rounded-lg font-bold text-xs hover:bg-rose-100 transition-colors border border-rose-200"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                        {req.status === 'approved' && (
                          <button 
                            onClick={() => handleMarkRefunded(req.id)}
                            className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg font-bold text-xs hover:bg-emerald-100 transition-colors border border-emerald-200"
                          >
                            Mark Refunded
                          </button>
                        )}
                        {(req.status === 'refunded' || req.status === 'rejected') && (
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Resolved</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Approval Modal */}
      {approvalModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-xl font-black text-slate-900">Approve Return</h3>
              <p className="text-sm text-slate-500 mt-1">Specify refund details for this return.</p>
            </div>
            <form onSubmit={handleApprove} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Refund Type</label>
                <select 
                  required
                  className="w-full border border-slate-300 rounded-xl px-4 py-2.5 font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={approvalData.refund_type}
                  onChange={(e) => setApprovalData({...approvalData, refund_type: e.target.value})}
                >
                  <option value="original_payment">Original Payment</option>
                  <option value="store_credit">Store Credit</option>
                  <option value="replacement">Replacement Item</option>
                </select>
              </div>
              {approvalData.refund_type !== 'replacement' && (
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Refund Amount</label>
                  <input 
                    type="number" 
                    step="0.01"
                    required
                    className="w-full border border-slate-300 rounded-xl px-4 py-2.5 font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={approvalData.refund_amount}
                    onChange={(e) => setApprovalData({...approvalData, refund_amount: e.target.value})}
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Admin Notes (Optional)</label>
                <textarea 
                  className="w-full border border-slate-300 rounded-xl px-4 py-2.5 font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  rows="3"
                  value={approvalData.admin_notes}
                  onChange={(e) => setApprovalData({...approvalData, admin_notes: e.target.value})}
                  placeholder="Notes for the customer..."
                ></textarea>
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setApprovalModal({isOpen: false, requestId: null})}
                  className="flex-1 px-4 py-2.5 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-md"
                >
                  Confirm Approval
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {rejectionModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-xl font-black text-rose-600 flex items-center gap-2">
                <AlertCircle size={24} /> Reject Return
              </h3>
              <p className="text-sm text-slate-500 mt-1">Please provide a reason for rejecting this return.</p>
            </div>
            <form onSubmit={handleReject} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Rejection Reason</label>
                <textarea 
                  required
                  className="w-full border border-slate-300 rounded-xl px-4 py-2.5 font-medium text-slate-700 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                  rows="4"
                  value={rejectionData.admin_notes}
                  onChange={(e) => setRejectionData({...rejectionData, admin_notes: e.target.value})}
                  placeholder="Explain why the return was rejected..."
                ></textarea>
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setRejectionModal({isOpen: false, requestId: null})}
                  className="flex-1 px-4 py-2.5 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2.5 rounded-xl font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-md"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
