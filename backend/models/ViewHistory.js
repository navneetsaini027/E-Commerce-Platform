const mongoose = require('mongoose');

const viewHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  sessionId: {
    type: String, // For non-logged-in users
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  viewCount: {
    type: Number,
    default: 1,
  },
  lastViewedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Compound index for unique user-product combination
viewHistorySchema.index({ user: 1, product: 1 }, { unique: true, sparse: true });
viewHistorySchema.index({ sessionId: 1, product: 1 }, { unique: true, sparse: true });
viewHistorySchema.index({ lastViewedAt: -1 });

module.exports = mongoose.model('ViewHistory', viewHistorySchema);
