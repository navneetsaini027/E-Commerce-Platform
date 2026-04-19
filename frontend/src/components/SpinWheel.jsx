import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Sparkles } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { canSpin, recordSpin } from '../api/api';
import { toast } from './ToastNotification';

const PRIZES = [
  { label: '10% OFF', color: '#FF6B6B', value: 10 },
  { label: '5% OFF', color: '#4ECDC4', value: 5 },
  { label: '15% OFF', color: '#FFE66D', value: 15 },
  { label: 'FREE SHIP', color: '#95E1D3', value: 0 },
  { label: '20% OFF', color: '#F38181', value: 20 },
  { label: '5% OFF', color: '#AA96DA', value: 5 },
  { label: '25% OFF', color: '#FCBAD3', value: 25 },
  { label: 'TRY AGAIN', color: '#A8D8EA', value: 0 },
];

export default function SpinWheel({ isOpen, onClose, onWin, user }) {
  const { theme } = useTheme();
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [prize, setPrize] = useState(null);
  const [canSpinToday, setCanSpinToday] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && user) {
      checkCanSpin();
    } else if (isOpen && !user) {
      // For non-logged users, check localStorage
      const lastSpin = localStorage.getItem('lastSpinDate');
      const today = new Date().toDateString();
      setCanSpinToday(lastSpin !== today);
      setLoading(false);
    }
  }, [isOpen, user]);

  const checkCanSpin = async () => {
    if (!user) return;
    try {
      const res = await canSpin();
      setCanSpinToday(res.data.canSpin);
    } catch (error) {
      console.error('Error checking spin status:', error);
    } finally {
      setLoading(false);
    }
  };

  const spinWheel = async () => {
    if (!canSpinToday || spinning) return;

    setSpinning(true);
    const prizeIndex = Math.floor(Math.random() * PRIZES.length);
    const segmentAngle = 360 / PRIZES.length;
    const targetRotation = 360 * 5 + (prizeIndex * segmentAngle) + (segmentAngle / 2);
    
    setRotation(targetRotation);

    setTimeout(async () => {
      setSpinning(false);
      const wonPrize = PRIZES[prizeIndex];
      setPrize(wonPrize);
      
      // Save to backend if user is logged in
      if (user) {
        try {
          const res = await recordSpin(wonPrize);
          if (res.data.couponCode) {
            toast.success(`You won ${wonPrize.label}! Code: ${res.data.couponCode}`);
          }
        } catch (error) {
          console.error('Error recording spin:', error);
        }
      } else {
        // Save to localStorage for non-logged users
        localStorage.setItem('lastSpinDate', new Date().toDateString());
      }
      
      setCanSpinToday(false);
      if (onWin) onWin(wonPrize);
    }, 4000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div style={{
        position: 'fixed',
        inset: 0,
        background: theme.colors.overlay,
        backdropFilter: 'blur(8px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          style={{
            background: theme.colors.surface,
            borderRadius: 24,
            padding: 40,
            maxWidth: 500,
            width: '100%',
            position: 'relative',
            boxShadow: `0 20px 60px ${theme.colors.shadow}`,
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              padding: 8,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <X size={24} color={theme.colors.text} />
          </button>

          <div style={{ textAlign: 'center', marginBottom: 30 }}>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
              style={{ display: 'inline-block', marginBottom: 16 }}
            >
              <Gift size={48} color="#E50010" />
            </motion.div>
            <h2 style={{
              fontSize: 28,
              fontWeight: 800,
              color: theme.colors.text,
              marginBottom: 8,
            }}>
              Spin & Win!
            </h2>
            <p style={{ fontSize: 14, color: theme.colors.textSecondary }}>
              {loading ? 'Loading...' : canSpinToday ? 'Try your luck today!' : 'Come back tomorrow for another spin!'}
            </p>
          </div>

          {/* Wheel Container */}
          <div style={{ position: 'relative', margin: '0 auto 30px', width: 300, height: 300 }}>
            {/* Pointer */}
            <div style={{
              position: 'absolute',
              top: -10,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 10,
              width: 0,
              height: 0,
              borderLeft: '15px solid transparent',
              borderRight: '15px solid transparent',
              borderTop: '30px solid #E50010',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
            }} />

            {/* Wheel */}
            <motion.div
              animate={{ rotate: rotation }}
              transition={{ duration: 4, ease: [0.25, 0.1, 0.25, 1] }}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                border: '8px solid #fff',
              }}
            >
              {PRIZES.map((prize, i) => {
                const angle = (360 / PRIZES.length) * i;
                return (
                  <div
                    key={i}
                    style={{
                      position: 'absolute',
                      width: '50%',
                      height: '50%',
                      left: '50%',
                      top: '50%',
                      transformOrigin: '0 0',
                      transform: `rotate(${angle}deg) skewY(${-90 + 360 / PRIZES.length}deg)`,
                      background: prize.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span style={{
                      position: 'absolute',
                      left: '60%',
                      top: '50%',
                      transform: `skewY(${90 - 360 / PRIZES.length}deg) rotate(${360 / PRIZES.length / 2}deg)`,
                      fontSize: 12,
                      fontWeight: 800,
                      color: '#fff',
                      textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                      whiteSpace: 'nowrap',
                    }}>
                      {prize.label}
                    </span>
                  </div>
                );
              })}

              {/* Center Circle */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #E50010, #FF4444)',
                boxShadow: '0 4px 12px rgba(229, 0, 16, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Sparkles size={24} color="#fff" />
              </div>
            </motion.div>
          </div>

          {/* Spin Button */}
          <motion.button
            onClick={spinWheel}
            disabled={!canSpinToday || spinning || loading}
            whileHover={canSpinToday && !spinning && !loading ? { scale: 1.05 } : {}}
            whileTap={canSpinToday && !spinning && !loading ? { scale: 0.95 } : {}}
            style={{
              width: '100%',
              padding: '16px 32px',
              background: canSpinToday && !spinning && !loading ? 'linear-gradient(135deg, #E50010, #FF4444)' : '#ccc',
              color: '#fff',
              border: 'none',
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: canSpinToday && !spinning && !loading ? 'pointer' : 'not-allowed',
              boxShadow: canSpinToday && !spinning && !loading ? '0 4px 16px rgba(229, 0, 16, 0.3)' : 'none',
            }}
          >
            {loading ? 'LOADING...' : spinning ? 'SPINNING...' : canSpinToday ? 'SPIN NOW' : 'COME BACK TOMORROW'}
          </motion.button>

          {/* Prize Display */}
          <AnimatePresence>
            {prize && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{
                  marginTop: 20,
                  padding: 20,
                  background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                  borderRadius: 12,
                  textAlign: 'center',
                }}
              >
                <p style={{ fontSize: 18, fontWeight: 800, color: '#000', marginBottom: 4 }}>
                  🎉 Congratulations! 🎉
                </p>
                <p style={{ fontSize: 24, fontWeight: 900, color: '#E50010' }}>
                  You won: {prize.label}
                </p>
                {prize.value > 0 && (
                  <p style={{ fontSize: 12, color: '#000', marginTop: 8 }}>
                    Use code: <strong>SPIN{prize.value}</strong>
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
