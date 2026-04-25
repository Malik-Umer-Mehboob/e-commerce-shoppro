import { useState, useEffect } from 'react';
import { 
  AlertTriangle, RefreshCw, TrendingDown, Box, ArrowRight, X 
} from 'lucide-react';
import { productService } from '../../services/productService';
import { toast } from 'react-hot-toast';

export default function LowStock() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [restockingId, setRestockingId] = useState(null);
  const [newStock, setNewStock] = useState('');

  useEffect(() => {
    fetchLowStock();
  }, []);

  const fetchLowStock = async () => {
    try {
      setLoading(true);
      const response = await productService.getLowStockProducts();
      // The API returns data directly or inside a data wrapper
      const data = response.data?.data || response.data || [];
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Failed to fetch low stock alerts');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRestock = async (id) => {
    if (!newStock || newStock < 0) return;
    try {
      await productService.updateProduct(id, { stock_quantity: newStock });
      toast.success('Inventory updated');
      setRestockingId(null);
      setNewStock('');
      fetchLowStock();
    } catch (error) {
      toast.error('Failed to update stock');
    }
  };

  const lowStockCount = (products ?? []).length;
  const outOfStockCount = (products ?? []).filter(i => i.stock_quantity === 0).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#0F172A]">Inventory Alerts</h1>
          <p className="text-gray-500 font-medium">Monitor and manage products running low on stock.</p>
        </div>
        <button 
          onClick={fetchLowStock}
          disabled={loading}
          className="bg-[#0F172A] text-white px-6 py-3 rounded-2xl font-black flex items-center space-x-2 shadow-xl shadow-[#0F172A]/20 hover:bg-black transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:transform-none"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Scan</span>
        </button>
      </div>

      <div className="flex items-center gap-6 mb-8 bg-orange-50/50 border border-orange-100 p-8 rounded-[2.5rem]">
        <div className="w-16 h-16 bg-[#F97316] text-white rounded-[2rem] flex items-center justify-center shadow-xl shadow-orange-200">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-[#0F172A]">Low Stock Warning</h2>
          <p className="text-orange-700 font-bold uppercase tracking-widest text-[10px] mt-1">
            {loading ? 'Calculating...' : `${lowStockCount} items require immediate attention`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center space-x-6">
          <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center">
            <TrendingDown className="w-7 h-7" />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Out of Stock</p>
            <p className="text-3xl font-black text-[#0F172A]">
              {loading ? '...' : outOfStockCount}
            </p>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center space-x-6">
          <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center">
            <Box className="w-7 h-7" />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Below Threshold</p>
            <p className="text-3xl font-black text-[#0F172A]">
              {loading ? '...' : lowStockCount}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Product Details</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center">Stock</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center">Threshold</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Quick Restock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <div className="w-12 h-12 border-4 border-[#F97316] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Scanning inventory...</p>
                  </td>
                </tr>
              ) : (products ?? []).length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <Box className="w-16 h-16 text-gray-100 mx-auto mb-4" />
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">All products are well stocked</p>
                  </td>
                </tr>
              ) : (products ?? []).map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-2xl bg-gray-50 overflow-hidden flex-shrink-0 border border-gray-100">
                        <img 
                          src={item.thumbnail ? `http://localhost:8000/storage/${item.thumbnail}` : 'https://via.placeholder.com/48'} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-black text-[#0F172A]">{item.name}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`text-lg font-black ${item.stock_quantity === 0 ? 'text-red-600' : 'text-orange-600'}`}>
                      {item.stock_quantity}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className="text-sm font-bold text-gray-400">{item.low_stock_threshold || 5}</span>
                  </td>
                  <td className="px-8 py-6">
                    {item.stock_quantity === 0 ? (
                      <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest bg-red-100 text-red-600 rounded-full">Out of Stock</span>
                    ) : (
                      <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest bg-orange-100 text-orange-600 rounded-full">Low Level</span>
                    )}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-end">
                      {restockingId === item.id ? (
                        <div className="flex items-center space-x-2 animate-in slide-in-from-right-4">
                          <input 
                            type="number"
                            className="w-24 px-4 py-2 rounded-xl bg-gray-50 border-none focus:ring-4 focus:ring-[#F97316]/10 outline-none font-bold text-sm"
                            placeholder="Add"
                            value={newStock}
                            onChange={(e) => setNewStock(e.target.value)}
                            autoFocus
                          />
                          <button 
                            onClick={() => handleRestock(item.id)}
                            className="p-2 bg-[#F97316] text-white rounded-xl shadow-lg shadow-orange-200"
                          >
                            <ArrowRight className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => setRestockingId(null)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => {
                            setRestockingId(item.id);
                            setNewStock(item.stock_quantity + 10);
                          }}
                          className="text-xs font-black text-[#F97316] hover:text-white hover:bg-[#F97316] bg-orange-50 px-6 py-2.5 rounded-xl transition-all"
                        >
                          Quick Restock
                        </button>
                      )}
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
