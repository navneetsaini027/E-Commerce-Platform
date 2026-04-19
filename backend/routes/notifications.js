const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token' });
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch { res.status(401).json({ message: 'Invalid token' }); }
};

// GET user notifications
router.get('/', auth, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .sort({ createdAt: -1 }).limit(20);
    res.json(notifications);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PATCH mark one as read
router.patch('/:id/read', auth, async (req, res) => {
  try {
    await Notification.findOneAndUpdate({ _id: req.params.id, user: req.user.id }, { read: true });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PATCH mark all as read
router.patch('/read-all', auth, async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user.id, read: false }, { read: true });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE one notification
router.delete('/:id', auth, async (req, res) => {
  try {
    await Notification.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
