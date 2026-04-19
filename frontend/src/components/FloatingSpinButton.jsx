import { motion } from 'framer-motion';
import { Gift } from 'lucide-react';

export default function FloatingSpinButton({ onClick }) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      style={{
        position: 'fixed',
        bottom: 30,
        left: 30,
        width: 70,
        height: 70,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #E50010, #FF4444)',
        border: 'none',
        cursor: 'pointer',
        boxShadow: '0 8px 24px rgba(229, 0, 16, 0.4)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Gift size={32} color="#fff" />
      </motion.div>

      {/* Pulse effect */}
      <motion.div
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.5, 0, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #E50010, #FF4444)',
        }}
      />
    </motion.button>
  );
}
