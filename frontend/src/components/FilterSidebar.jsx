import { motion, AnimatePresence } from 'framer-motion';
import { X, SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

export default function FilterSidebar({ isOpen, onClose, filters, onFilterChange, onClearFilters }) {
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    rating: true,
    sort: true,
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const priceRanges = [
    { label: 'Under ₹1,000', min: 0, max: 1000 },
    { label: '₹1,000 - ₹2,000', min: 1000, max: 2000 },
    { label: '₹2,000 - ₹3,000', min: 2000, max: 3000 },
    { label: '₹3,000 - ₹5,000', min: 3000, max: 5000 },
    { label: 'Above ₹5,000', min: 5000, max: Infinity },
  ];

  const sortOptions = [
    { label: 'Newest First', value: 'newest' },
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
    { label: 'Highest Rated', value: 'rating' },
  ];

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
              background: 'rgba(0,0,0,0.4)',
              zIndex: 1100,
              backdropFilter: 'blur(2px)',
            }}
          />

          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              position: 'fixed', top: 0, left: 0, bottom: 0,
              width: 'min(340px, 85vw)',
              background: '#fff',
              zIndex: 1200,
              display: 'flex', flexDirection: 'column',
              boxShadow: '8px 0 40px rgba(0,0,0,0.12)',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '24px 28px',
              borderBottom: '1px solid #e0e0e0',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <SlidersHorizontal size={18} />
                <h2 style={{ fontSize: 15, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Filters
                </h2>
              </div>
              <button onClick={onClose} style={{ padding: 8 }} aria-label="Close filters">
                <X size={18} />
              </button>
            </div>

            {/* Filters */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 28px' }}>
              
              {/* Sort By */}
              <div style={{ marginBottom: 28 }}>
                <button
                  onClick={() => toggleSection('sort')}
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 16,
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  Sort By
                  {expandedSections.sort ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                
                {expandedSections.sort && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {sortOptions.map(option => (
                      <label
                        key={option.value}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          cursor: 'pointer',
                          fontSize: 13,
                        }}
                      >
                        <input
                          type="radio"
                          name="sort"
                          value={option.value}
                          checked={filters.sort === option.value}
                          onChange={(e) => onFilterChange('sort', e.target.value)}
                          style={{ marginRight: 10, cursor: 'pointer' }}
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Price Range */}
              <div style={{ marginBottom: 28, paddingTop: 20, borderTop: '1px solid #e0e0e0' }}>
                <button
                  onClick={() => toggleSection('price')}
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 16,
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  Price Range
                  {expandedSections.price ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                
                {expandedSections.price && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {priceRanges.map((range, idx) => (
                      <label
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          cursor: 'pointer',
                          fontSize: 13,
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={filters.priceRanges?.some(
                            r => r.min === range.min && r.max === range.max
                          )}
                          onChange={(e) => {
                            const newRanges = e.target.checked
                              ? [...(filters.priceRanges || []), range]
                              : filters.priceRanges.filter(
                                  r => !(r.min === range.min && r.max === range.max)
                                );
                            onFilterChange('priceRanges', newRanges);
                          }}
                          style={{ marginRight: 10, cursor: 'pointer' }}
                        />
                        {range.label}
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Rating */}
              <div style={{ paddingTop: 20, borderTop: '1px solid #e0e0e0' }}>
                <button
                  onClick={() => toggleSection('rating')}
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 16,
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  Minimum Rating
                  {expandedSections.rating ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                
                {expandedSections.rating && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {[4, 3, 2, 1].map(rating => (
                      <label
                        key={rating}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          cursor: 'pointer',
                          fontSize: 13,
                        }}
                      >
                        <input
                          type="radio"
                          name="rating"
                          value={rating}
                          checked={filters.minRating === rating}
                          onChange={(e) => onFilterChange('minRating', Number(e.target.value))}
                          style={{ marginRight: 10, cursor: 'pointer' }}
                        />
                        {rating}+ Stars
                      </label>
                    ))}
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        fontSize: 13,
                      }}
                    >
                      <input
                        type="radio"
                        name="rating"
                        value={0}
                        checked={!filters.minRating || filters.minRating === 0}
                        onChange={(e) => onFilterChange('minRating', 0)}
                        style={{ marginRight: 10, cursor: 'pointer' }}
                      />
                      All Ratings
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding: '20px 28px', borderTop: '1px solid #e0e0e0' }}>
              <button
                onClick={onClearFilters}
                style={{
                  width: '100%',
                  background: '#fff',
                  color: '#000',
                  border: '1px solid #000',
                  padding: '14px',
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  marginBottom: 12,
                }}
              >
                Clear All Filters
              </button>
              <button
                onClick={onClose}
                style={{
                  width: '100%',
                  background: '#000',
                  color: '#fff',
                  padding: '14px',
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                }}
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
