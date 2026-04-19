import { motion } from 'framer-motion';
import { Tag, Zap, Gift, Truck } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const OFFERS = [
  { icon: Tag, label: 'FLAT 30% OFF', sub: 'On orders above ₹999', color: '#E50010' },
  { icon: Zap, label: 'FLASH SALE', sub: 'Every Friday 6–9 PM', color: '#FF6B00' },
  { icon: Gift, label: 'FREE GIFT', sub: 'On orders above ₹1999', color: '#7B2FBE' },
  { icon: Truck, label: 'FREE DELIVERY', sub: 'Pan India on ₹599+', color: '#0066CC' },
];

export default function DiscountStrip() {
  const { theme } = useTheme();

  return (
    <section style={{
      background: theme.colors.surface,
      borderTop: `1px solid ${theme.colors.border}`,
      borderBottom: `1px solid ${theme.colors.border}`,
      padding: 'clamp(32px, 5vw, 56px) clamp(16px, 4vw, 60px)',
    }}>
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{
          textAlign: 'center', fontSize: 11, letterSpacing: '0.28em',
          textTransform: 'uppercase', color: '#E50010', fontWeight: 700, marginBottom: 36,
        }}
      >
        Exclusive Offers
      </motion.p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 24,
        maxWidth: 1100, margin: '0 auto',
      }}>
        {OFFERS.map(({ icon: Icon, label, sub, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.55 }}
            whileHover={{ y: -4, boxShadow: `0 12px 32px ${color}22` }}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              textAlign: 'center', padding: '28px 20px',
              border: `1px solid ${theme.colors.border}`,
              background: theme.colors.background,
              cursor: 'default', transition: 'box-shadow 0.3s',
            }}
          >
            <div style={{
              width: 52, height: 52, borderRadius: '50%',
              background: `${color}18`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 16,
            }}>
              <Icon size={22} color={color} />
            </div>
            <p style={{ fontSize: 14, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: theme.colors.text, marginBottom: 6 }}>
              {label}
            </p>
            <p style={{ fontSize: 12, color: theme.colors.textSecondary, fontWeight: 400 }}>
              {sub}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
