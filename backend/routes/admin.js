const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Newsletter = require('../models/Newsletter');
const Coupon = require('../models/Coupon');
const jwt = require('jsonwebtoken');

// Admin auth middleware
const adminAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// GET dashboard stats
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const [totalOrders, totalProducts, totalUsers, totalSubscribers, orders] = await Promise.all([
      Order.countDocuments(),
      Product.countDocuments(),
      User.countDocuments(),
      Newsletter.countDocuments({ isActive: true }),
      Order.find().select('totalAmount status createdAt'),
    ]);

    const totalRevenue = orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const processingOrders = orders.filter(o => o.status === 'processing').length;
    const shippedOrders = orders.filter(o => o.status === 'shipped').length;
    const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
    const cancelledOrders = orders.filter(o => o.status === 'cancelled').length;

    // Revenue last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentRevenue = orders
      .filter(o => new Date(o.createdAt) > sevenDaysAgo && o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    res.json({
      totalOrders, totalProducts, totalUsers, totalSubscribers, totalRevenue,
      recentRevenue, pendingOrders, processingOrders, shippedOrders, deliveredOrders, cancelledOrders,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET all orders (admin)
router.get('/orders', adminAuth, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = status && status !== 'all' ? { status } : {};
    const orders = await Order.find(filter)
      .populate('user', 'name email')
      .populate('items.product', 'name image')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Order.countDocuments(filter);
    res.json({ orders, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH update order status (admin)
router.patch('/orders/:id/status', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const update = { status };
    if (status === 'delivered') update.deliveredAt = Date.now();
    if (status === 'processing') update.isPaid = true;
    const order = await Order.findByIdAndUpdate(req.params.id, update, { new: true })
      .populate('user', 'name email')
      .populate('items.product', 'name image');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET all users (admin)
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH update product (admin)
router.patch('/products/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET newsletter subscribers (admin)
router.get('/newsletter', adminAuth, async (req, res) => {
  try {
    const subscribers = await Newsletter.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({ count: subscribers.length, subscribers });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET all coupons (admin)
router.get('/coupons', adminAuth, async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create coupon (admin)
router.post('/coupons', adminAuth, async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json(coupon);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE coupon (admin)
router.delete('/coupons/:id', adminAuth, async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ message: 'Coupon deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH toggle user role (admin)
router.patch('/users/:id/role', adminAuth, async (req, res) => {
  try {
    const { role } = req.body;
    if (!['admin', 'user'].includes(role)) return res.status(400).json({ message: 'Invalid role' });
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
