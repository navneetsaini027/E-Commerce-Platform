import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import ProductGrid from './components/ProductGrid';
import AdminPanel from './components/AdminPanel';
import CartDrawer from './components/CartDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import AuthModal from './components/AuthModal';
import ProductDetail from './components/ProductDetail';
import CheckoutModal from './components/CheckoutModal';
import ReviewModal from './components/ReviewModal';
import FilterSidebar from './components/FilterSidebar';
import OrdersModal from './components/OrdersModal';
import ToastNotification, { toast } from './components/ToastNotification';
import LiveChat from './components/LiveChat';
import Footer from './components/Footer';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

const GOOGLE_CLIENT_ID = '331730642980-27qqkceh8ijtemtkp2nrvtvh801or8h3.apps.googleusercontent.com';
import { getProducts, addProduct, deleteProduct, addReview, getProduct, updateProductStock, trackProductView, getMe } from './api/api';
import SeasonSaleBanner from './components/SeasonSaleBanner';
import TrendingSection from './components/TrendingSection';
import DiscountStrip from './components/DiscountStrip';
import GiftSection from './components/GiftSection';
import StyleLookbook from './components/StyleLookbook';
import BrandStats from './components/BrandStats';
import TestimonialsSection from './components/TestimonialsSection';
import NewsletterSection from './components/NewsletterSection';
import CategoryDrawer from './components/CategoryDrawer';
import AdminDashboard from './components/AdminDashboard';
import SplashScreen from './components/SplashScreen';
import UserDashboard from './components/UserDashboard';
import InvoicePage from './components/InvoicePage';
import PaymentPage from './components/PaymentPage';
import ThankYouModal from './components/ThankYouModal';
import StarryBackground from './components/StarryBackground';
import SpinWheel from './components/SpinWheel';
import QuickView from './components/QuickView';
import ParticleBackground from './components/ParticleBackground';
import ProductComparison from './components/ProductComparison';

const CART_KEY = 'aashirwad_cart';
const WISHLIST_KEY = 'aashirwad_wishlist';

