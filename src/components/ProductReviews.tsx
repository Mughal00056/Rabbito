import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

interface ProductReviewsProps {
  productId: number;
}

export const ProductReviews: React.FC<ProductReviewsProps> = ({ productId }) => {
  const { getProductReviews, getProductRatingStats, addReview } = useStore();

  const reviews = getProductReviews(productId);
  const stats = getProductRatingStats(productId);

  const [showForm, setShowForm] = useState(false);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [selectedRating, setSelectedRating] = useState<number>(5);
  const [userName, setUserName] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [filterStar, setFilterStar] = useState<number | 'all'>('all');

  const RATING_LABELS: Record<number, string> = {
    5: 'Exceptional (5/5)',
    4: 'Very Good (4/5)',
    3: 'Average (3/5)',
    2: 'Below Expectations (2/5)',
    1: 'Poor (1/5)'
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    addReview({
      productId,
      userName: userName.trim() || 'Verified Customer',
      rating: selectedRating,
      comment: comment.trim()
    });

    setComment('');
    setShowForm(false);
  };

  const displayedReviews = filterStar === 'all'
    ? reviews
    : reviews.filter((r) => Math.round(r.rating) === filterStar);

  return (
    <div className="w-full text-slate-200">
      {/* Rating Summary Header */}
      <div className="bg-[#1a1a24] rounded-2xl p-4 sm:p-5 border border-purple-900/40 mb-5">
        <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-8">
          {/* Big Score Box */}
          <div className="flex flex-col items-center justify-center text-center shrink-0 w-full sm:w-auto">
            <div className="text-3xl sm:text-4xl font-black text-white flex items-center gap-1.5">
              <span>{stats.average.toFixed(1)}</span>
              <i className="fa-solid fa-star text-amber-400 text-2xl" />
            </div>
            <div className="flex items-center gap-1 my-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <i
                  key={s}
                  className={`fa-solid fa-star text-xs ${
                    s <= Math.round(stats.average) ? 'text-amber-400' : 'text-slate-600'
                  }`}
                />
              ))}
            </div>
            <span className="text-[11px] font-bold text-purple-400">
              Based on {stats.count} {stats.count === 1 ? 'review' : 'reviews'}
            </span>
          </div>

          {/* Star Breakdown Bars */}
          <div className="flex-1 w-full space-y-1.5">
            {[5, 4, 3, 2, 1].map((stars) => {
              const countForStar = stats.breakdown[stars] || 0;
              const percent = stats.count > 0 ? Math.round((countForStar / stats.count) * 100) : 0;
              const isSelected = filterStar === stars;

              return (
                <button
                  key={stars}
                  type="button"
                  onClick={() => setFilterStar(isSelected ? 'all' : stars)}
                  className={`w-full flex items-center gap-2 text-xs group transition cursor-pointer px-2 py-0.5 rounded-lg ${
                    isSelected ? 'bg-purple-950/60' : 'hover:bg-purple-950/30'
                  }`}
                >
                  <span className="w-8 text-[11px] font-bold text-purple-300 text-left shrink-0">
                    {stars}★
                  </span>
                  <div className="flex-1 h-2 rounded-full bg-black/60 overflow-hidden border border-purple-900/30">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-purple-500 rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="w-10 text-[10px] font-bold text-purple-400 text-right shrink-0">
                    {percent}%
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Button to Open Form */}
        <div className="mt-4 pt-4 border-t border-purple-900/30 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-purple-300 font-semibold flex items-center gap-1.5">
            <i className="fa-solid fa-shield-halved text-emerald-400 text-xs" />
            <span>100% Verified Customer Ratings</span>
          </div>
          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
            className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white shadow-md shadow-purple-900/40 transition active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            <i className={`fa-solid ${showForm ? 'fa-xmark' : 'fa-pen-to-square'}`} />
            <span>{showForm ? 'Cancel Review' : 'Write a Review'}</span>
          </button>
        </div>
      </div>

      {/* Review Submission Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-[#181822] rounded-2xl p-4 sm:p-5 border-2 border-purple-600/50 mb-5 shadow-xl shadow-purple-950/50 animate-[slideDown_0.2s_ease-out]"
        >
          <h4 className="text-sm font-black text-white uppercase tracking-wider mb-3 flex items-center gap-2">
            <i className="fa-solid fa-star text-amber-400" /> Leave Your Feedback
          </h4>

          {/* Interactive Star Picker */}
          <div className="mb-4">
            <label className="block text-[11px] font-black uppercase tracking-wider text-purple-300 mb-1.5">
              Select Rating: <span className="text-amber-400 font-bold">{RATING_LABELS[hoverRating || selectedRating]}</span>
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const isLit = star <= (hoverRating || selectedRating);
                return (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setSelectedRating(star)}
                    className="p-1 text-2xl transition-transform hover:scale-125 cursor-pointer"
                  >
                    <i
                      className={`fa-solid fa-star ${
                        isLit
                          ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                          : 'text-slate-600'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* User Name */}
          <div className="mb-3">
            <label className="block text-[11px] font-black uppercase tracking-wider text-purple-300 mb-1">
              Your Name (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Ali Raza"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-purple-900/60 bg-[#0a0a0f] text-white outline-none focus:border-purple-400"
            />
          </div>

          {/* Review Text */}
          <div className="mb-4">
            <label className="block text-[11px] font-black uppercase tracking-wider text-purple-300 mb-1">
              Your Review <span className="text-purple-400">*</span>
            </label>
            <textarea
              required
              rows={3}
              placeholder="How was the build quality, sound, comfort, delivery speed?..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-purple-900/60 bg-[#0a0a0f] text-white outline-none focus:border-purple-400 resize-none leading-relaxed"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white shadow-lg shadow-purple-900/50 transition active:scale-95 cursor-pointer"
          >
            Submit Verified Review ⭐
          </button>
        </form>
      )}

      {/* Reviews List Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <h4 className="text-xs font-black uppercase tracking-widest text-purple-300">
          Customer Reviews ({displayedReviews.length})
        </h4>
        {filterStar !== 'all' && (
          <button
            onClick={() => setFilterStar('all')}
            className="text-[11px] font-bold text-purple-400 hover:text-white underline cursor-pointer"
          >
            Show All ({reviews.length})
          </button>
        )}
      </div>

      {/* Reviews Items */}
      {displayedReviews.length === 0 ? (
        <div className="text-center py-8 px-4 rounded-2xl bg-[#1a1a24]/50 border border-purple-900/20">
          <i className="fa-regular fa-comment-dots text-2xl text-purple-500/60 mb-2" />
          <p className="text-xs font-bold text-white">No reviews found for this rating</p>
          <p className="text-[11px] text-purple-400/80 mt-0.5">
            Be the first to share your thoughts by clicking "Write a Review"!
          </p>
        </div>
      ) : (
        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {displayedReviews.map((rev) => (
            <div
              key={rev.id}
              className="p-3.5 rounded-xl bg-[#1a1a24]/80 border border-purple-900/30 hover:border-purple-700/50 transition"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-700 to-fuchsia-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                    {rev.userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white">{rev.userName}</span>
                      {rev.verifiedPurchase && (
                        <span className="inline-flex items-center gap-0.5 text-[9px] font-extrabold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.2 rounded-full">
                          <i className="fa-solid fa-check text-[8px]" /> Verified
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] text-purple-400/70 font-mono">{rev.date}</span>
              </div>

              {/* Stars */}
              <div className="flex items-center gap-1 mb-1.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <i
                    key={s}
                    className={`fa-solid fa-star text-[10px] ${
                      s <= rev.rating ? 'text-amber-400' : 'text-slate-600'
                    }`}
                  />
                ))}
              </div>

              {/* Review Comment */}
              <p className="text-xs text-purple-100/90 leading-relaxed break-words">
                {rev.comment}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
