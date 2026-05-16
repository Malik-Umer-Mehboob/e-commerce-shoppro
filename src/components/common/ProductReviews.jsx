import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Star, ShieldCheck, ChevronDown, Loader2, MessageSquare } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

/* ── Star display (read-only) ─────────────────────────────────────── */
function StarDisplay({ rating, size = 15 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={size}
          className={s <= Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-100 text-gray-200'}
        />
      ))}
    </div>
  );
}

/* ── Interactive star picker ──────────────────────────────────────── */
function StarInput({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  const labels = ['', 'Terrible', 'Poor', 'Average', 'Good', 'Excellent'];
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          onMouseEnter={() => setHovered(s)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110 focus:outline-none"
          aria-label={`Rate ${s} star${s > 1 ? 's' : ''}`}
        >
          <Star
            size={32}
            className={s <= (hovered || value) ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-100 text-gray-200'}
          />
        </button>
      ))}
      {(hovered || value) > 0 && (
        <span className="ml-2 text-sm font-bold text-gray-500">{labels[hovered || value]}</span>
      )}
    </div>
  );
}

/* ── Review skeleton ──────────────────────────────────────────────── */
function ReviewSkeleton() {
  return (
    <div className="space-y-5">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-gray-50 rounded-3xl p-6 animate-pulse">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gray-200" />
            <div className="space-y-2">
              <div className="h-3 w-28 bg-gray-200 rounded" />
              <div className="h-2 w-16 bg-gray-200 rounded" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-3 w-full bg-gray-200 rounded" />
            <div className="h-3 w-3/4 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Main component ───────────────────────────────────────────────── */
export default function ProductReviews({ productId }) {
  const { isAuthenticated } = useSelector((s) => s.auth);

  const [reviews, setReviews]     = useState([]);
  const [meta, setMeta]           = useState({ avg: 0, total: 0 });
  const [page, setPage]           = useState(1);
  const [lastPage, setLastPage]   = useState(1);
  const [loading, setLoading]     = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [eligibility, setEligibility] = useState(null); // null | {can_review, reason, message}
  const [checkingEligibility, setCheckingEligibility] = useState(false);

  const [form, setForm]       = useState({ rating: 0, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);

  /* fetch approved reviews */
  const fetchReviews = useCallback(async (pageNum = 1, append = false) => {
    try {
      pageNum === 1 ? setLoading(true) : setLoadingMore(true);
      const res = await api.get(`/products/${productId}/reviews`, { params: { page: pageNum } });
      const { reviews: paginator, average_rating, total_reviews } = res.data?.data ?? {};
      const items = paginator?.data ?? [];
      setReviews((prev) => (append ? [...prev, ...items] : items));
      setLastPage(paginator?.last_page ?? 1);
      setMeta({ avg: average_rating ?? 0, total: total_reviews ?? 0 });
    } catch {
      // silent
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [productId]);

  /* check eligibility */
  const fetchEligibility = useCallback(async () => {
    try {
      setCheckingEligibility(true);
      const res = await api.get(`/products/${productId}/can-review`);
      setEligibility(res.data?.data ?? null);
    } catch {
      setEligibility(null);
    } finally {
      setCheckingEligibility(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews(1);
    if (isAuthenticated) fetchEligibility();
  }, [productId, isAuthenticated, fetchReviews, fetchEligibility]);

  /* submit review */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.rating === 0) { toast.error('Please select a star rating'); return; }
    if (form.comment.trim().length < 10) { toast.error('Review must be at least 10 characters'); return; }
    try {
      setSubmitting(true);
      await api.post(`/products/${productId}/reviews`, {
        rating: form.rating,
        comment: form.comment.trim(),
      });
      setSubmitted(true);
      setEligibility({ can_review: false, reason: 'already_reviewed', message: 'Your review is pending approval.' });
      toast.success('Review submitted! It will appear after moderation.');
      fetchReviews(1);
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  /* rating breakdown (from loaded reviews; totals come from server) */
  const breakdown = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length;
    const pct = meta.total > 0 ? Math.round((count / meta.total) * 100) : 0;
    return { star, count, pct };
  });

  return (
    <section id="reviews" className="mt-16 border-t border-gray-100 pt-12">
      <h2 className="text-2xl font-black text-gray-900 mb-10">Customer Reviews</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

        {/* ── Left column: summary + form ── */}
        <div className="space-y-8">

          {/* Rating summary */}
          {!loading && (
            <div className="bg-gray-50 rounded-3xl p-8">
              <div className="text-center mb-6">
                <div className="text-5xl font-black text-gray-900">{Number(meta.avg).toFixed(1)}</div>
                <div className="flex justify-center mt-2">
                  <StarDisplay rating={meta.avg} size={20} />
                </div>
                <p className="text-sm text-gray-400 font-medium mt-2">
                  {meta.total} review{meta.total !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="space-y-2">
                {breakdown.map(({ star, count, pct }) => (
                  <div key={star} className="flex items-center gap-3">
                    <span className="text-[11px] font-bold text-gray-500 w-3 shrink-0">{star}</span>
                    <Star size={11} className="fill-yellow-400 text-yellow-400 shrink-0" />
                    <div className="flex-1 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-bold text-gray-400 w-5 text-right shrink-0">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Review form / status */}
          {isAuthenticated ? (
            submitted ? (
              <div className="bg-green-50 border border-green-100 rounded-3xl p-8 text-center">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck size={26} className="text-green-600" />
                </div>
                <h4 className="font-black text-green-800 mb-2">Review Submitted!</h4>
                <p className="text-sm text-green-600">Your review is pending approval by our team.</p>
              </div>
            ) : checkingEligibility ? (
              <div className="flex justify-center py-8">
                <Loader2 size={24} className="animate-spin text-gray-300" />
              </div>
            ) : eligibility?.can_review ? (
              <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
                <h4 className="font-black text-gray-900 mb-6">Write a Review</h4>

                <div className="mb-6">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">
                    Your Rating *
                  </label>
                  <StarInput value={form.rating} onChange={(r) => setForm((f) => ({ ...f, rating: r }))} />
                </div>

                <div className="mb-6">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">
                    Your Review *
                  </label>
                  <textarea
                    id="review-comment"
                    value={form.comment}
                    onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))}
                    placeholder="Share your experience with this product..."
                    rows={5}
                    maxLength={1000}
                    className="w-full border border-gray-200 rounded-2xl p-4 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all"
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-[10px] text-gray-400">Min 10 characters</span>
                    <span className="text-[10px] text-gray-400">{form.comment.length}/1000</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-orange-500 text-white font-black py-4 rounded-2xl hover:bg-orange-600 active:scale-95 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {submitting
                    ? <><Loader2 size={18} className="animate-spin" /> Submitting…</>
                    : 'Submit Review'}
                </button>
              </form>
            ) : eligibility ? (
              <div className="bg-gray-50 border border-gray-100 rounded-3xl p-8 text-center">
                <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare size={22} className="text-gray-400" />
                </div>
                <p className="text-sm font-bold text-gray-500 leading-relaxed">{eligibility.message}</p>
              </div>
            ) : null
          ) : (
            <div className="bg-orange-50 border border-orange-100 rounded-3xl p-8 text-center">
              <MessageSquare size={28} className="text-orange-300 mx-auto mb-4" />
              <p className="text-sm font-bold text-gray-600 mb-5">Sign in to share your experience</p>
              <Link
                to="/login"
                className="inline-block bg-orange-500 text-white font-black px-6 py-3 rounded-xl hover:bg-orange-600 transition-colors text-sm"
              >
                Sign In to Review
              </Link>
            </div>
          )}
        </div>

        {/* ── Right column: reviews list ── */}
        <div className="lg:col-span-2">
          {loading ? (
            <ReviewSkeleton />
          ) : reviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-gray-50 rounded-3xl">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <MessageSquare size={28} className="text-gray-300" />
              </div>
              <p className="font-bold text-gray-400">No reviews yet</p>
              <p className="text-sm text-gray-300 mt-1">Be the first to share your thoughts!</p>
            </div>
          ) : (
            <div className="space-y-5">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3 gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-orange-50 flex items-center justify-center font-black text-orange-500 text-sm shrink-0">
                        {review.reviewer_avatar
                          ? <img src={review.reviewer_avatar} alt={review.reviewer_name} className="w-full h-full object-cover" />
                          : (review.reviewer_name?.[0]?.toUpperCase() ?? '?')}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm leading-tight">{review.reviewer_name}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">{review.created_at}</p>
                      </div>
                    </div>
                    {review.verified_purchase && (
                      <span className="flex items-center gap-1 text-[10px] font-black text-green-600 bg-green-50 px-2 py-1 rounded-full shrink-0">
                        <ShieldCheck size={11} /> Verified Purchase
                      </span>
                    )}
                  </div>
                  <StarDisplay rating={review.rating} size={14} />
                  <p className="mt-3 text-sm text-gray-600 leading-relaxed">{review.comment}</p>
                </div>
              ))}

              {page < lastPage && (
                <button
                  onClick={() => { const next = page + 1; setPage(next); fetchReviews(next, true); }}
                  disabled={loadingMore}
                  className="w-full py-4 border border-gray-200 rounded-2xl text-sm font-bold text-gray-500 hover:border-orange-300 hover:text-orange-500 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {loadingMore
                    ? <><Loader2 size={16} className="animate-spin" /> Loading…</>
                    : <><ChevronDown size={16} /> Load More Reviews</>}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
