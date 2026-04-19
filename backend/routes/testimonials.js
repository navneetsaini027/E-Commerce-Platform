const express = require('express');
const router = express.Router();
const Testimonial = require('../models/Testimonial');
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

// GET all approved testimonials
router.get('/', async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ isApproved: true }).sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST submit testimonial (auth required)
router.post('/', auth, async (req, res) => {
  try {
    const { name, city, rating, text, avatar } = req.body;
    if (!name || !city || !rating || !text) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const testimonial = await Testimonial.create({ name, city, rating, text, avatar });
    res.status(201).json(testimonial);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
