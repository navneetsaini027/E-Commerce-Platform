import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { getAdminStats } from '../api/api';

function CountUp({ to, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView || !to) return;
    let start = 0;
    const duration = 1800;
    const step = Math.ceil(to / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= to) { setCount(to); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, to]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

export default function BrandStats() {
  const { theme } = useTheme();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // Try to get real stats, fallback to defaults if not admin
    getAdminStats()
      .then(res => setStats(res.data))
      .catch(() => setStats(null)); // not admin - use defaults
  }, []);

  const STATS = stats ? [
    { value: stats.totalUsers || 0, suffix: '+', label: 'Happy Customers' },
    { value: stats.totalProducts || 0, suffix: '+', label: 'Products' },
    { value: stats.totalOrders || 0, suffix: '+', label: 'Orders Placed' },
    { value: Math.round((stats.totalRevenue || 0) / 1000), suffix: 'K+', label: 'Revenue (₹)' },
  ] : [
    { value: 500, suffix: '+', label: 'Happy Customers' },
    { value: 34, suffix: '+', label: 'Products' },
    { value: 98, suffix: '%', label: 'Satisfaction Rate' },
    { value: 50, suffix: '+', label: 'Cities Delivered' },
  ];

  return (
    <section style={{
      background: theme.colors.text,
      color: theme.colors.background,
      padding: 'clamp(48px, 7vw, 80px) clamp(16px, 4vw, 60px)',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: 32, maxWidth: 900, margin: '0 auto', textAlign: 'center',
      }}>
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12, duration: 0.6 }}
          >
            <p style={{
              fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 900,
              letterSpacing: '-0.03em', color: '#FFE500', lineHeight: 1,
              marginBottom: 8,
            }}>
              <CountUp to={s.value} suffix={s.suffix} />
            </p>
            <p style={{
              fontSize: 12, fontWeight: 500, letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: theme.colors.background === '#fff' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
            }}>
              {s.label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
