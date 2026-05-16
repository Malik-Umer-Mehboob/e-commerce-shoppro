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
    draft: 0,
    archived: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
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
    setProducts([]); // Clear existing products before fetching fresh data
    try {
        const params = {
            page,
            search: filters.search,
            category_id: filters.category_id,
            status: filters.status,
            moderation_status: filters.moderation_status,
        };

        const response = await api.get('/products', { params });

        // Read products
        const productsData = response.data?.data?.products;
        setProducts(productsData?.data ?? []); // Always replace state
        setTotalPages(productsData?.last_page ?? 1);
        setCurrentPage(productsData?.current_page ?? 1);

        // Read stats
        const statsData = response.data?.data?.stats;
        setStats({
            total: statsData?.total ?? 0,
            published: statsData?.published ?? 0,
            draft: statsData?.draft ?? 0,
            archived: statsData?.archived ?? 0,
            approved: statsData?.approved ?? 0,
            pending: statsData?.pending ?? 0,
            rejected: statsData?.rejected ?? 0,
            low_stock: statsData?.low_stock ?? 0,
        });

    } catch (err) {
        toast.error('Failed to load products');
        setProducts([]); // Clear on error
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [filters.category_id, filters.status, filters.moderation_status, filters.search, currentPage]);

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

  const updateProductStatus = async (product, newStatus) => {
    try {
      await api.patch(`/products/${product.id}/status`, { status: newStatus });
      toast.success(`Product ${newStatus}`);
      fetchProducts(currentPage);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const updateModeration = async (product, newStatus) => {
    try {
      await api.patch(`/admin/products/${product.id}/moderation-status`, { moderation_status: newStatus });
      toast.success(`Product ${newStatus}`);
      fetchProducts(currentPage);
    } catch (error) {
      toast.error('Failed to update moderation status');
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {[
          { icon: Package, label: 'Total', value: stats.total, color: '#3B82F6', bg: '#EFF6FF' },
          { icon: CheckCircle, label: 'Published', value: stats.published, color: '#10B981', bg: '#ECFDF5' },
          { icon: Clock, label: 'Drafts', value: stats.draft, color: '#F59E0B', bg: '#FFFBEB' },
          { icon: AlertTriangle, label: 'Archived', value: stats.archived, color: '#EF4444', bg: '#FEF2F2' },
          { icon: CheckCircle, label: 'Approved', value: stats.approved, color: '#06B6D4', bg: '#ECFEFF' },
          { icon: Clock, label: 'Pending', value: stats.pending, color: '#8B5CF6', bg: '#F5F3FF' },
          { icon: AlertTriangle, label: 'Rejected', value: stats.rejected, color: '#EC4899', bg: '#FDF2F8' }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: stat.bg }}
            >
              <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
            </div>
            <div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-lg font-black text-[#0F172A]">{stat.value}</p>
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
          <option value="">All Publish</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
        <select 
          className="px-6 py-3 rounded-2xl bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-[#F97316]/10 outline-none transition-all font-bold text-[#0F172A]"
          value={filters.moderation_status}
          onChange={(e) => setFilters({ ...filters, moderation_status: e.target.value })}
        >
          <option value="">All Moderation</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Product</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Seller</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Category</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Price</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center">Stock</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Publish</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Moderation</th>
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
                                src={product.thumbnail?.trim().startsWith('http') 
                                    ? product.thumbnail.trim() 
                                    : `http://localhost:8000/storage/${product.thumbnail?.trim()}`} 
                                alt={product.name}
                                loading="lazy"
                                decoding="async"
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
                  <td className="px-8 py-6 text-sm font-bold text-[#0F172A]">
                    {product.seller?.name ?? 'Admin'}
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
                            product.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                        }`}>
                            {product.status}
                        </span>
                        <div className="flex items-center gap-2">
                          <button 
                              onClick={() => updateProductStatus(product, product.status === 'published' ? 'draft' : 'published')}
                              className="text-[9px] font-black text-[#F97316] uppercase tracking-widest hover:underline"
                          >
                              Toggle
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col space-y-2">
                        <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg inline-block w-fit ${
                            product.moderation_status === 'approved' ? 'bg-blue-100 text-blue-700' :
                            product.moderation_status === 'pending' ? 'bg-purple-100 text-purple-700' :
                            'bg-pink-100 text-pink-700'
                        }`}>
                            {product.moderation_status}
                        </span>
                        <div className="flex items-center gap-2">
                          {product.moderation_status !== 'approved' && (
                            <button 
                                onClick={() => updateModeration(product, 'approved')}
                                className="text-[9px] font-black text-green-600 uppercase tracking-widest hover:underline"
                            >
                                Approve
                            </button>
                          )}
                          {product.moderation_status !== 'rejected' && (
                            <button 
                                onClick={() => updateModeration(product, 'rejected')}
                                className="text-[9px] font-black text-red-600 uppercase tracking-widest hover:underline"
                            >
                                Reject
                            </button>
                          )}
                        </div>
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
