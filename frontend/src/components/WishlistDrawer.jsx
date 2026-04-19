import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';

export default function WishlistDrawer({ isOpen, onClose, wishlistItems, onRemove, onAddToCart }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
              zIndex: 1100, backdropFilter: 'blur(2px)',
            }}
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              position: 'fixed', top: 0, right: 0, bottom: 0,
              width: 'min(420px, 100vw)',
              background: '#fff',
              zIndex: 1200,
              display: 'flex', flexDirection: 'column',
              boxShadow: '-8px 0 40px rgba(0,0,0,0.12)',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '24px 28px',
              borderBottom: '1px solid #e0e0e0',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Heart size={18} />
                <h2 style={{ fontSize: 15, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Wishlist
                </h2>
                <span style={{
                  background: '#E50010', color: '#fff',
                  borderRadius: '50%', width: 20, height: 20,
                  fontSize: 10, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {wishlistItems.length}
                </span>
              </div>
              <button onClick={onClose} style={{ padding: 8 }} aria-label="Close wishlist">
                <X size={18} />
              </button>
            </div>

            {/* Items */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 28px' }}>
              {wishlistItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 0', color: '#767676' }}>
                  <Heart size={48} style={{ margin: '0 auto 16px', opacity: 0.2 }} />
                  <p style={{ fontSize: 15, fontWeight: 300 }}>Your wishlist is empty</p>
                  <p style={{ fontSize: 13, marginTop: 8 }}>Save items you love</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {wishlistItems.map(item => (
                    <motion.div
                      key={item._id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      style={{ display: 'flex', gap: 14 }}
                    >
                      <img
                        src={item.image} alt={item.name}
                        style={{ width: 80, height: 104, objectFit: 'cover', background: '#f5f5f5', flexShrink: 0 }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 3, lineHeight: 1.3 }}>{item.name}</p>
                        <p style={{ fontSize: 11, color: '#767676', marginBottom: 8 }}>{item.category}</p>

                        <p style={{ fontSize: 13, fontWeight: 700, color: item.memberPrice ? '#E50010' : '#000', marginBottom: 12 }}>
                          ₹{(item.memberPrice || item.price).toLocaleString()}
                        </p>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button
                            onClick={() => {
                              onAddToCart(item);
                              onRemove(item._id);
                            }}
                            style={{
                              flex: 1,
                              background: '#000', color: '#fff',
                              padding: '8px 12px',
                              fontSize: 10, fontWeight: 700,
                              letterSpacing: '0.08em', textTransform: 'uppercase',
                              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                            }}
                          >
                            <ShoppingBag size={12} />
                            Add to Bag
                          </button>
                          <button
                            onClick={() => onRemove(item._id)}
                            style={{
                              padding: '8px 12px',
                              border: '1px solid #e0e0e0',
                              color: '#767676',
                            }}
                            aria-label="Remove from wishlist"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
