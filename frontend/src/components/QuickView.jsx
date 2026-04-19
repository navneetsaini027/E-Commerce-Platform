import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Heart, Star } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useState } from 'react';

export default function QuickView({ product, onClose, onAddToCart, onAddToWishlist }) {
  const { theme } = useTheme();
  const [selectedImage, setSelectedImage] = useState(0);

  if (!product) return null;

  // Handle both single image and images array
  const images = product.images && product.images.length > 0 
    ? product.images 
    : product.image 
      ? [product.image] 
      : [];

  return (
    <AnimatePresence>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: theme.colors.overlay,
          backdropFilter: 'blur(8px)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
        }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: theme.colors.surface,
            borderRadius: 16,
            maxWidth: 900,
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            position: 'relative',
            boxShadow: `0 20px 60px ${theme.colors.shadow}`,
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              padding: 8,
              background: theme.colors.surface,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: '50%',
              cursor: 'pointer',
              zIndex: 10,
              boxShadow: `0 2px 8px ${theme.colors.shadow}`,
            }}
          >
            <X size={20} color={theme.colors.text} />
          </button>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, padding: 40 }}>
            {/* Left - Images */}
            <div>
              {images.length > 0 ? (
                <>
                  <div style={{
                    width: '100%',
                    aspectRatio: '3/4',
                    background: theme.colors.background,
                    borderRadius: 12,
                    overflow: 'hidden',
                    marginBottom: 16,
                  }}>
                    <img
                      src={images[selectedImage]}
                      alt={product.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        console.error('Image failed to load:', images[selectedImage]);
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                  {images.length > 1 && (
                    <div style={{ display: 'flex', gap: 8 }}>
                      {images.map((img, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedImage(i)}
                          style={{
                            width: 60,
                            height: 80,
                            borderRadius: 8,
                            overflow: 'hidden',
                            border: selectedImage === i ? `2px solid ${theme.colors.text}` : `1px solid ${theme.colors.border}`,
                            cursor: 'pointer',
                            padding: 0,
                          }}
                        >
                          <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div style={{
                  width: '100%',
                  aspectRatio: '3/4',
                  background: theme.colors.background,
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: theme.colors.textSecondary,
                  fontSize: 14,
                }}>
                  No image available
                </div>
              )}
            </div>

            {/* Right - Details */}
            <div>
              <div style={{ marginBottom: 8 }}>
                <span style={{
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: theme.colors.textSecondary,
                }}>
                  {product.category}
                </span>
              </div>

              <h2 style={{
                fontSize: 28,
                fontWeight: 800,
                color: theme.colors.text,
                marginBottom: 12,
                lineHeight: 1.2,
              }}>
                {product.name}
              </h2>

              {/* Rating */}
              {product.averageRating > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <div style={{ display: 'flex', gap: 2 }}>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        fill={i < Math.floor(product.averageRating) ? '#FFD700' : 'none'}
                        color="#FFD700"
                      />
                    ))}
                  </div>
                  <span style={{ fontSize: 12, color: theme.colors.textSecondary }}>
                    ({product.reviewCount || 0} reviews)
                  </span>
                </div>
              )}

              {/* Price */}
              <div style={{ marginBottom: 20 }}>
                {product.memberPrice ? (
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                    <span style={{ fontSize: 32, fontWeight: 800, color: '#E50010' }}>
                      ₹{product.memberPrice.toLocaleString()}
                    </span>
                    <span style={{
                      fontSize: 18,
                      color: theme.colors.textSecondary,
                      textDecoration: 'line-through',
                    }}>
                      ₹{product.price.toLocaleString()}
                    </span>
                    <span style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: '#4CAF50',
                      background: 'rgba(76, 175, 80, 0.1)',
                      padding: '4px 8px',
                      borderRadius: 4,
                    }}>
                      {Math.round((1 - product.memberPrice / product.price) * 100)}% OFF
                    </span>
                  </div>
                ) : (
                  <span style={{ fontSize: 32, fontWeight: 800, color: theme.colors.text }}>
                    ₹{product.price.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Description */}
              <p style={{
                fontSize: 14,
                lineHeight: 1.6,
                color: theme.colors.textSecondary,
                marginBottom: 24,
              }}>
                {product.description}
              </p>

              {/* Stock Status */}
              <div style={{ marginBottom: 24 }}>
                {product.stock > 0 || product.inStock !== false ? (
                  <span style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#4CAF50',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}>
                    <span style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: '#4CAF50',
                    }} />
                    In Stock {product.stock ? `(${product.stock} available)` : ''}
                  </span>
                ) : (
                  <span style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#F44336',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}>
                    <span style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: '#F44336',
                    }} />
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: 12 }}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onAddToCart(product);
                    onClose();
                  }}
                  disabled={product.stock === 0 || product.inStock === false}
                  style={{
                    flex: 1,
                    padding: '14px 24px',
                    background: (product.stock > 0 || product.inStock !== false) ? 'linear-gradient(135deg, #E50010, #FF4444)' : '#ccc',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    cursor: (product.stock > 0 || product.inStock !== false) ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                  }}
                >
                  <ShoppingBag size={18} />
                  Add to Cart
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    onAddToWishlist(product);
                  }}
                  style={{
                    padding: '14px',
                    background: 'none',
                    border: `2px solid ${theme.colors.text}`,
                    borderRadius: 8,
                    cursor: 'pointer',
                  }}
                >
                  <Heart size={20} color={theme.colors.text} />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
