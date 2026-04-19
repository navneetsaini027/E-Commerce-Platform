import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function StarryBackground() {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    // Generate random stars
    const newStars = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2,
    }));
    setStars(newStars);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: 'none',
      zIndex: 0,
      overflow: 'hidden',
    }}>
      {/* Animated Moon */}
      <motion.div
        animate={{
          y: [0, -10, 0],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          position: 'absolute',
          top: '8%',
          right: '10%',
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 30% 30%, #fff, #e0e0e0)',
          boxShadow: '0 0 40px rgba(255, 255, 255, 0.6), 0 0 80px rgba(255, 255, 255, 0.3), inset -10px -10px 20px rgba(0, 0, 0, 0.2)',
        }}
      >
        {/* Moon craters */}
        <div style={{
          position: 'absolute',
          top: '25%',
          left: '30%',
          width: 12,
          height: 12,
          borderRadius: '50%',
          background: 'rgba(0, 0, 0, 0.1)',
          boxShadow: 'inset 2px 2px 4px rgba(0, 0, 0, 0.3)',
        }} />
        <div style={{
          position: 'absolute',
          top: '55%',
          left: '50%',
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: 'rgba(0, 0, 0, 0.08)',
          boxShadow: 'inset 1px 1px 3px rgba(0, 0, 0, 0.3)',
        }} />
        <div style={{
          position: 'absolute',
          top: '40%',
          left: '65%',
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: 'rgba(0, 0, 0, 0.06)',
          boxShadow: 'inset 1px 1px 2px rgba(0, 0, 0, 0.3)',
        }} />
      </motion.div>

      {/* Stars */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          animate={{
            opacity: [0.4, 1, 0.4],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: "easeInOut"
          }}
          style={{
            position: 'absolute',
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size * 1.5,
            height: star.size * 1.5,
            borderRadius: '50%',
            background: '#ffffff',
            boxShadow: `0 0 ${star.size * 4}px rgba(255, 255, 255, 1), 0 0 ${star.size * 8}px rgba(255, 255, 255, 0.5)`,
          }}
        />
      ))}

      {/* Shooting stars */}
      <motion.div
        animate={{
          x: [-100, window.innerWidth + 100],
          y: [-50, 300],
          opacity: [0, 1, 1, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 8,
          ease: "easeOut"
        }}
        style={{
          position: 'absolute',
          top: '20%',
          left: 0,
          width: 150,
          height: 3,
          background: 'linear-gradient(90deg, transparent, #ffffff, transparent)',
          boxShadow: '0 0 20px rgba(255, 255, 255, 1), 0 0 40px rgba(255, 255, 255, 0.6)',
          transform: 'rotate(-45deg)',
        }}
      />

      <motion.div
        animate={{
          x: [-100, window.innerWidth + 100],
          y: [-50, 400],
          opacity: [0, 1, 1, 0],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          repeatDelay: 12,
          delay: 4,
          ease: "easeOut"
        }}
        style={{
          position: 'absolute',
          top: '40%',
          left: 0,
          width: 120,
          height: 3,
          background: 'linear-gradient(90deg, transparent, #ffffff, transparent)',
          boxShadow: '0 0 20px rgba(255, 255, 255, 1), 0 0 40px rgba(255, 255, 255, 0.6)',
          transform: 'rotate(-45deg)',
        }}
      />

      {/* Nebula clouds */}
      <motion.div
        animate={{
          opacity: [0.15, 0.3, 0.15],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          position: 'absolute',
          top: '15%',
          left: '20%',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(138, 43, 226, 0.3), transparent)',
          filter: 'blur(50px)',
        }}
      />

      <motion.div
        animate={{
          opacity: [0.15, 0.25, 0.15],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        style={{
          position: 'absolute',
          bottom: '20%',
          right: '15%',
          width: 350,
          height: 350,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(30, 144, 255, 0.25), transparent)',
          filter: 'blur(45px)',
        }}
      />
    </div>
  );
}
