import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, ShoppingBag } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function ProductComparison({ products, onClose, onAddToCart }) {
  const { theme } = useTheme();

  if (!products || products.length === 0) return null;

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
            maxWidth: 1200,
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            position: 'relative',
            boxShadow: `0 20px 60px ${theme.colors.shadow}`,
            padding: 40,
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              padding: 8,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <X size={24} color={theme.colors.text} />
          </button>

          <h2 style={{
            fontSize: 28,
            fontWeight: 800,
            color: theme.colors.text,
            marginBottom: 32,
          }}>
            Compare Products
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${products.length}, 1fr)`,
            gap: 24,
          }}>
            {products.map((product) => (
              <div
                key={product._id}
                style={{
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: 12,
                  padding: 20,
                }}
              >
                <div style={{
                  width: '100%',
                  aspectRatio: '3/4',
                  background: theme.colors.background,
                  borderRadius: 8,
                  overflow: 'hidden',
                  marginBottom: 16,
                }}>
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                <h3 style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: theme.colors.text,
                  marginBottom: 8,
                }}>
                  {product.name}
                </h3>

                <div style={{ marginBottom: 12 }}>
                  <span style={{
                    fontSize: 11,
                    color: theme.colors.textSecondary,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}>
                    {product.category}
                  </span>
                </div>

                {/* Price */}
                <div style={{ marginBottom: 12 }}>
                  {product.memberPrice ? (
                    <>
                      <div style={{ fontSize: 20, fontWeight: 800, color: '#E50010' }}>
                        ₹{product.memberPrice.toLocaleString()}
                      </div>
                      <div style={{
                        fontSize: 14,
                        color: theme.colors.textSecondary,
                        textDecoration: 'line-through',
                      }}>
                        ₹{product.price.toLocaleString()}
                      </div>
                    </>
                  ) : (
                    <div style={{ fontSize: 20, fontWeight: 800, color: theme.colors.text }}>
                      ₹{product.price.toLocaleString()}
                    </div>
                  )}
                </div>

                {/* Rating */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                  <div style={{ display: 'flex', gap: 2 }}>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        fill={i < Math.floor(product.averageRating || 0) ? '#FFD700' : 'none'}
                        color="#FFD700"
                      />
                    ))}
                  </div>
                  <span style={{ fontSize: 11, color: theme.colors.textSecondary }}>
                    ({product.reviewCount || 0})
                  </span>
                </div>

                {/* Stock */}
                <div style={{ marginBottom: 16 }}>
                  <span style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: product.stock > 0 ? '#4CAF50' : '#F44336',
                  }}>
                    {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                  </span>
                </div>

                {/* Description */}
                <p style={{
                  fontSize: 12,
                  lineHeight: 1.5,
                  color: theme.colors.textSecondary,
                  marginBottom: 16,
                  minHeight: 60,
                }}>
                  {product.description?.substring(0, 100)}...
                </p>

                {/* Add to Cart */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onAddToCart(product)}
                  disabled={product.stock === 0}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: product.stock > 0 ? 'linear-gradient(135deg, #E50010, #FF4444)' : '#ccc',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    cursor: product.stock > 0 ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                  }}
                >
                  <ShoppingBag size={14} />
                  Add to Cart
                </motion.button>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
