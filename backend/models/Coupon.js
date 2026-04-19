const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: { 
    type: String, 
    required: true, 
    unique: true, 
    uppercase: true,
    trim: true 
  },
  discountType: { 
    type: String, 
    enum: ['percentage', 'fixed'], 
    required: true 
  },
  discountValue: { 
    type: Number, 
    required: true,
    min: 0 
  },
  minPurchase: { 
    type: Number, 
    default: 0 
  },
  maxDiscount: { 
    type: Number 
  },
  usageLimit: { 
    type: Number 
  },
  usedCount: { 
    type: Number, 
    default: 0 
  },
  validFrom: { 
    type: Date, 
    default: Date.now 
  },
  validUntil: { 
    type: Date 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  description: String,
}, { timestamps: true });

// Check if coupon is valid
couponSchema.methods.isValid = function() {
  const now = new Date();
  
  if (!this.isActive) return { valid: false, message: 'Coupon is inactive' };
  
  if (this.validFrom && now < this.validFrom) {
    return { valid: false, message: 'Coupon not yet valid' };
  }
  
  if (this.validUntil && now > this.validUntil) {
    return { valid: false, message: 'Coupon has expired' };
  }
  
  if (this.usageLimit && this.usedCount >= this.usageLimit) {
    return { valid: false, message: 'Coupon usage limit reached' };
  }
  
  return { valid: true };
};

// Calculate discount
couponSchema.methods.calculateDiscount = function(subtotal) {
  if (subtotal < this.minPurchase) {
    return { 
      discount: 0, 
      message: `Minimum purchase of ₹${this.minPurchase} required` 
    };
  }
  
  let discount = 0;
  
  if (this.discountType === 'percentage') {
    discount = (subtotal * this.discountValue) / 100;
    if (this.maxDiscount && discount > this.maxDiscount) {
      discount = this.maxDiscount;
    }
  } else {
    discount = this.discountValue;
  }
  
  return { discount: Math.round(discount), message: 'Coupon applied successfully' };
};

module.exports = mongoose.model('Coupon', couponSchema);
