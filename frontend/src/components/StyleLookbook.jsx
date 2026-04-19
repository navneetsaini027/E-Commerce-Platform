import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

const LOOKS = [
  { image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=85', label: 'Street Style', span: 'row', category: 'All' },
  { image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=85', label: 'Boho Chic', category: 'Ladies' },
  { image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=85', label: 'Ethnic Glam', category: 'Traditional' },
  { image: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?w=600&q=85', label: 'Smart Casual', span: 'row', category: 'Men' },
  { image: 'https://images.unsplash.com/photo-1617922001439-4a2e6562f328?w=600&q=85', label: 'Festive Wear', category: 'Traditional' },
];

export default function StyleLookbook({ onShopCategory }) {
  const { theme } = useTheme();

  return (
    <section style={{
      padding: 'clamp(60px, 8vw, 100px) clamp(16px, 4vw, 60px)',
      background: theme.colors.surface,
    }}>
      <div style={{ textAlign: 'center', marginBottom: 52 }}>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ fontSize: 11, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#E50010', fontWeight: 700, marginBottom: 10 }}
        >
          Style Inspiration
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          style={{
            fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 900,
            letterSpacing: '-0.02em', textTransform: 'uppercase', color: theme.colors.text,
          }}
        >
          The Lookbook
        </motion.h2>
      </div>

      {/* Masonry-style grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateRows: 'auto',
        gap: 12,
        maxWidth: 1100, margin: '0 auto',
      }}>
        {LOOKS.map((look, i) => (
          <motion.div
            key={look.label}
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            whileHover={{ zIndex: 2 }}
            onClick={() => onShopCategory(look.category, look.label)}
            style={{
              position: 'relative', overflow: 'hidden', cursor: 'pointer',
              gridRow: look.span === 'row' ? 'span 2' : 'span 1',
              gridColumn: i === 0 ? '1' : i === 3 ? '3' : 'auto',
              aspectRatio: look.span === 'row' ? '3/5' : '4/3',
            }}
          >
            <motion.img
              src={look.image}
              alt={look.label}
              whileHover={{ scale: 1.06 }}
              transition={{ duration: 0.55 }}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.25 }}
              style={{
                position: 'absolute', inset: 0,
                background: 'rgba(0,0,0,0.45)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              <p style={{ color: '#fff', fontSize: 16, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', textAlign: 'center' }}>
                {look.label}
              </p>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                Shop Now →
              </p>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
