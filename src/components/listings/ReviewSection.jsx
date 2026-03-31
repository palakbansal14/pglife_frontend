import { useState, useEffect } from 'react';
import { Star, Loader2, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

function StarRating({ value, onChange, size = 20 }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(n => (
        <button key={n} type="button"
          onClick={() => onChange?.(n)}
          onMouseEnter={() => onChange && setHover(n)}
          onMouseLeave={() => onChange && setHover(0)}
          className="transition-transform hover:scale-110">
          <Star size={size}
            className={`transition-colors ${n <= (hover || value) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
          />
        </button>
      ))}
    </div>
  );
}

export default function ReviewSection({ listingId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    api.get(`/reviews/${listingId}`).then(r => setReviews(r.data.reviews || [])).finally(() => setLoading(false));
  }, [listingId]);

  const submit = async () => {
    if (!rating) return toast.error('Please select a rating');
    if (!comment.trim()) return toast.error('Please write a comment');
    setSubmitting(true);
    try {
      const { data } = await api.post(`/reviews/${listingId}`, { rating, comment });
      setReviews(prev => [data.review, ...prev]);
      setRating(0); setComment('');
      toast.success('Review submitted! 🎉');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally { setSubmitting(false); }
  };

  return (
    <div className="card p-5">
      <h3 className="font-display font-bold text-lg mb-5">Reviews & Ratings</h3>

      {/* Write review */}
      {isLoggedIn && (
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <p className="text-sm font-semibold text-gray-700 mb-3">Write a Review</p>
          <StarRating value={rating} onChange={setRating} />
          <textarea
            value={comment} onChange={e => setComment(e.target.value)}
            placeholder="Share your experience with this PG..."
            rows={3}
            className="input-field mt-3 resize-none"
          />
          <button onClick={submit} disabled={submitting}
            className="btn-primary text-sm py-2 px-5 mt-3 flex items-center gap-2">
            {submitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
            Submit Review
          </button>
        </div>
      )}

      {/* Reviews list */}
      {loading ? (
        <div className="text-center py-6"><Loader2 size={24} className="animate-spin text-gray-300 mx-auto" /></div>
      ) : reviews.length === 0 ? (
        <p className="text-center text-gray-400 text-sm py-6">No reviews yet. Be the first to review!</p>
      ) : (
        <div className="space-y-4">
          {reviews.map(review => (
            <div key={review._id} className="flex gap-3 pb-4 border-b border-gray-100 last:border-0">
              <div className="w-9 h-9 bg-brand-100 rounded-full flex-shrink-0 flex items-center justify-center">
                <span className="text-brand-600 font-bold text-sm">{review.user?.name?.charAt(0).toUpperCase()}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sm text-gray-800">{review.user?.name}</span>
                  <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString('en-IN')}</span>
                </div>
                <StarRating value={review.rating} size={14} />
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">{review.comment}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
