import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1600&q=90',
    position: 'center 30%',
    tag: 'New Season · 2025 Collection',
    heading: ['Style Has', 'No Rules'],
    sub: 'Dress bold. Live free. Explore the latest trends for him & her.',
    category: 'All', categoryLabel: 'All Products',
    exploreCategory: 'All', exploreLabel: 'New Arrivals',
  },
  {
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1600&q=90',
    position: 'center 20%',
    tag: "Women's Edit · 2025",
    heading: ['Own Every', 'Moment'],
    sub: "Confidence looks good on you. Discover our women's collection.",
    category: 'Ladies', categoryLabel: "Women's Collection",
    exploreCategory: 'Ladies', exploreLabel: "Women's Edit",
  },
  {
    image: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?w=1600&q=90',
    position: 'center 15%',
    tag: "Men's Collection · 2025",
    heading: ['Dress Like', 'You Mean It'],
    sub: 'Sharp fits, clean lines. Elevate your everyday wardrobe.',
    category: 'Men', categoryLabel: "Men's Collection",
    exploreCategory: 'Men', exploreLabel: "Men's Edit",
  },
  {
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1600&q=90',
    position: 'center 25%',
    tag: 'Couple Goals · 2025',
    heading: ['Together', 'In Style'],
    sub: 'Matching energy, matching fashion. Shop his & hers looks.',
    category: 'All', categoryLabel: 'Couple Looks',
    exploreCategory: 'All', exploreLabel: 'All Styles',
  },
];

const slideVariants = {
  enter: (dir) => ({
    x: dir > 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 1.04,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: { duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: (dir) => ({
    x: dir > 0 ? '-100%' : '100%',
    opacity: 0,
    scale: 0.97,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const textVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: 0.3 + i * 0.15, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export default function Hero({ onShopCategory }) {
  const [[current, dir], setCurrent] = useState([0, 0]);
  const [paused, setPaused] = useState(false);

  const paginate = useCallback((newDir) => {
    setCurrent(([prev]) => [
      (prev + newDir + SLIDES.length) % SLIDES.length,
      newDir,
    ]);
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => paginate(1), 5000);
    return () => clearInterval(timer);
  }, [paused, paginate]);

  const slide = SLIDES[current];

  return (
    <section
      style={{ position: 'relative', width: '100%', height: '92vh', minHeight: 520, overflow: 'hidden', marginTop: 60 }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides */}
      <AnimatePresence initial={false} custom={dir}>
        <motion.div
          key={current}
          custom={dir}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url('${slide.image}')`,
            backgroundSize: 'cover',
            backgroundPosition: slide.position,
          }}
        />
      </AnimatePresence>

      {/* Dark gradient overlay */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: 'linear-gradient(to right, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.25) 55%, rgba(0,0,0,0.05) 100%)',
      }} />

      {/* Bottom fade */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '30%', zIndex: 1,
        background: 'linear-gradient(to top, rgba(0,0,0,0.35), transparent)',
      }} />

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 2,
        height: '100%',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '0 clamp(24px, 6vw, 100px)',
        maxWidth: 680,
      }}>
        <AnimatePresence mode="wait">
          <motion.div key={current} style={{ display: 'flex', flexDirection: 'column' }}>
            <motion.p
              custom={0} variants={textVariants} initial="hidden" animate="visible"
              style={{
                color: 'rgba(255,255,255,0.85)', fontSize: 11,
                letterSpacing: '0.28em', textTransform: 'uppercase',
                marginBottom: 18, fontWeight: 600,
              }}
            >
              {slide.tag}
            </motion.p>

            <motion.h1
              custom={1} variants={textVariants} initial="hidden" animate="visible"
              style={{
                color: '#fff',
                fontSize: 'clamp(40px, 6.5vw, 86px)',
                fontWeight: 900, lineHeight: 1.0,
                letterSpacing: '-0.03em', textTransform: 'uppercase',
                marginBottom: 22,
              }}
            >
              {slide.heading[0]}<br />{slide.heading[1]}
            </motion.h1>

            <motion.p
              custom={2} variants={textVariants} initial="hidden" animate="visible"
              style={{
                color: 'rgba(255,255,255,0.72)',
                fontSize: 'clamp(14px, 1.4vw, 17px)',
                fontWeight: 300, lineHeight: 1.65,
                marginBottom: 38, maxWidth: 400,
              }}
            >
              {slide.sub}
            </motion.p>

            <motion.div
              custom={3} variants={textVariants} initial="hidden" animate="visible"
              style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}
            >
              <a
                onClick={e => { e.preventDefault(); onShopCategory(slide.category, slide.categoryLabel); }}
                href="#"
                style={{
                  background: '#fff', color: '#000',
                  padding: '14px 34px', fontSize: 12, fontWeight: 700,
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  display: 'inline-block', transition: 'all 0.25s', cursor: 'pointer',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#000'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#000'; }}
              >
                Shop Now
              </a>
              <a
                onClick={e => { e.preventDefault(); onShopCategory(slide.exploreCategory, slide.exploreLabel); }}
                href="#"
                style={{
                  border: '1px solid rgba(255,255,255,0.65)', color: '#fff',
                  padding: '14px 34px', fontSize: 12, fontWeight: 400,
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  display: 'inline-block', transition: 'all 0.25s',
                  backdropFilter: 'blur(4px)', cursor: 'pointer',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
              >
                Explore
              </a>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Prev / Next arrows */}
      {[{ dir: -1, side: 'left' }, { dir: 1, side: 'right' }].map(({ dir: d, side }) => (
        <motion.button
          key={side}
          onClick={() => paginate(d)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          style={{
            position: 'absolute', top: '50%', [side]: 20,
            transform: 'translateY(-50%)',
            zIndex: 3, background: 'rgba(255,255,255,0.12)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.25)',
            borderRadius: '50%', width: 48, height: 48,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#fff',
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
        >
          {d === -1 ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </motion.button>
      ))}

      {/* Dot indicators */}
      <div style={{
        position: 'absolute', bottom: 28, left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 3, display: 'flex', gap: 8, alignItems: 'center',
      }}>
        {SLIDES.map((_, i) => (
          <motion.button
            key={i}
            onClick={() => setCurrent([i, i > current ? 1 : -1])}
            animate={{ width: i === current ? 28 : 8, opacity: i === current ? 1 : 0.45 }}
            transition={{ duration: 0.35 }}
            style={{
              height: 8, borderRadius: 4,
              background: '#fff', border: 'none',
              cursor: 'pointer', padding: 0,
            }}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div style={{
        position: 'absolute', bottom: 28, right: 28, zIndex: 3,
        color: 'rgba(255,255,255,0.55)', fontSize: 12,
        fontWeight: 500, letterSpacing: '0.1em',
      }}>
        {String(current + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
      </div>

      {/* Progress bar */}
      {!paused && (
        <motion.div
          key={current}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 5, ease: 'linear' }}
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            height: 3, background: 'rgba(255,255,255,0.7)',
            transformOrigin: 'left', zIndex: 3,
          }}
        />
      )}
    </section>
  );
}
