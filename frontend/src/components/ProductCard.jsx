import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart, Star, Eye } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function ProductCard({ product, onAddToCart, onAddToWishlist, onProductClick, onQuickView }) {
  const [hovered, setHovered] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [added, setAdded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { theme } = useTheme();

  const handleAdd = (e) => {
    e.stopPropagation();
    if (!product.inStock) {
      alert('This product is currently out of stock');
      return;
    }
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const discount = product.memberPrice
    ? Math.round(((product.price - product.memberPrice) / product.price) * 100)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => {
        console.log('Product clicked:', product.name);
        onProductClick && onProductClick(product);
      }}
      style={{ cursor: 'pointer' }}
    >
      {/* Image container */}
      <div style={{
        position: 'relative',
        overflow: 'hidden',
        aspectRatio: '3/4',
        background: theme.colors.surface,
        marginBottom: 12,
        border: `1px solid ${theme.colors.border}`,
        transition: 'border-color 0.3s ease',
      }}>
        <motion.img
          src={product.image}
          alt={product.name}
          animate={{ scale: hovered ? 1.06 : 1 }}
          transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
          onError={() => setImageError(true)}
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover',
            display: imageError ? 'none' : 'block',
          }}
          loading="lazy"
        />
        {imageError && (
          <div style={{
            width: '100%', height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: theme.colors.surface, color: theme.colors.textSecondary,
            fontSize: 14, fontWeight: 500,
          }}>
            {product.name}
          </div>
        )}

        {/* Sale badge */}
        {discount && (
          <div style={{
            position: 'absolute', top: 12, left: 12,
            background: theme.colors.secondary, color: '#fff',
            fontSize: 10, fontWeight: 700,
            letterSpacing: '0.08em',
            padding: '3px 8px',
            textTransform: 'uppercase',
          }}>
            -{discount}%
          </div>
        )}

        {/* Stock badge */}
        {!product.inStock && (
          <div style={{
            position: 'absolute', top: 12, right: 12,
            background: theme.colors.text, color: theme.colors.background,
            fontSize: 10, fontWeight: 700,
            letterSpacing: '0.08em',
            padding: '3px 8px',
            textTransform: 'uppercase',
          }}>
            OUT OF STOCK
          </div>
        )}
        
        {product.inStock && product.stock <= product.lowStockThreshold && (
          <div style={{
            position: 'absolute', top: 12, right: 12,
            background: theme.colors.warning, color: '#fff',
            fontSize: 10, fontWeight: 700,
            letterSpacing: '0.08em',
            padding: '3px 8px',
            textTransform: 'uppercase',
          }}>
            ONLY {product.stock} LEFT
          </div>
        )}

        {/* Quick View Button */}
        {onQuickView && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            style={{
              position: 'absolute',
              top: 10,
              left: 10,
              background: 'rgba(255,255,255,0.9)',
              borderRadius: '50%',
              width: 34,
              height: 34,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: hovered ? 1 : 0,
              transition: 'opacity 0.2s ease',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              border: 'none',
            }}
            aria-label="Quick View"
          >
            <Eye size={15} color={theme.colors.text} />
          </button>
        )}

        {/* Wishlist */}
        <button
          onClick={e => { 
            e.stopPropagation(); 
            if (!wishlisted && onAddToWishlist) {
              onAddToWishlist(product);
            }
            setWishlisted(!wishlisted);
          }}
          style={{
            position: 'absolute', top: 10, right: 10,
            background: 'rgba(255,255,255,0.9)',
            borderRadius: '50%',
            width: 34, height: 34,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.2s ease',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
          aria-label="Wishlist"
        >
          <Heart
            size={15}
            fill={wishlisted ? theme.colors.secondary : 'none'}
            stroke={wishlisted ? theme.colors.secondary : theme.colors.text}
          />
        </button>

        {/* Add to cart overlay */}
        <motion.button
          onClick={handleAdd}
          disabled={!product.inStock}
          animate={{ y: hovered ? 0 : 60, opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.25 }}
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: !product.inStock ? theme.colors.textSecondary : added ? theme.colors.text : `rgba(255,255,255,0.95)`,
            color: !product.inStock || added ? theme.colors.background : theme.colors.text,
            padding: '13px 16px',
            fontSize: 11, fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            transition: 'background 0.2s, color 0.2s',
            cursor: !product.inStock ? 'not-allowed' : 'pointer',
          }}
        >
          <ShoppingBag size={13} />
          {!product.inStock ? 'Out of Stock' : added ? 'Added!' : 'Add to Bag'}
        </motion.button>
      </div>

      {/* Product info */}
      <div>
        <p style={{
          fontSize: 10, fontWeight: 500,
          letterSpacing: '0.12em', textTransform: 'uppercase',
          color: theme.colors.textSecondary, marginBottom: 4,
        }}>
          {product.category}
        </p>
        <p style={{
          fontSize: 14, fontWeight: 400,
          color: theme.colors.text, marginBottom: 6,
          lineHeight: 1.4,
        }}>
          {product.name}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {product.memberPrice ? (
            <>
              <span style={{ fontSize: 13, fontWeight: 700, color: theme.colors.secondary }}>
                ₹{product.memberPrice.toLocaleString()}
              </span>
              <span style={{ fontSize: 12, color: theme.colors.textSecondary, textDecoration: 'line-through' }}>
                ₹{product.price.toLocaleString()}
              </span>
              <span style={{
                fontSize: 9, fontWeight: 700, color: theme.colors.secondary,
                letterSpacing: '0.08em', textTransform: 'uppercase',
              }}>
                Member Price
              </span>
            </>
          ) : (
            <span style={{ fontSize: 13, fontWeight: 600, color: theme.colors.text }}>
              ₹{product.price.toLocaleString()}
            </span>
          )}
        </div>
        {/* Rating */}
        {product.numReviews > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
            <div style={{ display: 'flex', gap: 1 }}>
              {[1, 2, 3, 4, 5].map(star => (
                <Star
                  key={star}
                  size={11}
                  fill={star <= Math.round(product.averageRating) ? '#FFD700' : 'none'}
                  color={star <= Math.round(product.averageRating) ? '#FFD700' : '#d0d0d0'}
                />
              ))}
            </div>
            <span style={{ fontSize: 10, color: theme.colors.textSecondary }}>
              ({product.numReviews})
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
