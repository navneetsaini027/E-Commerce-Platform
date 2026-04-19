const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const { sendWelcomeEmail } = require('../utils/emailService');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// GOOGLE LOGIN
router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;
    // credential format: "googleId|email|name|picture"
    const [googleId, email, name, picture] = credential.split('|');
    if (!email || !name) return res.status(400).json({ message: 'Invalid Google data' });

    let user = await User.findOne({ email });
    const isNew = !user;
    if (!user) {
      user = await User.create({
        name, email,
        password: await bcrypt.hash(googleId + process.env.JWT_SECRET, 10),
        avatar: picture, googleId,
      });
      // Send welcome email for new Google users (non-blocking)
      sendWelcomeEmail(email, name);
    } else if (!user.googleId) {
      user.googleId = googleId;
      user.avatar = picture;
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: picture },
      isNew,
    });
  } catch (err) {
    console.error('Google auth error:', err);
    res.status(401).json({ message: 'Google authentication failed' });
  }
});

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    // Send welcome email (non-blocking)
    sendWelcomeEmail(email, name);
    const token = jwt.sign({ id: user._id, role: user.role, name: user.name }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ id: user._id, role: user.role, name: user.name }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE PROFILE
router.patch('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { name, phone } = req.body;
    const user = await User.findByIdAndUpdate(
      decoded.id,
      { name, phone },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
