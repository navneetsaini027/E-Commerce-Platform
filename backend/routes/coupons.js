const express = require('express');
const router = express.Router();
const Coupon = require('../models/Coupon');
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token' });
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// POST validate & apply coupon
router.post('/validate', async (req, res) => {
  try {
    const { code, subtotal } = req.body;
    if (!code) return res.status(400).json({ message: 'Coupon code is required' });

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (!coupon) return res.status(404).json({ message: 'Invalid coupon code' });

    const validity = coupon.isValid();
    if (!validity.valid) return res.status(400).json({ message: validity.message });

    const { discount, message } = coupon.calculateDiscount(subtotal || 0);
    res.json({
      valid: true,
      code: coupon.code,
      discount,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      message,
      description: coupon.description,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create coupon (admin)
router.post('/', async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json(coupon);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET all coupons (admin)
router.get('/', async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE coupon (admin)
router.delete('/:id', async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ message: 'Coupon deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
