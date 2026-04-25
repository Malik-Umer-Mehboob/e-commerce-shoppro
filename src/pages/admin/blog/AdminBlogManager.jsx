import React, { useEffect, useState } from 'react';
import api from '../../../services/api';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, Filter, MoreVertical, CheckCircle, Clock, FileText, MessageSquare } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminBlogManager = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await api.get('/admin/blog/posts');
      setPosts(response.data.data);
      setLoading(false);
    } catch (err) {
      toast.error('Failed to fetch posts');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await api.delete(`/admin/blog/posts/${id}`);
      toast.success('Post deleted');
      fetchPosts();
    } catch (err) {
      toast.error('Failed to delete post');
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Blog Management</h1>
          <p className="text-slate-500">Create, edit and manage your store's content.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Link 
            to="/admin/blog/comments" 
            className="bg-white border border-slate-100 text-slate-600 px-6 py-3 rounded-2xl font-bold flex items-center space-x-2 transition-all hover:bg-slate-50"
          >
            <MessageSquare size={20} />
            <span>Moderate Comments</span>
          </Link>
          <Link 
            to="/admin/blog/create" 
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center space-x-2 transition-all shadow-lg hover:shadow-orange-500/30"
          >
            <Plus size={20} />
            <span>New Article</span>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search posts..." 
                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 transition-all text-sm w-64"
              />
              <FileText size={16} className="absolute left-3 top-2.5 text-slate-400" />
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-sm font-bold border border-slate-100 hover:bg-slate-100 transition-all">
              <Filter size={16} />
              <span>Filters</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">
                <th className="px-8 py-4">Article</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4">Category</th>
                <th className="px-8 py-4">Author</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan="5" className="text-center py-20">Loading...</td></tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden">
                          <img src={post.featured_image || 'https://via.placeholder.com/100'} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 line-clamp-1">{post.title}</div>
                          <div className="text-xs text-slate-400">{new Date(post.created_at).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        post.status === 'published' ? 'bg-green-100 text-green-700' : 
                        post.status === 'draft' ? 'bg-slate-100 text-slate-500' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {post.status === 'published' ? <CheckCircle size={10} /> : <Clock size={10} />}
                        <span>{post.status}</span>
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-sm font-medium text-slate-600">{post.category?.name || 'General'}</span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="text-sm font-bold text-slate-900">{post.author?.name}</div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link to={`/blog/${post.slug}`} target="_blank" className="p-2 text-slate-400 hover:text-orange-500 transition-colors">
                          <Eye size={18} />
                        </Link>
                        <Link to={`/admin/blog/edit/${post.id}`} className="p-2 text-slate-400 hover:text-blue-500 transition-colors">
                          <Edit size={18} />
                        </Link>
                        <button onClick={() => handleDelete(post.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminBlogManager;
