import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../../components/layout/Header';
import { 
  Package, 
  Truck, 
  Calendar, 
  CreditCard, 
  MapPin, 
  Clock, 
  XCircle,
  MessageSquare,
  ChevronLeft,
  Info
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [canCancel, setCanCancel] = useState(false);
  const [cancelInfo, setCancelInfo] = useState(null);

  useEffect(() => {
    fetchOrder();
    checkCancellation();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const response = await api.get(`/user/orders/${id}`);
      setOrder(response.data);
    } catch (error) {
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const checkCancellation = async () => {
    try {
      const response = await api.get(`/orders/${id}/can-cancel`);
      setCanCancel(response.data.data.can_cancel);
      setCancelInfo(response.data.data);
    } catch (error) {
      console.error('Error checking cancellation', error);
    }
  };

  const handleCancelOrder = async () => {
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

    try {
      await api.post(`/orders/${id}/cancel`);
      toast.success('Order cancelled successfully');
      fetchOrder();
      checkCancellation();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (!order) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-700';
      case 'processing': return 'bg-blue-100 text-blue-700';
      case 'shipped': return 'bg-indigo-100 text-indigo-700';
      case 'delivered': return 'bg-emerald-100 text-emerald-700';
      case 'cancelled': return 'bg-rose-100 text-rose-700';
      case 'returned': return 'bg-slate-100 text-slate-700';
      case 'refunded': return 'bg-purple-100 text-purple-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'text-emerald-600 font-bold';
      case 'pending': return 'text-amber-600 font-bold';
      case 'failed': return 'text-rose-600 font-bold';
      case 'refunded': return 'text-purple-600 font-bold';
      default: return 'text-slate-600 font-bold';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Navigation */}
        <Link to="/user/orders" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors mb-6 font-medium">
          <ChevronLeft size={20} /> Back to My Orders
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900">Order #{order.id}</h1>
            <div className="flex items-center gap-4 mt-2">
              <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
              <span className="text-slate-500 text-sm flex items-center gap-1">
                <Calendar size={14} /> {new Date(order.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            {canCancel ? (
              <button 
                onClick={handleCancelOrder}
                className="bg-rose-50 text-rose-600 hover:bg-rose-100 px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all border border-rose-100"
              >
                <XCircle size={18} /> Cancel Order
              </button>
            ) : (
              (order.status === 'shipped' || order.status === 'delivered') && (
                <Link 
                  to="/help/contact"
                  className="bg-slate-900 text-white hover:bg-black px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all"
                >
                  <MessageSquare size={18} /> Contact Support
                </Link>
              )
            )}
          </div>
        </div>

        {canCancel && cancelInfo && (
          <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl mb-8 flex items-start gap-3">
            <Info size={20} className="text-indigo-600 mt-0.5" />
            <div>
              <p className="text-indigo-900 font-bold">Cancellation Window Open</p>
              <p className="text-indigo-700 text-sm">You have <strong>{cancelInfo.hours_left} hours</strong> left to cancel this order yourself. After this window, please contact support.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="md:col-span-2 space-y-8">
            {/* Items */}
            <section className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                <Package className="text-indigo-600" size={24} />
                <h2 className="text-xl font-bold text-slate-900">Order Items</h2>
              </div>
              <div className="divide-y divide-slate-100">
                {order.items.map((item) => (
                  <div key={item.id} className="p-6 flex gap-4">
                    <div className="w-20 h-20 bg-slate-50 rounded-xl overflow-hidden flex-shrink-0 border border-slate-100">
                      <img src={item.product?.thumbnail || 'https://via.placeholder.com/150'} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900">{item.name}</h3>
                      <p className="text-sm text-slate-500 mt-1">Qty: {item.quantity} × Rs. {item.price}</p>
                      {item.variant && (
                        <p className="text-xs text-slate-400 mt-1">
                          {item.variant.size && `Size: ${item.variant.size}`}
                          {item.variant.color && ` • Color: ${item.variant.color}`}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900">Rs. {item.total}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-slate-50 p-6 space-y-3">
                <div className="flex justify-between text-slate-600 text-sm">
                  <span>Subtotal</span>
                  <span>Rs. {order.subtotal}</span>
                </div>
                <div className="flex justify-between text-slate-600 text-sm">
                  <span>Shipping</span>
                  <span>Rs. {order.shipping_cost}</span>
                </div>
                <div className="flex justify-between text-slate-600 text-sm">
                  <span>Tax</span>
                  <span>Rs. {order.tax}</span>
                </div>
                {parseFloat(order.discount) > 0 && (
                  <div className="flex justify-between text-emerald-600 text-sm font-medium">
                    <span>Discount</span>
                    <span>-Rs. {order.discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-900 font-black text-xl pt-3 border-t border-slate-200">
                  <span>Total</span>
                  <span className="text-indigo-600">Rs. {order.grand_total}</span>
                </div>
              </div>
            </section>

            {/* Tracking / Timeline Placeholder */}
            {order.tracking_number && (
              <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-indigo-100 p-2 rounded-xl text-indigo-600">
                    <Truck size={24} />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">Tracking Information</h2>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl flex justify-between items-center">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Tracking Number</p>
                    <p className="text-lg font-black text-slate-900 mt-1">{order.tracking_number}</p>
                  </div>
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all">
                    Track Now
                  </button>
                </div>
              </section>
            )}
          </div>

          {/* Sidebar Info */}
          <div className="space-y-8">
            {/* Delivery Address */}
            <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="text-indigo-600" size={20} />
                <h3 className="font-bold text-slate-900">Delivery Address</h3>
              </div>
              <div className="text-sm text-slate-600 leading-relaxed">
                <p className="font-bold text-slate-900 mb-1">{order.shipping_address.full_name}</p>
                <p>{order.shipping_address.address_line_1}</p>
                <p>{order.shipping_address.city}, {order.shipping_address.state}</p>
                <p>{order.shipping_address.postal_code}, {order.shipping_address.country}</p>
                <p className="mt-2 flex items-center gap-1 font-medium text-slate-900">
                  <Clock size={14} className="text-slate-400" /> {order.shipping_address.phone}
                </p>
              </div>
            </section>

            {/* Payment Info */}
            <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <CreditCard className="text-indigo-600" size={20} />
                <h3 className="font-bold text-slate-900">Payment Information</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Method:</span>
                  <span className="font-bold text-slate-900 uppercase">{order.payment_method?.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Status:</span>
                  <span className={`uppercase text-xs tracking-wider ${getPaymentStatusColor(order.payment_status)}`}>
                    {order.payment_status}
                  </span>
                </div>
                {order.payment_id && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Ref ID:</span>
                    <span className="font-mono text-xs text-slate-900">{order.payment_id}</span>
                  </div>
                )}
                {order.payment_notes && (
                  <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 italic">
                    "{order.payment_notes}"
                  </div>
                )}
              </div>
            </section>

            {/* Support Box */}
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 rounded-3xl shadow-lg text-white">
              <h3 className="font-bold mb-2">Need help with your order?</h3>
              <p className="text-indigo-100 text-sm mb-6">Our support team is available 24/7 to assist you with any issues.</p>
              <Link 
                to="/help" 
                className="block w-full bg-white text-indigo-600 text-center py-3 rounded-2xl font-bold hover:bg-indigo-50 transition-all shadow-md"
              >
                Help Center
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderDetail;
