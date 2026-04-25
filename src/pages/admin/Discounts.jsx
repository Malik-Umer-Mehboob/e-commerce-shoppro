import { useState, useEffect } from 'react';
import { 
  Plus, Package, Tag, Percent, CreditCard, 
  Calendar, Pencil, Trash2 
} from 'lucide-react';
import { discountService } from '../../services/discountService';
import { toast } from 'react-hot-toast';

export default function Discounts() {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDiscounts();
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

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
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
  );
}
