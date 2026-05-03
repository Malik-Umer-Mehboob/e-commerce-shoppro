import { useState, useEffect } from 'react';
import { 
  Warehouse as WarehouseIcon, 
  MapPin, 
  User, 
  Phone, 
  Package, 
  Plus, 
  Search, 
  Pencil, 
  Trash2, 
  ChevronRight,
  ArrowLeft,
  X,
  Loader2,
  Box,
  LayoutGrid,
  List,
  AlertCircle
} from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

export default function Warehouses() {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [form, setForm] = useState({
    name: '',
    location: '',
    address: '',
    manager_name: '',
    phone: ''
  });
  const [saving, setSaving] = useState(false);

  // Stock Modal State
  const [stockData, setStockData] = useState([]);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [loadingStock, setLoadingStock] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [addQty, setAddQty] = useState('');
  const [updatingStock, setUpdatingStock] = useState(null);
  const [inlineQty, setInlineQty] = useState({});

  useEffect(() => {
    fetchWarehouses();
  }, []);

  useEffect(() => {
    if (selectedWarehouse) {
      fetchStock();
      fetchAvailableProducts();
    }
  }, [selectedWarehouse]);

  const fetchWarehouses = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/warehouses');
      setWarehouses(response.data?.data ?? []);
    } catch (error) {
      toast.error('Failed to load warehouses');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!form.name || !form.location) {
      toast.error('Name and location are required');
      return;
    }
    setSaving(true);
    try {
      await api.post('/admin/warehouses', form);
      toast.success('Warehouse added!');
      setShowAddModal(false);
      setForm({ name: '', location: '', address: '', manager_name: '', phone: '' });
      fetchWarehouses();
    } catch (error) {
      toast.error('Failed to add warehouse');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this warehouse? This will remove all associated stock records.')) return;
    try {
      await api.delete(`/admin/warehouses/${id}`);
      toast.success('Warehouse deleted');
      fetchWarehouses();
    } catch (error) {
      toast.error('Failed to delete warehouse');
    }
  };

  const fetchStock = async () => {
    setLoadingStock(true);
    try {
      const res = await api.get(`/admin/warehouses/${selectedWarehouse.id}/stock`);
      setStockData(res.data?.data?.products ?? []);
    } catch (error) {
      toast.error('Failed to load stock');
    } finally {
      setLoadingStock(false);
    }
  };

  const fetchAvailableProducts = async () => {
    try {
      const res = await api.get(`/admin/warehouses/${selectedWarehouse.id}/available-products`);
      setAvailableProducts(res.data?.data ?? []);
    } catch (error) {
      
    }
  };

  const handleAddProduct = async () => {
    if (!selectedProduct || !addQty) {
      toast.error('Select product and enter quantity');
      return;
    }
    try {
      await api.patch(`/admin/warehouses/${selectedWarehouse.id}/stock/${selectedProduct}`, {
        quantity: parseInt(addQty)
      });
      toast.success('Product added to warehouse!');
      setSelectedProduct('');
      setAddQty('');
      setShowAddProduct(false);
      fetchStock();
      fetchAvailableProducts();
    } catch (error) {
      toast.error('Failed to add product');
    }
  };

  const handleUpdateStock = async (productId) => {
    const qty = parseInt(inlineQty[productId]);
    if (isNaN(qty) || qty < 0) {
      toast.error('Enter a valid quantity');
      return;
    }
    setUpdatingStock(productId);
    try {
      await api.patch(`/admin/warehouses/${selectedWarehouse.id}/stock/${productId}`, {
        quantity: qty
      });
      toast.success('Stock updated!');
      setInlineQty(prev => ({ ...prev, [productId]: undefined }));
      fetchStock();
    } catch (error) {
      toast.error('Failed to update stock');
    } finally {
      setUpdatingStock(null);
    }
  };

  const handleRemoveProduct = async (productId) => {
    if (!window.confirm('Remove this product from warehouse?')) return;
    try {
      await api.delete(`/admin/warehouses/${selectedWarehouse.id}/products/${productId}`);
      toast.success('Product removed');
      fetchStock();
      fetchAvailableProducts();
    } catch (error) {
      toast.error('Failed to remove product');
    }
  };

  if (showStockModal) {
    return (
      <div className="space-y-8 animate-in slide-in-from-right duration-500">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setShowStockModal(false)}
              className="p-3 bg-white rounded-2xl border border-gray-100 shadow-sm hover:bg-gray-50 transition-all group"
            >
              <ArrowLeft className="w-5 h-5 text-gray-500 group-hover:-translate-x-1 transition-transform" />
            </button>
            <div>
              <h1 className="text-3xl font-black text-[#0F172A]">{selectedWarehouse.name}</h1>
              <p className="text-gray-500 font-medium flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {selectedWarehouse.location}
              </p>
            </div>
          </div>
          <button 
            onClick={() => setShowAddProduct(!showAddProduct)}
            className="bg-[#0F172A] text-white px-6 py-3 rounded-2xl font-black flex items-center space-x-2 shadow-xl shadow-[#0F172A]/20 hover:bg-black transition-all transform hover:-translate-y-1"
          >
            <Plus className="w-5 h-5" />
            <span>Assign Product</span>
          </button>
        </div>

        {showAddProduct && (
          <div className="bg-orange-50 border border-orange-100 p-8 rounded-[2.5rem] animate-in zoom-in duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-[#854D0E] flex items-center">
                <Box className="w-5 h-5 mr-2" />
                Assign New Product to Warehouse
              </h3>
              <button onClick={() => setShowAddProduct(false)} className="text-orange-500 hover:text-orange-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <label className="block text-[10px] font-black text-orange-700 uppercase tracking-widest mb-2">Select Product</label>
                <select 
                  className="w-full px-6 py-4 rounded-2xl bg-white border-none focus:ring-4 focus:ring-orange-200 outline-none transition-all font-bold text-[#0F172A]"
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                >
                  <option value="">Choose a product...</option>
                  {availableProducts.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-orange-700 uppercase tracking-widest mb-2">Initial Quantity</label>
                <input 
                  type="number"
                  placeholder="0"
                  className="w-full px-6 py-4 rounded-2xl bg-white border-none focus:ring-4 focus:ring-orange-200 outline-none transition-all font-bold text-[#0F172A]"
                  value={addQty}
                  onChange={(e) => setAddQty(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-8 flex justify-end items-center space-x-4">
              <button 
                onClick={() => setShowAddProduct(false)}
                className="text-orange-700 font-bold hover:underline"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddProduct}
                className="bg-[#F97316] text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-orange-200 hover:bg-[#EA580C] transition-all"
              >
                Assign to Warehouse
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Product</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Category</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center">In Stock</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center">Reserved</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center">Available</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loadingStock ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan="6" className="px-8 py-6">
                        <div className="h-12 bg-gray-50 rounded-xl" />
                      </td>
                    </tr>
                  ))
                ) : stockData.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-8 py-20 text-center">
                      <Box className="w-16 h-16 text-gray-100 mx-auto mb-4" />
                      <p className="text-gray-400 font-black uppercase tracking-widest text-xs">No products assigned to this warehouse</p>
                      <button 
                        onClick={() => setShowAddProduct(true)}
                        className="mt-4 text-[#F97316] font-bold hover:underline"
                      >
                        Click 'Assign Product' to start
                      </button>
                    </td>
                  </tr>
                ) : stockData.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-xl bg-gray-50 overflow-hidden flex-shrink-0 border border-gray-100">
                          {p.thumbnail ? (
                            <img src={p.thumbnail} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-50 text-[8px] font-black text-gray-300">NO IMG</div>
                          )}
                        </div>
                        <div>
                          <p className="font-black text-[#0F172A] leading-tight">{p.name}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{p.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 bg-gray-100 rounded-lg text-[10px] font-black text-gray-500 uppercase">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-center space-x-2">
                        <input 
                          type="number"
                          className="w-20 px-3 py-2 rounded-xl bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-orange-100 outline-none transition-all font-bold text-[#0F172A] text-sm text-center"
                          value={inlineQty[p.id] !== undefined ? inlineQty[p.id] : p.quantity}
                          onChange={(e) => setInlineQty(prev => ({ ...prev, [p.id]: e.target.value }))}
                        />
                        {inlineQty[p.id] !== undefined && (
                          <button 
                            onClick={() => handleUpdateStock(p.id)}
                            disabled={updatingStock === p.id}
                            className="p-2 bg-orange-100 text-orange-600 rounded-xl hover:bg-orange-200 transition-colors"
                          >
                            {updatingStock === p.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronRight className="w-4 h-4" />}
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center font-bold text-gray-400">{p.reserved_quantity}</td>
                    <td className="px-8 py-6 text-center">
                      <span className={`font-black ${p.available > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {p.available}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-end">
                        <button 
                          onClick={() => handleRemoveProduct(p.id)}
                          className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        >
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

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#0F172A]">Warehouse Management</h1>
          <p className="text-gray-500 font-medium">Manage inventory locations and stock distribution</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-[#0F172A] text-white px-6 py-3 rounded-2xl font-black flex items-center space-x-2 shadow-xl shadow-[#0F172A]/20 hover:bg-black transition-all transform hover:-translate-y-1"
        >
          <Plus className="w-5 h-5" />
          <span>Add Warehouse</span>
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 bg-white rounded-[2.5rem] animate-pulse border border-gray-100 shadow-sm" />
          ))}
        </div>
      ) : warehouses.length === 0 ? (
        <div className="bg-white p-20 rounded-[3rem] border border-dashed border-gray-200 text-center">
          <WarehouseIcon className="w-20 h-20 text-gray-100 mx-auto mb-6" />
          <h2 className="text-2xl font-black text-[#0F172A]">No warehouses yet</h2>
          <p className="text-gray-400 font-medium mb-8">Start by adding your first inventory location.</p>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-[#F97316] text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-orange-200 hover:bg-[#EA580C] transition-all"
          >
            Add First Warehouse
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {warehouses.map((w) => (
            <div 
              key={w.id} 
              className="bg-white p-8 rounded-[2.5rem] border-l-4 border-l-[#0F172A] border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-[#0F172A] group-hover:text-white transition-colors duration-500">
                    <WarehouseIcon className="w-7 h-7" />
                  </div>
                  <div className="flex space-x-1">
                    <button onClick={() => handleDelete(w.id)} className="p-2 text-gray-300 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <h3 className="text-xl font-black text-[#0F172A] mb-2">{w.name}</h3>
                <div className="space-y-2">
                  <p className="text-gray-400 font-bold flex items-center text-sm italic">
                    <MapPin className="w-3.5 h-3.5 mr-2 flex-shrink-0" />
                    {w.location}
                  </p>
                  {w.manager_name && (
                    <p className="text-gray-500 font-bold flex items-center text-xs uppercase tracking-tighter">
                      <User className="w-3.5 h-3.5 mr-2 flex-shrink-0" />
                      Manager: {w.manager_name}
                    </p>
                  )}
                  {w.phone && (
                    <p className="text-gray-500 font-bold flex items-center text-xs">
                      <Phone className="w-3.5 h-3.5 mr-2 flex-shrink-0" />
                      {w.phone}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center border-2 border-white">
                      <Package className="w-3.5 h-3.5 text-orange-600" />
                    </div>
                  </div>
                  <span className="ml-3 text-[10px] font-black text-[#0F172A] uppercase tracking-widest">
                    {w.products_count} Products
                  </span>
                </div>
                <button 
                  onClick={() => {
                    setSelectedWarehouse(w);
                    setShowStockModal(true);
                  }}
                  className="bg-[#F97316] text-white px-5 py-2.5 rounded-xl font-black text-xs hover:bg-[#EA580C] transition-all transform hover:scale-105 active:scale-95 shadow-md shadow-orange-100"
                >
                  View Stock
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-10">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-3xl font-black text-[#0F172A]">New Warehouse</h2>
                <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-[#0F172A]">
                  <X className="w-8 h-8" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Warehouse Name*</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Karachi Main Store"
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-[#F97316]/10 outline-none transition-all font-bold text-[#0F172A]"
                    value={form.name}
                    onChange={(e) => setForm({...form, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Location*</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Karachi, Sindh"
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-[#F97316]/10 outline-none transition-all font-bold text-[#0F172A]"
                    value={form.location}
                    onChange={(e) => setForm({...form, location: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Manager</label>
                    <input 
                      type="text" 
                      placeholder="Full Name"
                      className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-[#F97316]/10 outline-none transition-all font-bold text-[#0F172A]"
                      value={form.manager_name}
                      onChange={(e) => setForm({...form, manager_name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Phone</label>
                    <input 
                      type="text" 
                      placeholder="+92 XXX XXXXXXX"
                      className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-[#F97316]/10 outline-none transition-all font-bold text-[#0F172A]"
                      value={form.phone}
                      onChange={(e) => setForm({...form, phone: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-12 flex space-x-4">
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-8 py-5 rounded-2xl font-black text-gray-400 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAdd}
                  disabled={saving}
                  className="flex-[2] bg-[#F97316] text-white px-8 py-5 rounded-2xl font-black shadow-xl shadow-orange-200 hover:bg-[#EA580C] transition-all flex items-center justify-center space-x-2"
                >
                  {saving ? <Loader2 className="w-6 h-6 animate-spin" /> : <span>Create Warehouse</span>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
