const express = require('express');
const router = express.Router();
const ViewHistory = require('../models/ViewHistory');
const { protect, optionalAuth } = require('../middleware/auth');

// Track product view
router.post('/track', optionalAuth, async (req, res) => {
  try {
    const { productId, sessionId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID required' });
    }

    const query = req.user 
      ? { user: req.user._id, product: productId }
      : { sessionId, product: productId };

    // Update or create view record
    const viewRecord = await ViewHistory.findOneAndUpdate(
      query,
      {
        $inc: { viewCount: 1 },
        $set: { lastViewedAt: new Date() },
      },
      { upsert: true, new: true }
    );

    res.json({ success: true, viewRecord });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get recently viewed products
router.get('/recent', optionalAuth, async (req, res) => {
  try {
    const { sessionId } = req.query;
    const limit = parseInt(req.query.limit) || 8;

    const query = req.user 
      ? { user: req.user._id }
      : { sessionId };

    const recentViews = await ViewHistory.find(query)
      .sort({ lastViewedAt: -1 })
      .limit(limit)
      .populate('product');

    const products = recentViews
      .map(view => view.product)
      .filter(product => product); // Filter out null products

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Clear view history
router.delete('/clear', protect, async (req, res) => {
  try {
    await ViewHistory.deleteMany({ user: req.user._id });
    res.json({ success: true, message: 'View history cleared' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
