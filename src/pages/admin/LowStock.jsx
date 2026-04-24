import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Menu, LogOut, LayoutDashboard, Package, ShoppingCart, 
  Users, Tag, Settings, AlertTriangle, ArrowRight,
  RefreshCw, TrendingDown, Box, MoreVertical
} from 'lucide-react';
import { authService } from '../../services/authService';
import { productService } from '../../services/productService';
import { logoutUser } from '../../store/authSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export default function LowStock() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [restockingId, setRestockingId] = useState(null);
  const [newStock, setNewStock] = useState('');
  
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    fetchLowStock();
  }, []);

  const fetchLowStock = async () => {
    try {
      setLoading(true);
      const response = await productService.getLowStockProducts();
      // Combined list of products and potential variants could be handled here
      setItems(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch low stock alerts');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      dispatch(logoutUser());
      navigate('/login');
    } catch (error) {}
  };

  const handleRestock = async (id) => {
    if (!newStock || newStock < 0) return;
    try {
      // Assuming a generic update call for demo (ideally a specialized restock API)
      await productService.updateProduct(id, { stock_quantity: newStock });
      toast.success('Inventory updated');
      setRestockingId(null);
      setNewStock('');
      fetchLowStock();
    } catch (error) {
      toast.error('Failed to update stock');
    }
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard', active: false },
    { icon: Package, label: 'Products', path: '/admin/products', active: false },
    { icon: AlertTriangle, label: 'Low Stock', path: '/admin/low-stock', active: true },
    { icon: Tag, label: 'Categories', path: '/admin/categories', active: false },
    { icon: Settings, label: 'Settings', path: '/admin/settings', active: false },
  ];

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      <aside className={`fixed inset-y-0 left-0 bg-[#0F172A] w-64 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out z-20`}>
        <div className="flex h-16 items-center px-6 text-white font-bold text-xl border-b border-gray-700">ShopPro Admin</div>
        <nav className="p-4 space-y-2">
          {navItems.map((item, idx) => (
            <button key={idx} onClick={() => navigate(item.path)} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${item.active ? 'bg-[#F97316] text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}>
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <div className="flex-1 md:ml-64 flex flex-col min-h-screen transition-all duration-300">
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 z-10">
          <button className="md:hidden text-gray-500" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-[#0F172A] hidden md:block">Inventory Alerts</h1>
          <div className="ml-auto flex items-center space-x-4">
            <span className="text-sm font-medium text-[#0F172A]">{user?.name}</span>
            <button onClick={handleLogout} className="text-gray-500 hover:text-[#F97316]">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        <main className="p-6">
          <div className="flex items-center gap-4 mb-8 bg-orange-50 border border-orange-100 p-6 rounded-2xl">
            <div className="w-12 h-12 bg-[#F97316] text-white rounded-full flex items-center justify-center shadow-lg shadow-orange-200">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#0F172A]">Low Stock Warning</h2>
              <p className="text-orange-700 text-sm font-medium">{items.length} items require immediate replenishment.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="p-3 bg-red-50 text-red-600 rounded-xl"><TrendingDown className="w-6 h-6" /></div>
              <div>
                <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">Critical Items</p>
                <p className="text-2xl font-black text-[#0F172A]">{items.filter(i => i.stock_quantity === 0).length}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="p-3 bg-orange-50 text-orange-600 rounded-xl"><Box className="w-6 h-6" /></div>
              <div>
                <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">Below Threshold</p>
                <p className="text-2xl font-black text-[#0F172A]">{items.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-[#0F172A]">Stock Management List</h3>
              <button 
                onClick={fetchLowStock}
                className="p-2 text-gray-400 hover:text-[#F97316] transition-colors"
                title="Refresh"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Product Details</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Current Stock</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Threshold</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-right">Quick Restock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr><td colSpan="5" className="px-6 py-10 text-center text-gray-500">Scanning inventory...</td></tr>
                  ) : items.length === 0 ? (
                    <tr><td colSpan="5" className="px-6 py-10 text-center text-gray-500">Perfect! All products are well stocked.</td></tr>
                  ) : items.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img 
                            src={item.thumbnail ? `http://localhost:8000/storage/${item.thumbnail}` : 'https://via.placeholder.com/40'} 
                            className="w-12 h-12 rounded-xl object-cover"
                          />
                          <div>
                            <p className="font-bold text-[#0F172A]">{item.name}</p>
                            <p className="text-xs text-gray-400 font-mono uppercase">{item.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-lg font-black ${item.stock_quantity === 0 ? 'text-red-600' : 'text-orange-600'}`}>
                          {item.stock_quantity}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-600">{item.low_stock_threshold || 5}</td>
                      <td className="px-6 py-4">
                        {item.stock_quantity === 0 ? (
                          <span className="px-3 py-1 text-[10px] font-black uppercase bg-red-100 text-red-600 rounded-full">Out of Stock</span>
                        ) : (
                          <span className="px-3 py-1 text-[10px] font-black uppercase bg-orange-100 text-orange-600 rounded-full">Low Level</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {restockingId === item.id ? (
                          <div className="flex items-center justify-end gap-2 animate-in slide-in-from-right-2 duration-300">
                            <input 
                              type="number"
                              className="w-20 px-2 py-1 border border-orange-500 rounded outline-none text-sm"
                              placeholder="Add"
                              value={newStock}
                              onChange={(e) => setNewStock(e.target.value)}
                              autoFocus
                            />
                            <button 
                              onClick={() => handleRestock(item.id)}
                              className="p-1.5 bg-[#F97316] text-white rounded-lg"
                            ><ArrowRight className="w-4 h-4" /></button>
                            <button 
                              onClick={() => setRestockingId(null)}
                              className="p-1.5 bg-gray-100 text-gray-400 rounded-lg hover:text-red-500"
                            ><X className="w-4 h-4" /></button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => {
                              setRestockingId(item.id);
                              setNewStock(item.stock_quantity + 10);
                            }}
                            className="text-sm font-black text-[#F97316] hover:text-[#EA580C] bg-orange-50 px-4 py-2 rounded-xl transition-all"
                          >
                            Restock
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
