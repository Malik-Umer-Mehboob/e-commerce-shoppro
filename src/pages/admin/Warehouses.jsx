import { useState, useEffect } from 'react';
import { 
  Warehouse as WarehouseIcon, 
  MapPin, 
  Phone, 
  User, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Package,
  XCircle,
  Loader2,
  Check
} from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

export default function Warehouses() {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [stockData, setStockData] = useState([]);
  const [stockLoading, setStockLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    address: '',
    manager_name: '',
    phone: ''
  });

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/warehouses');
      setWarehouses(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch warehouses');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/warehouses', formData);
      toast.success('Warehouse created successfully');
      setIsAddModalOpen(false);
      setFormData({ name: '', location: '', address: '', manager_name: '', phone: '' });
      fetchWarehouses();
    } catch (error) {
      toast.error('Failed to create warehouse');
    }
  };

  const openStockModal = async (warehouse) => {
    setSelectedWarehouse(warehouse);
    setIsStockModalOpen(true);
    try {
      setStockLoading(true);
      const response = await api.get(`/admin/warehouses/${warehouse.id}/stock`);
      setStockData(response.data.data.products);
    } catch (error) {
      toast.error('Failed to fetch stock data');
    } finally {
      setStockLoading(false);
    }
  };

  const updateStock = async (productId, quantity) => {
    try {
      await api.patch(`/admin/warehouses/${selectedWarehouse.id}/stock/${productId}`, { quantity });
      toast.success('Stock updated');
    } catch (error) {
      toast.error('Failed to update stock');
    }
  };

  const deleteWarehouse = async (id) => {
    if (!window.confirm('Are you sure you want to delete this warehouse?')) return;
    try {
      await api.delete(`/admin/warehouses/${id}`);
      toast.success('Warehouse deleted');
      fetchWarehouses();
    } catch (error) {
      toast.error('Failed to delete warehouse');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#0F172A]">Warehouse Management</h1>
          <p className="text-gray-500 font-medium text-sm">Manage inventory locations and stock distribution.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-[#F97316] text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-[#F97316]/20 hover:scale-[1.02] transition-all"
        >
          <Plus size={18} /> Add Warehouse
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-[#F97316]" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {warehouses.map((w) => (
            <div key={w.id} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden group hover:border-[#F97316]/30 transition-all duration-300">
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="p-4 bg-orange-50 text-[#F97316] rounded-2xl">
                    <WarehouseIcon className="w-6 h-6" />
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={16} /></button>
                    <button onClick={() => deleteWarehouse(w.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                  </div>
                </div>

                <h3 className="text-xl font-black text-[#0F172A] mb-2">{w.name}</h3>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-500 gap-2">
                    <MapPin size={16} className="text-gray-400" />
                    <span className="font-medium">{w.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 gap-2">
                    <User size={16} className="text-gray-400" />
                    <span className="font-medium">{w.manager_name || 'No Manager'}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 gap-2">
                    <Phone size={16} className="text-gray-400" />
                    <span className="font-medium">{w.phone || 'N/A'}</span>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package size={18} className="text-[#F97316]" />
                    <span className="text-sm font-black text-[#0F172A]">{w.products_count} <span className="text-gray-400">Products</span></span>
                  </div>
                  <button 
                    onClick={() => openStockModal(w)}
                    className="text-xs font-black text-[#F97316] uppercase tracking-widest hover:underline"
                  >
                    View Stock
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Warehouse Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-[#0F172A]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <form onSubmit={handleSubmit} className="p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black text-[#0F172A]">New Warehouse</h3>
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-all">
                  <XCircle size={24} className="text-gray-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Warehouse Name</label>
                  <input 
                    required
                    type="text" 
                    className="w-full mt-1.5 px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#F97316] outline-none font-bold text-sm"
                    placeholder="e.g. Main Warehouse Karachi"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Location (City/Region)</label>
                  <input 
                    required
                    type="text" 
                    className="w-full mt-1.5 px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#F97316] outline-none font-bold text-sm"
                    placeholder="e.g. Karachi, Sindh"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Address</label>
                  <textarea 
                    rows="2"
                    className="w-full mt-1.5 px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#F97316] outline-none font-bold text-sm"
                    placeholder="Complete street address..."
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Manager Name</label>
                    <input 
                      type="text" 
                      className="w-full mt-1.5 px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#F97316] outline-none font-bold text-sm"
                      value={formData.manager_name}
                      onChange={(e) => setFormData({...formData, manager_name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                    <input 
                      type="text" 
                      className="w-full mt-1.5 px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#F97316] outline-none font-bold text-sm"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-4 rounded-2xl bg-gray-100 text-gray-500 font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 rounded-2xl bg-[#F97316] text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-[#F97316]/20 hover:scale-[1.02] transition-all"
                >
                  Save Warehouse
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stock Modal */}
      {isStockModalOpen && (
        <div className="fixed inset-0 bg-[#0F172A]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-4xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-8 md:p-12">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-3xl font-black text-[#0F172A]">{selectedWarehouse?.name} Stock</h3>
                  <p className="text-gray-400 font-bold text-sm mt-1">Manage physical inventory levels for this location.</p>
                </div>
                <button onClick={() => setIsStockModalOpen(false)} className="p-3 hover:bg-gray-100 rounded-full transition-all">
                  <XCircle size={28} className="text-gray-400" />
                </button>
              </div>

              <div className="bg-gray-50 rounded-[2rem] border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto max-h-[50vh] custom-scrollbar">
                  <table className="w-full text-left">
                    <thead className="sticky top-0 bg-white border-b border-gray-100">
                      <tr>
                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Product</th>
                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">SKU</th>
                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">In Stock</th>
                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Reserved</th>
                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Available</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {stockLoading ? (
                        <tr><td colSpan="5" className="px-8 py-20 text-center"><Loader2 className="w-8 h-8 animate-spin text-[#F97316] mx-auto" /></td></tr>
                      ) : stockData.length === 0 ? (
                        <tr><td colSpan="5" className="px-8 py-20 text-center text-gray-400 font-bold">No stock assigned to this warehouse</td></tr>
                      ) : (
                        stockData.map((item) => (
                          <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-8 py-4">
                              <div className="flex items-center gap-3">
                                <img src={item.thumbnail ? `http://localhost:8000/storage/${item.thumbnail}` : 'https://via.placeholder.com/40'} className="w-10 h-10 rounded-xl object-cover border border-gray-100" />
                                <span className="font-bold text-[#0F172A] text-xs line-clamp-1">{item.name}</span>
                              </div>
                            </td>
                            <td className="px-8 py-4 text-xs font-black text-gray-400 uppercase">{item.sku}</td>
                            <td className="px-8 py-4 text-center">
                              <div className="inline-flex items-center bg-gray-50 rounded-xl border border-gray-200 focus-within:ring-2 focus-within:ring-[#F97316]/20 transition-all overflow-hidden">
                                <input 
                                  type="number" 
                                  defaultValue={item.pivot.quantity}
                                  onBlur={(e) => updateStock(item.id, e.target.value)}
                                  className="w-16 bg-transparent px-2 py-2 text-center text-xs font-black text-[#0F172A] outline-none"
                                />
                              </div>
                            </td>
                            <td className="px-8 py-4 text-center">
                              <span className="text-xs font-bold text-orange-500">{item.pivot.reserved_quantity}</span>
                            </td>
                            <td className="px-8 py-4 text-center">
                              <span className="text-xs font-black text-green-600">{item.pivot.quantity - item.pivot.reserved_quantity}</span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button 
                  onClick={() => setIsStockModalOpen(false)}
                  className="bg-[#0F172A] text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#0F172A]/20 hover:scale-[1.02] transition-all"
                >
                  Close Manager
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
