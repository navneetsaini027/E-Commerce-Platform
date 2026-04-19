import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ImageGallery({ images, productName }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });

  const imageList = Array.isArray(images) ? images : [images];

  const handlePrevious = () => {
    setSelectedIndex(prev => (prev === 0 ? imageList.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex(prev => (prev === imageList.length - 1 ? 0 : prev + 1));
  };

  const handleMouseMove = (e) => {
    if (!isZoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Main Image */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          background: '#f5f5f5',
          cursor: isZoomed ? 'zoom-out' : 'zoom-in',
        }}
        onClick={() => setIsZoomed(!isZoomed)}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setIsZoomed(false)}
      >
        <motion.img
          key={selectedIndex}
          src={imageList[selectedIndex]}
          alt={`${productName} - View ${selectedIndex + 1}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: isZoomed ? 'scale(2)' : 'scale(1)',
            transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
            transition: 'transform 0.1s ease-out',
          }}
        />

        {/* Zoom Icon */}
        {!isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              background: 'rgba(255,255,255,0.9)',
              borderRadius: '50%',
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            <ZoomIn size={18} />
          </motion.div>
        )}

        {/* Navigation Arrows */}
        {imageList.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); handlePrevious(); }}
              style={{
                position: 'absolute',
                left: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.9)',
                borderRadius: '50%',
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#fff'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.9)'}
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              style={{
                position: 'absolute',
                right: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.9)',
                borderRadius: '50%',
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#fff'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.9)'}
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Image Counter */}
        {imageList.length > 1 && (
          <div
            style={{
              position: 'absolute',
              bottom: 16,
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(0,0,0,0.7)',
              color: '#fff',
              padding: '4px 12px',
              borderRadius: 12,
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            {selectedIndex + 1} / {imageList.length}
          </div>
        )}
      </div>

      {/* Thumbnail Strip */}
      {imageList.length > 1 && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'rgba(255,255,255,0.95)',
            padding: '12px',
            display: 'flex',
            gap: 8,
            overflowX: 'auto',
            borderTop: '1px solid #e0e0e0',
          }}
        >
          {imageList.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              style={{
                width: 60,
                height: 80,
                flexShrink: 0,
                border: selectedIndex === idx ? '2px solid #000' : '2px solid transparent',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.2s',
                opacity: selectedIndex === idx ? 1 : 0.6,
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = 1}
              onMouseLeave={e => e.currentTarget.style.opacity = selectedIndex === idx ? 1 : 0.6}
            >
              <img
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
