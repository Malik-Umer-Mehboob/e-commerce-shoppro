import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Menu, LogOut, Package, ShoppingCart, 
  BarChart2, Settings, Plus, Search, 
  Pencil, Trash2, Eye, EyeOff, CheckCircle, 
  Clock, AlertTriangle, Tag
} from 'lucide-react';
import { authService } from '../../services/authService';
import { productService } from '../../services/productService';
import { logoutUser } from '../../store/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import BulkUploadModal from './components/BulkUploadModal';

export default function SellerProducts() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
    low_stock: 0
  });
  
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    page: 1
  });

  const [showBulkUpload, setShowBulkUpload] = useState(false);
  
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, [filters.status, filters.page]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // productService returns response.data (axios-unwrapped)
      // Backend shape: { success, data: { products: { data:[...], last_page }, stats:{...} } }
      const response = await productService.getProducts({
        ...filters,
        search: filters.search,
        isSeller: true
      });

      const productsData = response?.data?.products;
      const statsData   = response?.data?.stats;

      setProducts(productsData?.data ?? []);
      setTotalPages(productsData?.last_page ?? 1);
      setStats({
        total:     statsData?.total     ?? 0,
        approved:  statsData?.approved  ?? 0,
        pending:   statsData?.pending   ?? 0,
        rejected:  statsData?.rejected  ?? 0,
        low_stock: statsData?.low_stock ?? 0,
      });
    } catch (error) {
      toast.error('Failed to fetch products');
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
    if (window.confirm('Delete this product?')) {
      try {
        await productService.deleteProduct(id);
        toast.success('Product deleted');
        fetchProducts();
      } catch (error) {
        toast.error('Failed to delete');
      }
    }
  };

  const toggleStatus = async (product) => {
    const newStatus = product.status === 'published' ? 'draft' : 'published';
    try {
      await productService.updateStatus(product.id, newStatus);
      toast.success('Status updated');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to update');
    }
  };

  const navItems = [
    { icon: Package, label: 'My Products', path: '/seller/products', active: true },
    { icon: ShoppingCart, label: 'Orders', path: '/seller/orders', active: false },
    { icon: Tag, label: 'Request Category', path: '/seller/category-request', active: false },
    { icon: BarChart2, label: 'Analytics', path: '/seller/analytics', active: false },
    { icon: Settings, label: 'Settings', path: '/seller/settings', active: false },
  ];

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-[#0F172A]">My Products</h1>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowBulkUpload(true)}
            className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 gap-2 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" /> Bulk Upload
          </button>
          <Link to="/seller/products/add" className="inline-flex items-center px-4 py-2 bg-[#F97316] text-white rounded-lg font-semibold hover:bg-[#EA580C] gap-2 shadow-lg shadow-orange-200 transition-all">
            <Plus className="w-5 h-5" /> Add New
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Package className="w-6 h-6" /></div>
          <div><p className="text-sm text-gray-500">Total</p><p className="text-2xl font-bold text-[#0F172A]">{stats.total}</p></div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-lg"><CheckCircle className="w-6 h-6" /></div>
          <div><p className="text-sm text-gray-500">Approved</p><p className="text-2xl font-bold text-[#0F172A]">{stats.approved}</p></div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-yellow-50 text-yellow-600 rounded-lg"><Clock className="w-6 h-6" /></div>
          <div><p className="text-sm text-gray-500">Pending</p><p className="text-2xl font-bold text-[#0F172A]">{stats.pending}</p></div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-red-50 text-red-600 rounded-lg"><AlertTriangle className="w-6 h-6" /></div>
          <div><p className="text-sm text-gray-500">Rejected</p><p className="text-2xl font-bold text-[#0F172A]">{stats.rejected}</p></div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search my products..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#F97316]"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && fetchProducts()}
          />
        </div>
        <select 
          className="px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#F97316] bg-white"
          value={filters.moderation_status || ''}
          onChange={(e) => setFilters({ ...filters, moderation_status: e.target.value, page: 1 })}
        >
          <option value="">All Moderation</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>
        <select 
          className="px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#F97316] bg-white"
          value={filters.status || ''}
          onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
        >
          <option value="">All Publish</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
               <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Product</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Price</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Stock</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Publish</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Moderation</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan="5" className="px-6 py-10 text-center text-gray-500">Loading...</td></tr>
            ) : products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img src={product.thumbnail 
                      ? (product.thumbnail.trim().startsWith('http') ? product.thumbnail.trim() : `http://localhost:8000/storage/${product.thumbnail.trim()}`)
                      : 'https://placehold.co/40'} 
                      className="w-10 h-10 rounded-lg object-cover" 
                    />
                    <div><p className="font-semibold text-[#0F172A]">{product.name}</p><p className="text-xs text-gray-500">{product.sku}</p></div>
                  </div>
                </td>
                <td className="px-6 py-4 font-bold text-[#0F172A]">Rs. {product.price}</td>
                <td className={`px-6 py-4 font-semibold ${product.stock_quantity <= product.low_stock_threshold ? 'text-red-500' : 'text-gray-700'}`}>{product.stock_quantity}</td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => toggleStatus(product)}
                    className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-widest rounded-lg w-fit transition-colors ${
                      product.status === 'published' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 
                      'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {product.status}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-widest rounded-lg w-fit ${
                    product.moderation_status === 'approved' ? 'bg-blue-100 text-blue-700' : 
                    product.moderation_status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                    'bg-red-100 text-red-700'
                  }`}>
                    {product.moderation_status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => navigate(`/seller/products/edit/${product.id}`)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setFilters(f => ({ ...f, page: Math.max(1, f.page - 1) }))}
            disabled={filters.page === 1}
            className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium disabled:opacity-40 hover:bg-gray-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {filters.page} of {totalPages}
          </span>
          <button
            onClick={() => setFilters(f => ({ ...f, page: Math.min(totalPages, f.page + 1) }))}
            disabled={filters.page === totalPages}
            className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium disabled:opacity-40 hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}

      <BulkUploadModal 
        isOpen={showBulkUpload} 
        onClose={() => setShowBulkUpload(false)} 
        onRefresh={fetchProducts}
      />
    </>
  );
}
