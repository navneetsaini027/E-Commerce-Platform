import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star } from 'lucide-react';

export default function ReviewModal({ isOpen, onClose, product, onSubmitReview }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    if (comment.trim().length < 10) {
      setError('Review must be at least 10 characters');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await onSubmitReview(product._id, { rating, comment });
      setRating(0);
      setComment('');
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.5)',
              zIndex: 1300,
              backdropFilter: 'blur(3px)',
            }}
          />
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            style={{
              position: 'fixed',
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              background: '#fff',
              width: 'min(480px, 90vw)',
              padding: '40px 36px',
              zIndex: 1400,
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            }}
          >
            <button
              onClick={onClose}
              style={{ position: 'absolute', top: 16, right: 16, padding: 8 }}
            >
              <X size={18} />
            </button>

            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Write a Review
              </h2>
              <p style={{ fontSize: 13, color: '#767676', marginTop: 6 }}>
                {product?.name}
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 24 }}>
                <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#767676', display: 'block', marginBottom: 12 }}>
                  Your Rating
                </label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      style={{ padding: 4, cursor: 'pointer' }}
                    >
                      <Star
                        size={32}
                        fill={star <= (hoverRating || rating) ? '#FFD700' : 'none'}
                        color={star <= (hoverRating || rating) ? '#FFD700' : '#d0d0d0'}
                        style={{ transition: 'all 0.2s' }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#767676', display: 'block', marginBottom: 8 }}>
                  Your Review
                </label>
                <textarea
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="Share your experience with this product..."
                  required
                  rows={5}
                  style={{
                    width: '100%',
                    border: '1px solid #d0d0d0',
                    padding: '12px',
                    fontSize: 13,
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                  }}
                />
                <p style={{ fontSize: 11, color: '#767676', marginTop: 4 }}>
                  Minimum 10 characters
                </p>
              </div>

              {error && (
                <p style={{ fontSize: 12, color: '#E50010', marginBottom: 16, textAlign: 'center' }}>
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  background: loading ? '#767676' : '#000',
                  color: '#fff',
                  padding: '14px',
                  fontSize: 12, fontWeight: 700,
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
