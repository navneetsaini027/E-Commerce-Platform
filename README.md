# 🛍️ Aashirwad Fashion - Premium E-Commerce Platform

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Status](https://img.shields.io/badge/status-production--ready-success.svg)

## 🎯 Quick Overview

**Aashirwad Fashion** is a complete, production-ready e-commerce platform built with MERN stack (MongoDB, Express, React, Node.js). It features 50+ premium features including dark mode with starry night animation, spin the wheel rewards, multiple image upload, and much more!

---

## ⚡ Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB (Atlas or Local)
- npm or yarn

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/aashirwad-fashion.git
cd aashirwad-fashion

# Backend setup
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
node seed.js
npm start

# Frontend setup (new terminal)
cd frontend
npm install
npm run dev
```

**Backend**: http://localhost:5000  
**Frontend**: http://localhost:5173

---

## 📚 Documentation

All documentation is organized in the `DOCUMENTATION/` folder:

1. **01_README.md** - Main project documentation
2. **02_COMPLETE_PROJECT_GUIDE.md** - Full development guide
3. **03_TECHNICAL_SUMMARY.md** - Code patterns & examples
4. **04_AI_RECOVERY_DOCUMENT.md** - AI assistant guide
5. **05_BACKEND_INTEGRATION.md** - API documentation
6. **06_PREMIUM_FEATURES.md** - Feature documentation
7. **07_DEPLOYMENT_GUIDE.md** - Deployment instructions
8. **08_PROJECT_SUMMARY.md** - Quick overview
9. **09_PROJECT_COMPLETE_SUMMARY.md** - Complete summary
10. **10_GITHUB_PUSH_COMMANDS.txt** - Git commands
11. **11_OAUTH_SETUP_GUIDE.md** - OAuth setup
12. **00_ALL_FEATURES_LIST.md** - Complete features list

---

## ✨ Key Features

### 🛒 E-Commerce Core
- Product catalog with categories
- Shopping cart with persistence
- Wishlist functionality
- Advanced search & filters
- Product reviews & ratings
- Order management
- Invoice generation

### 🎨 Premium UI/UX
- **Dark/Light Mode** with animated starry night
- **Live Date & Time** clock in navbar
- **Particle Effects** background
- Smooth animations (Framer Motion)
- Fully responsive design
- Toast notifications

### 🎡 Engagement Features
- **Spin the Wheel** - Daily rewards system
- **Quick View** - Instant product preview
- **Recently Viewed** - Product history tracking
- Real-time notifications
- Live chat support

### 👤 User Features
- Google OAuth login
- User dashboard
- Order history
- Profile management
- Wishlist collections

### 🔐 Admin Features
- Admin dashboard with analytics
- Product management (CRUD)
- **Multiple Image Upload** (NEW!)
- Order management
- User management
- Stock management
- Coupon management

---

## 🛠️ Tech Stack

**Frontend**: React 18, Vite, Framer Motion, Axios  
**Backend**: Node.js, Express, MongoDB, Mongoose  
**Auth**: JWT, Google OAuth, Bcrypt  
**Styling**: CSS-in-JS, Responsive Design  
**Animations**: Framer Motion  

---

## 📦 Project Structure

```
aashirwad-fashion/
├── backend/              # Node.js + Express
│   ├── models/          # MongoDB schemas (10)
│   ├── routes/          # API routes (11)
│   ├── middleware/      # Auth middleware
│   └── server.js        # Entry point
│
├── frontend/            # React + Vite
│   ├── src/
│   │   ├── components/  # React components (40+)
│   │   ├── contexts/    # Theme context
│   │   ├── api/         # API client
│   │   └── App.jsx      # Main app
│   └── public/          # Static assets
│
├── DOCUMENTATION/       # All documentation (12 files)
└── LICENSE             # MIT License
```

---

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy dist/ folder
```

### Backend (Railway/Render)
```bash
cd backend
# Set environment variables
# Deploy
```

See `DOCUMENTATION/07_DEPLOYMENT_GUIDE.md` for detailed instructions.

---

## 🔐 Environment Variables

Create `.env` in backend folder:

```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
PORT=5000
GOOGLE_CLIENT_ID=your_google_client_id
EMAIL_USER=your_email
EMAIL_PASS=your_password
```

---

## 📊 Statistics

- **Total Files**: 100+
- **Lines of Code**: ~15,000+
- **Components**: 40+
- **API Endpoints**: 50+
- **Features**: 50+
- **Documentation**: 12 files

---

## 🎯 Features List

See `DOCUMENTATION/00_ALL_FEATURES_LIST.md` for complete list of all 50+ features.

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License - see LICENSE file.

---

## 👨‍💻 Author

Built with ❤️ using AI assistance

---

## 📞 Support

For support:
- Check documentation in `DOCUMENTATION/` folder
- Create GitHub issue
- Review troubleshooting guide

---

## 🎉 Acknowledgments

- React Team
- MongoDB Team
- Express Team
- Framer Motion
- Lucide Icons
- All open source contributors

---

**⭐ Star this repo if you find it helpful!**

**Made with ❤️ for fashion enthusiasts**
