import { motion } from 'framer-motion';
import { Gift } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { getSiteSetting } from '../api/api';
import { useState, useEffect } from 'react';

const DEFAULT_GIFTS = [
  { image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=85', title: 'Gift for Her', desc: 'Sarees, Kurtis & Ethnic Sets', price: 'From ₹799', badge: '❤️ Most Loved', category: 'Ladies' },
  { image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=85', title: 'Gift for Him', desc: 'Shirts, Joggers & Sneakers', price: 'From ₹599', badge: '🔥 Top Picks', category: 'Men' },
  { image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&q=85', title: 'Gift Combos', desc: 'Curated sets for every occasion', price: 'From ₹1299', badge: '🎁 Best Value', category: 'All' },
];

export default function GiftSection({ onShopCategory }) {
  const { theme } = useTheme();
  const [GIFTS, setGIFTS] = useState(DEFAULT_GIFTS);

  useEffect(() => {
    getSiteSetting('gifts').then(res => { if (res.data) setGIFTS(res.data); }).catch(() => {});
  }, []);

  return (
    <section style={{
      padding: 'clamp(60px, 8vw, 100px) clamp(16px, 4vw, 60px)',
      background: theme.colors.background,
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 56 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 16 }}
        >
          <Gift size={20} color="#E50010" />
          <span style={{ fontSize: 11, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#E50010', fontWeight: 700 }}>
            Gifting Made Easy
          </span>
          <Gift size={20} color="#E50010" />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          style={{
            fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 900,
            letterSpacing: '-0.02em', textTransform: 'uppercase',
            color: theme.colors.text,
          }}
        >
          Trending Gifts
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          style={{ fontSize: 15, color: theme.colors.textSecondary, marginTop: 12, fontWeight: 300 }}
        >
          Perfect picks for every occasion — birthdays, anniversaries & more
        </motion.p>
      </div>

      {/* Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 24, maxWidth: 1100, margin: '0 auto',
      }}>
        {GIFTS.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: i * 0.15, duration: 0.65 }}
            whileHover={{ y: -8 }}
            onClick={() => onShopCategory(item.category, item.title)}
            style={{
              overflow: 'hidden', cursor: 'pointer',
              boxShadow: `0 4px 24px ${theme.colors.shadow}`,
              background: theme.isDark ? 'rgba(30, 41, 59, 0.6)' : theme.colors.surface,
              border: `1px solid ${theme.isDark ? 'rgba(148, 163, 184, 0.2)' : theme.colors.border}`,
              transition: 'box-shadow 0.3s',
            }}
          >
            <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden' }}>
              <motion.img
                src={item.image}
                alt={item.title}
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.6 }}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <span style={{
                position: 'absolute', top: 14, left: 14,
                background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)',
                color: '#fff', fontSize: 11, fontWeight: 700,
                padding: '5px 12px', borderRadius: 20,
              }}>
                {item.badge}
              </span>
            </div>
            <div style={{ padding: '20px 22px 24px' }}>
              <p style={{ fontSize: 16, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: theme.colors.text, marginBottom: 6 }}>
                {item.title}
              </p>
              <p style={{ fontSize: 13, color: theme.colors.textSecondary, marginBottom: 14 }}>
                {item.desc}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 15, fontWeight: 800, color: '#E50010' }}>{item.price}</span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={e => { e.stopPropagation(); onShopCategory(item.category, item.title); }}
                  style={{
                    background: '#E50010', 
                    color: '#fff',
                    padding: '8px 20px', fontSize: 11, fontWeight: 700,
                    letterSpacing: '0.1em', textTransform: 'uppercase', border: 'none', cursor: 'pointer',
                  }}
                >
                  Shop
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
