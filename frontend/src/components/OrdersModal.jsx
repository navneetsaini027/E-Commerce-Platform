import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Package, Truck, CheckCircle, Clock, MapPin } from 'lucide-react';
import { getMyOrders } from '../api/api';

const STATUS_CONFIG = {
  pending: { icon: Clock, color: '#FFA500', label: 'Order Placed' },
  processing: { icon: Package, color: '#2196F3', label: 'Processing' },
  shipped: { icon: Truck, color: '#9C27B0', label: 'Shipped' },
  delivered: { icon: CheckCircle, color: '#4CAF50', label: 'Delivered' },
  cancelled: { icon: X, color: '#F44336', label: 'Cancelled' },
};

export default function OrdersModal({ isOpen, onClose, user, onViewInvoice }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (isOpen && user) {
      loadOrders();
    }
  }, [isOpen, user]);

  const loadOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getMyOrders();
      setOrders(res.data);
    } catch (err) {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const OrderCard = ({ order }) => {
    const StatusIcon = STATUS_CONFIG[order.status]?.icon || Clock;
    const statusColor = STATUS_CONFIG[order.status]?.color || '#767676';
    const statusLabel = STATUS_CONFIG[order.status]?.label || order.status;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          border: '1px solid #e0e0e0',
          padding: 20,
          marginBottom: 16,
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        onClick={() => setSelectedOrder(order)}
        onMouseEnter={e => e.currentTarget.style.borderColor = '#000'}
        onMouseLeave={e => e.currentTarget.style.borderColor = '#e0e0e0'}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#767676', marginBottom: 4 }}>
              Order #{order._id.slice(-8)}
            </p>
            <p style={{ fontSize: 12, color: '#767676' }}>
              {new Date(order.createdAt).toLocaleDateString('en-IN', { 
                day: 'numeric', 
                month: 'short', 
                year: 'numeric' 
              })}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: `${statusColor}15`, padding: '6px 12px' }}>
            <StatusIcon size={14} color={statusColor} />
            <span style={{ fontSize: 11, fontWeight: 700, color: statusColor, textTransform: 'uppercase' }}>
              {statusLabel}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
          {order.items.slice(0, 3).map((item, idx) => (
            <div key={idx} style={{ width: 60, height: 80, background: '#f5f5f5', flexShrink: 0 }}>
              <img 
                src={item.product?.image || '/placeholder.png'} 
                alt={item.product?.name || 'Product'}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          ))}
          {order.items.length > 3 && (
            <div style={{ 
              width: 60, height: 80, 
              background: '#f5f5f5', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 700,
              color: '#767676'
            }}>
              +{order.items.length - 3}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontSize: 12, color: '#767676' }}>
            {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              onClick={e => { e.stopPropagation(); onViewInvoice && onViewInvoice(order); }}
              style={{ fontSize: 11, fontWeight: 700, color: '#E50010', background: 'none', border: '1px solid #E50010', padding: '4px 12px', borderRadius: 20, cursor: 'pointer', letterSpacing: '0.05em' }}
            >
              View Bill
            </button>
            <p style={{ fontSize: 16, fontWeight: 700 }}>
              ₹{order.totalAmount.toLocaleString()}
            </p>
          </div>
        </div>
      </motion.div>
    );
  };

  const OrderDetail = ({ order }) => {
    const StatusIcon = STATUS_CONFIG[order.status]?.icon || Clock;
    const statusColor = STATUS_CONFIG[order.status]?.color || '#767676';
    const statusLabel = STATUS_CONFIG[order.status]?.label || order.status;

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
      >
        <div style={{ padding: '24px 28px', borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => setSelectedOrder(null)} style={{ padding: 8 }}>
            ← Back
          </button>
          <h3 style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Order Details
          </h3>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 28px' }}>
          {/* Order Info */}
          <div style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#767676', marginBottom: 4 }}>
              Order #{order._id.slice(-8)}
            </p>
            <p style={{ fontSize: 12, color: '#767676', marginBottom: 12 }}>
              Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: `${statusColor}15`, padding: '10px 16px', width: 'fit-content' }}>
              <StatusIcon size={18} color={statusColor} />
              <span style={{ fontSize: 13, fontWeight: 700, color: statusColor, textTransform: 'uppercase' }}>
                {statusLabel}
              </span>
            </div>
          </div>

          {/* Items */}
          <div style={{ marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid #e0e0e0' }}>
            <h4 style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>
              Items ({order.items.length})
            </h4>
            {order.items.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                <div style={{ width: 70, height: 90, background: '#f5f5f5', flexShrink: 0 }}>
                  <img 
                    src={item.product?.image || '/placeholder.png'} 
                    alt={item.product?.name || 'Product'}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                    {item.product?.name || 'Product'}
                  </p>
                  <p style={{ fontSize: 11, color: '#767676', marginBottom: 6 }}>
                    Qty: {item.quantity}
                  </p>
                  <p style={{ fontSize: 13, fontWeight: 700 }}>
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Shipping Address */}
          <div style={{ marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid #e0e0e0' }}>
            <h4 style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <MapPin size={14} />
              Shipping Address
            </h4>
            <p style={{ fontSize: 13, lineHeight: 1.6, color: '#444' }}>
              {order.shippingAddress.address}<br />
              {order.shippingAddress.city}, {order.shippingAddress.state}<br />
              PIN: {order.shippingAddress.pincode}<br />
              Phone: {order.shippingAddress.phone}
            </p>
          </div>

          {/* Payment Summary */}
          <div>
            <h4 style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>
              Payment Summary
            </h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
              <span>Payment Method</span>
              <span style={{ fontWeight: 600, textTransform: 'uppercase' }}>{order.paymentMethod}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
              <span>Payment Status</span>
              <span style={{ fontWeight: 600, color: order.isPaid ? '#4CAF50' : '#FFA500', textTransform: 'uppercase' }}>
                {order.isPaid ? 'Paid' : 'Pending'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 700, marginTop: 16, paddingTop: 16, borderTop: '1px solid #e0e0e0' }}>
              <span>Total Amount</span>
              <span>₹{order.totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

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
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.5)',
              zIndex: 1300,
              backdropFilter: 'blur(3px)',
            }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 1400,
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
              pointerEvents: 'none',
            }}
          >
          <div style={{
            background: '#fff', width: 'min(700px, 100%)',
            maxHeight: '85vh', zIndex: 1400,
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            display: 'flex', flexDirection: 'column',
            pointerEvents: 'all',
          }}>
            {!selectedOrder ? (
              <>
                {/* Header */}
                <div style={{
                  padding: '24px 28px',
                  borderBottom: '1px solid #e0e0e0',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Package size={18} />
                    <h2 style={{ fontSize: 15, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                      My Orders
                    </h2>
                  </div>
                  <button onClick={onClose} style={{ padding: 8 }} aria-label="Close">
                    <X size={18} />
                  </button>
                </div>

                {/* Orders List */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '20px 28px' }}>
                  {loading ? (
                    <div style={{ textAlign: 'center', padding: '60px 0', color: '#767676' }}>
                      <Package size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
                      <p>Loading your orders...</p>
                    </div>
                  ) : error ? (
                    <div style={{ textAlign: 'center', padding: '60px 0', color: '#E50010' }}>
                      <p>{error}</p>
                    </div>
                  ) : orders.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 0', color: '#767676' }}>
                      <Package size={48} style={{ margin: '0 auto 16px', opacity: 0.2 }} />
                      <p style={{ fontSize: 15, fontWeight: 300, marginBottom: 8 }}>No orders yet</p>
                      <p style={{ fontSize: 13 }}>Start shopping to see your orders here</p>
                    </div>
                  ) : (
                    orders.map(order => <OrderCard key={order._id} order={order} />)
                  )}
                </div>
              </>
            ) : (
              <OrderDetail order={selectedOrder} />
            )}
          </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
