const mongoose = require('mongoose');

const wishlistCollectionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
    default: 'My Wishlist',
  },
  description: {
    type: String,
  },
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
    notes: String,
  }],
  isPublic: {
    type: Boolean,
    default: false,
  },
  shareCode: {
    type: String,
    unique: true,
    sparse: true,
  },
}, {
  timestamps: true,
});

// Index for faster queries
wishlistCollectionSchema.index({ user: 1 });
wishlistCollectionSchema.index({ shareCode: 1 });

module.exports = mongoose.model('WishlistCollection', wishlistCollectionSchema);
