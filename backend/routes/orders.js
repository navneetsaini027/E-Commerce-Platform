const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Notification = require('../models/Notification');
const jwt = require('jsonwebtoken');

// Middleware to verify token
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// POST place order
router.post('/', auth, async (req, res) => {
  try {
    const order = await Order.create({ user: req.user.id, ...req.body });
    // Create notification
    await Notification.create({
      user: req.user.id,
      type: 'order',
      title: 'Order Placed Successfully!',
      message: `Your order #${order._id.toString().slice(-8).toUpperCase()} has been placed. Total: ₹${order.totalAmount.toLocaleString()}`,
    });
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET user orders
router.get('/my', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.product')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single order
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH update order status (admin only - simplified for now)
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, ...(status === 'delivered' && { deliveredAt: Date.now() }) },
      { new: true }
    );
    // Notify user
    const msgs = {
      processing: 'Your order is being processed.',
      shipped: 'Your order has been shipped and is on the way!',
      delivered: 'Your order has been delivered. Enjoy your purchase!',
      cancelled: 'Your order has been cancelled.',
    };
    if (msgs[status]) {
      await Notification.create({
        user: order.user,
        type: status === 'delivered' ? 'success' : 'order',
        title: `Order ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        message: msgs[status],
      });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
