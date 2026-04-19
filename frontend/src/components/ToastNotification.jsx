import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, X, Info, AlertCircle } from 'lucide-react';

const TOAST_TYPES = {
  success: { icon: CheckCircle, color: '#4CAF50', bg: '#E8F5E8' },
  error: { icon: AlertCircle, color: '#F44336', bg: '#FFEBEE' },
  warning: { icon: AlertTriangle, color: '#FF9800', bg: '#FFF3E0' },
  info: { icon: Info, color: '#2196F3', bg: '#E3F2FD' },
};

let toastId = 0;

export const showToast = (() => {
  let addToast = null;
  
  const setAddToast = (fn) => {
    addToast = fn;
  };
  
  const show = (message, type = 'info', duration = 4000) => {
    if (addToast) {
      addToast({ 
        id: ++toastId, 
        message, 
        type, 
        duration 
      });
    }
  };
  
  return { show, setAddToast };
})();

export default function ToastNotification() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    showToast.setAddToast((toast) => {
      setToasts(prev => [...prev, toast]);
      
      // Auto remove after duration
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== toast.id));
      }, toast.duration);
    });
  }, []);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div style={{
      position: 'fixed',
      top: 80,
      right: 20,
      zIndex: 2000,
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
    }}>
      <AnimatePresence>
        {toasts.map(toast => {
          const config = TOAST_TYPES[toast.type];
          const Icon = config.icon;

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 300, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 300, scale: 0.8 }}
              transition={{ duration: 0.3, type: 'spring', damping: 25 }}
              style={{
                background: '#fff',
                border: `1px solid ${config.color}20`,
                borderLeft: `4px solid ${config.color}`,
                padding: '12px 16px',
                minWidth: 300,
                maxWidth: 400,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: config.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Icon size={14} color={config.color} />
              </div>
              
              <p style={{
                flex: 1,
                fontSize: 13,
                color: '#333',
                lineHeight: 1.4,
                margin: 0,
              }}>
                {toast.message}
              </p>
              
              <button
                onClick={() => removeToast(toast.id)}
                style={{
                  padding: 4,
                  color: '#767676',
                  flexShrink: 0,
                  cursor: 'pointer',
                }}
              >
                <X size={14} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

// Helper functions for easy usage
export const toast = {
  success: (message, duration) => showToast.show(message, 'success', duration),
  error: (message, duration) => showToast.show(message, 'error', duration),
  warning: (message, duration) => showToast.show(message, 'warning', duration),
  info: (message, duration) => showToast.show(message, 'info', duration),
};