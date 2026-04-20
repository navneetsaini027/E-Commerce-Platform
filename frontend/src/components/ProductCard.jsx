import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Heart, Star, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function ProductCard({ product, onAddToCart, onAddToWishlist, onProductClick, onQuickView }) {
  const [hovered, setHovered] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [added, setAdded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [activeColorIdx, setActiveColorIdx] = useState(0);
  const [slideDir, setSlideDir] = useState(1);
  const { theme } = useTheme();

  const hasColors = product.colorVariants && product.colorVariants.length > 0;
  const activeColor = hasColors ? product.colorVariants[activeColorIdx] : null;
  const displayImage = activeColor ? activeColor.image : product.image;

  const handleColorChange = (e, idx) => {
    e.stopPropagation();
    setSlideDir(idx > activeColorIdx ? 1 : -1);
    setActiveColorIdx(idx);
    setImageError(false);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    const newIdx = (activeColorIdx - 1 + product.colorVariants.length) % product.colorVariants.length;
    setSlideDir(-1);
    setActiveColorIdx(newIdx);
    setImageError(false);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    const newIdx = (activeColorIdx + 1) % product.colorVariants.length;
    setSlideDir(1);
    setActiveColorIdx(newIdx);
    setImageError(false);
  };

  const handleAdd = (e) => {
    e.stopPropagation();
    if (!product.inStock) return;
    const productToAdd = hasColors
      ? { ...product, selectedColor: activeColor.color, image: activeColor.image }
      : product;
    onAddToCart(productToAdd);
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
      onClick={() => onProductClick && onProductClick(product)}
      style={{ cursor: 'pointer' }}
    >
      {/* Image container */}
      <div style={{
        position: 'relative', overflow: 'hidden',
        aspectRatio: '3/4', background: theme.colors.surface,
        marginBottom: 12, border: `1px solid ${theme.colors.border}`,
      }}>
        {/* Sliding Image */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.img
            key={displayImage + activeColorIdx}
            src={displayImage}
            alt={product.name}
            initial={{ x: slideDir * 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -slideDir * 60, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            onError={() => setImageError(true)}
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover',
              display: imageError ? 'none' : 'block',
            }}
            loading="lazy"
          />
        </AnimatePresence>

        {imageError && (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: theme.colors.surface, color: theme.colors.textSecondary, fontSize: 14 }}>
            {product.name}
          </div>
        )}

        {/* Discount badge */}
        {discount && (
          <div style={{ position: 'absolute', top: 12, left: 12, background: theme.colors.secondary, color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 8px', textTransform: 'uppercase', zIndex: 2 }}>
            -{discount}%
          </div>
        )}

        {/* Stock badge */}
        {!product.inStock && (
          <div style={{ position: 'absolute', top: 12, right: 12, background: theme.colors.text, color: theme.colors.background, fontSize: 10, fontWeight: 700, padding: '3px 8px', textTransform: 'uppercase', zIndex: 2 }}>
            OUT OF STOCK
          </div>
        )}
        {product.inStock && product.stock <= product.lowStockThreshold && (
          <div style={{ position: 'absolute', top: 12, right: 12, background: theme.colors.warning, color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 8px', textTransform: 'uppercase', zIndex: 2 }}>
            ONLY {product.stock} LEFT
          </div>
        )}

        {/* Color slide arrows - show on hover if has colors */}
        {hasColors && product.colorVariants.length > 1 && hovered && (
          <>
            <button onClick={handlePrev}
              style={{ position: 'absolute', left: 6, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
              <ChevronLeft size={14} color="#000" />
            </button>
            <button onClick={handleNext}
              style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
              <ChevronRight size={14} color="#000" />
            </button>
          </>
        )}

        {/* Quick View */}
        {onQuickView && (
          <button onClick={(e) => { e.stopPropagation(); onQuickView(product); }}
            style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(255,255,255,0.9)', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: hovered ? 1 : 0, transition: 'opacity 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', cursor: 'pointer', border: 'none', zIndex: 3 }}>
            <Eye size={15} color={theme.colors.text} />
          </button>
        )}

        {/* Wishlist */}
        <button onClick={e => { e.stopPropagation(); if (!wishlisted && onAddToWishlist) onAddToWishlist(product); setWishlisted(!wishlisted); }}
          style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(255,255,255,0.9)', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: hovered ? 1 : 0, transition: 'opacity 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', zIndex: 3, border: 'none', cursor: 'pointer' }}>
          <Heart size={15} fill={wishlisted ? theme.colors.secondary : 'none'} stroke={wishlisted ? theme.colors.secondary : theme.colors.text} />
        </button>

        {/* Add to cart overlay */}
        <motion.button
          onClick={handleAdd}
          disabled={!product.inStock}
          animate={{ y: hovered ? 0 : 60, opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.25 }}
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 3,
            background: !product.inStock ? theme.colors.textSecondary : added ? theme.colors.text : 'rgba(255,255,255,0.95)',
            color: !product.inStock || added ? theme.colors.background : theme.colors.text,
            padding: '13px 16px', fontSize: 11, fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            cursor: !product.inStock ? 'not-allowed' : 'pointer', border: 'none',
          }}
        >
          <ShoppingBag size={13} />
          {!product.inStock ? 'Out of Stock' : added ? `Added (${activeColor?.color || ''})` : 'Add to Bag'}
        </motion.button>
      </div>

      {/* Product info */}
      <div>
        <p style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: theme.colors.textSecondary, marginBottom: 4 }}>
          {product.category}
        </p>
        <p style={{ fontSize: 14, fontWeight: 400, color: theme.colors.text, marginBottom: 6, lineHeight: 1.4 }}>
          {product.name}
        </p>

        {/* Color dots */}
        {hasColors && (
          <div style={{ display: 'flex', gap: 5, marginBottom: 6, alignItems: 'center' }}>
            {product.colorVariants.map((cv, i) => (
              <button key={i} onClick={(e) => handleColorChange(e, i)}
                title={cv.color}
                style={{
                  width: 14, height: 14, borderRadius: '50%',
                  background: cv.colorCode || '#ccc',
                  border: i === activeColorIdx ? '2px solid #E50010' : '2px solid transparent',
                  outline: i === activeColorIdx ? '1px solid #E50010' : '1px solid #ccc',
                  cursor: 'pointer', padding: 0, transition: 'all 0.2s',
                }}
              />
            ))}
            <span style={{ fontSize: 10, color: theme.colors.textSecondary, marginLeft: 4 }}>
              {activeColor?.color}
            </span>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {product.memberPrice ? (
            <>
              <span style={{ fontSize: 13, fontWeight: 700, color: theme.colors.secondary }}>₹{product.memberPrice.toLocaleString()}</span>
              <span style={{ fontSize: 12, color: theme.colors.textSecondary, textDecoration: 'line-through' }}>₹{product.price.toLocaleString()}</span>
              <span style={{ fontSize: 9, fontWeight: 700, color: theme.colors.secondary, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Member Price</span>
            </>
          ) : (
            <span style={{ fontSize: 13, fontWeight: 600, color: theme.colors.text }}>₹{product.price.toLocaleString()}</span>
          )}
        </div>

        {product.numReviews > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
            <div style={{ display: 'flex', gap: 1 }}>
              {[1,2,3,4,5].map(star => (
                <Star key={star} size={11} fill={star <= Math.round(product.averageRating) ? '#FFD700' : 'none'} color={star <= Math.round(product.averageRating) ? '#FFD700' : '#d0d0d0'} />
              ))}
            </div>
            <span style={{ fontSize: 10, color: theme.colors.textSecondary }}>({product.numReviews})</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
