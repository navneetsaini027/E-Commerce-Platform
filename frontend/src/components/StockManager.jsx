import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Package, TrendingDown } from 'lucide-react';

export default function StockManager({ products, onUpdateStock }) {
  const [stockUpdates, setStockUpdates] = useState({});

  const lowStockProducts = products.filter(p => 
    p.stock !== undefined && p.stock <= (p.lowStockThreshold || 10)
  );

  const outOfStockProducts = products.filter(p => !p.inStock || p.stock === 0);

  const handleStockChange = (productId, value) => {
    setStockUpdates(prev => ({ ...prev, [productId]: value }));
  };

  const saveStock = (productId) => {
    const newStock = stockUpdates[productId];
    if (newStock !== undefined && !isNaN(newStock) && Number(newStock) >= 0) {
      onUpdateStock(productId, Number(newStock));
      setStockUpdates(prev => {
        const updated = { ...prev };
        delete updated[productId];
        return updated;
      });
    }
  };

  return (
    <div>
      {/* Alerts */}
      {lowStockProducts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: '#FFF3CD',
            border: '1px solid #FFE69C',
            padding: '12px 16px',
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <AlertTriangle size={18} color="#856404" />
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#856404', marginBottom: 2 }}>
              Low Stock Alert
            </p>
            <p style={{ fontSize: 11, color: '#856404' }}>
              {lowStockProducts.length} {lowStockProducts.length === 1 ? 'product' : 'products'} running low on stock
            </p>
          </div>
        </motion.div>
      )}

      {outOfStockProducts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: '#F8D7DA',
            border: '1px solid #F5C2C7',
            padding: '12px 16px',
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <TrendingDown size={18} color="#842029" />
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#842029', marginBottom: 2 }}>
              Out of Stock
            </p>
            <p style={{ fontSize: 11, color: '#842029' }}>
              {outOfStockProducts.length} {outOfStockProducts.length === 1 ? 'product is' : 'products are'} out of stock
            </p>
          </div>
        </motion.div>
      )}

      {/* Stock List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#767676' }}>
            <Package size={40} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
            <p style={{ fontSize: 14 }}>No products yet</p>
          </div>
        ) : (
          products.map(p => {
            const currentStock = stockUpdates[p._id] !== undefined ? stockUpdates[p._id] : p.stock || 0;
            const isLowStock = currentStock <= (p.lowStockThreshold || 10) && currentStock > 0;
            const isOutOfStock = currentStock === 0;

            return (
              <div
                key={p._id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px',
                  border: '1px solid',
                  borderColor: isOutOfStock ? '#F5C2C7' : isLowStock ? '#FFE69C' : '#e0e0e0',
                  background: isOutOfStock ? '#FFF5F5' : isLowStock ? '#FFFBF0' : '#fff',
                }}
              >
                <img
                  src={p.image}
                  alt={p.name}
                  style={{
                    width: 52,
                    height: 68,
                    objectFit: 'cover',
                    background: '#f5f5f5',
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontSize: 13,
                    fontWeight: 600,
                    marginBottom: 2,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {p.name}
                  </p>
                  <p style={{ fontSize: 11, color: '#767676', marginBottom: 4 }}>
                    {p.category}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input
                      type="number"
                      min="0"
                      value={stockUpdates[p._id] !== undefined ? stockUpdates[p._id] : p.stock || 0}
                      onChange={e => handleStockChange(p._id, e.target.value)}
                      style={{
                        width: 70,
                        padding: '4px 8px',
                        border: '1px solid #d0d0d0',
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    />
                    <span style={{ fontSize: 11, color: '#767676' }}>units</span>
                    {stockUpdates[p._id] !== undefined && (
                      <button
                        onClick={() => saveStock(p._id)}
                        style={{
                          padding: '4px 12px',
                          background: '#000',
                          color: '#fff',
                          fontSize: 10,
                          fontWeight: 700,
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                        }}
                      >
                        Save
                      </button>
                    )}
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  {isOutOfStock ? (
                    <span style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: '#842029',
                      background: '#F8D7DA',
                      padding: '3px 8px',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                    }}>
                      OUT
                    </span>
                  ) : isLowStock ? (
                    <span style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: '#856404',
                      background: '#FFF3CD',
                      padding: '3px 8px',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                    }}>
                      LOW
                    </span>
                  ) : (
                    <span style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: '#155724',
                      background: '#D4EDDA',
                      padding: '3px 8px',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                    }}>
                      OK
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
