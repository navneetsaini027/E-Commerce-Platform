# AI Handover Summary - Aashirwad Fashion E-Commerce Platform
> This document is written for any AI assistant (ChatGPT, Gemini, Claude, etc.) to understand the full project and continue development without needing extra context.

---

## Project Overview

**Project Name:** Aashirwad Fashion E-Commerce Platform  
**GitHub:** https://github.com/navneetsaini027/E-Commerce-Platform  
**Frontend (Live):** https://e-commerce-platform-five-black.vercel.app  
**Backend (Live):** https://ecommerce-backend-nk0g.onrender.com  
**Database:** MongoDB Atlas (Cloud: cluster0.syi19kz.mongodb.net, DB: ecommerce)  
**Tech Stack:** MERN (MongoDB, Express, React, Node.js)  
**Owner:** Navneet Kumar Saini (nickeysaini02@gmail.com)

---

## Project Structure

```
aashirwad-fashion/
├── backend/          → Node.js + Express API
│   ├── models/       → MongoDB schemas
│   ├── routes/       → API endpoints
│   ├── middleware/   → auth.js
│   ├── utils/        → emailService.js
│   └── server.js     → Entry point (port 5000)
├── frontend/         → React + Vite
│   ├── src/
│   │   ├── components/  → All UI components (40+)
│   │   ├── api/api.js   → All API calls
│   │   ├── contexts/    → ThemeContext.jsx
│   │   └── App.jsx      → Main app
└── DOCUMENTATION/    → All docs
```

---

## Environment Variables

### Backend (.env)
```
MONGO_URI=mongodb+srv://saininavneet027:saini123@cluster0.syi19kz.mongodb.net/ecommerce?retryWrites=true&w=majority
JWT_SECRET=aashirwad_fashion_jwt_secret_2024_production_secure_token_key
PORT=5000
NODE_ENV=development
GOOGLE_CLIENT_ID=331730642980-27qqkceh8ijtemtkp2nrvtvh801or8h3.apps.googleusercontent.com
EMAIL_USER=nickeysaini02@gmail.com
EMAIL_PASS=fmar lsmv ermf ozgv
RAZORPAY_KEY_ID=rzp_test_SffZq575yBwduv
RAZORPAY_KEY_SECRET=y3W3KKAknfeCZhQrnYozBRhp
```

### Render (Production) - Same variables set in dashboard

---

## Database Models

| Model | Purpose |
|-------|---------|
| User | Users with roles: user / admin / owner |
| Product | Products with images[], reviews[], stock |
| Order | Orders with items, shippingAddress, paymentMethod |
| Coupon | Discount coupons |
| Newsletter | Email subscribers |
| Notification | User notifications |
| Testimonial | Customer testimonials |
| SpinHistory | Spin wheel records |
| ViewHistory | Product view tracking |
| WishlistCollection | Wishlist collections |
| SiteSettings | key-value store for Trending/Gift/Lookbook sections |

---

## API Routes

| Route | Purpose |
|-------|---------|
| /api/products | CRUD products |
| /api/auth | Login, Register, Google OAuth, /me (get fresh user) |
| /api/orders | Place order, get orders, update status |
| /api/admin | Admin dashboard stats, users, orders management |
| /api/coupons | Validate coupons |
| /api/newsletter | Subscribe |
| /api/notifications | User notifications |
| /api/spin-wheel | Daily spin wheel |
| /api/view-history | Track product views |
| /api/wishlist-collections | Wishlist management |
| /api/payment | Razorpay create-order, verify |
| /api/settings | Site settings (trending/gifts/lookbook) |

---

## User Roles System

| Role | Access |
|------|--------|
| user | Normal shopping |
| admin | Full admin panel access |
| owner | Admin + can delete admins, cannot be deleted |

**Owner email:** nickeysaini02@gmail.com  
**To set owner:** Run in backend terminal:
```bash
node -e "const mongoose=require('mongoose');require('dotenv').config();mongoose.connect(process.env.MONGO_URI).then(async()=>{const User=require('./models/User');const u=await User.findOneAndUpdate({email:'nickeysaini02@gmail.com'},{role:'owner'},{new:true});console.log(u.name,u.role);process.exit()})"
```

---

## Key Features Implemented

