import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag, Zap, Gift, Truck, X, CheckCircle, Clock } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const OFFERS = [
  {
    icon: Tag,
    label: 'FLAT 30% OFF',
    sub: 'On orders above ₹999',
    color: '#E50010',
    coupon: 'FLAT30',
    discount: '30%',
    msg: '🔥 Hurry! FLAT30 applied — 30% OFF on your order above ₹999!',
    urgency: 'Limited time offer! Only a few hours left.',
  },
  {
    icon: Zap,
    label: 'FLASH SALE',
    sub: 'Every Friday 6–9 PM',
    color: '#FF6B00',
    coupon: 'FLASH20',
    discount: '20%',
    msg: '⚡ Flash Sale! FLASH20 applied — 20% OFF! Sale ends soon!',
    urgency: 'Flash sale ending soon! Grab it now.',
  },
  {
    icon: Gift,
    label: 'FREE GIFT',
    sub: 'On orders above ₹1999',
    color: '#7B2FBE',
    coupon: 'GIFT1999',
    discount: 'Free Gift',
    msg: '🎁 Free Gift unlocked! GIFT1999 applied on orders above ₹1999!',
    urgency: 'Limited stock! Claim your free gift now.',
  },
  {
    icon: Truck,
    label: 'FREE DELIVERY',
    sub: 'Pan India on ₹599+',
    color: '#0066CC',
    coupon: 'FREEDEL',
    discount: 'Free Delivery',
    msg: '🚚 Free Delivery activated! FREEDEL applied — Free shipping on ₹599+!',
    urgency: 'Free delivery on your next order!',
  },
];

export default function DiscountStrip({ onCouponApply }) {
  const { theme } = useTheme();
  const [notification, setNotification] = useState(null);
  const [appliedCoupons, setAppliedCoupons] = useState([]);

  const handleOfferClick = (offer) => {
    // Show center notification
    setNotification(offer);

    // Auto-hide after 4 seconds
    setTimeout(() => setNotification(null), 4000);

    // Track applied coupons
    if (!appliedCoupons.includes(offer.coupon)) {
      setAppliedCoupons(prev => [...prev, offer.coupon]);
    }

    // Pass coupon to parent (checkout)
    if (onCouponApply) onCouponApply(offer.coupon);

    // Copy coupon to clipboard
    navigator.clipboard?.writeText(offer.coupon).catch(() => {});
  };

  return (
    <>
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
          Exclusive Offers — Click to Apply
        </motion.p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 24,
          maxWidth: 1100, margin: '0 auto',
        }}>
          {OFFERS.map(({ icon: Icon, label, sub, color, coupon }, i) => {
            const isApplied = appliedCoupons.includes(coupon);
            return (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.55 }}
                whileHover={{ y: -4, boxShadow: `0 12px 32px ${color}33` }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleOfferClick(OFFERS[i])}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  textAlign: 'center', padding: '28px 20px',
                  border: `2px solid ${isApplied ? color : theme.colors.border}`,
                  background: isApplied ? `${color}08` : theme.colors.background,
                  cursor: 'pointer', transition: 'all 0.3s',
                  position: 'relative', overflow: 'hidden',
                }}
              >
                {/* Applied badge */}
                {isApplied && (
                  <div style={{ position: 'absolute', top: 8, right: 8, background: color, color: '#fff', fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 10 }}>
                    ✓ APPLIED
                  </div>
                )}

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
                <p style={{ fontSize: 12, color: theme.colors.textSecondary, fontWeight: 400, marginBottom: 10 }}>
                  {sub}
                </p>
                <div style={{ background: `${color}15`, border: `1px dashed ${color}`, borderRadius: 6, padding: '4px 12px' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color, letterSpacing: '0.1em', fontFamily: 'monospace' }}>
                    {OFFERS[i].coupon}
                  </span>
                </div>
                <p style={{ fontSize: 10, color: theme.colors.textSecondary, marginTop: 6 }}>
                  Click to apply
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Center Notification */}
      <AnimatePresence>
        {notification && (
          <>
            {/* Backdrop blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setNotification(null)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 9000, backdropFilter: 'blur(2px)' }}
            />

            {/* Notification Card - Fixed center wrapper */}
            <div style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9001,
              pointerEvents: 'none',
            }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.7, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.7, y: 40 }}
              transition={{ type: 'spring', duration: 0.5 }}
              style={{
                background: '#fff',
                borderRadius: 20,
                padding: '32px 36px',
                maxWidth: 380,
                width: '90vw',
                textAlign: 'center',
                boxShadow: `0 20px 60px rgba(0,0,0,0.25), 0 0 0 4px ${notification.color}22`,
                border: `2px solid ${notification.color}`,
                pointerEvents: 'all',
                position: 'relative',
              }}
            >
              {/* Close */}
              <button onClick={() => setNotification(null)}
                style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', cursor: 'pointer', color: '#999' }}>
                <X size={18} />
              </button>

              {/* Icon */}
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6 }}
                style={{ fontSize: 48, marginBottom: 12 }}>
                {notification.coupon === 'FLAT30' ? '🔥' :
                 notification.coupon === 'FLASH20' ? '⚡' :
                 notification.coupon === 'GIFT1999' ? '🎁' : '🚚'}
              </motion.div>

              {/* Message */}
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#1a1a1a', marginBottom: 8, lineHeight: 1.3 }}>
                {notification.msg}
              </h3>

              {/* Urgency */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 16 }}>
                <Clock size={13} color={notification.color} />
                <p style={{ fontSize: 12, color: notification.color, fontWeight: 600 }}>
                  {notification.urgency}
                </p>
              </div>

              {/* Coupon code */}
              <div style={{ background: `${notification.color}10`, border: `2px dashed ${notification.color}`, borderRadius: 10, padding: '12px 20px', marginBottom: 16 }}>
                <p style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>Your coupon code</p>
                <p style={{ fontSize: 24, fontWeight: 900, color: notification.color, letterSpacing: '0.15em', fontFamily: 'monospace' }}>
                  {notification.coupon}
                </p>
                <p style={{ fontSize: 10, color: '#888', marginTop: 4 }}>✓ Copied to clipboard!</p>
              </div>

              {/* Applied badge */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#E8F5E9', borderRadius: 8, padding: '8px 16px' }}>
                <CheckCircle size={16} color="#2E7D32" />
                <span style={{ fontSize: 13, fontWeight: 700, color: '#2E7D32' }}>
                  Coupon added to your checkout!
                </span>
              </div>

              {/* Auto close bar */}
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 4, ease: 'linear' }}
                style={{ height: 3, background: notification.color, borderRadius: 2, marginTop: 16 }}
              />
            </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
