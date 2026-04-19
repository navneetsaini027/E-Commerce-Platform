import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BRAND from '../config/brand';

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 4 + 2,
  delay: Math.random() * 2,
  duration: Math.random() * 3 + 2,
}));

const LETTERS_LINE1 = BRAND.shortName.split('');
const LETTERS_LINE2 = 'Fashion'.split('');

export default function SplashScreen({ onDone }) {
  const [phase, setPhase] = useState('intro'); // intro → tagline → exit

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('tagline'), 2200);
    const t2 = setTimeout(() => setPhase('exit'), 4000);
    const t3 = setTimeout(() => onDone(), 5000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: '#0a0a0a',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Ambient glow blobs */}
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.3, 0.15] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute', width: 600, height: 600,
              borderRadius: '50%',
              background: 'radial-gradient(circle, #E50010 0%, transparent 70%)',
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              filter: 'blur(80px)',
            }}
          />
          <motion.div
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            style={{
              position: 'absolute', width: 400, height: 400,
              borderRadius: '50%',
              background: 'radial-gradient(circle, #FF6B6B 0%, transparent 70%)',
              top: '30%', left: '60%',
              filter: 'blur(100px)',
            }}
          />

          {/* Floating particles */}
          {PARTICLES.map(p => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: [0, 0.6, 0], y: [20, -60, -120] }}
              transition={{ delay: p.delay, duration: p.duration, repeat: Infinity, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                left: `${p.x}%`, top: `${p.y}%`,
                width: p.size, height: p.size,
                borderRadius: '50%',
                background: '#E50010',
              }}
            />
          ))}

          {/* Horizontal scan line */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1.8, times: [0, 0.3, 0.7, 1], ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              width: '60%', height: 1,
              background: 'linear-gradient(to right, transparent, #E50010, transparent)',
              transformOrigin: 'center',
            }}
          />

          {/* Main content */}
          <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>

            {/* Brand name — letter by letter */}
            <div style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                {LETTERS_LINE1.map((l, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 60, rotateX: -90 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{
                      delay: 0.3 + i * 0.07,
                      duration: 0.6,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    style={{
                      display: 'inline-block',
                      fontSize: 'clamp(42px, 8vw, 96px)',
                      fontWeight: 900,
                      color: '#fff',
                      fontFamily: '"Cinzel Decorative", serif',
                      letterSpacing: '0.04em',
                      lineHeight: 1,
                    }}
                  >
                    {l}
                  </motion.span>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                {LETTERS_LINE2.map((l, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 60, rotateX: -90 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{
                      delay: 0.9 + i * 0.07,
                      duration: 0.6,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    style={{
                      display: 'inline-block',
                      fontSize: 'clamp(42px, 8vw, 96px)',
                      fontWeight: 900,
                      color: '#E50010',
                      fontFamily: '"Cinzel Decorative", serif',
                      letterSpacing: '0.04em',
                      lineHeight: 1,
                    }}
                  >
                    {l}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Animated underline */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              style={{
                height: 2,
                background: 'linear-gradient(to right, transparent, #E50010, transparent)',
                transformOrigin: 'center',
                margin: '12px auto',
                width: '80%',
              }}
            />

            {/* Tagline */}
            <AnimatePresence>
              {(phase === 'tagline' || phase === 'exit') && (
                <motion.p
                  initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                  style={{
                    fontSize: 'clamp(13px, 2vw, 18px)',
                    color: 'rgba(255,255,255,0.6)',
                    fontWeight: 300,
                    letterSpacing: '0.3em',
                    textTransform: 'uppercase',
                    marginTop: 16,
                  }}
                >
                  {BRAND.tagline}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Loading bar */}
            <motion.div
              style={{
                marginTop: 48,
                width: 'clamp(160px, 30vw, 280px)',
                height: 2,
                background: 'rgba(255,255,255,0.1)',
                borderRadius: 2,
                overflow: 'hidden',
                margin: '48px auto 0',
              }}
            >
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 3.8, ease: 'linear' }}
                style={{ height: '100%', background: 'linear-gradient(to right, #E50010, #FF6B6B)', borderRadius: 2 }}
              />
            </motion.div>

            {/* Welcome text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8, duration: 0.6 }}
              style={{
                fontSize: 11,
                color: 'rgba(255,255,255,0.3)',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                marginTop: 12,
              }}
            >
              Welcome
            </motion.p>
          </div>

          {/* Corner decorations */}
          {[
            { top: 24, left: 24 },
            { top: 24, right: 24 },
            { bottom: 24, left: 24 },
            { bottom: 24, right: 24 },
          ].map((pos, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
              style={{
                position: 'absolute', ...pos,
                width: 24, height: 24,
                borderTop: i < 2 ? '2px solid rgba(229,0,16,0.5)' : 'none',
                borderBottom: i >= 2 ? '2px solid rgba(229,0,16,0.5)' : 'none',
                borderLeft: i % 2 === 0 ? '2px solid rgba(229,0,16,0.5)' : 'none',
                borderRight: i % 2 === 1 ? '2px solid rgba(229,0,16,0.5)' : 'none',
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
