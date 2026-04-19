import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, Package } from 'lucide-react';
import { CATEGORIES } from '../data/products';
import StockManager from './StockManager';

const FIELD_STYLE = {
  width: '100%',
  border: 'none',
  borderBottom: '1px solid #d0d0d0',
  padding: '10px 0',
  fontSize: 14,
  outline: 'none',
  background: 'transparent',
  color: '#000',
  transition: 'border-color 0.2s',
};

const LABEL_STYLE = {
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: '#767676',
  display: 'block',
  marginBottom: 4,
};

export default function AdminPanel({ isOpen, onClose, onAddProduct, products, onDeleteProduct, onUpdateStock }) {
  const [form, setForm] = useState({
    name: '', price: '', memberPrice: '', category: 'Ladies', image: '', stock: '50', images: [], description: '',
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('add');
  const [stockUpdates, setStockUpdates] = useState({});
  const [imageInput, setImageInput] = useState('');

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) e.price = 'Valid price required';
    if (form.memberPrice && (isNaN(form.memberPrice) || Number(form.memberPrice) <= 0)) e.memberPrice = 'Must be a valid number';
    if (!form.image.trim()) e.image = 'Required';
    if (!form.stock || isNaN(form.stock) || Number(form.stock) < 0) e.stock = 'Valid stock required';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    onAddProduct({
      name: form.name,
      price: Number(form.price),
      memberPrice: form.memberPrice ? Number(form.memberPrice) : undefined,
      category: form.category,
      image: form.image,
      images: form.images.length > 0 ? form.images : [form.image],
      description: form.description || undefined,
      stock: Number(form.stock),
    });

    setForm({ name: '', price: '', memberPrice: '', category: 'Ladies', image: '', stock: '50', images: [], description: '' });
    setImageInput('');
    setErrors({});
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2500);
  };

  const handleAddImage = () => {
    if (imageInput.trim()) {
      setForm(prev => ({ ...prev, images: [...prev.images, imageInput.trim()] }));
      setImageInput('');
    }
  };

  const handleRemoveImage = (index) => {
    setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
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

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              position: 'fixed', top: 0, right: 0, bottom: 0,
              width: 'min(480px, 100vw)',
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
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Admin Panel
                </h2>
                <p style={{ fontSize: 12, color: '#767676', marginTop: 2 }}>Manage your product catalog</p>
              </div>
              <button onClick={onClose} style={{ padding: 8 }} aria-label="Close">
                <X size={18} />
              </button>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid #e0e0e0' }}>
              {[
                { id: 'add', label: 'Add Product' }, 
                { id: 'manage', label: `Manage (${products.length})` },
                { id: 'stock', label: 'Stock' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    flex: 1, padding: '14px 0',
                    fontSize: 12, fontWeight: 700,
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    borderBottom: activeTab === tab.id ? '2px solid #000' : '2px solid transparent',
                    color: activeTab === tab.id ? '#000' : '#767676',
                    transition: 'all 0.2s',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '28px' }}>
              {activeTab === 'add' && (
                <form onSubmit={handleSubmit} noValidate>
                  <AnimatePresence>
                    {success && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        style={{
                          background: '#000', color: '#fff',
                          padding: '12px 16px', fontSize: 13,
                          marginBottom: 24, fontWeight: 500,
                        }}
                      >
                        ✓ Product added successfully
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Product Name */}
                  <div style={{ marginBottom: 24 }}>
                    <label style={LABEL_STYLE}>Product Name *</label>
                    <input
                      value={form.name}
                      onChange={e => handleChange('name', e.target.value)}
                      placeholder="e.g. Flowy Summer Dress"
                      style={{ ...FIELD_STYLE, borderBottomColor: errors.name ? '#E50010' : '#d0d0d0' }}
                    />
                    {errors.name && <p style={{ fontSize: 11, color: '#E50010', marginTop: 4 }}>{errors.name}</p>}
                  </div>

                  {/* Price row */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
                    <div>
                      <label style={LABEL_STYLE}>Original Price (₹) *</label>
                      <input
                        type="number" min="0"
                        value={form.price}
                        onChange={e => handleChange('price', e.target.value)}
                        placeholder="2499"
                        style={{ ...FIELD_STYLE, borderBottomColor: errors.price ? '#E50010' : '#d0d0d0' }}
                      />
                      {errors.price && <p style={{ fontSize: 11, color: '#E50010', marginTop: 4 }}>{errors.price}</p>}
                    </div>
                    <div>
                      <label style={LABEL_STYLE}>Member Price (₹)</label>
                      <input
                        type="number" min="0"
                        value={form.memberPrice}
                        onChange={e => handleChange('memberPrice', e.target.value)}
                        placeholder="1999"
                        style={{ ...FIELD_STYLE, borderBottomColor: errors.memberPrice ? '#E50010' : '#d0d0d0' }}
                      />
                      {errors.memberPrice && <p style={{ fontSize: 11, color: '#E50010', marginTop: 4 }}>{errors.memberPrice}</p>}
                    </div>
                  </div>

                  {/* Category */}
                  <div style={{ marginBottom: 24 }}>
                    <label style={LABEL_STYLE}>Category *</label>
                    <select
                      value={form.category}
                      onChange={e => handleChange('category', e.target.value)}
                      style={{
                        ...FIELD_STYLE,
                        appearance: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      {CATEGORIES.filter(c => c !== 'All').map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* Image URL */}
                  <div style={{ marginBottom: 24 }}>
                    <label style={LABEL_STYLE}>Main Image URL *</label>
                    <input
                      value={form.image}
                      onChange={e => handleChange('image', e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      style={{ ...FIELD_STYLE, borderBottomColor: errors.image ? '#E50010' : '#d0d0d0' }}
                    />
                    {errors.image && <p style={{ fontSize: 11, color: '#E50010', marginTop: 4 }}>{errors.image}</p>}
                    {form.image && (
                      <div style={{ marginTop: 12, aspectRatio: '3/2', overflow: 'hidden', background: '#f5f5f5' }}>
                        <img
                          src={form.image}
                          alt="Preview"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={e => { e.target.style.display = 'none'; }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Additional Images */}
                  <div style={{ marginBottom: 24 }}>
                    <label style={LABEL_STYLE}>Additional Images (Gallery)</label>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                      <input
                        value={imageInput}
                        onChange={e => setImageInput(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleAddImage())}
                        placeholder="Paste image URL and press Enter or click +"
                        style={{ ...FIELD_STYLE, flex: 1 }}
                      />
                      <button
                        type="button"
                        onClick={handleAddImage}
                        style={{
                          padding: '8px 16px',
                          background: '#000',
                          color: '#fff',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: 12,
                          fontWeight: 700,
                        }}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    
                    {/* Image Gallery Preview */}
                    {form.images.length > 0 && (
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: 8,
                        marginTop: 12,
                      }}>
                        {form.images.map((img, index) => (
                          <div
                            key={index}
                            style={{
                              position: 'relative',
                              aspectRatio: '3/4',
                              background: '#f5f5f5',
                              overflow: 'hidden',
                            }}
                          >
                            <img
                              src={img}
                              alt={`Gallery ${index + 1}`}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              onError={e => { e.target.style.display = 'none'; }}
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              style={{
                                position: 'absolute',
                                top: 4,
                                right: 4,
                                background: 'rgba(0,0,0,0.7)',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '50%',
                                width: 24,
                                height: 24,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                              }}
                            >
                              <X size={14} />
                            </button>
                            <div style={{
                              position: 'absolute',
                              bottom: 4,
                              left: 4,
                              background: 'rgba(0,0,0,0.7)',
                              color: '#fff',
                              padding: '2px 6px',
                              fontSize: 10,
                              fontWeight: 700,
                            }}>
                              {index + 1}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <p style={{ fontSize: 10, color: '#767676', marginTop: 8 }}>
                      {form.images.length} image{form.images.length !== 1 ? 's' : ''} added • Click + to add more
                    </p>
                  </div>

                  {/* Description */}
                  <div style={{ marginBottom: 24 }}>
                    <label style={LABEL_STYLE}>Description (Optional)</label>
                    <textarea
                      value={form.description}
                      onChange={e => handleChange('description', e.target.value)}
                      placeholder="Detailed product description..."
                      rows={3}
                      style={{
                        ...FIELD_STYLE,
                        resize: 'vertical',
                        fontFamily: 'inherit',
                        paddingTop: 10,
                      }}
                    />
                  </div>

                  {/* Stock */}
                  <div style={{ marginBottom: 32 }}>
                    <label style={LABEL_STYLE}>Initial Stock *</label>
                    <input
                      type="number"
                      min="0"
                      value={form.stock}
                      onChange={e => handleChange('stock', e.target.value)}
                      placeholder="50"
                      style={{ ...FIELD_STYLE, borderBottomColor: errors.stock ? '#E50010' : '#d0d0d0' }}
                    />
                    {errors.stock && <p style={{ fontSize: 11, color: '#E50010', marginTop: 4 }}>{errors.stock}</p>}
                  </div>

                  <button
                    type="submit"
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
                    <Plus size={14} />
                    Add Product
                  </button>
                </form>
              )}
              
              {activeTab === 'manage' && (
                <div>
                  {products.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 0', color: '#767676' }}>
                      <Package size={40} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
                      <p style={{ fontSize: 14 }}>No products yet</p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {products.map(p => (
                        <div
                          key={p._id}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 12,
                            padding: '12px 0', borderBottom: '1px solid #f0f0f0',
                          }}
                        >
                          <img
                            src={p.image} alt={p.name}
                            style={{ width: 52, height: 68, objectFit: 'cover', background: '#f5f5f5', flexShrink: 0 }}
                          />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {p.name}
                            </p>
                            <p style={{ fontSize: 11, color: '#767676', marginBottom: 2 }}>{p.category}</p>
                            <p style={{ fontSize: 12, fontWeight: 700, color: p.memberPrice ? '#E50010' : '#000' }}>
                              ₹{(p.memberPrice || p.price).toLocaleString()}
                            </p>
                          </div>
                          <button
                            onClick={() => onDeleteProduct(p._id)}
                            style={{ padding: 8, color: '#767676', flexShrink: 0 }}
                            aria-label="Delete product"
                            onMouseEnter={e => e.currentTarget.style.color = '#E50010'}
                            onMouseLeave={e => e.currentTarget.style.color = '#767676'}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'stock' && (
                <StockManager products={products} onUpdateStock={onUpdateStock} />
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
