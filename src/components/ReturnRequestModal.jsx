import { useState, useEffect } from 'react';
import { 
  X, 
  AlertCircle, 
  Package, 
  Upload, 
  Loader2 
} from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-hot-toast';

export default function ReturnRequestModal({ isOpen, onClose, onSuccess }) {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    order_id: '',
    reason: '',
    description: ''
  });

  useEffect(() => {
    if (isOpen) {
      fetchDeliveredOrders();
      setFormData({ order_id: '', reason: '', description: '' });
    }
  }, [isOpen]);

  const fetchDeliveredOrders = async () => {
    try {
      setLoadingOrders(true);
      // Let's assume order endpoint can return all orders or we filter on frontend
      // In a real app we might have a specific endpoint or query param
      const response = await api.get('/orders');
      if (response.data?.success) {
        const delivered = (response.data.data.data || response.data.data || []).filter(o => o.status === 'delivered');
        setOrders(delivered);
      }
    } catch (error) {
      
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.order_id || !formData.reason) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      const response = await api.post('/returns', formData);
      if (response.data?.success) {
        toast.success('Return request submitted!');
        onSuccess && onSuccess();
        onClose();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit return request');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-[2rem] shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-black text-[#0F172A]">Request a Return</h2>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-6 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-bold">Return Policy</p>
              <p className="mt-1">Items can only be returned within 14 days of delivery. Once approved, you will receive instructions on how to ship the item back.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Select Order *</label>
              <div className="relative">
                <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select 
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-[#F97316]/20 outline-none transition-all appearance-none cursor-pointer"
                  value={formData.order_id}
                  onChange={(e) => setFormData({ ...formData, order_id: e.target.value })}
                  required
                >
                  <option value="">Select a delivered order...</option>
                  {loadingOrders ? (
                    <option disabled>Loading orders...</option>
                  ) : orders.map(order => (
                    <option key={order.id} value={order.id}>
                      Order {order.order_number} - {new Date(order.created_at).toLocaleDateString()}
                    </option>
                  ))}
                </select>
              </div>
              {orders.length === 0 && !loadingOrders && (
                <p className="text-xs font-bold text-red-500 mt-1 ml-1">You have no eligible delivered orders for return.</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Reason for Return *</label>
              <select 
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-[#F97316]/20 outline-none transition-all appearance-none cursor-pointer"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                required
              >
                <option value="">Select a reason...</option>
                <option value="defective">Defective Product</option>
                <option value="wrong_item">Wrong Item Received</option>
                <option value="not_as_described">Not as Described</option>
                <option value="changed_mind">Changed My Mind</option>
                <option value="damaged_in_shipping">Damaged in Shipping</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Additional Details</label>
              <textarea 
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#F97316]/20 outline-none transition-all resize-none"
                placeholder="Please provide more details about the issue..."
                rows="4"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                maxLength={1000}
              ></textarea>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-end space-x-3">
              <button 
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:text-[#0F172A] transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={submitting || orders.length === 0}
                className="px-6 py-2.5 bg-[#F97316] text-white rounded-xl font-bold text-sm shadow-lg shadow-[#F97316]/20 hover:bg-[#ea580c] transition-all disabled:opacity-50 flex items-center"
              >
                {submitting ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</>
                ) : (
                  'Submit Request'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
