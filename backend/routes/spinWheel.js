const express = require('express');
const router = express.Router();
const SpinHistory = require('../models/SpinHistory');
const { protect } = require('../middleware/auth');

// Check if user can spin today
router.get('/can-spin', protect, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todaySpin = await SpinHistory.findOne({
      user: req.user._id,
      createdAt: { $gte: today },
    });

    res.json({
      canSpin: !todaySpin,
      lastSpin: todaySpin ? todaySpin.createdAt : null,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Record spin result
router.post('/spin', protect, async (req, res) => {
  try {
    const { prize } = req.body;

    // Check if already spun today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todaySpin = await SpinHistory.findOne({
      user: req.user._id,
      createdAt: { $gte: today },
    });

    if (todaySpin) {
      return res.status(400).json({ message: 'Already spun today' });
    }

    // Generate coupon code if prize has value
    let couponCode = null;
    if (prize.value > 0) {
      couponCode = `SPIN${prize.value}-${Date.now().toString(36).toUpperCase()}`;
    }

    const spinRecord = await SpinHistory.create({
      user: req.user._id,
      prize,
      couponCode,
    });

    res.status(201).json({
      success: true,
      couponCode,
      spin: spinRecord,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's spin history
router.get('/history', protect, async (req, res) => {
  try {
    const history = await SpinHistory.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(30);

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get active coupons
router.get('/coupons', protect, async (req, res) => {
  try {
    const coupons = await SpinHistory.find({
      user: req.user._id,
      used: false,
      expiresAt: { $gt: new Date() },
      'prize.value': { $gt: 0 },
    }).sort({ createdAt: -1 });

    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Use coupon
router.post('/use-coupon/:code', protect, async (req, res) => {
  try {
    const spin = await SpinHistory.findOne({
      user: req.user._id,
      couponCode: req.params.code,
      used: false,
      expiresAt: { $gt: new Date() },
    });

    if (!spin) {
      return res.status(404).json({ message: 'Invalid or expired coupon' });
    }

    spin.used = true;
    spin.usedAt = new Date();
    await spin.save();

    res.json({
      success: true,
      discount: spin.prize.value,
      message: `${spin.prize.value}% discount applied`,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
