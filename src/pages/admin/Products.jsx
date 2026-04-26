import { useState, useEffect } from 'react';
import { 
  Package, CheckCircle, Clock, AlertTriangle, 
  Plus, Search, Eye, EyeOff, Pencil, Trash2 
} from 'lucide-react';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export default function AdminProducts() {
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

  const getStatusBadge = (status, stock) => {
    if (stock <= 0) return <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg bg-red-100 text-red-700">Out of Stock</span>;
    
    switch (status) {
      case 'published':
        return <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg bg-green-100 text-green-700">Published</span>;
      case 'draft':
        return <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg bg-gray-100 text-gray-500">Draft</span>;
      case 'archived':
        return <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg bg-red-100 text-red-600">Archived</span>;
      default:
        return <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg bg-gray-100 text-gray-700">{status}</span>;
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
          { icon: Package, label: 'Total Products', value: stats.total, color: 'blue' },
          { icon: CheckCircle, label: 'Published', value: stats.published, color: 'green' },
          { icon: Clock, label: 'Drafts', value: stats.drafts, color: 'yellow' },
          { icon: AlertTriangle, label: 'Low Stock', value: stats.lowStock, color: 'red' }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center">
              <stat.icon className="w-6 h-6 text-[#F97316]" />
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
            onKeyDown={(e) => e.key === 'Enter' && fetchProducts()}
          />
        </div>
        <select 
          className="px-6 py-3 rounded-2xl bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-[#F97316]/10 outline-none transition-all font-bold text-[#0F172A]"
          value={filters.category_id}
          onChange={(e) => setFilters({ ...filters, category_id: e.target.value, page: 1 })}
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <select 
          className="px-6 py-3 rounded-2xl bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-[#F97316]/10 outline-none transition-all font-bold text-[#0F172A]"
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
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
                <tr>
                  <td colSpan="6" className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 border-4 border-[#F97316] border-t-transparent rounded-full animate-spin mb-4"></div>
                      <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading products...</p>
                    </div>
                  </td>
                </tr>
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
                        <img 
                          src={product.thumbnail ? `http://localhost:8000/storage/${product.thumbnail}` : 'https://via.placeholder.com/48'} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-black text-[#0F172A] line-clamp-1">{product.name}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">SKU: {product.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm font-bold text-gray-500">{product.category?.name}</td>
                  <td className="px-8 py-6">
                    <p className="font-black text-[#0F172A]">Rs. {product.price}</p>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`font-black text-sm ${product.stock_quantity <= product.low_stock_threshold ? 'text-red-500' : 'text-[#0F172A]'}`}>
                      {product.stock_quantity}
                    </span>
                  </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col space-y-2">
                        {getStatusBadge(product.status, product.stock_quantity)}
                        {product.status === 'draft' && (
                          <button 
                            onClick={() => toggleStatus(product)}
                            className="text-[10px] font-black text-[#F97316] uppercase tracking-widest hover:underline text-left"
                          >
                            Publish
                          </button>
                        )}
                        {product.status === 'published' && (
                          <button 
                            onClick={() => toggleStatus(product)}
                            className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:underline text-left"
                          >
                            Unpublish
                          </button>
                        )}
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
        <div className="p-8 bg-gray-50/50 flex items-center justify-between border-t border-gray-50">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Showing {products.length} products</p>
          <div className="flex space-x-2">
            <button 
              disabled={filters.page === 1}
              onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
              className="px-6 py-2 rounded-xl bg-white border border-gray-200 text-xs font-black text-[#0F172A] hover:bg-gray-50 disabled:opacity-50 transition-all"
            >
              Prev
            </button>
            <button 
              onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
              className="px-6 py-2 rounded-xl bg-white border border-gray-200 text-xs font-black text-[#0F172A] hover:bg-gray-50 disabled:opacity-50 transition-all"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
