require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors({ 
  origin: [
    'http://localhost:5173', 
    'http://localhost:5174', 
    'http://localhost:5175',
    'https://e-commerce-platform.vercel.app',
    'https://e-commerce-platform-navneetsaini027.vercel.app',
    /\.vercel\.app$/
  ], 
  credentials: true 
}));
app.use(express.json());

// Routes
app.use('/api/products', require('./routes/products'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/coupons', require('./routes/coupons'));
app.use('/api/newsletter', require('./routes/newsletter'));
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/spin-wheel', require('./routes/spinWheel'));
app.use('/api/view-history', require('./routes/viewHistory'));
app.use('/api/wishlist-collections', require('./routes/wishlistCollections'));

app.get('/', (req, res) => res.json({ message: 'Aashirwad Fashion API running' }));

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running on http://localhost:${process.env.PORT || 5000}`);
    });
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));