function loadCart() {
  try {
    const stored = localStorage.getItem(CART_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return [];
}

function loadWishlist() {
  try {
    const stored = localStorage.getItem(WISHLIST_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return [];
}

function AppContent() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(loadCart);
  const [wishlist, setWishlist] = useState(loadWishlist);
  const [activeCategory, setActiveCategory] = useState('All');
  const [adminOpen, setAdminOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewProduct, setReviewProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [ordersOpen, setOrdersOpen] = useState(false);
  const [categoryDrawer, setCategoryDrawer] = useState({ open: false, category: '', label: '' });
  const [adminDashboardOpen, setAdminDashboardOpen] = useState(false);
  const [userDashboardOpen, setUserDashboardOpen] = useState(false);
  const [invoiceOrder, setInvoiceOrder] = useState(null);
  const [paymentOrder, setPaymentOrder] = useState(null);
  const [showThankYou, setShowThankYou] = useState(false);
  const [showSplash, setShowSplash] = useState(() => !sessionStorage.getItem('splashShown'));
  const [spinWheelOpen, setSpinWheelOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [compareProducts, setCompareProducts] = useState([]);
  const [showComparison, setShowComparison] = useState(false);
  const [filters, setFilters] = useState({
    sort: 'newest',
    priceRanges: [],
    minRating: 0,
  });
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  });

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    toast.success(`Welcome back, ${userData.name}!`);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setShowThankYou(true);
  };



  // Load products from backend
  useEffect(() => {
    getProducts()
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading products:', err);
        setLoading(false);
      });
  }, []);

  // Refresh user role from backend on load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getMe()
        .then(res => {
          const freshUser = res.data;
          setUser(freshUser);
          localStorage.setItem('user', JSON.stringify(freshUser));
        })
        .catch(() => {
          // Token invalid - logout
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        });
    }
  }, []);

  // Persist cart
  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  // Persist wishlist
  useEffect(() => {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  const handleAddProduct = async (product) => {
    try {
      const res = await addProduct(product);
      setProducts(prev => [res.data, ...prev]);
      toast.success('Product added successfully!');
    } catch (err) {
      console.error('Error adding product:', err);
      toast.error('Failed to add product');
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await deleteProduct(id);
      setProducts(prev => prev.filter(p => p._id !== id));
      toast.success('Product deleted successfully');
    } catch (err) {
      console.error('Error deleting product:', err);
      toast.error('Failed to delete product');
    }
  };

  const handleUpdateStock = async (id, stock) => {
    try {
      const res = await updateProductStock(id, stock);
      setProducts(prev => prev.map(p => p._id === id ? res.data : p));
    } catch (err) {
      console.error('Error updating stock:', err);
      alert('Failed to update stock');
    }
  };

  const handleAddToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(i => i._id === product._id);
      if (existing) {
        toast.info(`Updated ${product.name} quantity in cart`);
        return prev.map(i => i._id === product._id ? { ...i, qty: i.qty + 1 } : i);
      }
      toast.success(`Added ${product.name} to cart!`);
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const handleRemoveFromCart = (id) => {
    setCart(prev => prev.filter(i => i._id !== id));
  };

  const handleUpdateQty = (id, qty) => {
    if (qty <= 0) {
      handleRemoveFromCart(id);
      return;
    }
    setCart(prev => prev.map(i => i._id === id ? { ...i, qty } : i));
  };

  const handleAddToWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.find(i => i._id === product._id);
      if (exists) {
        toast.warning('Product already in wishlist');
        return prev;
      }
      toast.success(`Added ${product.name} to wishlist!`);
      return [...prev, product];
    });
  };

  const handleRemoveFromWishlist = (id) => {
    setWishlist(prev => prev.filter(i => i._id !== id));
  };

  const handleCheckout = () => {
    if (!user) {
      setCartOpen(false);
      alert('Please sign in with Google or Facebook to complete your purchase');
      setAuthOpen(true);
      return;
    }
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  const handleOrderSuccess = () => {
    setCart([]);
    setCheckoutOpen(false);
    toast.success('Order placed successfully! Check your orders for updates.');
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const openCategory = (category, label) => {
    setCategoryDrawer({ open: true, category, label });
  };

  const handleOpenReview = (product) => {
    if (!user) {
      setAuthOpen(true);
      return;
    }
    setReviewProduct(product);
    setReviewOpen(true);
  };

  const handleSubmitReview = async (productId, reviewData) => {
    try {
      await addReview(productId, reviewData);
      // Refresh product details
      const res = await getProduct(productId);
      setProducts(prev => prev.map(p => p._id === productId ? res.data : p));
      if (selectedProduct?._id === productId) {
        setSelectedProduct(res.data);
      }
    } catch (err) {
      throw err;
    }
  };

  const handleProductClick = async (product) => {
    try {
      // Track view
      const sessionId = localStorage.getItem('sessionId') || `session-${Date.now()}`;
      if (!localStorage.getItem('sessionId')) {
        localStorage.setItem('sessionId', sessionId);
      }
      
      trackProductView(product._id, sessionId).catch(err => 
        console.error('Error tracking view:', err)
      );

      const res = await getProduct(product._id);
      setSelectedProduct(res.data);
    } catch (err) {
      console.error('Error loading product:', err);
      setSelectedProduct(product);
    }
  };

  const handleQuickView = async (product) => {
    console.log('Quick View clicked for:', product);
    console.log('Product image:', product.image);
    console.log('Product images:', product.images);
    try {
      const res = await getProduct(product._id);
      console.log('Fetched product data:', res.data);
      setQuickViewProduct(res.data);
    } catch (err) {
      console.error('Error fetching product:', err);
      setQuickViewProduct(product);
    }
  };

  const handleSpinWin = (prize) => {
    if (prize.value > 0) {
      toast.success(`🎉 You won ${prize.label}! Use code: SPIN${prize.value}`);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      sort: 'newest',
      priceRanges: [],
      minRating: 0,
    });
  };

  // Filter products by search query
  const filteredProducts = searchQuery
    ? products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : products;

  // Apply filters and sorting
  const getFilteredAndSortedProducts = () => {
    let result = [...filteredProducts];

    // Apply price range filter
    if (filters.priceRanges.length > 0) {
      result = result.filter(product => {
        const price = product.memberPrice || product.price;
        return filters.priceRanges.some(
          range => price >= range.min && price < range.max
        );
      });
    }

    // Apply rating filter
    if (filters.minRating > 0) {
      result = result.filter(
        product => (product.averageRating || 0) >= filters.minRating
      );
    }

    // Apply sorting
    switch (filters.sort) {
      case 'price-asc':
        result.sort((a, b) => (a.memberPrice || a.price) - (b.memberPrice || b.price));
        break;
      case 'price-desc':
        result.sort((a, b) => (b.memberPrice || b.price) - (a.memberPrice || a.price));
        break;
      case 'rating':
        result.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
        break;
      case 'newest':
      default:
        // Already sorted by createdAt from backend
        break;
    }

    return result;
  };

  const displayProducts = getFilteredAndSortedProducts();

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const { theme, isDark } = useTheme();

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: theme.colors.background,
      color: theme.colors.text,
      transition: 'background-color 0.3s ease, color 0.3s ease',
      position: 'relative',
    }}>
      {isDark && <StarryBackground />}
      {!isDark && <ParticleBackground />}
      <div style={{ position: 'relative', zIndex: 1 }}>
      <Navbar
        cartCount={cartCount}
        wishlistCount={wishlist.length}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        onAdminToggle={() => (user?.role === 'admin' || user?.role === 'owner') ? setAdminDashboardOpen(true) : null}
        onUserDashboard={() => setUserDashboardOpen(true)}
        onCartOpen={() => setCartOpen(true)}
        onWishlistOpen={() => setWishlistOpen(true)}
        onAuthOpen={() => setAuthOpen(true)}
        onOrdersOpen={() => setOrdersOpen(true)}
        onSpinOpen={() => setSpinWheelOpen(true)}
        user={user}
        onLogout={handleLogout}
        onSearch={handleSearch}
      />

      <main>
        <Hero onShopCategory={openCategory} />
        <Marquee />
        <DiscountStrip onCouponApply={(code) => {
          // Store applied coupon for checkout
          localStorage.setItem('appliedCoupon', code);
          toast.success(`Coupon ${code} applied! Use it at checkout 🎉`);
        }} />
        <TrendingSection onCategoryChange={setActiveCategory} onShopCategory={openCategory} />
        <SeasonSaleBanner onShopCategory={openCategory} />
        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px 0' }}>Loading products...</div>
        ) : (
          <ProductGrid
            products={displayProducts}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleAddToWishlist}
            onProductClick={handleProductClick}
            onOpenFilters={() => setFilterOpen(true)}
            onQuickView={handleQuickView}
          />
        )}
        <StyleLookbook onShopCategory={openCategory} />
        <GiftSection onShopCategory={openCategory} />
        <BrandStats />
        <TestimonialsSection />
        <NewsletterSection />
      </main>

      <Footer />

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      <ProductDetail
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onAddToWishlist={handleAddToWishlist}
        onOpenReview={handleOpenReview}
        user={user}
      />

      <ReviewModal
        isOpen={reviewOpen}
        onClose={() => setReviewOpen(false)}
        product={reviewProduct}
        onSubmitReview={handleSubmitReview}
      />

      <FilterSidebar
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      <OrdersModal
        isOpen={ordersOpen}
        onClose={() => setOrdersOpen(false)}
        user={user}
        onViewInvoice={(order) => { setOrdersOpen(false); setInvoiceOrder(order); }}
      />

      <AdminPanel
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
        onAddProduct={handleAddProduct}
        products={products}
        onDeleteProduct={handleDeleteProduct}
        onUpdateStock={handleUpdateStock}
      />

      {userDashboardOpen && user && (
        <UserDashboard
          user={user}
          onClose={() => setUserDashboardOpen(false)}
          onLogout={() => { handleLogout(); setUserDashboardOpen(false); }}
          onUpdateUser={(updated) => setUser(updated)}
        />
      )}

      {adminDashboardOpen && (
        <AdminDashboard
          user={user}
          onLogout={() => { handleLogout(); setAdminDashboardOpen(false); }}
          onClose={() => setAdminDashboardOpen(false)}
        />
      )}

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cart}
        onRemove={handleRemoveFromCart}
        onUpdateQty={handleUpdateQty}
        onCheckout={handleCheckout}
      />

      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        cartItems={cart}
        user={user}
        onOrderSuccess={handleOrderSuccess}
      />

      <WishlistDrawer
        isOpen={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
        wishlistItems={wishlist}
        onRemove={handleRemoveFromWishlist}
        onAddToCart={handleAddToCart}
      />

      <ToastNotification />
      <LiveChat user={user} />

      <SpinWheel
        isOpen={spinWheelOpen}
        onClose={() => setSpinWheelOpen(false)}
        onWin={handleSpinWin}
        user={user}
      />

      <QuickView
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        onAddToWishlist={handleAddToWishlist}
      />

      <ProductComparison
        products={showComparison ? compareProducts : []}
        onClose={() => setShowComparison(false)}
        onAddToCart={handleAddToCart}
      />

      <ThankYouModal show={showThankYou} onDone={() => setShowThankYou(false)} />

      {invoiceOrder && (
        <InvoicePage
          order={invoiceOrder}
          onClose={() => setInvoiceOrder(null)}
          onPayNow={(order) => { setInvoiceOrder(null); setPaymentOrder(order); }}
        />
      )}

      {paymentOrder && (
        <PaymentPage
          order={paymentOrder}
          onClose={() => setPaymentOrder(null)}
          onSuccess={() => { setPaymentOrder(null); toast.success('Payment successful!'); }}
        />
      )}

      {showSplash && (
        <SplashScreen onDone={() => {
          sessionStorage.setItem('splashShown', '1');
          setShowSplash(false);
        }} />
      )}

      <CategoryDrawer
        isOpen={categoryDrawer.open}
        onClose={() => setCategoryDrawer({ open: false, category: '', label: '' })}
        category={categoryDrawer.category}
        label={categoryDrawer.label}
        onAddToCart={handleAddToCart}
        onAddToWishlist={handleAddToWishlist}
        onProductClick={handleProductClick}
      />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}
