import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartDrawer({ isOpen, onClose, cartItems, onRemove, onUpdateQty, onCheckout }) {
  const total = cartItems.reduce((sum, item) => sum + (item.memberPrice || item.price) * item.qty, 0);

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
                <ShoppingBag size={18} />
                <h2 style={{ fontSize: 15, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Shopping Bag
                </h2>
                <span style={{
                  background: '#000', color: '#fff',
                  borderRadius: '50%', width: 20, height: 20,
                  fontSize: 10, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {cartItems.reduce((s, i) => s + i.qty, 0)}
                </span>
              </div>
              <button onClick={onClose} style={{ padding: 8 }} aria-label="Close cart">
                <X size={18} />
              </button>
            </div>

            {/* Items */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 28px' }}>
              {cartItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 0', color: '#767676' }}>
                  <ShoppingBag size={48} style={{ margin: '0 auto 16px', opacity: 0.2 }} />
                  <p style={{ fontSize: 15, fontWeight: 300 }}>Your bag is empty</p>
                  <p style={{ fontSize: 13, marginTop: 8 }}>Add some items to get started</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {cartItems.map(item => (
                    <motion.div
                      key={item._id || item.id}
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

                        {/* Qty controls */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e0e0e0' }}>
                            <button
                              onClick={() => onUpdateQty(item._id, item.qty - 1)}
                              style={{ width: 28, height: 28, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                              −
                            </button>
                            <span style={{ width: 28, textAlign: 'center', fontSize: 13, fontWeight: 600 }}>{item.qty}</span>
                            <button
                              onClick={() => onUpdateQty(item._id, item.qty + 1)}
                              style={{ width: 28, height: 28, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => onRemove(item._id)}
                            style={{ color: '#767676', padding: 4 }}
                            aria-label="Remove item"
                            onMouseEnter={e => e.currentTarget.style.color = '#E50010'}
                            onMouseLeave={e => e.currentTarget.style.color = '#767676'}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        <p style={{ fontSize: 13, fontWeight: 700, color: item.memberPrice ? '#E50010' : '#000' }}>
                          ₹{((item.memberPrice || item.price) * item.qty).toLocaleString()}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div style={{ padding: '20px 28px', borderTop: '1px solid #e0e0e0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: '#767676' }}>Subtotal</span>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>₹{total.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                  <span style={{ fontSize: 13, color: '#767676' }}>Shipping</span>
                  <span style={{ fontSize: 13, color: '#000', fontWeight: 500 }}>
                    {total >= 999 ? 'Free' : '₹99'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20, paddingTop: 16, borderTop: '1px solid #e0e0e0' }}>
                  <span style={{ fontSize: 15, fontWeight: 700 }}>Total</span>
                  <span style={{ fontSize: 15, fontWeight: 800 }}>
                    ₹{(total + (total >= 999 ? 0 : 99)).toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={onCheckout}
                  style={{
                    width: '100%', background: '#000', color: '#fff',
                    padding: '15px', fontSize: 12, fontWeight: 700,
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#333'}
                  onMouseLeave={e => e.currentTarget.style.background = '#000'}
                >
                  Proceed to Checkout
                  <ArrowRight size={14} />
                </button>
                <p style={{ fontSize: 11, color: '#767676', textAlign: 'center', marginTop: 12 }}>
                  Free shipping on orders above ₹999
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
