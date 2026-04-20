import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, ShoppingBag, Star } from 'lucide-react';
import ImageGallery from './ImageGallery';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export default function ProductDetail({ product, onClose, onAddToCart, onAddToWishlist, onOpenReview, user }) {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState(null);
  const [wishlisted, setWishlisted] = useState(false);
  const [added, setAdded] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [colorError, setColorError] = useState(false);

  const hasColors = product?.colorVariants && product.colorVariants.length > 0;

  // Set default color
  useState(() => {
    if (hasColors && !selectedColor) setSelectedColor(product.colorVariants[0]);
  });

  if (!product) return null;

  const discount = product.memberPrice
    ? Math.round(((product.price - product.memberPrice) / product.price) * 100)
    : null;

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 2000);
      return;
    }
    if (hasColors && !selectedColor) {
      setColorError(true);
      setTimeout(() => setColorError(false), 2000);
      return;
    }
    const productToAdd = {
      ...product,
      selectedSize,
      selectedColor: selectedColor?.color || null,
      image: selectedColor?.image || product.image,
    };
    onAddToCart(productToAdd);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <AnimatePresence>
      {product && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.5)',
              zIndex: 1300, backdropFilter: 'blur(3px)',
            }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              top: '50%', 
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: '#fff',
              width: 'min(900px, 95vw)',
              maxHeight: '90vh',
              overflowY: 'auto',
              zIndex: 1400,
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              boxShadow: '0 25px 80px rgba(0,0,0,0.2)',
            }}
            className="product-detail-modal"
          >
            {/* Left - Image Gallery */}
            <div style={{ position: 'relative', aspectRatio: '3/4', background: '#f5f5f5' }}>
              <ImageGallery 
                images={
                  hasColors && selectedColor
                    ? [selectedColor.image, ...product.colorVariants.filter(cv => cv.color !== selectedColor.color).map(cv => cv.image)]
                    : product.images && product.images.length > 0 ? product.images : [product.image]
                }
                productName={product.name}
              />
              {discount && (
                <div style={{
                  position: 'absolute', top: 16, left: 16,
                  background: '#E50010', color: '#fff',
                  fontSize: 11, fontWeight: 700,
                  padding: '4px 10px',
                  zIndex: 10,
                }}>
                  -{discount}% OFF
                </div>
              )}
            </div>

            {/* Right - Details */}
            <div style={{ padding: '40px 36px', display: 'flex', flexDirection: 'column' }}>
              {/* Close button */}
              <button
                onClick={onClose}
                className="product-detail-close"
                style={{ position: 'absolute', top: 16, right: 16, padding: 8, zIndex: 10, background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>

              {/* Category */}
              <p style={{
                fontSize: 11, fontWeight: 600,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                color: '#767676', marginBottom: 8,
              }}>
                {product.category}
              </p>

              {/* Name */}
              <h2 style={{
                fontSize: 24, fontWeight: 800,
                letterSpacing: '-0.02em',
                marginBottom: 16, lineHeight: 1.2,
              }}>
                {product.name}
              </h2>

              {/* Price */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                {product.memberPrice ? (
                  <>
                    <span style={{ fontSize: 22, fontWeight: 800, color: '#E50010' }}>
                      ₹{product.memberPrice.toLocaleString()}
                    </span>
                    <span style={{ fontSize: 16, color: '#767676', textDecoration: 'line-through' }}>
                      ₹{product.price.toLocaleString()}
                    </span>
                    <span style={{
                      fontSize: 10, fontWeight: 700, color: '#E50010',
                      border: '1px solid #E50010', padding: '2px 6px',
                    }}>
                      MEMBER PRICE
                    </span>
                  </>
                ) : (
                  <span style={{ fontSize: 22, fontWeight: 800 }}>
                    ₹{product.price.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Description */}
              <p style={{ fontSize: 14, color: '#444', lineHeight: 1.7, marginBottom: 28 }}>
                {product.description || `Premium quality ${product.category.toLowerCase()} crafted with finest materials. Perfect for all occasions. Easy care and long lasting fabric.`}
              </p>

              {/* Color Selection */}
              {hasColors && (
                <div style={{ marginBottom: 28 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12, color: colorError ? '#E50010' : '#000' }}>
                    {colorError ? 'Please select a colour' : `Colour: ${selectedColor?.color || 'Select'}`}
                  </p>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    {product.colorVariants.map((cv, i) => (
                      <button key={i} onClick={() => { setSelectedColor(cv); setColorError(false); }}
                        title={cv.color}
                        style={{
                          width: 36, height: 36, borderRadius: '50%',
                          background: cv.colorCode || '#ccc',
                          border: selectedColor?.color === cv.color ? '3px solid #E50010' : '3px solid transparent',
                          outline: selectedColor?.color === cv.color ? '2px solid #E50010' : '2px solid #ddd',
                          cursor: 'pointer', padding: 0, transition: 'all 0.2s',
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              <div style={{ marginBottom: 28 }}>
                <p style={{
                  fontSize: 11, fontWeight: 700,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  marginBottom: 12,
                  color: sizeError ? '#E50010' : '#000',
                }}>
                  {sizeError ? 'Please select a size' : 'Select Size'}
                </p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {SIZES.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      style={{
                        width: 44, height: 44,
                        border: `1px solid ${selectedSize === size ? '#000' : '#d0d0d0'}`,
                        background: selectedSize === size ? '#000' : '#fff',
                        color: selectedSize === size ? '#fff' : '#000',
                        fontSize: 12, fontWeight: 600,
                        transition: 'all 0.2s',
                        cursor: 'pointer',
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: 12, marginTop: 'auto' }}>
                <button
                  onClick={handleAddToCart}
                  style={{
                    flex: 1,
                    background: added ? '#333' : '#000',
                    color: '#fff',
                    padding: '15px',
                    fontSize: 12, fontWeight: 700,
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    transition: 'background 0.2s',
                  }}
                >
                  <ShoppingBag size={14} />
                  {added ? 'Added!' : 'Add to Bag'}
                </button>

                <button
                  onClick={() => { 
                    if (onAddToWishlist) {
                      onAddToWishlist(product);
                      setWishlisted(true);
                    }
                  }}
                  style={{
                    width: 52, height: 52,
                    border: `1px solid ${wishlisted ? '#E50010' : '#d0d0d0'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s',
                    background: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <Heart
                    size={18}
                    fill={wishlisted ? '#E50010' : 'none'}
                    stroke={wishlisted ? '#E50010' : '#000'}
                  />
                </button>
              </div>

              {/* Shipping info */}
              <p style={{ fontSize: 12, color: '#767676', marginTop: 16 }}>
                🚚 Free shipping on orders above ₹999
              </p>

              {/* Reviews Section */}
              <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid #e0e0e0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div>
                    <h3 style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>
                      Customer Reviews
                    </h3>
                    {product.numReviews > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ display: 'flex', gap: 2 }}>
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star
                              key={star}
                              size={14}
                              fill={star <= Math.round(product.averageRating) ? '#FFD700' : 'none'}
                              color={star <= Math.round(product.averageRating) ? '#FFD700' : '#d0d0d0'}
                            />
                          ))}
                        </div>
                        <span style={{ fontSize: 12, color: '#767676' }}>
                          {product.averageRating.toFixed(1)} ({product.numReviews} {product.numReviews === 1 ? 'review' : 'reviews'})
                        </span>
                      </div>
                    )}
                  </div>
                  {user && (
                    <button
                      onClick={() => onOpenReview(product)}
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: '#000',
                        border: '1px solid #000',
                        padding: '8px 16px',
                      }}
                    >
                      Write Review
                    </button>
                  )}
                </div>

                {product.reviews && product.reviews.length > 0 ? (
                  <div style={{ maxHeight: 200, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {product.reviews.slice(0, 3).map((review, idx) => (
                      <div key={idx} style={{ paddingBottom: 16, borderBottom: '1px solid #f0f0f0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                          <span style={{ fontSize: 12, fontWeight: 600 }}>{review.userName}</span>
                          <div style={{ display: 'flex', gap: 2 }}>
                            {[1, 2, 3, 4, 5].map(star => (
                              <Star
                                key={star}
                                size={12}
                                fill={star <= review.rating ? '#FFD700' : 'none'}
                                color={star <= review.rating ? '#FFD700' : '#d0d0d0'}
                              />
                            ))}
                          </div>
                        </div>
                        <p style={{ fontSize: 12, color: '#444', lineHeight: 1.5 }}>{review.comment}</p>
                        <p style={{ fontSize: 10, color: '#999', marginTop: 4 }}>
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: 12, color: '#767676', textAlign: 'center', padding: '20px 0' }}>
                    No reviews yet. Be the first to review!
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          <style>{`
            .product-detail-modal {
              position: fixed !important;
              top: 50% !important;
              left: 50% !important;
              transform: translate(-50%, -50%) !important;
            }
            @media (max-width: 640px) {
              .product-detail-modal {
                grid-template-columns: 1fr !important;
                top: 0 !important; 
                left: 0 !important;
                transform: none !important;
                width: 100vw !important;
                max-height: 100vh !important;
                border-radius: 0 !important;
                overflow-y: auto !important;
              }
              .product-detail-close {
                position: fixed !important;
                top: 12px !important;
                right: 12px !important;
                z-index: 1500 !important;
                background: rgba(255,255,255,0.95) !important;
                border-radius: 50% !important;
                width: 36px !important;
                height: 36px !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2) !important;
              }
            }
          `}</style>
        </>
      )}
    </AnimatePresence>
  );
}
