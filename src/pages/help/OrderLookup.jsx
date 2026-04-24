import { useState } from 'react';
import { Search, Package, User, Mail, ChevronLeft, MapPin, Truck, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export default function OrderLookup() {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);

  const handleLookup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setOrder(null);

    try {
      const response = await axios.post(`${API_URL}/support/order-lookup`, {
        order_number: orderNumber,
        email: email
      });
      setOrder(response.data.data);
      toast.success('Order found!');
    } catch (error) {
      console.error('Order lookup error:', error);
      toast.error(error.response?.data?.message || 'Order not found. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link to="/help" className="inline-flex items-center text-gray-500 hover:text-[#F97316] mb-8 transition-colors group">
          <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
          Back to Help Center
        </Link>

        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100">
          <div className="bg-[#0F172A] p-10 text-white flex flex-col md:flex-row items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold mb-2">Track your order</h1>
              <p className="text-gray-400">Enter your order details to see real-time updates.</p>
            </div>
            <div className="mt-6 md:mt-0 bg-[#F97316]/10 p-4 rounded-2xl border border-[#F97316]/20">
              <Package className="w-12 h-12 text-[#F97316]" />
            </div>
          </div>

          {!order ? (
            <form onSubmit={handleLookup} className="p-8 md:p-12 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-700 block ml-1">Order Number</label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      required
                      type="text"
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-[#F97316]/10 focus:border-[#F97316] outline-none transition-all text-lg"
                      placeholder="e.g. 12345"
                      value={orderNumber}
                      onChange={(e) => setOrderNumber(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-700 block ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      required
                      type="email"
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-[#F97316]/10 focus:border-[#F97316] outline-none transition-all text-lg"
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <button
                disabled={loading}
                className={`w-full flex items-center justify-center space-x-2 bg-[#F97316] text-white py-5 rounded-2xl font-black text-xl shadow-xl shadow-[#F97316]/20 hover:bg-[#ea6a0f] transition-all transform hover:-translate-y-1 active:translate-y-0 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Search className="w-6 h-6" />
                    <span>Track Order Now</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="p-8 md:p-12 space-y-10">
              {/* Order Status Tracker */}
              <div className="relative flex justify-between items-center max-w-2xl mx-auto px-4 py-8">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 z-0"></div>
                <div className={`absolute top-1/2 left-0 h-1 bg-[#F97316] -translate-y-1/2 z-0 transition-all duration-1000`} 
                     style={{ width: order.status === 'delivered' ? '100%' : order.status === 'shipped' ? '66%' : order.status === 'processing' ? '33%' : '0%' }}></div>
                
                {[
                  { id: 'pending', label: 'Ordered', icon: Calendar },
                  { id: 'processing', label: 'Processing', icon: Package },
                  { id: 'shipped', label: 'Shipped', icon: Truck },
                  { id: 'delivered', label: 'Delivered', icon: MapPin },
                ].map((step, idx) => {
                  const isActive = ['pending', 'processing', 'shipped', 'delivered'].indexOf(order.status) >= idx;
                  return (
                    <div key={step.id} className="relative z-10 flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${isActive ? 'bg-[#F97316] text-white shadow-lg shadow-[#F97316]/30 scale-110' : 'bg-white border-2 border-gray-100 text-gray-300'}`}>
                        <step.icon className="w-6 h-6" />
                      </div>
                      <span className={`text-xs font-bold mt-3 uppercase tracking-wider ${isActive ? 'text-[#0F172A]' : 'text-gray-400'}`}>{step.label}</span>
                    </div>
                  );
                })}
              </div>

              {/* Order Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <h3 className="text-xl font-extrabold text-gray-900 flex items-center">
                    <Package className="w-6 h-6 mr-2 text-[#F97316]" />
                    Order Summary
                  </h3>
                  <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                    <div className="flex justify-between items-center text-sm font-medium">
                      <span className="text-gray-500">Order ID</span>
                      <span className="text-[#0F172A] font-mono">#{order.id}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-medium">
                      <span className="text-gray-500">Order Date</span>
                      <span className="text-[#0F172A]">{new Date(order.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-medium">
                      <span className="text-gray-500">Payment Status</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-black ${order.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {order.payment_status}
                      </span>
                    </div>
                    <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                      <span className="text-gray-900 font-bold">Grand Total</span>
                      <span className="text-2xl font-black text-[#F97316]">${order.grand_total}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-extrabold text-gray-900 flex items-center">
                    <MapPin className="w-6 h-6 mr-2 text-[#F97316]" />
                    Shipping Details
                  </h3>
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <div className="text-gray-600 space-y-1">
                      <p className="font-bold text-gray-900">{order.shipping_address?.first_name} {order.shipping_address?.last_name}</p>
                      <p>{order.shipping_address?.address_line1}</p>
                      <p>{order.shipping_address?.city}, {order.shipping_address?.state} {order.shipping_address?.postal_code}</p>
                      <p>{order.shipping_address?.country}</p>
                    </div>
                    {order.tracking_number && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <p className="text-xs font-black text-gray-400 uppercase mb-2">Tracking Number</p>
                        <div className="flex items-center space-x-2">
                          <span className="bg-white px-3 py-2 rounded-lg border border-gray-200 font-mono text-sm">{order.tracking_number}</span>
                          <button className="text-[#F97316] hover:underline text-sm font-bold">Copy</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-6">
                <h3 className="text-xl font-extrabold text-gray-900">Ordered Items</h3>
                <div className="space-y-4">
                  {order.items?.map((item) => (
                    <div key={item.id} className="flex items-center bg-white border border-gray-100 p-4 rounded-2xl hover:shadow-md transition-shadow">
                      <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                        <img 
                          src={item.product?.main_image || 'https://via.placeholder.com/150'} 
                          alt={item.product?.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <h4 className="font-bold text-gray-900">{item.product?.name}</h4>
                        <p className="text-xs text-gray-500">
                          {item.variant?.name ? `Variant: ${item.variant.name}` : 'Default Variant'} • Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-[#0F172A]">${item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-6">
                <button
                  onClick={() => setOrder(null)}
                  className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                >
                  Track Another Order
                </button>
                <Link
                  to="/help/contact"
                  className="flex-1 bg-[#0F172A] text-white py-4 rounded-xl font-bold hover:bg-black transition-colors text-center"
                >
                  Need Help with this Order?
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
