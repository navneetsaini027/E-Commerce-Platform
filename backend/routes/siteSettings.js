const express = require('express');
const router = express.Router();
const SiteSettings = require('../models/SiteSettings');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Admin auth
const adminAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('role');
    if (!user || (user.role !== 'admin' && user.role !== 'owner')) {
      return res.status(403).json({ message: 'Admin access required' });
    }
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// GET setting by key (public)
router.get('/:key', async (req, res) => {
  try {
    const setting = await SiteSettings.findOne({ key: req.params.key });
    res.json(setting ? setting.value : null);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update setting (admin only)
router.put('/:key', adminAuth, async (req, res) => {
  try {
    const { value } = req.body;
    const setting = await SiteSettings.findOneAndUpdate(
      { key: req.params.key },
      { value },
      { new: true, upsert: true }
    );
    res.json(setting.value);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
