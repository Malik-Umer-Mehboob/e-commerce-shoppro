import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Menu, LogOut, LayoutDashboard, Package, ShoppingCart, 
  Users, Tag, Settings, Plus, Search, Filter, 
  Pencil, Trash2, Calendar, Percent, CreditCard, ChevronRight
} from 'lucide-react';
import { authService } from '../../services/authService';
import { discountService } from '../../services/discountService';
import { logoutUser } from '../../store/authSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export default function Discounts() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const handleLogout = async () => {
    try {
      await authService.logout();
      dispatch(logoutUser());
      navigate('/login');
    } catch (error) {}
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

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard', active: false },
    { icon: Package, label: 'Products', path: '/admin/products', active: false },
    { icon: ShoppingCart, label: 'Orders', path: '/admin/orders', active: false },
    { icon: Tag, label: 'Categories', path: '/admin/categories', active: false },
    { icon: Percent, label: 'Discounts', path: '/admin/discounts', active: true },
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
          <h1 className="text-xl font-bold text-[#0F172A] hidden md:block">Discounts & Offers</h1>
          <div className="ml-auto flex items-center space-x-4">
            <span className="text-sm font-medium text-[#0F172A]">{user?.name}</span>
            <button onClick={handleLogout} className="text-gray-500 hover:text-[#F97316]">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        <main className="p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-[#0F172A]">Manage Discounts</h2>
            <button 
              onClick={() => toast.success('Discount creation modal would open here')}
              className="bg-[#F97316] text-white px-4 py-2 rounded-lg font-bold hover:bg-[#EA580C] shadow-sm flex items-center gap-2"
            >
              <Plus className="w-5 h-5" /> Add Discount
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Discount Info</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Applied To</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Value</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Validity</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan="6" className="px-6 py-10 text-center text-gray-500">Loading discounts...</td></tr>
                ) : discounts.length === 0 ? (
                  <tr><td colSpan="6" className="px-6 py-10 text-center text-gray-500">No active discounts found.</td></tr>
                ) : discounts.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-[#0F172A]">{d.name}</p>
                      <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded font-bold uppercase">{d.badge_text || 'Sale'}</span>
                    </td>
                    <td className="px-6 py-4">
                      {d.product ? (
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{d.product.name}</span>
                        </div>
                      ) : d.category ? (
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{d.category.name}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400 italic">Entire Store</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 font-bold text-[#0F172A]">
                        {d.type === 'percentage' ? <Percent className="w-4 h-4 text-orange-500" /> : <CreditCard className="w-4 h-4 text-orange-500" />}
                        <span>{d.value}{d.type === 'percentage' ? '%' : ' Rs.'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-gray-500 space-y-1">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>From: {d.starts_at ? new Date(d.starts_at).toLocaleDateString() : 'Start'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>To: {d.ends_at ? new Date(d.ends_at).toLocaleDateString() : 'Forever'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {d.is_active ? (
                        <span className="px-2 py-1 text-[10px] font-black uppercase rounded-full bg-green-100 text-green-700">Active</span>
                      ) : (
                        <span className="px-2 py-1 text-[10px] font-black uppercase rounded-full bg-gray-100 text-gray-400">Inactive</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(d.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
