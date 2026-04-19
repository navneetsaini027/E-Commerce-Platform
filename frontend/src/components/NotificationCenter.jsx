import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Package, ShoppingBag, AlertTriangle, Gift, CheckCircle } from 'lucide-react';
import { getNotifications, markNotificationRead, markAllNotificationsRead, deleteNotification } from '../api/api';
import { useTheme } from '../contexts/ThemeContext';

const NOTIFICATION_TYPES = {
  order: { icon: Package, color: '#2196F3', bg: '#E3F2FD' },
  stock: { icon: AlertTriangle, color: '#FF9800', bg: '#FFF3E0' },
  promotion: { icon: Gift, color: '#E91E63', bg: '#FCE4EC' },
  success: { icon: CheckCircle, color: '#4CAF50', bg: '#E8F5E8' },
  cart: { icon: ShoppingBag, color: '#9C27B0', bg: '#F3E5F5' },
};

export default function NotificationCenter({ user }) {
  const { theme } = useTheme();
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const loadNotifications = useCallback(async () => {
    if (!user) return;
    try {
      const res = await getNotifications();
      setNotifications(res.data);
      setUnreadCount(res.data.filter(n => !n.read).length);
    } catch {}
  }, [user]);

  useEffect(() => {
    loadNotifications();
    // Poll every 30 seconds for new notifications
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, [loadNotifications]);

  const markAsRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch {}
  };

  const markAllAsRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch {}
  };

  const removeNotification = async (id) => {
    const notif = notifications.find(n => n._id === id);
    try {
      await deleteNotification(id);
      setNotifications(prev => prev.filter(n => n._id !== id));
      if (notif && !notif.read) setUnreadCount(prev => Math.max(0, prev - 1));
    } catch {}
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  if (!user) return null;

  return (
    <div style={{ position: 'relative' }}>
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: 8,
          position: 'relative',
          cursor: 'pointer',
        }}
        aria-label="Notifications"
      >
        <Bell size={18} color={theme.colors.text} />
        {unreadCount > 0 && (
          <motion.span
            key={unreadCount}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{
              position: 'absolute',
              top: 2,
              right: 2,
              background: '#E50010',
              color: '#fff',
              borderRadius: '50%',
              width: 16,
              height: 16,
              fontSize: 10,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 1,
            }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </button>

      {/* Notification Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              onClick={() => setIsOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 999,
              }}
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: 8,
                width: 320,
                maxHeight: 400,
                background: theme.colors.surface,
                border: `1px solid ${theme.colors.border}`,
                boxShadow: `0 8px 32px ${theme.colors.shadow}`,
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Header */}
              <div style={{
                padding: '16px 20px',
                borderBottom: `1px solid ${theme.colors.border}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <h3 style={{
                  fontSize: 14,
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: theme.colors.text,
                }}>
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    style={{
                      fontSize: 11,
                      color: '#E50010',
                      fontWeight: 600,
                      textDecoration: 'underline',
                    }}
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {/* Notifications List */}
              <div style={{ flex: 1, overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <div style={{
                    padding: '40px 20px',
                    textAlign: 'center',
                    color: theme.colors.textSecondary,
                  }}>
                    <Bell size={32} style={{ opacity: 0.3, margin: '0 auto 12px' }} color={theme.colors.textSecondary} />
                    <p style={{ fontSize: 13 }}>No notifications yet</p>
                  </div>
                ) : (
                  notifications.map(notification => {
                    const config = NOTIFICATION_TYPES[notification.type] || NOTIFICATION_TYPES.order;
                    const Icon = config.icon;
                    return (
                      <motion.div
                        key={notification._id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        style={{
                          padding: '12px 20px',
                          borderBottom: `1px solid ${theme.colors.border}`,
                          background: notification.read ? theme.colors.surface : theme.colors.background,
                          cursor: 'pointer',
                          position: 'relative',
                        }}
                        onClick={() => markAsRead(notification._id)}
                      >
                        <div style={{ display: 'flex', gap: 12 }}>
                          <div style={{ width: 32, height: 32, borderRadius: '50%', background: config.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Icon size={16} color={config.color} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 4 }}>
                              <p style={{ fontSize: 12, fontWeight: notification.read ? 600 : 700, color: theme.colors.text, lineHeight: 1.3 }}>
                                {notification.title}
                              </p>
                              <button onClick={(e) => { e.stopPropagation(); removeNotification(notification._id); }} style={{ padding: 2, color: theme.colors.textSecondary, flexShrink: 0 }}>
                                <X size={12} />
                              </button>
                            </div>
                            <p style={{ fontSize: 11, color: theme.colors.textSecondary, lineHeight: 1.4, marginBottom: 6 }}>{notification.message}</p>
                            <p style={{ fontSize: 10, color: theme.colors.textSecondary, fontWeight: 500, opacity: 0.7 }}>{formatTime(notification.createdAt)}</p>
                          </div>
                        </div>
                        {!notification.read && (
                          <div style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', width: 6, height: 6, borderRadius: '50%', background: '#E50010' }} />
                        )}
                      </motion.div>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div style={{
                  padding: '12px 20px',
                  borderTop: `1px solid ${theme.colors.border}`,
                  textAlign: 'center',
                }}>
                  <button
                    style={{
                      fontSize: 11,
                      color: theme.colors.textSecondary,
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                    }}
                  >
                    View All Notifications
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}