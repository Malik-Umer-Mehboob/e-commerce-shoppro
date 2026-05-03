import { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Save, 
  Send, 
  Image as ImageIcon, 
  X, 
  Settings, 
  Tag, 
  FileText,
  Loader2,
  Calendar
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import { toast } from 'react-hot-toast';

export default function CreateBlog() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category_id: '',
    status: 'draft',
    tags: '',
    thumbnail: null
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/admin/blog/categories');
      setCategories(response.data?.data ?? []);
    } catch (error) {
      
      setCategories([]);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size must be less than 2MB');
        return;
      }
      setFormData({ ...formData, thumbnail: file });
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, thumbnail: null });
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e, status = null) => {
    if (e) e.preventDefault();
    
    const finalStatus = status || formData.status;
    
    if (!formData.title || !formData.content) {
      toast.error('Title and content are required');
      return;
    }

    setLoading(true);
    const data = new FormData();
    data.append('title', formData.title);
    data.append('content', formData.content);
    data.append('excerpt', formData.excerpt);
    data.append('category_id', formData.category_id);
    data.append('status', finalStatus);
    
    if (formData.tags) {
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
      tagsArray.forEach((tag, index) => {
        data.append(`tags[${index}]`, tag);
      });
    }

    if (formData.thumbnail) {
      data.append('thumbnail', formData.thumbnail);
    }

    try {
      await api.post('/admin/blog/posts', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success(finalStatus === 'published' ? 'Article published!' : 'Draft saved!');
      navigate('/admin/blog');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create article');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 animate-in fade-in duration-500">
      {/* Top Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/admin/blog" className="p-2 hover:bg-gray-50 rounded-xl transition-all text-gray-400 hover:text-[#0F172A]">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <nav className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">
              <Link to="/admin/blog" className="hover:text-[#F97316]">Blog Manager</Link>
              <span>/</span>
              <span className="text-[#0F172A]">New Article</span>
            </nav>
            <h1 className="text-xl font-black text-[#0F172A]">Create New Article</h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button 
            type="button"
            disabled={loading}
            onClick={(e) => handleSubmit(e, 'draft')}
            className="px-6 py-3 rounded-2xl font-black text-[#0F172A] border border-gray-200 hover:bg-gray-50 transition-all flex items-center space-x-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>Save Draft</span>
          </button>
          <button 
            type="button"
            disabled={loading}
            onClick={(e) => handleSubmit(e, 'published')}
            className="bg-[#F97316] text-white px-8 py-3 rounded-2xl font-black shadow-xl shadow-[#F97316]/20 hover:bg-[#ea6a0f] transition-all transform hover:-translate-y-1 flex items-center space-x-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span>Publish Article</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 mt-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main Content Area */}
          <div className="flex-1 space-y-8">
            <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Article Title</label>
                <input 
                  type="text"
                  placeholder="Enter a catchy title..."
                  className="w-full text-4xl font-black text-[#0F172A] border-none focus:ring-0 placeholder:text-gray-200 p-0"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Excerpt</label>
                  <span className={`text-[10px] font-bold ${formData.excerpt.length > 500 ? 'text-red-500' : 'text-gray-300'}`}>
                    {formData.excerpt.length}/500
                  </span>
                </div>
                <textarea 
                  placeholder="Brief description shown in listings..."
                  rows="3"
                  className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-[#F97316]/10 outline-none transition-all font-medium text-gray-600 resize-none"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({...formData, excerpt: e.target.value.slice(0, 500)})}
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Body Content</label>
                <textarea 
                  placeholder="Write your article content here..."
                  className="w-full min-h-[500px] px-8 py-8 rounded-3xl bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-[#F97316]/10 outline-none transition-all font-medium text-lg text-gray-700 leading-relaxed"
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="w-full lg:w-[400px] space-y-8">
            {/* Settings Card */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
              <div className="flex items-center space-x-3 text-[#0F172A]">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <Settings className="w-5 h-5" />
                </div>
                <h3 className="font-black">Article Settings</h3>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center">
                    <Calendar className="w-3 h-3 mr-2" />
                    Status
                  </label>
                  <div className="grid grid-cols-2 gap-3 p-1.5 bg-gray-50 rounded-2xl">
                    <button 
                      onClick={() => setFormData({...formData, status: 'draft'})}
                      className={`py-2.5 rounded-xl text-xs font-black transition-all ${formData.status === 'draft' ? 'bg-white text-[#0F172A] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      Draft
                    </button>
                    <button 
                      onClick={() => setFormData({...formData, status: 'published'})}
                      className={`py-2.5 rounded-xl text-xs font-black transition-all ${formData.status === 'published' ? 'bg-[#F97316] text-white shadow-lg shadow-[#F97316]/20' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      Published
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center">
                    <FileText className="w-3 h-3 mr-2" />
                    Category
                  </label>
                  <select
                    value={formData.category_id ?? ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      color: '#0F172A',
                      backgroundColor: 'white',
                      cursor: 'pointer',
                      outline: 'none',
                    }}
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center">
                    <Tag className="w-3 h-3 mr-2" />
                    Tags
                  </label>
                  <input 
                    type="text"
                    placeholder="e.g. technology, news, tutorial"
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-[#F97316]/10 outline-none transition-all font-bold text-[#0F172A]"
                    value={formData.tags}
                    onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* Thumbnail Card */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
              <div className="flex items-center space-x-3 text-[#0F172A]">
                <div className="p-2 bg-orange-50 text-orange-600 rounded-xl">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <h3 className="font-black">Featured Image</h3>
              </div>

              {!preview ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-100 rounded-[2rem] p-10 flex flex-col items-center justify-center space-y-3 cursor-pointer hover:bg-gray-50 hover:border-[#F97316]/20 transition-all group"
                >
                  <div className="w-14 h-14 bg-gray-50 text-gray-300 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ImageIcon className="w-7 h-7" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-black text-[#0F172A]">Click to upload</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">PNG, JPG up to 2MB</p>
                  </div>
                </div>
              ) : (
                <div className="relative rounded-[2rem] overflow-hidden group border border-gray-100">
                  <img src={preview} alt="Preview" className="w-full aspect-video object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="p-3 bg-white text-[#0F172A] rounded-xl font-black text-xs hover:scale-105 transition-all shadow-lg"
                    >
                      Change
                    </button>
                    <button 
                      onClick={removeImage}
                      className="p-3 bg-red-500 text-white rounded-xl font-black text-xs hover:scale-105 transition-all shadow-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
              
              <input 
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
