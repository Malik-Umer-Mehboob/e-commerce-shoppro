import { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Package, 
  RefreshCw, 
  Plus, 
  CheckCircle,
  TrendingUp,
  Loader2
} from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

export default function LowStock() {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({
    out_of_stock: 0,
    below_threshold: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [restocking, setRestocking] = useState(null);
  const [restockQty, setRestockQty] = useState({});

  const fetchLowStock = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/low-stock');
      const data = response.data?.data;

      setProducts(data?.products ?? []);
      setStats({
        out_of_stock: data?.stats?.out_of_stock ?? 0,
        below_threshold: data?.stats?.below_threshold ?? 0,
        total: data?.stats?.total ?? 0,
      });
    } catch (err) {
      
      toast.error('Failed to load low stock data');
      setProducts([]);
      setStats({ out_of_stock: 0, below_threshold: 0, total: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLowStock();
  }, []);

  const handleRestock = async (productId) => {
    const qty = parseInt(restockQty[productId] ?? 0);
    if (!qty || qty <= 0) {
      toast.error('Enter a valid quantity');
      return;
    }

    setRestocking(productId);
    try {
      await api.patch(`/products/${productId}/restock`, {
        quantity: qty
      });
      toast.success(`Stock updated! +${qty} units added`);
      setRestockQty(prev => ({ ...prev, [productId]: '' }));
      fetchLowStock(); // refresh
    } catch (err) {
      toast.error('Failed to update stock');
    } finally {
      setRestocking(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#0F172A] flex items-center gap-3">
            Inventory Alerts
            {stats.total > 0 && (
              <span className="bg-orange-100 text-orange-600 text-xs px-3 py-1 rounded-full border border-orange-200">
                Action Required
              </span>
            )}
          </h1>
          <p className="text-gray-500 font-medium">Monitor and manage products running low on stock</p>
        </div>
        <button 
          onClick={fetchLowStock}
          className="flex items-center space-x-2 px-6 py-3 rounded-2xl font-black text-[#F97316] border-2 border-[#F97316] hover:bg-[#F97316] hover:text-white transition-all transform hover:-translate-y-1 active:scale-95"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Scan</span>
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stats.total > 0 ? 'bg-orange-50' : 'bg-green-50'}`}>
            <AlertTriangle className={`w-6 h-6 ${stats.total > 0 ? 'text-orange-500' : 'text-green-500'}`} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Low Stock Warning</p>
            <p className={`text-lg font-black ${stats.total > 0 ? 'text-orange-600' : 'text-green-600'}`}>
              {loading ? '...' : `${stats.total} items require attention`}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stats.out_of_stock > 0 ? 'bg-red-50' : 'bg-green-50'}`}>
            <Package className={`w-6 h-6 ${stats.out_of_stock > 0 ? 'text-red-500' : 'text-green-500'}`} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Out of Stock</p>
            <p className={`text-2xl font-black ${stats.out_of_stock > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {loading ? '...' : stats.out_of_stock}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stats.below_threshold > 0 ? 'bg-orange-50' : 'bg-green-50'}`}>
            <TrendingUp className={`w-6 h-6 ${stats.below_threshold > 0 ? 'text-orange-500' : 'text-green-500'}`} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Below Threshold</p>
            <p className={`text-2xl font-black ${stats.below_threshold > 0 ? 'text-orange-600' : 'text-green-600'}`}>
              {loading ? '...' : stats.below_threshold}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-50 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h3 className="text-2xl font-black text-[#0F172A]">All products are well stocked!</h3>
            <p className="text-gray-500 font-medium mt-2">No items require immediate attention.</p>
          </div>
        ) : (
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
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-gray-50 overflow-hidden flex-shrink-0 border border-gray-100 flex items-center justify-center">
                          {product.thumbnail ? (
                            <img 
                              src={product.thumbnail} 
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter text-center leading-none">No Image</span>
                          )}
                        </div>
                        <div>
                          <p className="font-black text-[#0F172A] line-clamp-1">{product.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{product.sku}</span>
                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                            <span className="text-[10px] font-bold text-[#F97316] uppercase tracking-widest">{product.category}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className={`text-lg font-black ${product.status === 'out_of_stock' ? 'text-red-600' : 'text-orange-600'}`}>
                        {product.stock_quantity}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-center font-bold text-gray-400">
                      {product.low_stock_threshold}
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                        product.status === 'out_of_stock' 
                          ? 'bg-red-100 text-red-600 border border-red-200' 
                          : 'bg-orange-100 text-orange-600 border border-orange-200'
                      }`}>
                        {product.status === 'out_of_stock' ? 'Out of Stock' : 'Low Stock'}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-end space-x-2">
                        <input 
                          type="number" 
                          placeholder="+qty"
                          className="w-20 px-3 py-2 rounded-xl bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-[#F97316]/10 outline-none transition-all font-bold text-[#0F172A] text-sm"
                          value={restockQty[product.id] ?? ''}
                          onChange={(e) => setRestockQty(prev => ({ ...prev, [product.id]: e.target.value }))}
                        />
                        <button 
                          onClick={() => handleRestock(product.id)}
                          disabled={restocking === product.id}
                          className="bg-[#F97316] text-white px-4 py-2 rounded-xl font-black text-xs hover:bg-[#EA580C] transition-all shadow-lg shadow-[#F97316]/20 flex items-center gap-2 active:scale-95 disabled:opacity-70"
                        >
                          {restocking === product.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Plus className="w-3 h-3" />
                          )}
                          Add Stock
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
