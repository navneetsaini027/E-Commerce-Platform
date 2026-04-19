# 🛍️ Aashirwad Fashion - Premium E-Commerce Platform

A modern, feature-rich fashion e-commerce platform built with MERN stack (MongoDB, Express, React, Node.js).

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Features

### 🎨 User Experience
- **Dark/Light Mode** - Beautiful theme switching with animated starry night in dark mode
- **Live Date & Time** - Real-time clock display in navbar
- **Responsive Design** - Fully optimized for mobile, tablet, and desktop
- **Smooth Animations** - Framer Motion powered transitions
- **Particle Effects** - Dynamic background animations

### 🛒 Shopping Features
- **Product Catalog** - Browse products by categories
- **Quick View** - Instant product preview without page reload
- **Advanced Filters** - Sort by price, rating, newest
- **Product Reviews** - Star ratings and customer reviews
- **Wishlist** - Save favorite products
- **Shopping Cart** - Add to cart with quantity management
- **Recently Viewed** - Track browsing history

### 🎡 Gamification
- **Spin the Wheel** - Daily rewards system with discount coupons
- **Achievement System** - Track user milestones
- **Loyalty Points** - Earn rewards on purchases

### 👤 User Management
- **Google OAuth** - Quick social login
- **User Dashboard** - Profile management
- **Order History** - Track all orders
- **Real-time Notifications** - Bell icon with live updates

### 🔐 Admin Panel
- **Product Management** - Add, edit, delete products
- **Order Management** - Update order status
- **User Management** - View and manage users
- **Analytics Dashboard** - Sales and user statistics
- **Stock Alerts** - Low stock notifications
- **Coupon Management** - Create and manage discount codes

### 💳 Payment & Checkout
- **Secure Checkout** - Multi-step checkout process
- **Coupon System** - Apply discount codes
- **Invoice Generation** - PDF invoices for orders
- **Multiple Payment Options** - Ready for payment gateway integration

### 📱 Additional Features
- **Live Chat Support** - Customer support widget
- **Newsletter Subscription** - Email marketing integration
- **Testimonials** - Customer reviews showcase
- **SEO Optimized** - Meta tags and structured data
- **PWA Ready** - Progressive Web App capabilities

---

## 🚀 Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **Axios** - HTTP client
- **React OAuth Google** - Google authentication

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Nodemailer** - Email service

---

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/aashirwad-fashion.git
cd aashirwad-fashion
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env with your credentials

# Seed database (optional)
node seed.js
node seedExtras.js

# Start backend server
npm start
```

Backend will run on `http://localhost:5000`

### 3. Frontend Setup
```bash
cd ../frontend
npm install

# Start frontend dev server
npm run dev
```

Frontend will run on `http://localhost:5173`

---

## 🔧 Environment Variables

### Backend (.env)
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_password
GOOGLE_CLIENT_ID=your_google_client_id
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### Frontend
Update `GOOGLE_CLIENT_ID` in `src/App.jsx` if needed.

---

## 📁 Project Structure

```
aashirwad-fashion/
├── backend/
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API routes
│   ├── middleware/       # Auth middleware
│   ├── utils/            # Helper functions
│   ├── server.js         # Express app
│   └── .env.example      # Environment template
│
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── contexts/     # React contexts
│   │   ├── api/          # API functions
│   │   ├── config/       # Configuration
│   │   ├── data/         # Static data
│   │   └── App.jsx       # Main app
│   ├── public/           # Static assets
│   └── index.html        # HTML template
│
├── PREMIUM_FEATURES.md   # Feature documentation
├── BACKEND_INTEGRATION.md # API documentation
└── README.md             # This file
```

---

## 🎯 API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `DELETE /api/products/:id` - Delete product (admin)
- `POST /api/products/:id/reviews` - Add review

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/google` - Google OAuth

### Orders
- `POST /api/orders` - Place order
- `GET /api/orders/my` - Get user orders
- `GET /api/orders/:id` - Get order details

### Spin Wheel
- `GET /api/spin-wheel/can-spin` - Check if can spin
- `POST /api/spin-wheel/spin` - Record spin
- `GET /api/spin-wheel/coupons` - Get active coupons

### View History
- `POST /api/view-history/track` - Track product view
- `GET /api/view-history/recent` - Get recently viewed

### Wishlist Collections
- `GET /api/wishlist-collections` - Get collections
- `POST /api/wishlist-collections` - Create collection
- `POST /api/wishlist-collections/:id/products` - Add product

[See BACKEND_INTEGRATION.md for complete API documentation]

---

## 🎨 Features Documentation

See [PREMIUM_FEATURES.md](./PREMIUM_FEATURES.md) for detailed feature documentation including:
- Spin the Wheel system
- Quick View modal
- Recently Viewed tracking
- Particle effects
- Dark mode enhancements

---

## 🔐 Default Admin Credentials

```
Username: admin
Password: admin123
```

**⚠️ Change these in production!**

---

## 🚀 Deployment

### Backend (Heroku/Railway/Render)
1. Push code to GitHub
2. Connect repository to hosting platform
3. Set environment variables
4. Deploy

### Frontend (Vercel/Netlify)
1. Push code to GitHub
2. Connect repository
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Deploy

### Database (MongoDB Atlas)
1. Create cluster on MongoDB Atlas
2. Get connection string
3. Update MONGO_URI in .env

---

## 📝 Scripts

### Backend
```bash
npm start          # Start server
node seed.js       # Seed products
node seedExtras.js # Seed additional data
```

### Frontend
```bash
npm run dev        # Development server
npm run build      # Production build
npm run preview    # Preview production build
```

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- Icons by [Lucide](https://lucide.dev/)
- Animations by [Framer Motion](https://www.framer.com/motion/)
- UI inspiration from modern e-commerce platforms

---

## 📞 Support

For support, email your.email@example.com or create an issue on GitHub.

---

**Made with ❤️ for fashion enthusiasts**
