import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import { Sparkles } from 'lucide-react';

export default function RecommendedProducts({ 
  currentProduct, 
  allProducts, 
  onAddToCart, 
  onAddToWishlist, 
  onProductClick 
}) {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    if (!currentProduct || !allProducts) return;

    // Smart recommendation algorithm
    const getRecommendations = () => {
      let scored = allProducts
        .filter(p => p._id !== currentProduct._id) // Exclude current product
        .map(product => {
          let score = 0;

          // Same category gets highest priority
          if (product.category === currentProduct.category) {
            score += 50;
          }

          // Similar price range
          const priceDiff = Math.abs(
            (product.memberPrice || product.price) - 
            (currentProduct.memberPrice || currentProduct.price)
          );
          if (priceDiff < 500) score += 30;
          else if (priceDiff < 1000) score += 20;
          else if (priceDiff < 2000) score += 10;

          // Higher rated products
          if (product.averageRating >= 4) score += 20;
          else if (product.averageRating >= 3) score += 10;

          // In stock products
          if (product.inStock) score += 15;

          // Popular products (more reviews)
          if (product.numReviews > 10) score += 15;
          else if (product.numReviews > 5) score += 10;

          // Products with member price (on sale)
          if (product.memberPrice) score += 10;

          return { ...product, score };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 4); // Top 4 recommendations

      setRecommendations(scored);
    };

    getRecommendations();
  }, [currentProduct, allProducts]);

  if (recommendations.length === 0) return null;

  return (
    <div style={{ 
      marginTop: 32, 
      paddingTop: 32, 
      borderTop: '1px solid #e0e0e0' 
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 8, 
          marginBottom: 20 
        }}>
          <Sparkles size={18} color="#E50010" />
          <h3 style={{ 
            fontSize: 14, 
            fontWeight: 700, 
            letterSpacing: '0.06em', 
            textTransform: 'uppercase' 
          }}>
            You May Also Like
          </h3>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: 12 
        }}>
          {recommendations.map((product, idx) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              style={{ cursor: 'pointer' }}
              onClick={() => onProductClick(product)}
            >
              <div style={{ 
                border: '1px solid #e0e0e0',
                overflow: 'hidden',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#000'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#e0e0e0'}
              >
                <div style={{ 
                  position: 'relative', 
                  aspectRatio: '3/4', 
                  background: '#f5f5f5' 
                }}>
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover' 
                    }}
                  />
                  {product.memberPrice && (
                    <div style={{
                      position: 'absolute',
                      top: 8,
                      left: 8,
                      background: '#E50010',
                      color: '#fff',
                      fontSize: 9,
                      fontWeight: 700,
                      padding: '2px 6px',
                      letterSpacing: '0.06em',
                    }}>
                      SALE
                    </div>
                  )}
                  {product.averageRating >= 4 && (
                    <div style={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      background: '#FFD700',
                      color: '#000',
                      fontSize: 9,
                      fontWeight: 700,
                      padding: '2px 6px',
                      letterSpacing: '0.06em',
                    }}>
                      ⭐ {product.averageRating.toFixed(1)}
                    </div>
                  )}
                </div>
                <div style={{ padding: 10 }}>
                  <p style={{ 
                    fontSize: 11, 
                    fontWeight: 600, 
                    marginBottom: 4,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {product.name}
                  </p>
                  <p style={{ 
                    fontSize: 9, 
                    color: '#767676', 
                    marginBottom: 6,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}>
                    {product.category}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {product.memberPrice ? (
                      <>
                        <span style={{ 
                          fontSize: 12, 
                          fontWeight: 700, 
                          color: '#E50010' 
                        }}>
                          ₹{product.memberPrice.toLocaleString()}
                        </span>
                        <span style={{ 
                          fontSize: 10, 
                          color: '#767676', 
                          textDecoration: 'line-through' 
                        }}>
                          ₹{product.price.toLocaleString()}
                        </span>
                      </>
                    ) : (
                      <span style={{ 
                        fontSize: 12, 
                        fontWeight: 600 
                      }}>
                        ₹{product.price.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
