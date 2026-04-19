import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Truck, CheckCircle, Tag } from 'lucide-react';
import { placeOrder, validateCoupon } from '../api/api';

export default function CheckoutModal({ isOpen, onClose, cartItems, user, onOrderSuccess }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [coupon, setCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [form, setForm] = useState({
    address: '', city: '', state: '', pincode: '', phone: '', paymentMethod: 'cod',
  });

  const subtotal = cartItems.reduce((sum, item) => sum + (item.memberPrice || item.price) * item.qty, 0);
  const shipping = subtotal > 2000 ? 0 : 99;
  const discount = coupon?.discount || 0;
  const finalTotal = subtotal + shipping - discount;

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError('');
    setCoupon(null);
    try {
      const res = await validateCoupon(couponCode.trim(), subtotal);
      setCoupon(res.data);
    } catch (err) {
      setCouponError(err.response?.data?.message || 'Invalid coupon');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const orderData = {
        items: cartItems.map(item => ({
          product: item._id,
          quantity: item.qty,
          price: item.memberPrice || item.price,
        })),
        shippingAddress: {
          address: form.address,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
          phone: form.phone,
        },
        paymentMethod: form.paymentMethod,
        totalAmount: finalTotal,
        couponCode: coupon?.code || null,
        discount,
      };

      await placeOrder(orderData);
      setStep(3);
      setTimeout(() => {
        onOrderSuccess();
        onClose();
        setStep(1);
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const INPUT_STYLE = {
    width: '100%',
    border: '1px solid #d0d0d0',
    padding: '10px 12px',
    fontSize: 13,
    outline: 'none',
    background: '#fff',
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
            background: '#fff', width: 'min(500px, 100%)',
            maxHeight: '90vh', overflowY: 'auto', padding: '40px 36px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            pointerEvents: 'all', position: 'relative',
          }}>
            {step !== 3 && (
              <button
                onClick={onClose}
                style={{ position: 'absolute', top: 16, right: 16, padding: 8 }}
              >
                <X size={18} />
              </button>
            )}

            {/* Success Step */}
            {step === 3 ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', duration: 0.5 }}
                >
                  <CheckCircle size={64} color="#22c55e" style={{ margin: '0 auto' }} />
                </motion.div>
                <h2 style={{ fontSize: 24, fontWeight: 800, marginTop: 24, letterSpacing: '-0.02em' }}>
                  Order Placed!
                </h2>
                <p style={{ fontSize: 14, color: '#767676', marginTop: 12 }}>
                  Thank you for your order. We'll send you a confirmation email shortly.
                </p>
              </div>
            ) : (
              <>
                {/* Header */}
                <div style={{ marginBottom: 32 }}>
                  <h2 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    Checkout
                  </h2>
                  <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                    <div style={{ flex: 1, height: 3, background: '#000' }} />
                    <div style={{ flex: 1, height: 3, background: step >= 2 ? '#000' : '#e0e0e0' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#000' }}>
                      <Truck size={12} style={{ display: 'inline', marginRight: 4 }} />
                      SHIPPING
                    </span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: step >= 2 ? '#000' : '#767676' }}>
                      <CreditCard size={12} style={{ display: 'inline', marginRight: 4 }} />
                      PAYMENT
                    </span>
                  </div>
                </div>

                {/* Step 1: Shipping Address */}
                {step === 1 && (
                  <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: 20 }}>
                      <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#767676', display: 'block', marginBottom: 6 }}>
                        Full Address
                      </label>
                      <input
                        type="text"
                        value={form.address}
                        onChange={e => handleChange('address', e.target.value)}
                        placeholder="House no, Street, Area"
                        required
                        style={INPUT_STYLE}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#767676', display: 'block', marginBottom: 6 }}>
                          City
                        </label>
                        <input
                          type="text"
                          value={form.city}
                          onChange={e => handleChange('city', e.target.value)}
                          placeholder="City"
                          required
                          style={INPUT_STYLE}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#767676', display: 'block', marginBottom: 6 }}>
                          State
                        </label>
                        <input
                          type="text"
                          value={form.state}
                          onChange={e => handleChange('state', e.target.value)}
                          placeholder="State"
                          required
                          style={INPUT_STYLE}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#767676', display: 'block', marginBottom: 6 }}>
                          Pincode
                        </label>
                        <input
                          type="text"
                          value={form.pincode}
                          onChange={e => handleChange('pincode', e.target.value)}
                          placeholder="123456"
                          required
                          pattern="[0-9]{6}"
                          style={INPUT_STYLE}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#767676', display: 'block', marginBottom: 6 }}>
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={e => handleChange('phone', e.target.value)}
                          placeholder="9876543210"
                          required
                          pattern="[0-9]{10}"
                          style={INPUT_STYLE}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      style={{
                        width: '100%',
                        background: '#000',
                        color: '#fff',
                        padding: '14px',
                        fontSize: 12, fontWeight: 700,
                        letterSpacing: '0.12em', textTransform: 'uppercase',
                      }}
                    >
                      Continue to Payment
                    </button>
                  </form>
                )}

                {/* Step 2: Payment */}
                {step === 2 && (
                  <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: 24 }}>
                      <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#767676', display: 'block', marginBottom: 12 }}>
                        Payment Method
                      </label>
                      
                      <label style={{ display: 'flex', alignItems: 'center', padding: 16, border: '2px solid', borderColor: form.paymentMethod === 'cod' ? '#000' : '#d0d0d0', marginBottom: 12, cursor: 'pointer' }}>
                        <input
                          type="radio"
                          name="payment"
                          value="cod"
                          checked={form.paymentMethod === 'cod'}
                          onChange={e => handleChange('paymentMethod', e.target.value)}
                          style={{ marginRight: 12 }}
                        />
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 700 }}>Cash on Delivery</div>
                          <div style={{ fontSize: 12, color: '#767676', marginTop: 2 }}>Pay when you receive</div>
                        </div>
                      </label>

                      <label style={{ display: 'flex', alignItems: 'center', padding: 16, border: '2px solid', borderColor: form.paymentMethod === 'online' ? '#000' : '#d0d0d0', cursor: 'pointer' }}>
                        <input
                          type="radio"
                          name="payment"
                          value="online"
                          checked={form.paymentMethod === 'online'}
                          onChange={e => handleChange('paymentMethod', e.target.value)}
                          style={{ marginRight: 12 }}
                        />
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 700 }}>Online Payment</div>
                          <div style={{ fontSize: 12, color: '#767676', marginTop: 2 }}>UPI, Cards, Net Banking</div>
                        </div>
                      </label>
                    </div>

                    {/* Order Summary */}
                    <div style={{ background: '#f9f9f9', padding: 20, marginBottom: 24 }}>
                      <h3 style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>
                        Order Summary
                      </h3>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                        <span>Subtotal ({cartItems.length} items)</span>
                        <span>₹{subtotal.toLocaleString()}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                        <span>Shipping</span>
                        <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                      </div>
                      {discount > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8, color: '#22c55e' }}>
                          <span>Coupon ({coupon.code})</span>
                          <span>-₹{discount}</span>
                        </div>
                      )}
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 700, paddingTop: 12, borderTop: '1px solid #e0e0e0' }}>
                        <span>Total</span>
                        <span>₹{finalTotal.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Coupon */}
                    <div style={{ marginBottom: 20 }}>
                      <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#767676', display: 'block', marginBottom: 8 }}>
                        <Tag size={11} style={{ display: 'inline', marginRight: 4 }} />
                        Coupon Code
                      </label>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <input
                          type="text"
                          value={couponCode}
                          onChange={e => { setCouponCode(e.target.value.toUpperCase()); setCoupon(null); setCouponError(''); }}
                          placeholder="e.g. FLAT30"
                          style={{ flex: 1, border: '1px solid #d0d0d0', padding: '10px 12px', fontSize: 13, outline: 'none', fontFamily: 'inherit', letterSpacing: '0.05em' }}
                        />
                        <button
                          type="button"
                          onClick={handleApplyCoupon}
                          disabled={couponLoading || !couponCode}
                          style={{
                            background: coupon ? '#22c55e' : '#000', color: '#fff',
                            padding: '10px 16px', fontSize: 11, fontWeight: 700,
                            letterSpacing: '0.08em', textTransform: 'uppercase',
                            cursor: couponLoading || !couponCode ? 'not-allowed' : 'pointer',
                            opacity: !couponCode ? 0.5 : 1,
                          }}
                        >
                          {couponLoading ? '...' : coupon ? '✓ Applied' : 'Apply'}
                        </button>
                      </div>
                      {couponError && <p style={{ fontSize: 11, color: '#E50010', marginTop: 6 }}>{couponError}</p>}
                      {coupon && <p style={{ fontSize: 11, color: '#22c55e', marginTop: 6 }}>✓ {coupon.message} — Saved ₹{coupon.discount}</p>}
                    </div>

                    {error && (
                      <p style={{ fontSize: 12, color: '#E50010', marginBottom: 16, textAlign: 'center' }}>
                        {error}
                      </p>
                    )}

                    <div style={{ display: 'flex', gap: 12 }}>
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        style={{
                          flex: 1,
                          background: '#fff',
                          color: '#000',
                          border: '1px solid #000',
                          padding: '14px',
                          fontSize: 12, fontWeight: 700,
                          letterSpacing: '0.12em', textTransform: 'uppercase',
                        }}
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        style={{
                          flex: 2,
                          background: loading ? '#767676' : '#000',
                          color: '#fff',
                          padding: '14px',
                          fontSize: 12, fontWeight: 700,
                          letterSpacing: '0.12em', textTransform: 'uppercase',
                          cursor: loading ? 'not-allowed' : 'pointer',
                        }}
                      >
                        {loading ? 'Processing...' : 'Place Order'}
                      </button>
                    </div>
                  </form>
                )}
              </>
            )}
          </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
