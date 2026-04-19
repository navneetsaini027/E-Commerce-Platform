import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import ProductCard from './ProductCard';

export default function RecentlyViewed({ products, onAddToCart, onAddToWishlist, onProductClick, onQuickView }) {
  const { theme } = useTheme();

  if (!products || products.length === 0) return null;

  return (
    <section style={{ padding: 'clamp(40px, 6vw, 80px) clamp(16px, 4vw, 60px)', background: theme.colors.background }}>
      <div style={{ marginBottom: 40 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}
        >
          <Eye size={28} color={theme.colors.text} />
          <h2 style={{
            fontSize: 'clamp(22px, 3vw, 36px)',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            color: theme.colors.text,
          }}>
            Recently Viewed
          </h2>
        </motion.div>
        <p style={{ fontSize: 14, color: theme.colors.textSecondary }}>
          Products you've checked out recently
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: 'clamp(16px, 2vw, 28px)',
      }}>
        {products.slice(0, 4).map((product) => (
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
    </section>
  );
}
