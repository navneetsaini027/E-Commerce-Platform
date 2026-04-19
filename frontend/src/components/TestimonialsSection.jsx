import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { getTestimonials } from '../api/api';

const FALLBACK = [
  { name: 'Priya Sharma', city: 'Delhi', rating: 5, text: 'Absolutely love the quality! The kurti I ordered fits perfectly and the fabric is so soft. Will definitely order again.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80' },
  { name: 'Rahul Verma', city: 'Mumbai', rating: 5, text: 'Best fashion store online! Got my outfit for a wedding and everyone was asking where I bought it from. Super fast delivery too.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80' },
  { name: 'Sneha Patel', city: 'Ahmedabad', rating: 5, text: 'The ethnic collection is stunning. Ordered 3 pieces and all arrived in perfect condition. The packaging was also very premium.', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80' },
];

export default function TestimonialsSection() {
  const { theme } = useTheme();
  const [reviews, setReviews] = useState(FALLBACK);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    getTestimonials()
      .then(res => { if (res.data?.length) setReviews(res.data); })
      .catch(() => {}); // fallback to static
  }, []);

  useEffect(() => {
    const t = setInterval(() => setCurrent(p => (p + 1) % reviews.length), 4500);
    return () => clearInterval(t);
  }, [reviews.length]);

  const review = reviews[current];

  return (
    <section style={{
      padding: 'clamp(60px, 8vw, 100px) clamp(16px, 4vw, 60px)',
      background: theme.colors.background,
      overflow: 'hidden',
    }}>
      <div style={{ textAlign: 'center', marginBottom: 52 }}>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ fontSize: 11, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#E50010', fontWeight: 700, marginBottom: 10 }}
        >
          Customer Love
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          style={{ fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 900, letterSpacing: '-0.02em', textTransform: 'uppercase', color: theme.colors.text }}
        >
          What They Say
        </motion.h2>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', position: 'relative' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            style={{
              background: theme.colors.surface,
              border: `1px solid ${theme.colors.border}`,
              padding: 'clamp(28px, 4vw, 48px)',
              textAlign: 'center',
              position: 'relative',
            }}
          >
            <Quote size={32} color="#E50010" style={{ opacity: 0.3, marginBottom: 20 }} />
            <p style={{
              fontSize: 'clamp(15px, 2vw, 18px)', fontWeight: 300,
              lineHeight: 1.75, color: theme.colors.text,
              fontStyle: 'italic', marginBottom: 28,
            }}>
              "{review.text}"
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 3, marginBottom: 16 }}>
              {[1,2,3,4,5].map(s => (
                <Star key={s} size={14} fill="#FFD700" color="#FFD700" />
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
              <img src={review.avatar} alt={review.name} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }} />
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: theme.colors.text }}>{review.name}</p>
                <p style={{ fontSize: 12, color: theme.colors.textSecondary }}>{review.city}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Controls */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, marginTop: 28 }}>
          <button onClick={() => setCurrent(p => (p - 1 + reviews.length) % reviews.length)}
            style={{ background: theme.colors.surface, border: `1px solid ${theme.colors.border}`, borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: theme.colors.text }}>
            <ChevronLeft size={16} />
          </button>
          {reviews.map((_, i) => (
            <motion.button key={i} onClick={() => setCurrent(i)}
              animate={{ width: i === current ? 24 : 8, background: i === current ? '#E50010' : theme.colors.border }}
              style={{ height: 8, borderRadius: 4, border: 'none', cursor: 'pointer', padding: 0 }}
            />
          ))}
          <button onClick={() => setCurrent(p => (p + 1) % reviews.length)}
            style={{ background: theme.colors.surface, border: `1px solid ${theme.colors.border}`, borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: theme.colors.text }}>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
