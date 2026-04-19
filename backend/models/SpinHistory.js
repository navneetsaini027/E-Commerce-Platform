const mongoose = require('mongoose');

const spinHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  prize: {
    label: { type: String, required: true },
    value: { type: Number, required: true },
    color: { type: String },
  },
  couponCode: {
    type: String,
  },
  used: {
    type: Boolean,
    default: false,
  },
  usedAt: {
    type: Date,
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
  },
}, {
  timestamps: true,
});

// Index for faster queries
spinHistorySchema.index({ user: 1, createdAt: -1 });
spinHistorySchema.index({ couponCode: 1 });

module.exports = mongoose.model('SpinHistory', spinHistorySchema);
