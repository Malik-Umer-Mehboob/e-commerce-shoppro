import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import { Package, Clock, Truck, CheckCircle, XCircle, RefreshCcw } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

export default function CustomerOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [cancellingId, setCancellingId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/user/orders');
      setOrders(response.data?.data?.data || response.data?.data || []);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (orderId) => {
    const result = await Swal.fire({
      title: 'Cancel Order?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, Cancel Order',
      cancelButtonText: 'Keep Order',
    });

    if (!result.isConfirmed) return;

    setCancellingId(orderId);
    try {
      const response = await api.post(`/orders/${orderId}/cancel`);
      toast.success(response.data?.message ?? 'Order cancelled successfully');
      setOrders((prev) => prev.map((order) =>
        order.id === orderId ? { ...order, status: 'cancelled' } : order
      ));
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Could not cancel order');
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending': return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold uppercase tracking-wider rounded-full">Pending</span>;
      case 'processing': return <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-full">Processing</span>;
      case 'shipped': return <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-wider rounded-full">Shipped</span>;
      case 'delivered': return <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider rounded-full">Delivered</span>;
      case 'cancelled': return <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider rounded-full">Cancelled</span>;
      default: return <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold uppercase tracking-wider rounded-full">{status}</span>;
    }
  };

  const getPaymentStatusBadge = (status) => {
    switch (status) {
      case 'pending': return <span className="px-2 py-1 bg-yellow-50 text-yellow-600 text-[10px] font-bold uppercase tracking-widest rounded-lg">Pending</span>;
      case 'paid': return <span className="px-2 py-1 bg-green-50 text-green-600 text-[10px] font-bold uppercase tracking-widest rounded-lg">Paid</span>;
      case 'refunded': return <span className="px-2 py-1 bg-purple-50 text-purple-600 text-[10px] font-bold uppercase tracking-widest rounded-lg">Refunded</span>;
      default: return <span className="px-2 py-1 bg-gray-50 text-gray-600 text-[10px] font-bold uppercase tracking-widest rounded-lg">{status}</span>;
    }
  };

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-[#0F172A]">My Orders</h1>
          <p className="text-gray-500 font-medium mt-1">Track, manage and return your orders</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F97316]"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] p-12 text-center border border-gray-100 shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-10 h-10 text-gray-300" />
            </div>
            <h2 className="text-xl font-black text-[#0F172A] mb-2">No orders yet</h2>
            <p className="text-gray-500 font-medium mb-8">Start shopping to see your orders here</p>
            <Link 
              to="/home" 
              className="inline-block px-8 py-3 bg-[#F97316] text-white rounded-xl font-bold text-sm shadow-lg shadow-[#F97316]/20 hover:bg-[#ea580c] transition-all"
            >
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const orderDate = new Date(order.created_at);
              const hoursSinceCreation = (new Date() - orderDate) / (1000 * 60 * 60);
              const canCancel = ['pending', 'processing'].includes(order.status) && hoursSinceCreation <= 24;

              return (
                <div key={order.id} className="bg-white rounded-[2rem] p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-start justify-between gap-6">
                  
                  <div className="space-y-4 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="px-3 py-1 bg-[#0F172A] text-white text-xs font-black rounded-lg">
                        #{order.order_number || String(order.id).padStart(4, '0')}
                      </span>
                      <span className="text-sm font-bold text-gray-400 flex items-center gap-1">
                        <Clock className="w-4 h-4" /> {orderDate.toLocaleDateString()}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-gray-50">
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</p>
                        {getStatusBadge(order.status)}
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Payment</p>
                        {getPaymentStatusBadge(order.payment_status)}
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Items</p>
                        <p className="font-bold text-[#0F172A]">{order.items_count || order.items?.length || 0} items</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total</p>
                        <p className="font-black text-[#F97316]">{formatPrice(order.grand_total)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 min-w-[200px] border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-8">
                    <Link 
                      to={`/customer/orders/${order.id}`}
                      className="w-full px-4 py-2 text-center text-sm font-bold text-gray-600 border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all"
                    >
                      View Details
                    </Link>

                    {canCancel && (
                      <div className="flex flex-col items-center">
                        <button
                          onClick={() => handleCancel(order.id)}
                          disabled={cancellingId === order.id}
                          className="w-full px-4 py-2 text-sm font-bold border-2 border-red-500 text-red-500 rounded-xl hover:bg-red-50 transition-colors disabled:opacity-50 cursor-pointer"
                        >
                          {cancellingId === order.id ? 'Cancelling...' : 'Cancel Order'}
                        </button>
                        <p className="text-[10px] font-bold text-gray-400 mt-2 text-center">
                          Cancel within 24 hours
                        </p>
                      </div>
                    )}

                    {order.status === 'delivered' && (
                      <button 
                        onClick={() => navigate('/returns')}
                        className="w-full px-4 py-2 text-sm font-bold border-2 border-blue-500 text-blue-500 rounded-xl hover:bg-blue-50 transition-colors cursor-pointer"
                      >
                        Request Return
                      </button>
                    )}

                    {order.status === 'shipped' && (
                      <div className="w-full px-4 py-2 text-sm font-bold bg-indigo-50 text-indigo-600 rounded-xl text-center">
                        <Truck className="w-4 h-4 inline mr-1" /> Track Order
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
