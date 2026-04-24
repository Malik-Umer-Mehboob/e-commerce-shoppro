import React, { useEffect, useState } from 'react';
import api from '../../../services/api';
import { Check, X, Trash2, User, MessageCircle, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminCommentModeration = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await api.get('/admin/blog/comments');
      setComments(response.data);
      setLoading(false);
    } catch (err) {
      toast.error('Failed to fetch comments');
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.patch(`/admin/blog/comments/${id}`, { status });
      toast.success(`Comment ${status}`);
      fetchComments();
    } catch (err) {
      toast.error('Action failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this comment permanently?')) return;
    try {
      await api.delete(`/admin/blog/comments/${id}`);
      toast.success('Comment deleted');
      fetchComments();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900">Comment Moderation</h1>
        <p className="text-slate-500">Manage and moderate community discussions.</p>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">
                <th className="px-8 py-4">User</th>
                <th className="px-8 py-4">Comment</th>
                <th className="px-8 py-4">Post</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan="5" className="text-center py-20">Loading...</td></tr>
              ) : comments.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-20 text-slate-400">No comments to moderate.</td></tr>
              ) : (
                comments.map((comment) => (
                  <tr key={comment.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                          <User size={16} />
                        </div>
                        <span className="text-sm font-bold text-slate-900">{comment.user?.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-sm text-slate-600 line-clamp-2 max-w-md">{comment.content}</p>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-xs font-medium text-slate-400 line-clamp-1">{comment.post?.title}</span>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        comment.status === 'approved' ? 'bg-green-100 text-green-700' : 
                        comment.status === 'pending' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {comment.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {comment.status !== 'approved' && (
                          <button onClick={() => handleStatusChange(comment.id, 'approved')} className="p-2 text-green-500 hover:bg-green-50 rounded-xl transition-all">
                            <Check size={18} />
                          </button>
                        )}
                        {comment.status !== 'rejected' && (
                          <button onClick={() => handleStatusChange(comment.id, 'rejected')} className="p-2 text-orange-500 hover:bg-orange-50 rounded-xl transition-all">
                            <X size={18} />
                          </button>
                        )}
                        <button onClick={() => handleDelete(comment.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all">
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

export default AdminCommentModeration;
