import { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Mail, ArrowRight } from 'lucide-react';
import { subscribeNewsletter } from '../api/api';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError('');
    try {
      await subscribeNewsletter(email);
      setDone(true);
      setEmail('');
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong';
      if (msg.toLowerCase().includes('already')) {
        setDone(true); // already subscribed is fine
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section ref={ref} style={{ position: 'relative', overflow: 'hidden', minHeight: 380 }}>
      <motion.div style={{
        position: 'absolute', inset: '-8%', y,
        backgroundImage: `url('https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1600&q=85')`,
        backgroundSize: 'cover', backgroundPosition: 'center',
      }} />
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.72)' }} />

      <div style={{
        position: 'relative', zIndex: 2,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', textAlign: 'center',
        padding: 'clamp(60px, 8vw, 100px) clamp(16px, 4vw, 60px)',
        minHeight: 380,
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}
        >
          <Mail size={18} color="#FFE500" />
          <span style={{ fontSize: 11, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#FFE500', fontWeight: 700 }}>
            Stay in the Loop
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          style={{
            color: '#fff', fontSize: 'clamp(28px, 4vw, 52px)',
            fontWeight: 900, letterSpacing: '-0.02em', textTransform: 'uppercase',
            marginBottom: 12,
          }}
        >
          Get Exclusive Deals
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          style={{ color: 'rgba(255,255,255,0.65)', fontSize: 15, fontWeight: 300, marginBottom: 36, maxWidth: 440 }}
        >
          Subscribe and get 15% off your first order + early access to sales & new arrivals.
        </motion.p>

        {done ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ color: '#FFE500', fontSize: 16, fontWeight: 700, letterSpacing: '0.05em' }}
          >
            🎉 You're in! Use code <strong>WELCOME15</strong> for 15% off your first order.
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, width: '100%', maxWidth: 480 }}
          >
            <div style={{ display: 'flex', width: '100%' }}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                style={{
                  flex: 1, padding: '14px 20px', fontSize: 13,
                  border: 'none', outline: 'none',
                  background: 'rgba(255,255,255,0.95)',
                  color: '#000', fontFamily: 'inherit',
                }}
              />
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.03 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  background: loading ? '#999' : '#E50010', color: '#fff',
                  padding: '14px 24px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', gap: 8,
                  fontSize: 12, fontWeight: 700, letterSpacing: '0.1em',
                  textTransform: 'uppercase', fontFamily: 'inherit',
                }}
              >
                {loading ? 'Subscribing...' : <><span>Subscribe</span> <ArrowRight size={14} /></>}
              </motion.button>
            </div>
            {error && <p style={{ color: '#FF6B6B', fontSize: 12, margin: 0 }}>{error}</p>}
          </motion.form>
        )}
      </div>
    </section>
  );
}