### Frontend
- Dark/Light mode with animated starry night background
- Live clock in navbar
- Google OAuth login
- Razorpay payment (UPI, Card, Net Banking, COD)
- Spin the Wheel daily rewards
- Quick View modal
- Product gallery with multiple images
- Admin Dashboard with tabs:
  - Dashboard Overview (real stats)
  - Manage Orders
  - Manage Products (add/edit/delete with Cloudinary image upload)
  - Manage Users (make admin, delete users)
  - Discount Coupons
  - Newsletter subscribers
  - Trending Banners (editable, saved to MongoDB)
  - Gift Section (editable, saved to MongoDB)
  - Style Lookbook (editable, saved to MongoDB)
- Mobile responsive navbar with hamburger menu
- Wishlist button working inside ProductDetail modal

### Backend
- JWT authentication
- Google OAuth (credential-based, no redirect)
- Admin auth checks DB role (not just token) - so role changes take effect immediately
- Email service (nodemailer + Gmail):
  - Welcome email on registration
  - Order confirmation email
  - Order status update email
  - Newsletter subscription email
  - Spin & Win prize email
- Razorpay payment integration
- SiteSettings model for dynamic homepage sections

### Image Upload
- **Cloudinary** used for image uploads
- Cloud Name: dhcyh666o
- Upload Preset: aashirwad_fashion (Unsigned)
- ImageUploader component: supports URL input OR gallery upload (up to 20MB)

---

## Frontend API URL

**Local development:**
```javascript
baseURL: 'http://localhost:5000/api'
```

**Production (before pushing to GitHub):**
```javascript
baseURL: 'https://ecommerce-backend-nk0g.onrender.com/api'
```

File: `frontend/src/api/api.js` line 4

---

## How to Run Locally

```bash
# Backend
cd backend
npm install
npm start   # runs on port 5000

# Frontend (new terminal)
cd frontend
npm install
npm run dev  # runs on port 5173
```

---

## How to Deploy

### Frontend → Vercel
1. Push to GitHub
2. Vercel auto-deploys from main branch
3. Root Directory: frontend

### Backend → Render
1. Push to GitHub
2. Render auto-deploys
3. Root Directory: backend
4. Start Command: npm start
5. Add all environment variables in Render dashboard

### Database Seed (if products missing)
```bash
cd backend
npm run seed   # inserts 34 products
```

---

## Known Issues / Notes

1. **Render Free Tier** sleeps after 15 min inactivity - first request takes 30-60 sec
2. **Razorpay is in Test Mode** - use `success@razorpay` for UPI testing
3. **API URL** must be changed before pushing: localhost → Render URL
4. **MongoDB IP Whitelist** must include 0.0.0.0/0 for Render to connect
5. **Owner role** must be set manually via terminal command (see above)
6. **Google OAuth** - Vercel URL must be added to Google Cloud Console authorized origins

---

## Important Files

| File | Purpose |
|------|---------|
| frontend/src/api/api.js | All API calls - change baseURL for production |
| frontend/src/components/AdminDashboard.jsx | Full admin panel |
| frontend/src/components/CheckoutModal.jsx | Razorpay payment flow |
| frontend/src/components/ImageUploader.jsx | Cloudinary image upload |
| backend/utils/emailService.js | All email templates |
| backend/routes/payment.js | Razorpay backend |
| backend/routes/siteSettings.js | Dynamic homepage sections |
| backend/routes/admin.js | Admin API with owner/admin role checks |

---

## Pending Features (Not Yet Implemented)

- Star rating system visible on ProductCard (reviews exist in DB but only shown in ProductDetail)
- Real-time notifications (currently polling based)

---

## Quick Fix Guide

**Products not showing?**
→ Run `npm run seed` in backend folder

**Admin panel not accessible?**
→ User role might be 'user' - update to 'admin' or 'owner' via terminal

**Payment failing?**
→ Check if API URL is localhost (for local) or Render URL (for production)

**Images not uploading?**
→ Check Cloudinary preset name is 'aashirwad_fashion' and mode is 'Unsigned'

**Emails not sending?**
→ Check EMAIL_USER and EMAIL_PASS in .env (Gmail App Password required)

---

*Last updated: April 2026*  
*Project by: Navneet Kumar Saini*
