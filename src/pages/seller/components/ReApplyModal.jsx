import { useState, useEffect } from 'react';
import { X, Store, FileText, Briefcase, Tags, Loader2, AlertCircle } from 'lucide-react';
import api from '../../../services/api';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { updateUser } from '../../../store/authSlice';

export default function ReApplyModal({ isOpen, onClose, user }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    store_name: user?.store_name || '',
    store_description: user?.store_description || '',
    business_type: user?.business_type || '',
    categories: []
  });

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get('/categories');
      const fetched = response.data?.data?.categories || [];
      setCategories(fetched);
    } catch (error) {
      console.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryToggle = (catId) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(catId)
        ? prev.categories.filter(id => id !== catId)
        : [...prev.categories, catId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.categories.length === 0) {
      toast.error('Please select at least one category');
      return;
    }

    try {
      setSubmitting(true);
      const response = await api.post('/seller/profile/re-apply', formData);
      if (response.data?.success) {
        toast.success('Application re-submitted successfully!');
        dispatch(updateUser({ 
          seller_status: 'pending', 
          rejection_reason: null,
          ...response.data.data 
        }));
        onClose();
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to resubmit application';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
        <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-[#0F172A] text-white">
          <div>
            <h2 className="text-2xl font-black">Re-Apply as Seller</h2>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-1">Update your information and resubmit</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto custom-scrollbar">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Store Name</label>
                <div className="relative">
                  <Store className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input 
                    required
                    type="text" 
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-4 focus:ring-orange-500/10 font-bold transition-all"
                    placeholder="e.g. My Awesome Shop"
                    value={formData.store_name}
                    onChange={(e) => setFormData({...formData, store_name: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Business Type</label>
                <div className="relative">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select 
                    required
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-4 focus:ring-orange-500/10 font-bold transition-all appearance-none"
                    value={formData.business_type}
                    onChange={(e) => setFormData({...formData, business_type: e.target.value})}
                  >
                    <option value="">Select Type</option>
                    <option value="Individual">Individual</option>
                    <option value="Registered Business">Registered Business</option>
                    <option value="Brand/Manufacturer">Brand/Manufacturer</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Store Description</label>
              <div className="relative">
                <FileText className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
                <textarea 
                  required
                  rows="3"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-4 focus:ring-orange-500/10 font-bold transition-all resize-none"
                  placeholder="Tell us about your store..."
                  value={formData.store_description}
                  onChange={(e) => setFormData({...formData, store_description: e.target.value})}
                ></textarea>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Select Categories</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {loading ? (
                  <div className="col-span-full py-10 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-[#F97316] mx-auto" />
                  </div>
                ) : categories.map(cat => (
                  <label key={cat.id} className={`flex items-center p-3 rounded-2xl border-2 transition-all cursor-pointer ${formData.categories.includes(cat.id) ? 'border-[#F97316] bg-[#F97316]/5' : 'border-gray-50 bg-gray-50 hover:border-gray-100'}`}>
                    <input 
                      type="checkbox" 
                      className="hidden"
                      checked={formData.categories.includes(cat.id)}
                      onChange={() => handleCategoryToggle(cat.id)}
                    />
                    <span className={`text-[10px] font-black uppercase tracking-widest ${formData.categories.includes(cat.id) ? 'text-[#F97316]' : 'text-gray-500'}`}>
                      {cat.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6 flex gap-4 sticky bottom-0 bg-white">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 px-8 py-4 rounded-2xl font-black bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
            >
              Cancel
            </button>
            <button 
              disabled={submitting}
              type="submit"
              className="flex-1 px-8 py-4 rounded-2xl font-black bg-[#F97316] text-white shadow-xl shadow-[#F97316]/20 hover:bg-[#ea6a0f] transition-all flex items-center justify-center"
            >
              {submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Resubmit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
