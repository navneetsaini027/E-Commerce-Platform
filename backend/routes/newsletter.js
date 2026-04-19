const express = require('express');
const router = express.Router();
const Newsletter = require('../models/Newsletter');

// POST subscribe
router.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const existing = await Newsletter.findOne({ email });
    if (existing) {
      if (existing.isActive) return res.status(400).json({ message: 'Already subscribed!' });
      existing.isActive = true;
      await existing.save();
      return res.json({ message: 'Welcome back! You are subscribed again.' });
    }

    await Newsletter.create({ email });
    res.status(201).json({ message: 'Subscribed successfully! Check your inbox for your 15% discount code.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET all subscribers (admin)
router.get('/', async (req, res) => {
  try {
    const subscribers = await Newsletter.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({ count: subscribers.length, subscribers });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
