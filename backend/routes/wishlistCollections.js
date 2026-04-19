const express = require('express');
const router = express.Router();
const WishlistCollection = require('../models/WishlistCollection');
const { protect } = require('../middleware/auth');
const crypto = require('crypto');

// Get all user's wishlist collections
router.get('/', protect, async (req, res) => {
  try {
    const collections = await WishlistCollection.find({ user: req.user._id })
      .populate('products.product')
      .sort({ createdAt: -1 });

    res.json(collections);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new wishlist collection
router.post('/', protect, async (req, res) => {
  try {
    const { name, description, isPublic } = req.body;

    const collection = await WishlistCollection.create({
      user: req.user._id,
      name: name || 'My Wishlist',
      description,
      isPublic,
      shareCode: isPublic ? crypto.randomBytes(8).toString('hex') : undefined,
    });

    res.status(201).json(collection);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single collection
router.get('/:id', protect, async (req, res) => {
  try {
    const collection = await WishlistCollection.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate('products.product');

    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    res.json(collection);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update collection
router.put('/:id', protect, async (req, res) => {
  try {
    const { name, description, isPublic } = req.body;

    const collection = await WishlistCollection.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    if (name) collection.name = name;
    if (description !== undefined) collection.description = description;
    if (isPublic !== undefined) {
      collection.isPublic = isPublic;
      if (isPublic && !collection.shareCode) {
        collection.shareCode = crypto.randomBytes(8).toString('hex');
      }
    }

    await collection.save();
    res.json(collection);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete collection
router.delete('/:id', protect, async (req, res) => {
  try {
    const collection = await WishlistCollection.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    res.json({ success: true, message: 'Collection deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add product to collection
router.post('/:id/products', protect, async (req, res) => {
  try {
    const { productId, notes } = req.body;

    const collection = await WishlistCollection.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    // Check if product already exists
    const exists = collection.products.some(
      p => p.product.toString() === productId
    );

    if (exists) {
      return res.status(400).json({ message: 'Product already in collection' });
    }

    collection.products.push({
      product: productId,
      notes,
      addedAt: new Date(),
    });

    await collection.save();
    await collection.populate('products.product');

    res.json(collection);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Remove product from collection
router.delete('/:id/products/:productId', protect, async (req, res) => {
  try {
    const collection = await WishlistCollection.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    collection.products = collection.products.filter(
      p => p.product.toString() !== req.params.productId
    );

    await collection.save();
    res.json(collection);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get shared collection (public)
router.get('/shared/:shareCode', async (req, res) => {
  try {
    const collection = await WishlistCollection.findOne({
      shareCode: req.params.shareCode,
      isPublic: true,
    }).populate('products.product user', 'name email');

    if (!collection) {
      return res.status(404).json({ message: 'Collection not found or not public' });
    }

    res.json(collection);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
