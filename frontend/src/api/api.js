import axios from 'axios';

const API = axios.create({
  baseURL: 'https://e-commerce-platform-4a86.onrender.com/api',
});

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Products
export const getProducts = () => API.get('/products');
export const getProduct = (id) => API.get(`/products/${id}`);
export const addProduct = (data) => API.post('/products', data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);
export const addReview = (id, data) => API.post(`/products/${id}/reviews`, data);
export const updateProductStock = (id, stock) => API.patch(`/products/${id}/stock`, { stock });
export const getLowStockProducts = () => API.get('/products/alerts/low-stock');

// Auth
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const googleLogin = (credential) => API.post('/auth/google', { credential });

// Orders
export const placeOrder = (data) => API.post('/orders', data);
export const getMyOrders = () => API.get('/orders/my');
export const getOrder = (id) => API.get(`/orders/${id}`);

// Coupons
export const validateCoupon = (code, subtotal) => API.post('/coupons/validate', { code, subtotal });

// Newsletter
export const subscribeNewsletter = (email) => API.post('/newsletter/subscribe', { email });

// Testimonials
export const getTestimonials = () => API.get('/testimonials');
export const submitTestimonial = (data) => API.post('/testimonials', data);

// Notifications
export const getNotifications = () => API.get('/notifications');
export const markNotificationRead = (id) => API.patch(`/notifications/${id}/read`);
export const markAllNotificationsRead = () => API.patch('/notifications/read-all');
export const deleteNotification = (id) => API.delete(`/notifications/${id}`);

// Admin
export const getAdminStats = () => API.get('/admin/stats');
export const getAdminOrders = (params) => API.get('/admin/orders', { params });
export const updateOrderStatus = (id, status) => API.patch(`/admin/orders/${id}/status`, { status });
export const getAdminUsers = () => API.get('/admin/users');
export const updateUserRole = (id, role) => API.patch(`/admin/users/${id}/role`, { role });
export const updateProduct = (id, data) => API.patch(`/admin/products/${id}`, data);
export const getAdminNewsletter = () => API.get('/admin/newsletter');
export const getAdminCoupons = () => API.get('/admin/coupons');
export const createCoupon = (data) => API.post('/admin/coupons', data);
export const deleteCoupon = (id) => API.delete(`/admin/coupons/${id}`);

// Spin Wheel
export const canSpin = () => API.get('/spin-wheel/can-spin');
export const recordSpin = (prize) => API.post('/spin-wheel/spin', { prize });
export const getSpinHistory = () => API.get('/spin-wheel/history');
export const getActiveCoupons = () => API.get('/spin-wheel/coupons');
export const useCoupon = (code) => API.post(`/spin-wheel/use-coupon/${code}`);

// View History
export const trackProductView = (productId, sessionId) => API.post('/view-history/track', { productId, sessionId });
export const getRecentlyViewed = (sessionId, limit = 8) => API.get('/view-history/recent', { params: { sessionId, limit } });
export const clearViewHistory = () => API.delete('/view-history/clear');

// Wishlist Collections
export const getWishlistCollections = () => API.get('/wishlist-collections');
export const createWishlistCollection = (data) => API.post('/wishlist-collections', data);
export const getWishlistCollection = (id) => API.get(`/wishlist-collections/${id}`);
export const updateWishlistCollection = (id, data) => API.put(`/wishlist-collections/${id}`, data);
export const deleteWishlistCollection = (id) => API.delete(`/wishlist-collections/${id}`);
export const addToWishlistCollection = (id, productId, notes) => API.post(`/wishlist-collections/${id}/products`, { productId, notes });
export const removeFromWishlistCollection = (id, productId) => API.delete(`/wishlist-collections/${id}/products/${productId}`);
export const getSharedWishlist = (shareCode) => API.get(`/wishlist-collections/shared/${shareCode}`);

export default API;
