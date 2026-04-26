import { useState, useEffect } from 'react';
import { 
  Star, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ShieldCheck, 
  ShieldAlert,
  MessageSquare,
  Search,
  Filter,
  Loader2,
  Trash2,
  Check
} from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    verified: 0
  });

  useEffect(() => {
    fetchReviews();
  }, [status, page]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/reviews', { 
        params: { status: status !== 'all' ? status : '', page } 
      });
      const { data } = response.data;
      setReviews(data.data);
      setLastPage(data.last_page);
      
      // Calculate stats (simplified for UI demonstration)
      setStats({
        total: data.total,
        pending: status === 'pending' ? data.total : reviews.filter(r => !r.is_approved).length,
        approved: status === 'approved' ? data.total : reviews.filter(r => r.is_approved).length,
        verified: reviews.filter(r => r.verified_purchase).length
      });
    } catch (error) {
      toast.error('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.post(`/admin/reviews/${id}/approve`);
      toast.success('Review approved');
      fetchReviews();
    } catch (error) {
      toast.error('Failed to approve review');
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Are you sure you want to reject and delete this review?')) return;
    try {
      await api.delete(`/admin/reviews/${id}/reject`);
      toast.success('Review rejected and deleted');
      fetchReviews();
    } catch (error) {
      toast.error('Failed to reject review');
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            className={`w-4 h-4 ${star <= rating ? 'fill-[#F97316] text-[#F97316]' : 'text-gray-200'}`} 
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#0F172A]">Review Moderation</h1>
          <p className="text-gray-500 font-medium">Approve or reject customer reviews</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1.5 rounded-2xl w-fit">
        {['all', 'pending', 'approved'].map((t) => (
          <button
            key={t}
            onClick={() => { setStatus(t); setPage(1); }}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              status === t 
                ? 'bg-[#F97316] text-white shadow-lg shadow-[#F97316]/20' 
                : 'text-gray-500 hover:text-[#0F172A] hover:bg-white/50'
            }`}
          >
            {t} Reviews
          </button>
        ))}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Reviews', value: stats.total, icon: MessageSquare, bg: 'bg-indigo-50', color: 'text-indigo-600' },
          { label: 'Pending Approval', value: stats.pending, icon: Clock, bg: 'bg-orange-50', color: 'text-orange-600', badge: true },
          { label: 'Approved', value: stats.approved, icon: CheckCircle2, bg: 'bg-green-50', color: 'text-green-600' },
          { label: 'Verified Purchases', value: stats.verified, icon: ShieldCheck, bg: 'bg-blue-50', color: 'text-blue-600' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center space-x-4">
            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
              <div className="flex items-center space-x-2">
                <h4 className="text-2xl font-black text-[#0F172A]">{stat.value}</h4>
                {stat.badge && stat.value > 0 && (
                  <span className="px-2 py-0.5 bg-orange-500 text-white text-[8px] font-black rounded-full animate-pulse">
                    ACT
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Product</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Reviewer</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Rating</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Review</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Verified</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-8 py-20 text-center">
                    <Loader2 className="w-10 h-10 animate-spin text-[#F97316] mx-auto mb-4" />
                    <p className="text-gray-400 font-bold">Loading reviews...</p>
                  </td>
                </tr>
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-8 py-20 text-center text-gray-400 font-bold">
                    No reviews found.
                  </td>
                </tr>
              ) : (
                reviews.map((review) => (
                  <tr key={review.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                          {review.product_thumbnail ? (
                            <img src={review.product_thumbnail} alt={review.product_name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                              <MessageSquare className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                        <span className="font-bold text-[#0F172A] text-xs line-clamp-1 max-w-[120px]">{review.product_name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div>
                        <p className="font-bold text-[#0F172A] text-xs">{review.reviewer_name}</p>
                        <p className="text-[10px] text-gray-400 font-medium">{review.reviewer_email}</p>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      {renderStars(review.rating)}
                    </td>
                    <td className="px-8 py-5">
                      <div className="max-w-[200px]">
                        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                          {review.comment}
                        </p>
                        {review.comment.length > 100 && (
                          <button className="text-[9px] font-black text-[#F97316] uppercase mt-1">Read More</button>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      {review.verified_purchase ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-lg bg-green-50 text-green-600 text-[9px] font-black uppercase">
                          <ShieldCheck className="w-3 h-3 mr-1" />
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-lg bg-gray-50 text-gray-400 text-[9px] font-black uppercase">
                          Unverified
                        </span>
                      )}
                    </td>
                    <td className="px-8 py-5">
                      {review.is_approved ? (
                        <span className="flex items-center text-green-500 font-black text-[10px] uppercase tracking-widest">
                          <Check className="w-3 h-3 mr-1.5" />
                          Approved
                        </span>
                      ) : (
                        <span className="flex items-center text-orange-500 font-black text-[10px] uppercase tracking-widest">
                          <Clock className="w-3 h-3 mr-1.5" />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {!review.is_approved && (
                          <button 
                            onClick={() => handleApprove(review.id)}
                            className="p-2 text-green-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                            title="Approve"
                          >
                            <CheckCircle2 className="w-5 h-5" />
                          </button>
                        )}
                        <button 
                          onClick={() => handleReject(review.id)}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Reject/Delete"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {lastPage > 1 && (
          <div className="px-8 py-6 border-t border-gray-50 flex items-center justify-between">
            <button 
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="px-4 py-2 rounded-xl border border-gray-200 font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-all"
            >
              Previous
            </button>
            <span className="font-black text-[10px] text-gray-400 uppercase tracking-widest">
              Page {page} of {lastPage}
            </span>
            <button 
              disabled={page === lastPage}
              onClick={() => setPage(p => p + 1)}
              className="px-4 py-2 rounded-xl border border-gray-200 font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-all"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
