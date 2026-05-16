import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  XCircle, 
  RefreshCcw,
  CreditCard,
  Truck,
  MoreVertical,
  Download
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [isRiderModalOpen, setIsRiderModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [riders, setRiders] = useState([]);
  const [assigning, setAssigning] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [page, status]);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const response = await api.get('/orders/export', {
        params: { status, search },
        responseType: 'blob',
        headers: {
          'Accept': 'text/csv'
        }
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const date = new Date().toISOString().split('T')[0];
      link.setAttribute('download', `orders-report-${date}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Export completed');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export CSV');
    } finally {
      setIsExporting(false);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get('/orders', {
        params: {
          page,
          status,
          search
        }
      });
      setOrders(response.data.data);
      setPagination(response.data);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkPaid = async (orderId) => {
    if (processingId) return;
    setProcessingId(orderId);
    try {
      await api.post(`/admin/orders/${orderId}/payment/mark-paid`);
      toast.success('Order marked as paid');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update payment status');
    } finally {
      setProcessingId(null);
    }
  };

  const handleRefund = async (orderId) => {
    const reason = window.prompt('Reason for refund:');
    if (reason === null) return;

    if (processingId) return;
    setProcessingId(orderId);
    try {
      await api.post(`/admin/orders/${orderId}/payment/refund`, { reason });
      toast.success('Refund processed');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to process refund');
    } finally {
      setProcessingId(null);
    }
  };

  const openRiderModal = async (orderId) => {
    setSelectedOrderId(orderId);
    setIsRiderModalOpen(true);
    try {
      const response = await api.get('/admin/riders');
      setRiders(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch riders');
    }
  };

  const handleAssignRider = async (riderId) => {
    try {
      setAssigning(true);
      await api.post(`/admin/orders/${selectedOrderId}/assign-rider`, { rider_id: riderId });
      toast.success('Order assigned to rider');
      setIsRiderModalOpen(false);
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to assign rider');
    } finally {
      setAssigning(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-amber-100 text-amber-700 border-amber-200',
      processing: 'bg-blue-100 text-blue-700 border-blue-200',
      shipped: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      delivered: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      cancelled: 'bg-rose-100 text-rose-700 border-rose-200',
      refunded: 'bg-purple-100 text-purple-700 border-purple-200'
    };
    return badges[status] || 'bg-slate-100 text-slate-700 border-slate-200';
  };

  const getPaymentBadge = (status) => {
    const badges = {
      paid: 'bg-emerald-500 text-white',
      pending: 'bg-amber-500 text-white',
      failed: 'bg-rose-500 text-white',
      refunded: 'bg-purple-500 text-white'
    };
    return badges[status] || 'bg-slate-500 text-white';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Order Management</h1>
          <p className="text-slate-500 text-sm">Monitor and manage customer orders, payments and shipping.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={18} className={isExporting ? 'animate-bounce' : ''} />
            {isExporting ? 'Exporting...' : 'Export CSV'}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search order ID or customer name..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchOrders()}
          />
        </div>

        <select 
          className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none text-sm font-medium focus:ring-2 focus:ring-indigo-500"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
          <option value="refunded">Refunded</option>
        </select>
        
        <button 
          onClick={fetchOrders}
          className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700 transition-all text-sm shadow-md"
        >
          Filter
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Order</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Payment</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="6" className="px-6 py-4 bg-slate-50/30"></td>
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">No orders found matching your criteria.</td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">#{order.id}</span>
                        <span className="text-xs text-slate-500">{new Date(order.created_at).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-700">{order.customer?.name || 'Guest'}</td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-indigo-600">Rs. {order.grand_total}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusBadge(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${getPaymentBadge(order.payment_status).split(' ')[0]}`}></span>
                        <span className="text-xs font-bold text-slate-700 uppercase">{order.payment_status}</span>
                        <span className="text-[10px] text-slate-400 font-medium">({order.payment_method})</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {order.payment_status === 'pending' && (
                          <button 
                            onClick={() => handleMarkPaid(order.id)}
                            disabled={processingId === order.id}
                            className={`p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors ${processingId === order.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                            title="Mark as Paid"
                          >
                            <CheckCircle size={18} className={processingId === order.id ? 'animate-spin' : ''} />
                          </button>
                        )}
                        {order.payment_status === 'paid' && (
                          <button 
                            onClick={() => handleRefund(order.id)}
                            disabled={processingId === order.id}
                            className={`p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors ${processingId === order.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                            title="Refund"
                          >
                            <RefreshCcw size={18} className={processingId === order.id ? 'animate-spin' : ''} />
                          </button>
                        )}
                        {(order.status === 'pending' || order.status === 'processing') && (
                          <button 
                            onClick={() => openRiderModal(order.id)}
                            className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                            title="Assign Rider"
                          >
                            <Truck size={18} />
                          </button>
                        )}
                        <Link 
                          to={`/orders/${order.id}`} // Admin detail route
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <Eye size={18} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.last_page > 1 && (
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
            <span className="text-xs text-slate-500 font-medium">Showing {orders.length} of {pagination.total} orders</span>
            <div className="flex gap-1">
              <button 
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-sm disabled:opacity-50"
              >
                Prev
              </button>
              <button 
                disabled={page === pagination.last_page}
                onClick={() => setPage(p => p + 1)}
                className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Rider Assignment Modal */}
      {isRiderModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-black text-slate-900">Assign Rider</h3>
                <button onClick={() => setIsRiderModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-all">
                  <XCircle size={24} className="text-slate-400" />
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-slate-500 text-sm font-medium">Select a rider to deliver order <span className="text-indigo-600 font-black">#{selectedOrderId}</span></p>
                
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  {riders.length === 0 ? (
                    <p className="text-center py-8 text-slate-400 font-bold">No riders available</p>
                  ) : (
                    riders.map(rider => (
                      <button
                        key={rider.id}
                        disabled={assigning}
                        onClick={() => handleAssignRider(rider.id)}
                        className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-indigo-500 hover:bg-indigo-50/50 transition-all group text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black">
                            {rider.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{rider.name}</p>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{rider.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${rider.active_deliveries > 0 ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                            {rider.active_deliveries} Active
                          </span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>

              <div className="mt-8">
                <button 
                  onClick={() => setIsRiderModalOpen(false)}
                  className="w-full py-4 rounded-2xl bg-slate-100 text-slate-500 font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
