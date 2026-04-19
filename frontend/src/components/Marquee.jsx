import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

const TEXT = "AASHIRWAD FASHION • SUMMER 2025 COLLECTION • NEW ARRIVALS • MEMBER PRICES • ";

export default function Marquee() {
  const { theme } = useTheme();
  const repeated = TEXT.repeat(4);

  return (
    <div style={{
      background: theme.colors.text, 
      color: theme.colors.background,
      overflow: 'hidden',
      padding: '12px 0',
      userSelect: 'none',
      transition: 'background-color 0.3s ease, color 0.3s ease',
    }}>
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        style={{ display: 'flex', whiteSpace: 'nowrap', width: 'max-content' }}
      >
        <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.18em', paddingRight: 0 }}>
          {repeated}
        </span>
        <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.18em' }}>
          {repeated}
        </span>
      </motion.div>
    </div>
  );
}
