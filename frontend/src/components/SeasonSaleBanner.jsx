import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';

export default function SeasonSaleBanner({ onShopCategory }) {
  const ref = useRef(null);
  const { theme } = useTheme();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);

  return (
    <section ref={ref} style={{ position: 'relative', height: '70vh', minHeight: 480, overflow: 'hidden' }}>
      {/* Parallax BG */}
      <motion.div style={{
        position: 'absolute', inset: '-10%', y,
        backgroundImage: `url('https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=90')`,
        backgroundSize: 'cover', backgroundPosition: 'center',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(135deg, rgba(229,0,16,0.82) 0%, rgba(0,0,0,0.65) 100%)',
      }} />

      <div style={{
        position: 'relative', zIndex: 2, height: '100%',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '0 24px',
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 16, fontWeight: 600 }}>
            Limited Time Only
          </p>
          <h2 style={{
            color: '#fff', fontSize: 'clamp(52px, 10vw, 130px)',
            fontWeight: 900, lineHeight: 0.9, letterSpacing: '-0.04em',
            textTransform: 'uppercase', marginBottom: 8,
          }}>
            SEASON
          </h2>
          <h2 style={{
            color: '#FFE500', fontSize: 'clamp(52px, 10vw, 130px)',
            fontWeight: 900, lineHeight: 0.9, letterSpacing: '-0.04em',
            textTransform: 'uppercase', marginBottom: 28,
            WebkitTextStroke: '2px #FFE500',
          }}>
            SALE
          </h2>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 36, flexWrap: 'wrap' }}>
            {['UP TO 70% OFF', 'FREE SHIPPING', 'NEW ARRIVALS'].map((tag, i) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.1 }}
                style={{
                  background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  color: '#fff', padding: '8px 20px',
                  fontSize: 11, fontWeight: 700, letterSpacing: '0.15em',
                }}
              >
                {tag}
              </motion.span>
            ))}
          </div>
          <motion.a
            onClick={e => { e.preventDefault(); onShopCategory('All', 'Season Sale — All Products'); }}
            href="#"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            style={{
              background: '#FFE500', color: '#000',
              padding: '16px 48px', fontSize: 13, fontWeight: 800,
              letterSpacing: '0.15em', textTransform: 'uppercase',
              display: 'inline-block', cursor: 'pointer',
            }}
          >
            Shop the Sale
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
