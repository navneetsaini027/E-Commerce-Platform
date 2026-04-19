import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import { CATEGORIES } from '../data/products';
import { SlidersHorizontal } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function ProductGrid({ products, activeCategory, onCategoryChange, onAddToCart, onAddToWishlist, onProductClick, onOpenFilters, onQuickView }) {
  const { theme } = useTheme();
  const filtered = activeCategory === 'All'
    ? products
    : products.filter(p => p.category === activeCategory);

  return (
    <section id="products" style={{ padding: 'clamp(40px, 6vw, 80px) clamp(16px, 4vw, 60px)' }}>
      {/* Section header */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{
              fontSize: 'clamp(22px, 3vw, 36px)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              color: theme.colors.text,
            }}
          >
            {activeCategory === 'All' ? 'New Arrivals' : activeCategory}
          </motion.h2>

          {/* Filter Button */}
          <button
            onClick={onOpenFilters}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 20px',
              border: `1px solid ${theme.colors.text}`,
              background: theme.colors.background,
              color: theme.colors.text,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = theme.colors.text;
              e.currentTarget.style.color = theme.colors.background;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = theme.colors.background;
              e.currentTarget.style.color = theme.colors.text;
            }}
          >
            <SlidersHorizontal size={14} />
            Filters
          </button>
        </div>

        {/* Category filter pills */}
        <div style={{
          display: 'flex', gap: 8, flexWrap: 'wrap',
          borderBottom: `1px solid ${theme.colors.border}`,
          paddingBottom: 20,
        }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              style={{
                padding: '7px 18px',
                fontSize: 12, fontWeight: 600,
                letterSpacing: '0.06em', textTransform: 'uppercase',
                background: activeCategory === cat ? theme.colors.text : 'transparent',
                color: activeCategory === cat ? theme.colors.background : theme.colors.text,
                border: '1px solid',
                borderColor: activeCategory === cat ? theme.colors.text : theme.colors.border,
                transition: 'all 0.2s ease',
                cursor: 'pointer',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p style={{ fontSize: 12, color: theme.colors.textSecondary, marginBottom: 28, letterSpacing: '0.04em' }}>
        {filtered.length} {filtered.length === 1 ? 'item' : 'items'}
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: theme.colors.textSecondary }}>
          <p style={{ fontSize: 16, fontWeight: 300 }}>No products in this category yet.</p>
          <p style={{ fontSize: 13, marginTop: 8 }}>Add products via the Admin Panel.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 'clamp(16px, 2vw, 28px)',
        }}
          className="product-grid"
        >
          {filtered.map(product => (
            <ProductCard 
              key={product._id} 
              product={product} 
              onAddToCart={onAddToCart} 
              onAddToWishlist={onAddToWishlist}
              onProductClick={onProductClick}
              onQuickView={onQuickView}
            />
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 1024px) {
          .product-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .product-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  );
}
