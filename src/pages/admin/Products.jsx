import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Menu, LogOut, LayoutDashboard, Package, ShoppingCart, 
  Users, Tag, Settings, Plus, Search, Filter, 
  Pencil, Trash2, Eye, EyeOff, MoreVertical, 
  AlertTriangle, CheckCircle, Clock, Upload
} from 'lucide-react';
import { authService } from '../../services/authService';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { logoutUser } from '../../store/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export default function AdminProducts() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    drafts: 0,
    lowStock: 0
  });
  
  const [filters, setFilters] = useState({
    search: '',
    category_id: '',
    status: '',
    page: 1
  });

  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [filters.category_id, filters.status, filters.page]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getProducts({
        ...filters,
        search: filters.search
      });
      setProducts(response.data.data);
      
      // Rough stats calculation (ideally from backend)
      const allRes = await productService.getProducts({ limit: 1000 });
      const all = allRes.data.data;
      setStats({
        total: allRes.data.total,
        published: all.filter(p => p.status === 'published').length,
        drafts: all.filter(p => p.status === 'draft').length,
        lowStock: all.filter(p => p.stock_quantity <= p.low_stock_threshold).length
      });
    } catch (error) {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getCategories();
      // Flatten categories for dropdown
      const flattened = [];
      response.data.categories.forEach(cat => {
        flattened.push(cat);
        if (cat.children) {
          cat.children.forEach(child => {
            flattened.push({ ...child, name: `— ${child.name}` });
          });
        }
      });
      setCategories(flattened);
    } catch (error) {
      console.error('Failed to fetch categories');
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      dispatch(logoutUser());
      navigate('/login');
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.deleteProduct(id);
        toast.success('Product deleted successfully');
        fetchProducts();
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const toggleStatus = async (product) => {
    const newStatus = product.status === 'published' ? 'draft' : 'published';
    try {
      await productService.updateStatus(product.id, newStatus);
      toast.success(`Product ${newStatus === 'published' ? 'published' : 'moved to drafts'}`);
      fetchProducts();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard', active: false },
    { icon: Package, label: 'Products', path: '/admin/products', active: true },
    { icon: Tag, label: 'Discounts', path: '/admin/discounts', active: false },
    { icon: Upload, label: 'Bulk Upload', path: '/admin/bulk-upload', active: false },
    { icon: AlertTriangle, label: 'Low Stock', path: '/admin/low-stock', active: false },
    { icon: Tag, label: 'Categories', path: '/admin/categories', active: false },
    { icon: Settings, label: 'Settings', path: '/admin/settings', active: false },
  ];

  const getStatusBadge = (status, stock) => {
    if (stock <= 0) return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">Out of Stock</span>;
    if (status === 'published') return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">Published</span>;
    if (status === 'draft') return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700">Draft</span>;
    return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700">{status}</span>;
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 bg-[#0F172A] w-64 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out z-20`}>
        <div className="flex h-16 items-center px-6 text-white font-bold text-xl border-b border-gray-700">
          ShopPro Admin
        </div>
        <nav className="p-4 space-y-2">
          {navItems.map((item, idx) => (
            <button 
              key={idx} 
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${item.active ? 'bg-[#F97316] text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen transition-all duration-300">
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-4 sm:px-6 z-10">
          <button className="md:hidden text-gray-500" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <Menu className="w-6 h-6" />
          </button>
          <div className="md:hidden font-bold text-[#0F172A] text-lg">ShopPro</div>
          <div className="ml-auto flex items-center space-x-4">
            <span className="text-sm font-medium text-[#0F172A] hidden sm:block">{user?.name}</span>
            <div className="w-8 h-8 rounded-full bg-[#0F172A] text-white flex items-center justify-center font-bold">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <button onClick={handleLogout} className="text-gray-500 hover:text-[#F97316] transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <h1 className="text-2xl font-bold text-[#0F172A]">Products Management</h1>
            <Link 
              to="/admin/products/add"
              className="inline-flex items-center justify-center px-4 py-2 bg-[#F97316] text-white rounded-lg font-semibold hover:bg-[#EA580C] transition-all shadow-sm gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Product
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Package className="w-6 h-6" /></div>
              <div>
                <p className="text-sm text-gray-500">Total Products</p>
                <p className="text-2xl font-bold text-[#0F172A]">{stats.total}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="p-3 bg-green-50 text-green-600 rounded-lg"><CheckCircle className="w-6 h-6" /></div>
              <div>
                <p className="text-sm text-gray-500">Published</p>
                <p className="text-2xl font-bold text-[#0F172A]">{stats.published}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="p-3 bg-yellow-50 text-yellow-600 rounded-lg"><Clock className="w-6 h-6" /></div>
              <div>
                <p className="text-sm text-gray-500">Drafts</p>
                <p className="text-2xl font-bold text-[#0F172A]">{stats.drafts}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="p-3 bg-red-50 text-red-600 rounded-lg"><AlertTriangle className="w-6 h-6" /></div>
              <div>
                <p className="text-sm text-gray-500">Low Stock</p>
                <p className="text-2xl font-bold text-[#0F172A]">{stats.lowStock}</p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-wrap gap-4 items-center">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search products..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && fetchProducts()}
              />
            </div>
            <select 
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316] bg-white min-w-[160px]"
              value={filters.category_id}
              onChange={(e) => setFilters({ ...filters, category_id: e.target.value, page: 1 })}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <select 
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316] bg-white min-w-[140px]"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
            >
              <option value="">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
            <button 
              onClick={fetchProducts}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
            >
              Apply
            </button>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">SKU</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Stock</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-10 text-center text-gray-500">Loading products...</td>
                    </tr>
                  ) : products.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-10 text-center text-gray-500">No products found.</td>
                    </tr>
                  ) : products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={product.thumbnail ? `http://localhost:8000/storage/${product.thumbnail}` : 'https://via.placeholder.com/40'} 
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                          />
                          <div>
                            <p className="font-semibold text-[#0F172A] line-clamp-1">{product.name}</p>
                            <p className="text-xs text-gray-500">by {product.seller?.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 font-mono text-center">{product.sku}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{product.category?.name}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-[#0F172A]">Rs. {product.price}</span>
                          {product.sale_price && <span className="text-xs text-gray-400 line-through">Rs. {product.sale_price}</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`text-sm font-semibold ${product.stock_quantity <= product.low_stock_threshold ? 'text-red-500' : 'text-gray-700'}`}>
                          {product.stock_quantity}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(product.status, product.stock_quantity)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => toggleStatus(product)}
                            className="p-1.5 text-gray-400 hover:text-[#F97316] hover:bg-orange-50 rounded-lg transition-all"
                            title="Toggle Status"
                          >
                            {product.status === 'published' ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                          <button 
                            onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="Edit"
                          >
                            <Pencil className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => handleDelete(product.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Delete"
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
            {/* Simple Pagination */}
            <div className="p-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-sm text-gray-500">Showing {products.length} products</span>
              <div className="flex gap-2">
                <button 
                  disabled={filters.page === 1}
                  onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                  className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50"
                >
                  Prev
                </button>
                <button 
                  onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                  className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>
      )}
    </div>
  );
}
