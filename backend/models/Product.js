const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  memberPrice: { type: Number },
  category: { type: String, required: true },
  image: { type: String, required: true },
  images: [{ type: String }], // Multiple images for gallery
  description: { type: String },
  reviews: [reviewSchema],
  averageRating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  stock: { type: Number, default: 50 },
  lowStockThreshold: { type: Number, default: 10 },
  inStock: { type: Boolean, default: true },
  sizes: [{
    size: { type: String, required: true },
    stock: { type: Number, default: 10 },
  }],
}, { timestamps: true });

// Update inStock status based on stock
productSchema.pre('save', function(next) {
  this.inStock = this.stock > 0;
  next();
});

module.exports = mongoose.model('Product', productSchema);
