import { useState, useEffect } from 'react';
import { 
  Package, CheckCircle, Clock, AlertTriangle, 
  Plus, Search, Pencil, Trash2 
} from 'lucide-react';
import api from '../../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    drafts: 0,
    low_stock: 0,
  });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [filters, setFilters] = useState({
    search: '',
    category_id: '',
    status: '',
  });

  const navigate = useNavigate();

  const fetchProducts = async (page = 1) => {
    setLoading(true);
    try {
        const params = {
            page,
            search: filters.search,
            category_id: filters.category_id,
            status: filters.status,
        };

        const response = await api.get('/products', { params });

        // Read products
        const productsData = response.data?.data?.products;
        setProducts(productsData?.data ?? []);
        setTotalPages(productsData?.last_page ?? 1);
        setCurrentPage(productsData?.current_page ?? 1);

        // Read stats
        const statsData = response.data?.data?.stats;
        setStats({
            total: statsData?.total ?? 0,
            published: statsData?.published ?? 0,
            drafts: statsData?.drafts ?? 0,
            low_stock: statsData?.low_stock ?? 0,
        });

    } catch (err) {
        console.error('Products fetch error:', err);
        toast.error('Failed to load products');
        setProducts([]);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(1);
  }, [filters.category_id, filters.status]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        toast.success('Product deleted successfully');
        fetchProducts(currentPage);
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const toggleStatus = async (product) => {
    const newStatus = product.status === 'published' ? 'draft' : 'published';
    try {
      await api.patch(`/products/${product.id}/status`, { status: newStatus });
      toast.success(`Product ${newStatus === 'published' ? 'published' : 'moved to drafts'}`);
      fetchProducts(currentPage);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#0F172A]">Products Management</h1>
          <p className="text-gray-500 font-medium">Manage your inventory and product listings.</p>
        </div>
        <Link 
          to="/admin/products/add"
          className="bg-[#0F172A] text-white px-6 py-3 rounded-2xl font-black flex items-center space-x-2 shadow-xl shadow-[#0F172A]/20 hover:bg-black transition-all transform hover:-translate-y-1"
        >
          <Plus className="w-5 h-5" />
          <span>Add Product</span>
        </Link>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: Package, label: 'Total Products', value: stats.total, color: '#3B82F6', bg: '#EFF6FF' },
          { icon: CheckCircle, label: 'Published', value: stats.published, color: '#10B981', bg: '#ECFDF5' },
          { icon: Clock, label: 'Drafts', value: stats.drafts, color: '#F59E0B', bg: '#FFFBEB' },
          { icon: AlertTriangle, label: 'Low Stock', value: stats.low_stock, color: '#EF4444', bg: '#FEF2F2' }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center space-x-4">
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: stat.bg }}
            >
              <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-black text-[#0F172A]">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search products..." 
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-[#F97316]/10 outline-none transition-all font-bold text-[#0F172A]"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && fetchProducts(1)}
          />
        </div>
        <select 
          className="px-6 py-3 rounded-2xl bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-[#F97316]/10 outline-none transition-all font-bold text-[#0F172A]"
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Product</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Category</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Price</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center">Stock</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                        <td colSpan={6} className="px-8 py-6">
                            <div className="h-10 bg-gray-50 rounded-xl animate-pulse" />
                        </td>
                    </tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-8 py-20 text-center">
                    <Package className="w-16 h-16 text-gray-100 mx-auto mb-4" />
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No products found</p>
                  </td>
                </tr>
              ) : products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-2xl bg-gray-50 overflow-hidden flex-shrink-0 border border-gray-100">
                        {product.thumbnail ? (
                            <img 
                                src={`http://localhost:8000/storage/${product.thumbnail}`} 
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400 font-bold uppercase tracking-tighter text-center leading-none">
                                No Image
                            </div>
                        )}
                      </div>
                      <div>
                        <p className="font-black text-[#0F172A] line-clamp-1">{product.name}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">SKU: {product.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm font-bold text-gray-500">
                    {product.category?.name ?? 'Uncategorized'}
                  </td>
                  <td className="px-8 py-6">
                    <p className="font-black text-[#0F172A]">Rs. {Number(product.price).toLocaleString()}</p>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`font-black text-sm ${product.stock_quantity <= product.low_stock_threshold ? 'text-red-500' : 'text-[#0F172A]'}`}>
                      {product.stock_quantity}
                    </span>
                  </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col space-y-2">
                        <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg inline-block w-fit ${
                            product.status === 'published' ? 'bg-green-100 text-green-700' :
                            product.status === 'draft' ? 'bg-gray-100 text-gray-500' :
                            'bg-red-100 text-red-600'
                        }`}>
                            {product.status}
                        </span>
                        <button 
                            onClick={() => toggleStatus(product)}
                            className="text-[10px] font-black text-[#F97316] uppercase tracking-widest hover:underline text-left"
                        >
                            {product.status === 'published' ? 'Unpublish' : 'Publish'}
                        </button>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                          className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                        >
                          <Pencil className="w-5 h-5" />
                        </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
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
        
        {/* Pagination */}
        {totalPages > 1 && (
            <div className="p-8 bg-gray-50/50 flex items-center justify-center border-t border-gray-50 gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                        key={page}
                        onClick={() => fetchProducts(page)}
                        className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                            currentPage === page 
                            ? 'bg-[#F97316] text-white shadow-lg shadow-[#F97316]/20' 
                            : 'bg-white border border-gray-200 text-[#0F172A] hover:bg-gray-100'
                        }`}
                    >
                        {page}
                    </button>
                ))}
            </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: .5; }
        }
      `}</style>
    </div>
  );
}
