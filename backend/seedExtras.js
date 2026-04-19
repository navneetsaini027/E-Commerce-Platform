require('dotenv').config();
const mongoose = require('mongoose');
const Coupon = require('./models/Coupon');
const Testimonial = require('./models/Testimonial');

const COUPONS = [
  { code: 'WELCOME15', discountType: 'percentage', discountValue: 15, minPurchase: 0, description: 'Welcome offer - 15% off on first order', isActive: true },
  { code: 'FLAT30', discountType: 'percentage', discountValue: 30, minPurchase: 999, maxDiscount: 500, description: 'Flat 30% off on orders above ₹999', isActive: true },
  { code: 'SAVE200', discountType: 'fixed', discountValue: 200, minPurchase: 1499, description: '₹200 off on orders above ₹1499', isActive: true },
  { code: 'FREESHIP', discountType: 'fixed', discountValue: 99, minPurchase: 0, description: 'Free shipping on any order', isActive: true },
  { code: 'FESTIVE50', discountType: 'percentage', discountValue: 50, minPurchase: 1999, maxDiscount: 800, description: 'Festive special - 50% off upto ₹800', isActive: true },
];

const TESTIMONIALS = [
  { name: 'Priya Sharma', city: 'Delhi', rating: 5, text: 'Absolutely love the quality! The kurti I ordered fits perfectly and the fabric is so soft. Will definitely order again.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80', isApproved: true },
  { name: 'Rahul Verma', city: 'Mumbai', rating: 5, text: 'Best fashion store online! Got my outfit for a wedding and everyone was asking where I bought it from. Super fast delivery too.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80', isApproved: true },
  { name: 'Sneha Patel', city: 'Ahmedabad', rating: 5, text: 'The ethnic collection is stunning. Ordered 3 pieces and all arrived in perfect condition. The packaging was also very premium.', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80', isApproved: true },
  { name: 'Arjun Singh', city: 'Jaipur', rating: 5, text: 'Great streetwear collection! The joggers and hoodie combo is exactly what I was looking for. Fits true to size.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80', isApproved: true },
  { name: 'Kavya Nair', city: 'Bangalore', rating: 5, text: 'Ordered a gift combo for my sister and she absolutely loved it! The gift wrapping was beautiful. 10/10 experience.', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&q=80', isApproved: true },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB');

  // Coupons
  await Coupon.deleteMany({});
  await Coupon.insertMany(COUPONS);
  console.log(`✅ Seeded ${COUPONS.length} coupons`);

  // Testimonials
  await Testimonial.deleteMany({});
  await Testimonial.insertMany(TESTIMONIALS);
  console.log(`✅ Seeded ${TESTIMONIALS.length} testimonials`);

  await mongoose.disconnect();
  console.log('🎉 Done!');
}

seed().catch(err => { console.error(err); process.exit(1); });
