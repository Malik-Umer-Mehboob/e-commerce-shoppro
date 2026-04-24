import React, { useState } from 'react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { Send, User } from 'lucide-react';
import { useSelector } from 'react-redux';

const CommentSection = ({ postId, comments, onCommentAdded }) => {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setSubmitting(true);
    try {
      await api.post('/blog/comments', { post_id: postId, content });
      toast.success('Comment submitted for moderation!');
      setContent('');
      if (onCommentAdded) onCommentAdded();
    } catch (err) {
      toast.error('Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const renderComment = (comment) => (
    <div key={comment.id} className="space-y-4">
      <div className="flex space-x-4 p-4 bg-white rounded-3xl border border-slate-100 shadow-sm">
        <div className="w-10 h-10 bg-slate-200 rounded-2xl flex items-center justify-center font-black text-slate-500">
          {comment.user?.name.charAt(0)}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-slate-900">{comment.user?.name}</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase">{new Date(comment.created_at).toLocaleDateString()}</span>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">{comment.content}</p>
        </div>
      </div>
      {comment.children?.length > 0 && (
        <div className="ml-12 space-y-4 border-l-2 border-slate-100 pl-6">
          {comment.children.map(child => renderComment(child))}
        </div>
      )}
    </div>
  );

  return (
    <div className="mt-16 pt-16 border-t border-slate-100">
      <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center space-x-3">
        <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center">
          <MessageCircle size={20} />
        </div>
        <span>Community Discussion</span>
      </h3>

      {/* Comment Form */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-12 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-xs">
              {user?.name.charAt(0)}
            </div>
            <span className="text-sm font-bold text-slate-900">{user?.name}</span>
          </div>
          <textarea 
            rows="4" 
            placeholder="Share your thoughts on this story..." 
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500 transition-all text-sm mb-4"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
          <div className="flex justify-end">
            <button 
              disabled={submitting}
              className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold flex items-center space-x-2 hover:bg-slate-800 transition-all shadow-lg disabled:opacity-50"
            >
              <Send size={18} />
              <span>{submitting ? 'Posting...' : 'Post Comment'}</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-12 p-8 bg-orange-50 rounded-[2rem] border border-orange-100 text-center">
          <p className="text-orange-900 font-bold mb-4 text-lg">Join the conversation</p>
          <p className="text-orange-700 text-sm mb-6">You must be logged in to share your thoughts.</p>
          <Link to="/login" className="inline-block bg-orange-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg">
            Sign In to Comment
          </Link>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {comments?.length > 0 ? (
          comments.filter(c => !c.parent_id).map(comment => renderComment(comment))
        ) : (
          <div className="text-center py-12 text-slate-400">
            No comments yet. Be the first to start the discussion!
          </div>
        )}
      </div>
    </div>
  );
};

// Internal MessageCircle as it's not imported yet
import { MessageCircle, Link } from 'lucide-react';

export default CommentSection;
