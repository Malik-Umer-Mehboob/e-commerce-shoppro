import { useState, useEffect } from 'react';
import { 
  Plus, Package, Tag, Percent, CreditCard, 
  Calendar, Pencil, Trash2, Ticket, Users, BarChart3, X
} from 'lucide-react';
import { discountService } from '../../services/discountService';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

export default function Discounts() {
  const [discounts, setDiscounts] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [couponsLoading, setCouponsLoading] = useState(true);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [couponForm, setCouponForm] = useState({
    code: '',
    type: 'percentage',
    value: '',
    minimum_order_amount: '',
    max_uses: '',
    per_user_limit: 1,
    expires_at: '',
    is_active: true,
  });

  useEffect(() => {
    fetchDiscounts();
    fetchCoupons();
  }, []);

  const fetchDiscounts = async () => {
    try {
      setLoading(true);
      const response = await discountService.getDiscounts();
      setDiscounts(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch discounts');
    } finally {
      setLoading(false);
    }
  };

  const fetchCoupons = async () => {
    try {
      setCouponsLoading(true);
      const response = await api.get('/admin/coupons');
      setCoupons(response.data.data || []);
    } catch {
      setCoupons([]);
    } finally {
      setCouponsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this discount?')) {
      try {
        await discountService.deleteDiscount(id);
        toast.success('Discount deleted');
        fetchDiscounts();
      } catch (error) {
        toast.error('Failed to delete discount');
      }
    }
  };

  const handleCouponSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...couponForm,
        max_uses: couponForm.max_uses ? parseInt(couponForm.max_uses) : null,
        per_user_limit: parseInt(couponForm.per_user_limit) || 1,
        value: parseFloat(couponForm.value),
        minimum_order_amount: parseFloat(couponForm.minimum_order_amount) || 0,
      };
      await api.post('/admin/coupons', payload);
      toast.success('Coupon created successfully');
      setShowCouponModal(false);
      setCouponForm({ code: '', type: 'percentage', value: '', minimum_order_amount: '', max_uses: '', per_user_limit: 1, expires_at: '', is_active: true });
      fetchCoupons();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create coupon');
    }
  };

  const handleDeleteCoupon = async (id) => {
    if (window.confirm('Delete this coupon?')) {
      try {
        await api.delete(`/admin/coupons/${id}`);
        toast.success('Coupon deleted');
        fetchCoupons();
      } catch {
        toast.error('Failed to delete coupon');
      }
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      {/* --- Product Discounts Section --- */}
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-[#0F172A]">Discounts & Offers</h1>
            <p className="text-gray-500 font-medium">Manage your promotional codes and store-wide sales.</p>
          </div>
          <button 
            onClick={() => toast.success('Discount creation modal would open here')}
            className="bg-[#0F172A] text-white px-6 py-3 rounded-2xl font-black flex items-center space-x-2 shadow-xl shadow-[#0F172A]/20 hover:bg-black transition-all transform hover:-translate-y-1"
          >
            <Plus className="w-5 h-5" />
            <span>Add Discount</span>
          </button>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Discount Info</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Applied To</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Value</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Validity</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 border-4 border-[#F97316] border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading discounts...</p>
                      </div>
                    </td>
                  </tr>
                ) : discounts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-8 py-20 text-center">
                      <Tag className="w-16 h-16 text-gray-100 mx-auto mb-4" />
                      <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No discounts found</p>
                    </td>
                  </tr>
                ) : discounts.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div>
                        <p className="font-black text-[#0F172A]">{d.name}</p>
                        <span className="text-[10px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-black uppercase tracking-widest">{d.badge_text || 'Sale'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      {d.product ? (
                        <div className="flex items-center space-x-2">
                          <Package className="w-4 h-4 text-[#F97316]" />
                          <span className="text-sm font-bold text-gray-600">{d.product.name}</span>
                        </div>
                      ) : d.category ? (
                        <div className="flex items-center space-x-2">
                          <Tag className="w-4 h-4 text-[#F97316]" />
                          <span className="text-sm font-bold text-gray-600">{d.category.name}</span>
                        </div>
                      ) : (
                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest italic">Entire Store</span>
                      )}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-1 font-black text-[#0F172A]">
                        {d.type === 'percentage' ? <Percent className="w-4 h-4 text-[#F97316]" /> : <CreditCard className="w-4 h-4 text-[#F97316]" />}
                        <span>{d.value}{d.type === 'percentage' ? '%' : ' Rs.'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          <span>Starts: {d.starts_at ? new Date(d.starts_at).toLocaleDateString() : 'Now'}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          <span>Ends: {d.ends_at ? new Date(d.ends_at).toLocaleDateString() : 'Forever'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      {d.is_active ? (
                        <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full bg-green-100 text-green-700">Active</span>
                      ) : (
                        <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full bg-gray-100 text-gray-400">Inactive</span>
                      )}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                          <Pencil className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleDelete(d.id)} className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- Coupon Codes Section --- */}
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-[#0F172A]">Coupon Codes</h2>
            <p className="text-gray-500 font-medium">Manage per-user and global usage limits for coupon codes.</p>
          </div>
          <button
            onClick={() => setShowCouponModal(true)}
            className="bg-[#F97316] text-white px-6 py-3 rounded-2xl font-black flex items-center space-x-2 shadow-xl shadow-orange-500/20 hover:bg-orange-600 transition-all transform hover:-translate-y-1"
          >
            <Plus className="w-5 h-5" />
            <span>Add Coupon</span>
          </button>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Code</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Value</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Min. Order</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Usage</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Expires</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {couponsLoading ? (
                  <tr>
                    <td colSpan="7" className="px-8 py-20 text-center">
                      <div className="w-12 h-12 border-4 border-[#F97316] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading coupons...</p>
                    </td>
                  </tr>
                ) : coupons.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-8 py-20 text-center">
                      <Ticket className="w-16 h-16 text-gray-100 mx-auto mb-4" />
                      <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No coupons found</p>
                    </td>
                  </tr>
                ) : coupons.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <span className="font-black text-[#0F172A] bg-slate-100 px-3 py-1 rounded-lg tracking-widest text-sm">{c.code}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-1 font-black text-[#0F172A]">
                        {c.type === 'percentage' ? <Percent className="w-4 h-4 text-[#F97316]" /> : <CreditCard className="w-4 h-4 text-[#F97316]" />}
                        <span>{c.value}{c.type === 'percentage' ? '%' : ' Rs.'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm font-bold text-gray-600">
                        {c.minimum_order_amount > 0 ? `Rs. ${c.minimum_order_amount}` : 'None'}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <BarChart3 className="w-3.5 h-3.5 text-[#F97316]" />
                          <span className="text-sm font-bold text-[#0F172A]">
                            {c.used_count ?? 0} / {c.max_uses ?? '∞'} used
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            Limit: {c.per_user_limit ?? 1}x per user
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm font-bold text-gray-600">
                        {c.expires_at ? new Date(c.expires_at).toLocaleDateString() : 'Never'}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      {c.is_active ? (
                        <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full bg-green-100 text-green-700">Active</span>
                      ) : (
                        <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full bg-gray-100 text-gray-400">Inactive</span>
                      )}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-end space-x-2">
                        <button onClick={() => handleDeleteCoupon(c.id)} className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- Add Coupon Modal --- */}
      {showCouponModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-y-auto max-h-[90vh]">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black text-[#0F172A]">Create Coupon</h3>
                <button onClick={() => setShowCouponModal(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleCouponSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Coupon Code</label>
                  <input
                    required
                    value={couponForm.code}
                    onChange={e => setCouponForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                    placeholder="e.g. SAVE20"
                    className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-black text-[#0F172A] tracking-widest focus:ring-2 focus:ring-orange-500/20 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Type</label>
                    <select
                      value={couponForm.type}
                      onChange={e => setCouponForm(f => ({ ...f, type: e.target.value }))}
                      className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-bold text-[#0F172A] focus:ring-2 focus:ring-orange-500/20 outline-none"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (Rs.)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Value</label>
                    <input
                      required
                      type="number"
                      min="0"
                      step="0.01"
                      value={couponForm.value}
                      onChange={e => setCouponForm(f => ({ ...f, value: e.target.value }))}
                      placeholder={couponForm.type === 'percentage' ? '10' : '500'}
                      className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-bold text-[#0F172A] focus:ring-2 focus:ring-orange-500/20 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Minimum Order Amount (Rs.)</label>
                  <input
                    type="number"
                    min="0"
                    value={couponForm.minimum_order_amount}
                    onChange={e => setCouponForm(f => ({ ...f, minimum_order_amount: e.target.value }))}
                    placeholder="Leave empty for no minimum"
                    className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-bold text-[#0F172A] focus:ring-2 focus:ring-orange-500/20 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Total Usage Limit</label>
                    <input
                      type="number"
                      min="1"
                      value={couponForm.max_uses}
                      onChange={e => setCouponForm(f => ({ ...f, max_uses: e.target.value }))}
                      placeholder="Leave empty for unlimited"
                      className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-bold text-[#0F172A] focus:ring-2 focus:ring-orange-500/20 outline-none"
                    />
                    <p className="text-[10px] text-gray-400 font-bold mt-1.5 ml-1">Maximum total uses across all users</p>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Per User Limit</label>
                    <input
                      type="number"
                      min="1"
                      value={couponForm.per_user_limit}
                      onChange={e => setCouponForm(f => ({ ...f, per_user_limit: e.target.value }))}
                      className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-bold text-[#0F172A] focus:ring-2 focus:ring-orange-500/20 outline-none"
                    />
                    <p className="text-[10px] text-gray-400 font-bold mt-1.5 ml-1">How many times one user can use this</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Expiry Date (Optional)</label>
                  <input
                    type="datetime-local"
                    value={couponForm.expires_at}
                    onChange={e => setCouponForm(f => ({ ...f, expires_at: e.target.value }))}
                    className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-bold text-[#0F172A] focus:ring-2 focus:ring-orange-500/20 outline-none"
                  />
                </div>

                <div className="flex items-center space-x-3 pt-2">
                  <input
                    type="checkbox"
                    id="coupon-active"
                    checked={couponForm.is_active}
                    onChange={e => setCouponForm(f => ({ ...f, is_active: e.target.checked }))}
                    className="w-5 h-5 accent-orange-500"
                  />
                  <label htmlFor="coupon-active" className="text-sm font-bold text-[#0F172A]">Active (can be used immediately)</label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCouponModal(false)}
                    className="flex-1 py-4 rounded-2xl border-2 border-slate-200 font-black text-gray-600 hover:bg-slate-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-4 rounded-2xl bg-[#F97316] text-white font-black hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20"
                  >
                    Create Coupon
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
