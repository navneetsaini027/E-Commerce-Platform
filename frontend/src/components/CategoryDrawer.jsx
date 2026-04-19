import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, SlidersHorizontal, ShoppingBag, Heart } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { getProducts } from '../api/api';

export default function CategoryDrawer({ isOpen, onClose, category, label, onAddToCart, onAddToWishlist, onProductClick }) {
  const { theme } = useTheme();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    getProducts()
      .then(res => {
        let data = res.data;
        if (category && category !== 'All') {
          data = data.filter(p =>
            p.category?.toLowerCase().includes(category.toLowerCase()) ||
            category.toLowerCase().includes(p.category?.toLowerCase())
          );
        }
        setProducts(data);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [isOpen, category]);

  const sorted = [...products].sort((a, b) => {
    if (sort === 'price-asc') return (a.memberPrice || a.price) - (b.memberPrice || b.price);
    if (sort === 'price-desc') return (b.memberPrice || b.price) - (a.memberPrice || a.price);
    if (sort === 'rating') return (b.averageRating || 0) - (a.averageRating || 0);
    return 0;
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 1200, backdropFilter: 'blur(3px)' }}
          />

          {/* Panel — slides up from bottom */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'tween', duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              position: 'fixed', bottom: 0, left: 0, right: 0,
              height: '90vh', zIndex: 1300,
              background: theme.colors.background,
              display: 'flex', flexDirection: 'column',
              borderRadius: '20px 20px 0 0',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '20px 28px 16px',
              borderBottom: `1px solid ${theme.colors.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              flexShrink: 0,
            }}>
              <div>
                <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#E50010', fontWeight: 700, marginBottom: 4 }}>
                  Shop Collection
                </p>
                <h2 style={{ fontSize: 22, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.01em', color: theme.colors.text }}>
                  {label || category || 'All Products'}
                </h2>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {/* Sort */}
                <select
                  value={sort}
                  onChange={e => setSort(e.target.value)}
                  style={{
                    padding: '8px 12px', fontSize: 12, fontWeight: 600,
                    border: `1px solid ${theme.colors.border}`,
                    background: theme.colors.surface, color: theme.colors.text,
                    cursor: 'pointer', outline: 'none', fontFamily: 'inherit',
                  }}
                >
                  <option value="newest">Newest</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
                <button onClick={onClose} style={{ padding: 8, color: theme.colors.text }}>
                  <X size={22} />
                </button>
              </div>
            </div>

            {/* Products */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
              {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    style={{ width: 32, height: 32, border: '3px solid #e0e0e0', borderTopColor: '#E50010', borderRadius: '50%' }}
                  />
                </div>
              ) : sorted.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 0', color: theme.colors.textSecondary }}>
                  <ShoppingBag size={48} style={{ margin: '0 auto 16px', opacity: 0.2 }} />
                  <p style={{ fontSize: 16, fontWeight: 300 }}>No products found in this category.</p>
                  <p style={{ fontSize: 13, marginTop: 8 }}>Check back soon or browse all products.</p>
                </div>
              ) : (
                <>
                  <p style={{ fontSize: 12, color: theme.colors.textSecondary, marginBottom: 20 }}>
                    {sorted.length} {sorted.length === 1 ? 'item' : 'items'}
                  </p>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: 20,
                  }}>
                    {sorted.map((product, i) => (
                      <motion.div
                        key={product._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04, duration: 0.4 }}
                      >
                        <DrawerProductCard
                          product={product}
                          theme={theme}
                          onAddToCart={(p) => { onAddToCart(p); }}
                          onAddToWishlist={onAddToWishlist}
                          onProductClick={(p) => { onProductClick(p); onClose(); }}
                        />
                      </motion.div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function DrawerProductCard({ product, theme, onAddToCart, onAddToWishlist, onProductClick }) {
  const [hovered, setHovered] = useState(false);
  const [added, setAdded] = useState(false);
  const discount = product.memberPrice
    ? Math.round(((product.price - product.memberPrice) / product.price) * 100)
    : null;

  const handleAdd = (e) => {
    e.stopPropagation();
    if (!product.inStock) return;
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onProductClick(product)}
      style={{ cursor: 'pointer' }}
    >
      {/* Image */}
      <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', background: theme.colors.surface, marginBottom: 10 }}>
        <motion.img
          src={product.image} alt={product.name}
          animate={{ scale: hovered ? 1.06 : 1 }}
          transition={{ duration: 0.5 }}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {discount && (
          <span style={{ position: 'absolute', top: 10, left: 10, background: '#E50010', color: '#fff', fontSize: 9, fontWeight: 800, padding: '3px 8px' }}>
            -{discount}%
          </span>
        )}
        {!product.inStock && (
          <span style={{ position: 'absolute', top: 10, right: 10, background: '#333', color: '#fff', fontSize: 9, fontWeight: 700, padding: '3px 8px' }}>
            OUT OF STOCK
          </span>
        )}
        {/* Wishlist */}
        <button
          onClick={e => { e.stopPropagation(); onAddToWishlist(product); }}
          style={{
            position: 'absolute', top: 8, right: 8,
            background: 'rgba(255,255,255,0.9)', borderRadius: '50%',
            width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: hovered ? 1 : 0, transition: 'opacity 0.2s',
          }}
        >
          <Heart size={13} />
        </button>
        {/* Add to cart */}
        <motion.button
          onClick={handleAdd}
          disabled={!product.inStock}
          animate={{ y: hovered ? 0 : 50, opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: added ? '#22c55e' : 'rgba(255,255,255,0.95)',
            color: added ? '#fff' : '#000',
            padding: '10px', fontSize: 10, fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            border: 'none', cursor: product.inStock ? 'pointer' : 'not-allowed',
          }}
        >
          <ShoppingBag size={11} />
          {added ? 'Added!' : 'Add to Bag'}
        </motion.button>
      </div>
      {/* Info */}
      <p style={{ fontSize: 10, color: theme.colors.textSecondary, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 3 }}>
        {product.category}
      </p>
      <p style={{ fontSize: 13, fontWeight: 500, color: theme.colors.text, marginBottom: 4, lineHeight: 1.3 }}>
        {product.name}
      </p>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {product.memberPrice ? (
          <>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#E50010' }}>₹{product.memberPrice.toLocaleString()}</span>
            <span style={{ fontSize: 11, color: theme.colors.textSecondary, textDecoration: 'line-through' }}>₹{product.price.toLocaleString()}</span>
          </>
        ) : (
          <span style={{ fontSize: 13, fontWeight: 600, color: theme.colors.text }}>₹{product.price.toLocaleString()}</span>
        )}
      </div>
    </div>
  );
}
