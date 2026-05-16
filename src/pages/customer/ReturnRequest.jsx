import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RotateCcw, ChevronLeft, Package, CheckCircle2, AlertTriangle, Truck, Info } from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';



export default function ReturnRequest() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEligibleOrders();
  }, []);

  const fetchEligibleOrders = async () => {
    try {
      const response = await api.get('/user/orders/eligible-returns');
      // Backend now handles the filtering (delivered status + 30 day window)
      setOrders(response.data.data || []);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load orders');
      setLoading(false);
    }
  };

  const handleReturnRequest = async (e) => {
    e.preventDefault();
    if (!selectedOrder || !reason) return;

    setSubmitting(true);
    try {
      // In this system, a return request creates a ticket
      await api.post('/tickets', {
        subject: `Return Request for Order #${selectedOrder.id}`,
        message: `Reason for Return: ${reason}\n\nOrder Items:\n${selectedOrder.items.map(item => `- ${item.product?.name || 'Product'} x${item.quantity}`).join('\n')}`,
        category: 'Returns & Refunds',
        order_id: selectedOrder.id,
        priority: 'Medium'
      });

      toast.success('Return request submitted successfully!');
      navigate('/customer/tickets');
    } catch (error) {
      toast.error('Failed to submit return request');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="w-12 h-12 border-4 border-[#F97316] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate(-1)} className="inline-flex items-center text-gray-500 hover:text-[#F97316] mb-8 transition-colors group">
          <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100">
          <div className="bg-[#0F172A] p-10 text-white">
            <div className="flex items-center space-x-3 mb-2">
              <RotateCcw className="w-8 h-8 text-[#F97316]" />
              <h1 className="text-3xl font-extrabold">Return or Exchange</h1>
            </div>
            <p className="text-gray-400">Changed your mind? No problem. Initiate your return request below.</p>
          </div>

          <div className="p-8 md:p-12">
            {!selectedOrder ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-[#0F172A]">Select an eligible order</h2>
                  <div className="flex items-center text-xs font-bold text-gray-400 uppercase bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                    <Info className="w-3.5 h-3.5 mr-1.5" />
                    30-Day Return Window
                  </div>
                </div>

                {orders.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {orders.map((order) => (
                      <button
                        key={order.id}
                        onClick={() => setSelectedOrder(order)}
                        className="flex flex-col md:flex-row md:items-center justify-between p-6 rounded-2xl border border-gray-100 bg-white hover:border-[#F97316] hover:bg-[#F97316]/5 transition-all group text-left"
                      >
                        <div className="flex items-center space-x-4 mb-4 md:mb-0">
                          <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-[#F97316]/10 group-hover:text-[#F97316] transition-colors">
                            <Package className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="font-bold text-[#0F172A]">Order #{order.id}</p>
                            <p className="text-xs text-gray-500">Delivered on {new Date(order.updated_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between md:justify-end md:space-x-8">
                          <div className="text-right">
                            <p className="text-xs font-black text-[#F97316]">${order.grand_total}</p>
                            <p className="text-[10px] text-gray-400 uppercase font-bold">{order.total_items} items</p>
                          </div>
                          <div className="bg-[#0F172A] text-white p-2 rounded-xl group-hover:scale-110 transition-transform">
                            <ChevronLeft className="w-4 h-4 rotate-180" />
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-3xl p-16 text-center border border-dashed border-gray-200">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No eligible orders</h3>
                    <p className="text-gray-500 max-w-sm mx-auto mb-8">
                      Only orders delivered within the last 30 days are eligible for self-service returns.
                    </p>
                    <Link to="/help" className="text-[#F97316] font-bold hover:underline">Need help with an older order?</Link>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleReturnRequest} className="space-y-8">
                <div className="flex items-center justify-between border-b border-gray-100 pb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-[#F97316]/10 rounded-xl flex items-center justify-center text-[#F97316]">
                      <Package className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="font-bold text-gray-900">Requesting return for Order #{selectedOrder.id}</h2>
                      <button type="button" onClick={() => setSelectedOrder(null)} className="text-xs text-[#F97316] font-bold hover:underline">Change Order</button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-bold text-gray-700 block">Why are you returning this?</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      'Incorrect item received',
                      'Damaged or defective',
                      'Not as described',
                      'No longer needed',
                      'Better price elsewhere',
                      'Other'
                    ].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setReason(r)}
                        className={`p-4 rounded-xl text-left text-sm font-bold border-2 transition-all ${
                          reason === r ? 'border-[#F97316] bg-[#F97316]/5 text-[#F97316]' : 'border-gray-100 hover:border-gray-200 text-gray-600'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-bold text-gray-700 block">Additional Comments (Optional)</label>
                  <textarea
                    rows="4"
                    className="w-full px-4 py-4 rounded-2xl border border-gray-100 focus:border-[#F97316] outline-none transition-all resize-none bg-gray-50 focus:bg-white font-medium"
                    placeholder="Provide more details to speed up your request..."
                    value={reason.startsWith('Other') ? '' : reason} // Simplified logic
                    onChange={(e) => setReason(e.target.value)}
                  ></textarea>
                </div>

                <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-6 flex items-start space-x-4">
                  <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-bold mb-1">Return Policy Reminder</p>
                    <p>Items must be in original packaging and condition. Refunds are processed within 5-7 business days after we receive your return.</p>
                  </div>
                </div>

                <button
                  disabled={submitting || !reason}
                  className={`w-full flex items-center justify-center space-x-2 bg-[#F97316] text-white py-5 rounded-2xl font-black text-xl shadow-xl shadow-[#F97316]/20 hover:bg-[#ea6a0f] transition-all transform hover:-translate-y-1 active:translate-y-0 ${submitting || !reason ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {submitting ? (
                    <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <RotateCcw className="w-6 h-6" />
                      <span>Submit Return Request</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
