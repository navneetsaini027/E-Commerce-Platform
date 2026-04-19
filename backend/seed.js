require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const SEED_PRODUCTS = [
  // ─── LADIES ───────────────────────────────────────────────
  {
    name: "Luxury Silk Wrap Dress",
    price: 3999, memberPrice: 2999,
    category: "Ladies",
    description: "Premium silk wrap dress with elegant drape. Perfect for parties and evening events.",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=90",
    stock: 25, inStock: true,
  },
  {
    name: "Floral Maxi Dress",
    price: 2999, memberPrice: 2399,
    category: "Ladies",
    description: "Trending floral print maxi dress with puff sleeves. Lightweight and breathable.",
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=90",
    stock: 30, inStock: true,
  },
  {
    name: "Wide-Leg Palazzo Pants",
    price: 2299, memberPrice: 1849,
    category: "Ladies",
    description: "Flowy wide-leg palazzo in premium crepe fabric. Versatile and ultra-comfortable.",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=90",
    stock: 20, inStock: true,
  },

  {
    name: "Satin Slip Dress",
    price: 2799, memberPrice: 2199,
    category: "Ladies",
    description: "Luxurious satin slip dress with adjustable straps. Effortlessly chic.",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=90",
    stock: 22, inStock: true,
  },
  {
    name: "Boho Embroidered Kurti",
    price: 1799, memberPrice: 1399,
    category: "Ladies",
    description: "Hand-embroidered boho kurti with mirror work. Ethnic meets contemporary.",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=90",
    stock: 35, inStock: true,
  },
  {
    name: "Linen Co-ord Set",
    price: 2599, memberPrice: 1999,
    category: "Ladies",
    description: "Breathable linen co-ord set in earthy tones. Perfect for summer outings.",
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=90",
    stock: 28, inStock: true,
  },
  {
    name: "Off-Shoulder Ruffle Dress",
    price: 2499, memberPrice: 1999,
    category: "Ladies",
    description: "Romantic off-shoulder ruffle dress in chiffon. Feminine and elegant.",
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&q=90",
    stock: 20, inStock: true,
  },

  // ─── MEN ──────────────────────────────────────────────────
  {
    name: "Premium Tailored Blazer",
    price: 3999, memberPrice: 3199,
    category: "Men",
    description: "Italian-cut tailored blazer in premium wool blend. Sharp and sophisticated.",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=90",
    stock: 20, inStock: true,
  },
  {
    name: "Luxury Slim Fit Chinos",
    price: 1999, memberPrice: 1599,
    category: "Men",
    description: "Slim fit chinos in stretch cotton. Wrinkle-resistant and all-day comfortable.",
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=90",
    stock: 40, inStock: true,
  },
  {
    name: "Structured Overcoat",
    price: 3799, memberPrice: 2999,
    category: "Men",
    description: "Classic structured overcoat in charcoal grey. Timeless winter essential.",
    image: "https://images.unsplash.com/photo-1488161628813-04466f872be2?w=800&q=90",
    stock: 15, inStock: true,
  },
  {
    name: "Linen Casual Shirt",
    price: 1599, memberPrice: 1299,
    category: "Men",
    description: "Premium linen casual shirt. Breathable and perfect for summer.",
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=90",
    stock: 45, inStock: true,
  },
  {
    name: "Jogger Track Pants",
    price: 1499, memberPrice: 1199,
    category: "Men",
    description: "Trending jogger pants with tapered fit. Athleisure at its best.",
    image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&q=90",
    stock: 50, inStock: true,
  },
  {
    name: "Oxford Button-Down Shirt",
    price: 1799, memberPrice: 1399,
    category: "Men",
    description: "Classic Oxford shirt in premium cotton. Versatile for work and casual wear.",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=90",
    stock: 38, inStock: true,
  },
  {
    name: "Luxury Polo T-Shirt",
    price: 1299, memberPrice: 999,
    category: "Men",
    description: "Premium pique polo in Egyptian cotton. Refined casual style.",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&q=90",
    stock: 42, inStock: true,
  },
  {
    name: "Denim Jacket",
    price: 2499, memberPrice: 1999,
    category: "Men",
    description: "Classic denim jacket with modern slim fit. Layering essential for all seasons.",
    image: "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=800&q=90",
    stock: 30, inStock: true,
  },

  // ─── JEANS ────────────────────────────────────────────────
  {
    name: "High-Rise Skinny Jeans",
    price: 2999, memberPrice: 2399,
    category: "Jeans",
    description: "Premium stretch denim in high-rise skinny fit. Sculpts and flatters.",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=90",
    stock: 35, inStock: true,
  },
  {
    name: "Straight-Cut Denim",
    price: 2799, memberPrice: 2199,
    category: "Jeans",
    description: "Classic straight-cut denim in rigid fabric. Timeless and durable.",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=90",
    stock: 30, inStock: true,
  },
  {
    name: "Baggy Cargo Jeans",
    price: 2599, memberPrice: 1999,
    category: "Jeans",
    description: "Trending baggy cargo jeans with utility pockets. Street style essential.",
    image: "https://images.unsplash.com/photo-1475178626620-a4d074967452?w=800&q=90",
    stock: 25, inStock: true,
  },
  {
    name: "Ripped Slim Jeans",
    price: 2299, memberPrice: 1849,
    category: "Jeans",
    description: "Edgy ripped slim jeans in premium denim. Bold and fashion-forward.",
    image: "https://images.unsplash.com/photo-1555689502-c4b22d76c56f?w=800&q=90",
    stock: 28, inStock: true,
  },
  {
    name: "Wide-Leg Denim",
    price: 2799, memberPrice: 2299,
    category: "Jeans",
    description: "Trending wide-leg denim with high waist. Retro-inspired modern silhouette.",
    image: "https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=800&q=90",
    stock: 22, inStock: true,
  },

  // ─── T-SHIRTS ─────────────────────────────────────────────
  {
    name: "Oversized Graphic Tee",
    price: 999, memberPrice: 799,
    category: "T-shirts",
    description: "Premium oversized graphic tee in 100% cotton. Bold prints, relaxed fit.",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=90",
    stock: 60, inStock: true,
  },
  {
    name: "Essential White Tee",
    price: 699, memberPrice: 549,
    category: "T-shirts",
    description: "Wardrobe essential white tee in Supima cotton. Perfectly fitted.",
    image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&q=90",
    stock: 80, inStock: true,
  },
  {
    name: "Luxury Ribbed Crop Top",
    price: 899, memberPrice: 699,
    category: "T-shirts",
    description: "Ribbed crop top in premium stretch fabric. Minimal and modern.",
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=90",
    stock: 45, inStock: true,
  },
  {
    name: "Vintage Washed Tee",
    price: 1199, memberPrice: 949,
    category: "T-shirts",
    description: "Vintage washed tee with distressed finish. Effortlessly cool.",
    image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=90",
    stock: 40, inStock: true,
  },
  {
    name: "Tie-Dye Oversized Tee",
    price: 1099, memberPrice: 849,
    category: "T-shirts",
    description: "Trending tie-dye oversized tee. Vibrant colors, relaxed summer vibe.",
    image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&q=90",
    stock: 35, inStock: true,
  },

  // ─── SHIRTS ───────────────────────────────────────────────
  {
    name: "Luxury Printed Shirt",
    price: 1999, memberPrice: 1599,
    category: "Shirts",
    description: "Premium printed shirt in soft rayon. Vibrant patterns for a bold look.",
    image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&q=90",
    stock: 30, inStock: true,
  },
  {
    name: "Classic Denim Shirt",
    price: 1799, memberPrice: 1399,
    category: "Shirts",
    description: "Versatile denim shirt that works as a top or jacket. A wardrobe staple.",
    image: "https://images.unsplash.com/photo-1588359348347-9bc6cbbb689e?w=800&q=90",
    stock: 28, inStock: true,
  },
  {
    name: "Mandarin Collar Shirt",
    price: 1699, memberPrice: 1349,
    category: "Shirts",
    description: "Elegant mandarin collar shirt in premium cotton. Minimalist luxury.",
    image: "https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=800&q=90",
    stock: 25, inStock: true,
  },
  {
    name: "Relaxed Linen Shirt",
    price: 1599, memberPrice: 1299,
    category: "Shirts",
    description: "Breathable linen shirt in relaxed fit. Summer essential.",
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=90",
    stock: 35, inStock: true,
  },

  // ─── TRADITIONAL ──────────────────────────────────────────
  {
    name: "Bandhani Silk Saree",
    price: 3999, memberPrice: 3199,
    category: "Traditional",
    description: "Authentic Bandhani silk saree with zari border. Handcrafted in Rajasthan.",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=90",
    stock: 15, inStock: true,
  },
  {
    name: "Embroidered Anarkali Suit",
    price: 3499, memberPrice: 2799,
    category: "Traditional",
    description: "Luxurious embroidered Anarkali with dupatta. Perfect for weddings and festivals.",
    image: "https://images.unsplash.com/photo-1617922001439-4a2e6562f328?w=800&q=90",
    stock: 12, inStock: true,
  },
  {
    name: "Sherwani for Men",
    price: 3999, memberPrice: 3299,
    category: "Traditional",
    description: "Premium sherwani with intricate embroidery. Regal look for weddings.",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=90",
    stock: 10, inStock: true,
  },
  {
    name: "Chanderi Kurta Set",
    price: 2499, memberPrice: 1999,
    category: "Traditional",
    description: "Lightweight Chanderi kurta with palazzo. Elegant ethnic wear for all occasions.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=90",
    stock: 20, inStock: true,
  },
  {
    name: "Banarasi Lehenga",
    price: 3799, memberPrice: 2999,
    category: "Traditional",
    description: "Stunning Banarasi weave lehenga with blouse. Bridal and festive wear.",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=90",
    stock: 8, inStock: true,
  },
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB connected');
    await Product.deleteMany({});
    const inserted = await Product.insertMany(SEED_PRODUCTS);
    console.log(`✅ ${inserted.length} products inserted`);
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
  });
