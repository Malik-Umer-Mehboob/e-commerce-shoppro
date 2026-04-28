import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  Book, 
  ChevronRight,
  Filter,
  CheckCircle2,
  XCircle,
  FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

export default function KBManagement() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'FAQ',
    content: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await api.get(`/kb`);
      setArticles(response.data.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load articles');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingArticle) {
        await api.put(`/kb/${editingArticle.id}`, formData);
        toast.success('Article updated');
      } else {
        await api.post(`/kb`, formData);
        toast.success('Article created');
      }
      setShowModal(false);
      setEditingArticle(null);
      setFormData({ title: '', category: 'FAQ', content: '' });
      fetchArticles();
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;
    try {
      await api.delete(`/kb/${id}`);
      toast.success('Article deleted');
      fetchArticles();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const handleEdit = (article) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      category: article.category,
      content: article.content
    });
    setShowModal(true);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-black text-[#0F172A]">Knowledge Base</h1>
          <p className="text-gray-500 text-sm font-medium">Manage help articles and self-service content</p>
        </div>
        <button 
          onClick={() => {
            setEditingArticle(null);
            setFormData({ title: '', category: 'FAQ', content: '' });
            setShowModal(true);
          }}
          className="inline-flex items-center justify-center space-x-2 bg-[#F97316] text-white px-6 py-3 rounded-2xl font-black shadow-xl shadow-[#F97316]/20 hover:bg-[#ea6a0f] transition-all transform hover:-translate-y-1"
        >
          <Plus className="w-5 h-5" />
          <span>New Article</span>
        </button>
      </div>

      {/* Stats & Search */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search articles by title or content..."
            className="w-full pl-12 pr-4 py-4 rounded-3xl border border-gray-100 shadow-sm outline-none focus:ring-4 focus:ring-[#F97316]/10 focus:border-[#F97316] transition-all"
          />
        </div>
        <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between px-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Articles</p>
              <p className="text-lg font-black text-[#0F172A]">{articles.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
          [1, 2, 3, 4].map(n => <div key={n} className="h-48 bg-white animate-pulse rounded-3xl border border-gray-100"></div>)
        ) : articles.length > 0 ? (
          articles.map((article) => (
            <div key={article.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group border-l-4 border-l-transparent hover:border-l-[#F97316]">
              <div className="flex justify-between items-start mb-4">
                <span className="bg-[#F97316]/10 text-[#F97316] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                  {article.category}
                </span>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => handleEdit(article)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(article.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <h3 className="text-xl font-black text-[#0F172A] mb-2 group-hover:text-[#F97316] transition-colors">{article.title}</h3>
              <p className="text-sm text-gray-500 line-clamp-2 mb-6 font-medium">
                {article.content.replace(/<[^>]*>?/gm, '')}
              </p>

              <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                <div className="flex items-center space-x-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <span className="flex items-center">
                    <Eye className="w-3.5 h-3.5 mr-1.5" />
                    {article.views}
                  </span>
                  <span className="flex items-center text-green-600">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                    {article.helpful_count}
                  </span>
                  <span className="flex items-center text-red-600">
                    <XCircle className="w-3.5 h-3.5 mr-1.5" />
                    {article.not_helpful_count}
                  </span>
                </div>
                <button 
                  onClick={() => navigate(`/help/article/${article.slug}`)}
                  className="text-xs font-black text-[#0F172A] flex items-center hover:underline"
                >
                  View Live <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-gray-200">
            <Book className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-500 max-w-sm mx-auto">Start by creating your first help article to assist your customers.</p>
          </div>
        )}
      </div>

      {/* Article Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="bg-[#0F172A] p-8 text-white flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black">{editingArticle ? 'Edit Article' : 'Create New Article'}</h2>
                <p className="text-gray-400 text-sm">Fill in the details to publish your content</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <XCircle className="w-8 h-8" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Article Title</label>
                  <input
                    required
                    type="text"
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-[#F97316] outline-none transition-all font-bold"
                    placeholder="e.g. How to track your order"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Category</label>
                  <select
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-[#F97316] outline-none transition-all font-bold"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option>FAQ</option>
                    <option>Shipping & Delivery</option>
                    <option>Returns & Exchanges</option>
                    <option>Payment</option>
                    <option>Account Management</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Content (HTML supported)</label>
                <textarea
                  required
                  rows="12"
                  className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-[#F97316] outline-none transition-all font-medium resize-none"
                  placeholder="Write your article content here..."
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                ></textarea>
              </div>

              <div className="flex items-center justify-end space-x-4 pt-6">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="px-8 py-4 rounded-2xl font-black text-gray-500 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-[#F97316] text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-[#F97316]/20 hover:bg-[#ea6a0f] transition-all transform hover:-translate-y-1"
                >
                  {editingArticle ? 'Save Changes' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
