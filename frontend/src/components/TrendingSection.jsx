import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { getSiteSetting } from '../api/api';
import { useState, useEffect } from 'react';

const DEFAULT_TRENDING = [
  { label: "Men's Streetwear", image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&q=85', tag: 'Trending Now', color: '#1a1a1a', category: 'Men' },
  { label: "Women's Ethnic", image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=85', tag: 'Best Seller', color: '#8B1A1A', category: 'Traditional' },
  { label: "Couple Fits", image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&q=85', tag: 'New In', color: '#1a3a2a', category: 'All' },
  { label: "Summer Casuals", image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=85', tag: 'Hot Pick', color: '#2a1a3a', category: 'Ladies' },
];

export default function TrendingSection({ onCategoryChange, onShopCategory }) {
  const { theme } = useTheme();
  const [TRENDING, setTRENDING] = useState(DEFAULT_TRENDING);

  useEffect(() => {
    getSiteSetting('trending').then(res => { if (res.data) setTRENDING(res.data); }).catch(() => {});
  }, []);

  return (
    <section style={{ padding: 'clamp(60px, 8vw, 100px) clamp(16px, 4vw, 60px)', background: theme.colors.background }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48 }}>
        <div>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            style={{ fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#E50010', fontWeight: 700, marginBottom: 8 }}
          >
            What's Hot
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900, letterSpacing: '-0.02em', textTransform: 'uppercase', color: theme.colors.text }}
          >
            Trending Now
          </motion.h2>
        </div>
        <motion.button
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          onClick={() => onCategoryChange('All')}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            fontSize: 12, fontWeight: 600, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: theme.colors.text,
            background: 'none', border: 'none', cursor: 'pointer',
          }}
        >
          View All <ArrowRight size={16} />
        </motion.button>
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: 16,
      }}>
        {TRENDING.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: i * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            whileHover={{ y: -6 }}
            onClick={() => onShopCategory(item.category, item.label)}
            style={{ cursor: 'pointer', position: 'relative', overflow: 'hidden', borderRadius: 2 }}
          >
            <div style={{ position: 'relative', aspectRatio: i === 0 ? '3/4' : '3/4', overflow: 'hidden' }}>
              <motion.img
                src={item.image}
                alt={item.label}
                whileHover={{ scale: 1.07 }}
                transition={{ duration: 0.6 }}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              <div style={{
                position: 'absolute', inset: 0,
                background: `linear-gradient(to top, ${item.color}cc 0%, transparent 55%)`,
              }} />
              <span style={{
                position: 'absolute', top: 16, left: 16,
                background: '#E50010', color: '#fff',
                fontSize: 9, fontWeight: 800, letterSpacing: '0.15em',
                padding: '4px 10px', textTransform: 'uppercase',
              }}>
                {item.tag}
              </span>
              <div style={{ position: 'absolute', bottom: 20, left: 20, right: 20 }}>
                <p style={{ color: '#fff', fontSize: 18, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>
                  {item.label}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em' }}>
                  Shop Now <ArrowRight size={13} />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
