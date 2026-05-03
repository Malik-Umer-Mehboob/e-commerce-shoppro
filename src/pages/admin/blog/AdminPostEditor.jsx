import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import api from '../../../services/api';
import { toast } from 'react-hot-toast';
import { Save, ArrowLeft, Image as ImageIcon, Settings, Eye } from 'lucide-react';
import MediaLibrary from './MediaLibrary.jsx';

const AdminPostEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [post, setPost] = useState({
    title: '',
    content: '',
    excerpt: '',
    status: 'draft',
    category_id: '',
    featured_image: '',
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);

  useEffect(() => {
    fetchCategories();
    if (isEdit) fetchPost();
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/admin/blog/categories');
      setCategories(response.data?.data ?? []);
    } catch (err) {
      toast.error('Failed to load categories');
      setCategories([]);
    }
  };

  const fetchPost = async () => {
    try {
      const response = await api.get(`/admin/blog/posts/${id}`);
      setPost(response.data);
    } catch (err) {
      toast.error('Failed to load post');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        await api.patch(`/admin/blog/posts/${id}`, post);
        toast.success('Post updated!');
      } else {
        await api.post('/admin/blog/posts', post);
        toast.success('Post created!');
      }
      navigate('/admin/blog');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save post');
    } finally {
      setLoading(false);
    }
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate('/admin/blog')} className="p-2 hover:bg-slate-100 rounded-xl transition-all">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-3xl font-black text-slate-900">{isEdit ? 'Edit Article' : 'Create Article'}</h1>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 text-slate-500 font-bold hover:text-slate-900 transition-all">
            <Eye size={18} />
            <span>Preview</span>
          </button>
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-2xl font-bold flex items-center space-x-2 transition-all shadow-lg hover:shadow-orange-500/30"
          >
            <Save size={18} />
            <span>{loading ? 'Saving...' : 'Save Article'}</span>
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <input 
              type="text" 
              placeholder="Article Title" 
              className="w-full text-3xl font-black text-slate-900 outline-none placeholder:text-slate-200 mb-8 border-b border-transparent focus:border-slate-100 pb-4"
              value={post.title}
              onChange={(e) => setPost({ ...post, title: e.target.value })}
            />
            
            <div className="prose-editor">
              <ReactQuill 
                theme="snow"
                value={post.content}
                onChange={(val) => setPost({ ...post, content: val })}
                modules={quillModules}
                placeholder="Write your story here..."
                className="h-[500px] mb-12"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center space-x-2">
              <Settings size={14} className="text-orange-500" />
              <span>Publish Settings</span>
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Status</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500 text-sm font-medium"
                  value={post.status}
                  onChange={(e) => setPost({ ...post, status: e.target.value })}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Category</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500 text-sm font-medium"
                  value={post.category_id ?? ''}
                  onChange={(e) => setPost({ ...post, category_id: e.target.value })}
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center space-x-2">
              <ImageIcon size={14} className="text-orange-500" />
              <span>Featured Image</span>
            </h3>
            
            <div 
              onClick={() => setShowMediaLibrary(true)}
              className="aspect-video bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-4 text-center cursor-pointer hover:border-orange-500 transition-colors"
            >
              {post.featured_image ? (
                <img src={post.featured_image} className="w-full h-full object-cover rounded-xl" />
              ) : (
                <>
                  <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-400 mb-2">
                    <ImageIcon size={20} />
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Click to select image</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {showMediaLibrary && (
        <MediaLibrary 
          onSelect={(url) => {
            setPost({ ...post, featured_image: url });
            setShowMediaLibrary(false);
          }}
          onClose={() => setShowMediaLibrary(false)}
        />
      )}
    </div>
  );
};

export default AdminPostEditor;
