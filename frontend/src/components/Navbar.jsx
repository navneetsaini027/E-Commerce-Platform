import { useState, useEffect } from 'react';
import { Search, User, ShoppingBag, X, Menu, Settings, Heart, Package, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CATEGORIES } from '../data/products';
import NotificationCenter from './NotificationCenter';
import { useTheme } from '../contexts/ThemeContext';
import BRAND from '../config/brand';

function LiveClock({ theme, isDark }) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const h = now.getHours();
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = String(h % 12 || 12).padStart(2, '0');
  const dateStr = `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      style={{
        display: 'flex', flexDirection: 'column',
        padding: '8px 16px',
        borderRadius: 12,
        background: isDark 
          ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.9))'
          : theme.colors.surface,
        border: isDark 
          ? '1px solid rgba(148, 163, 184, 0.3)'
          : `1px solid ${theme.colors.border}`,
        minWidth: 150,
        boxShadow: isDark 
          ? '0 4px 20px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          : '0 2px 8px rgba(0, 0, 0, 0.1)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Glowing effect for dark mode */}
      {isDark && (
        <motion.div
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            position: 'absolute',
            top: -20,
            right: -20,
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 107, 107, 0.4), transparent)',
            filter: 'blur(15px)',
            pointerEvents: 'none',
          }}
        />
      )}
      
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, position: 'relative', zIndex: 1 }}>
        <span style={{
          fontSize: 20, fontWeight: 800, letterSpacing: '0.05em',
          color: isDark ? '#fff' : theme.colors.text, 
          fontFamily: 'monospace', 
          lineHeight: 1.2,
          textShadow: isDark ? '0 0 10px rgba(255, 107, 107, 0.5)' : 'none',
        }}>
          {h12}:{m}
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            style={{ 
              color: isDark ? '#FF6B6B' : '#E50010',
              textShadow: isDark ? '0 0 8px rgba(255, 107, 107, 0.8)' : 'none',
            }}
          >:</motion.span>
          {s}
        </span>
        <span style={{ 
          fontSize: 11, 
          fontWeight: 700, 
          color: isDark ? '#FF6B6B' : '#E50010', 
          letterSpacing: '0.05em',
          textShadow: isDark ? '0 0 6px rgba(255, 107, 107, 0.6)' : 'none',
        }}>
          {ampm}
        </span>
      </div>
      <span style={{ 
        fontSize: 10, 
        color: theme.colors.textSecondary, 
        letterSpacing: '0.08em', 
        textTransform: 'uppercase',
        position: 'relative',
        zIndex: 1,
      }}>
        {dateStr}
      </span>
    </motion.div>
  );
}

export default function Navbar({ cartCount, wishlistCount, onCategoryChange, activeCategory, onAdminToggle, onCartOpen, onWishlistOpen, onAuthOpen, user, onLogout, onSearch, onOrdersOpen, onUserDashboard }) {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme, isDark } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    if (onSearch) onSearch(value);
  };

  const handleSearchToggle = () => {
    if (searchOpen && searchQuery) {
      setSearchQuery('');
      if (onSearch) onSearch('');
    }
    setSearchOpen(!searchOpen);
  };

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      background: isDark 
        ? 'linear-gradient(180deg, rgba(10, 14, 39, 0.95) 0%, rgba(22, 33, 62, 0.95) 100%)'
        : theme.colors.background,
      backdropFilter: isDark ? 'blur(10px)' : 'none',
      borderBottom: scrolled ? `1px solid ${theme.colors.border}` : '1px solid transparent',
      transition: 'border-color 0.3s ease, box-shadow 0.3s ease, background 0.3s ease',
      boxShadow: scrolled 
        ? isDark 
          ? '0 4px 30px rgba(0, 0, 0, 0.5)' 
          : `0 2px 20px ${theme.colors.shadow}` 
        : 'none',
    }}>
      {/* Top bar */}
      <div style={{
        maxWidth: 1440, margin: '0 auto',
        padding: '0 24px',
        height: 60,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 16,
      }}>
        {/* LEFT: Clock + Mobile menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ display: 'none', padding: 8 }}
            className="mobile-menu-btn"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X size={20} color={theme.colors.text} /> : <Menu size={20} color={theme.colors.text} />}
          </button>
          <div className="live-clock-wrap">
            <LiveClock theme={theme} isDark={isDark} />
          </div>
        </div>

        {/* Logo */}
        <a href="#" style={{
          fontWeight: 700,
          fontSize: 'clamp(12px, 1.6vw, 17px)',
          letterSpacing: '0.04em',
          whiteSpace: 'nowrap',
          fontFamily: '"Cinzel Decorative", serif',
          color: theme.colors.text,
          textDecoration: 'none',
        }}>
          {BRAND.name}
        </a>

        {/* Desktop Category Nav */}
        <nav style={{ display: 'flex', gap: 32 }} className="desktop-nav">
          {CATEGORIES.filter(c => c !== 'All').map(cat => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat === activeCategory ? 'All' : cat)}
              style={{
                fontSize: 13,
                fontWeight: activeCategory === cat ? 700 : 400,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: theme.colors.text,
                padding: '4px 0',
                borderBottom: activeCategory === cat ? `2px solid ${theme.colors.text}` : '2px solid transparent',
                transition: 'all 0.2s ease',
                background: 'none',
              }}
            >
              {cat}
            </button>
          ))}
        </nav>

        {/* Icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Search - hide on mobile */}
          <div className="desktop-only">
            <AnimatePresence>
              {searchOpen && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 200, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ overflow: 'hidden' }}
                >
                  <input
                    autoFocus
                    value={searchQuery}
                    onChange={e => handleSearchChange(e.target.value)}
                    placeholder="Search products..."
                    style={{
                      width: '100%', border: 'none', borderBottom: `1px solid ${theme.colors.text}`,
                      outline: 'none', fontSize: 13, padding: '4px 0',
                      background: 'transparent', color: theme.colors.text,
                      transition: 'border-color 0.3s ease, color 0.3s ease',
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <button onClick={handleSearchToggle} style={{ padding: 8 }} aria-label="Search">
              {searchOpen ? <X size={18} color={theme.colors.text} /> : <Search size={18} color={theme.colors.text} />}
            </button>
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            style={{ padding: 8 }}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          >
            <motion.div initial={false} animate={{ rotate: isDark ? 180 : 0 }} transition={{ duration: 0.3 }}>
              {isDark ? <Sun size={18} color={theme.colors.text} /> : <Moon size={18} color={theme.colors.text} />}
            </motion.div>
          </button>

          {/* Notifications - desktop only */}
          <div className="desktop-only">
            {user && <NotificationCenter user={user} />}
          </div>

          {/* Orders - desktop only */}
          <div className="desktop-only">
            {user && (
              <button onClick={onOrdersOpen} style={{ padding: 8 }} aria-label="My Orders">
                <Package size={18} color={theme.colors.text} />
              </button>
            )}
          </div>

          {/* Wishlist */}
          <button onClick={onWishlistOpen} style={{ padding: 8, position: 'relative' }} aria-label="Wishlist">
            <Heart size={18} color={theme.colors.text} />
            {wishlistCount > 0 && (
              <motion.span key={wishlistCount} initial={{ scale: 0 }} animate={{ scale: 1 }} style={{
                position: 'absolute', top: 2, right: 2,
                background: '#E50010', color: '#fff',
                borderRadius: '50%', width: 16, height: 16,
                fontSize: 10, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {wishlistCount > 99 ? '99+' : wishlistCount}
              </motion.span>
            )}
          </button>

          {/* Admin - desktop only */}
          <div className="desktop-only">
            {user?.role === 'admin' && (
              <button onClick={onAdminToggle} style={{ padding: 8 }} aria-label="Admin Panel">
                <Settings size={18} color="#E50010" />
              </button>
            )}
          </div>

          {/* Cart */}
          <button onClick={onCartOpen} style={{ padding: 8, position: 'relative' }} aria-label="Shopping bag">
            <ShoppingBag size={18} color={theme.colors.text} />
            {cartCount > 0 && (
              <motion.span key={cartCount} initial={{ scale: 0 }} animate={{ scale: 1 }} style={{
                position: 'absolute', top: 2, right: 2,
                background: '#E50010', color: '#fff',
                borderRadius: '50%', width: 16, height: 16,
                fontSize: 10, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {cartCount > 99 ? '99+' : cartCount}
              </motion.span>
            )}
          </button>

          {/* Login - desktop only, mobile me menu me hai */}
          <div className="desktop-only">
            {!user ? (
              <motion.button
                onClick={onAuthOpen}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                style={{
                  background: '#E50010', color: '#fff',
                  padding: '8px 18px', fontSize: 11, fontWeight: 700,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  border: 'none', cursor: 'pointer', borderRadius: 999,
                  display: 'flex', alignItems: 'center', gap: 6, marginLeft: 4,
                }}
              >
                <User size={13} />
                Login
              </motion.button>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 4 }}>
                <motion.button
                  onClick={onUserDashboard}
                  whileHover={{ scale: 1.05 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', border: '2px solid #E50010' }} />
                  ) : (
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#E50010', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>
                      {user.name[0].toUpperCase()}
                    </div>
                  )}
                  <span style={{ fontSize: 12, fontWeight: 600, color: theme.colors.text, maxWidth: 70, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.name.split(' ')[0]}
                  </span>
                </motion.button>
                <motion.button
                  onClick={onLogout}
                  whileHover={{ scale: 1.04 }}
                  style={{ fontSize: 10, color: '#E50010', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '5px 12px', border: '1px solid #E50010', borderRadius: 999, cursor: 'pointer', background: 'none' }}
                >
                  Logout
                </motion.button>
              </div>
            )}
          </div>

          {/* Mobile: User icon if logged in */}
          <div className="mobile-only">
            {user && (
              <button onClick={onUserDashboard} style={{ padding: 8, background: 'none', border: 'none', cursor: 'pointer' }}>
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', border: '2px solid #E50010' }} />
                ) : (
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#E50010', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>
                    {user.name[0].toUpperCase()}
                  </div>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ 
              overflow: 'hidden', 
              borderTop: `1px solid ${theme.colors.border}`, 
              background: isDark 
                ? 'linear-gradient(180deg, rgba(22, 33, 62, 0.95) 0%, rgba(15, 23, 41, 0.95) 100%)'
                : theme.colors.background,
              backdropFilter: isDark ? 'blur(10px)' : 'none',
            }}
          >
            <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {CATEGORIES.filter(c => c !== 'All').map(cat => (
                <button
                  key={cat}
                  onClick={() => { onCategoryChange(cat === activeCategory ? 'All' : cat); setMobileMenuOpen(false); }}
                  style={{
                    fontSize: 14, fontWeight: activeCategory === cat ? 700 : 400,
                    letterSpacing: '0.06em', textTransform: 'uppercase',
                    textAlign: 'left', color: theme.colors.text,
                    transition: 'color 0.3s ease',
                  }}
                >
                  {cat}
                </button>
              ))}

              {/* Login/Logout in Mobile Menu */}
              <div style={{ borderTop: `1px solid ${theme.colors.border}`, paddingTop: 16, marginTop: 8 }}>
                {!user ? (
                  <button
                    onClick={() => { onAuthOpen(); setMobileMenuOpen(false); }}
                    style={{
                      width: '100%', padding: '12px', fontSize: 14, fontWeight: 700,
                      letterSpacing: '0.06em', textTransform: 'uppercase',
                      background: '#E50010', color: '#fff', border: 'none',
                      cursor: 'pointer', borderRadius: 4,
                    }}
                  >
                    Login / Sign Up
                  </button>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: theme.colors.text }}>
                      👋 Hello, {user.name.split(' ')[0]}!
                    </p>
                    <button
                      onClick={() => { onUserDashboard(); setMobileMenuOpen(false); }}
                      style={{
                        width: '100%', padding: '10px', fontSize: 13, fontWeight: 600,
                        background: 'transparent', color: theme.colors.text,
                        border: `1px solid ${theme.colors.border}`, cursor: 'pointer', borderRadius: 4,
                      }}
                    >
                      My Account
                    </button>
                    <button
                      onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                      style={{
                        width: '100%', padding: '10px', fontSize: 13, fontWeight: 600,
                        background: 'transparent', color: '#E50010',
                        border: `1px solid #E50010`, cursor: 'pointer', borderRadius: 4,
                      }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
          .desktop-only { display: none !important; }
          .mobile-only { display: flex !important; }
          .live-clock-wrap { display: none !important; }
        }
        @media (min-width: 769px) {
          .mobile-only { display: none !important; }
        }
      `}</style>
    </header>
  );
}
