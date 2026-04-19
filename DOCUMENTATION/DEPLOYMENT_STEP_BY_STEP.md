# 🚀 Complete Deployment Guide - E-Commerce Platform

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [MongoDB Atlas Setup](#mongodb-atlas-setup)
3. [Backend Deployment (Render)](#backend-deployment-render)
4. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
5. [Environment Variables](#environment-variables)
6. [Testing Deployment](#testing-deployment)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before deployment, you need:
- ✅ GitHub account (already done!)
- ✅ MongoDB Atlas account (free tier)
- ✅ Vercel account (free)
- ✅ Render account (free)
- ✅ Google OAuth credentials (optional)

---

## MongoDB Atlas Setup

### Step 1: Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create a new cluster (free M0 tier)

### Step 2: Create Database User
1. Go to **Database Access**
2. Click **Add New Database User**
3. Username: `admin` (or your choice)
4. Password: Generate strong password (SAVE THIS!)
5. Database User Privileges: **Read and write to any database**
6. Click **Add User**

### Step 3: Whitelist IP Address
1. Go to **Network Access**
2. Click **Add IP Address**
3. Click **Allow Access from Anywhere** (0.0.0.0/0)
4. Click **Confirm**

### Step 4: Get Connection String
1. Go to **Database** → **Connect**
2. Choose **Connect your application**
3. Copy the connection string
4. Replace `<password>` with your database password
5. Replace `<dbname>` with `ecommerce` or your choice

Example:
```
mongodb+srv://admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority
```

---

## Backend Deployment (Render)

### Step 1: Create Render Account
1. Go to https://render.com
2. Sign up with GitHub account
3. Authorize Render to access your repositories

### Step 2: Create New Web Service
1. Click **New +** → **Web Service**
2. Connect your GitHub repository: `E-Commerce-Platform`
3. Click **Connect**

### Step 3: Configure Service
Fill in these settings:

**Basic Settings:**
- Name: `ecommerce-backend` (or your choice)
- Region: Choose closest to you
- Branch: `main`
- Root Directory: `backend`
- Runtime: `Node`

**Build & Deploy:**
- Build Command: `npm install`
- Start Command: `npm start`

**Instance Type:**
- Select **Free** tier

### Step 4: Add Environment Variables
Click **Advanced** → **Add Environment Variable**

Add these variables:

```
MONGO_URI = mongodb+srv://admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority

JWT_SECRET = your_super_secret_key_here_make_it_long_and_random

PORT = 5000

GOOGLE_CLIENT_ID = your_google_client_id (optional)

EMAIL_USER = your_email@gmail.com (optional)

EMAIL_PASS = your_email_app_password (optional)

NODE_ENV = production
```

**Important**: 
- Replace `YOUR_PASSWORD` with your MongoDB password
- Generate a strong JWT_SECRET (random string, 32+ characters)

### Step 5: Deploy
1. Click **Create Web Service**
2. Wait 5-10 minutes for deployment
3. Your backend will be live at: `https://ecommerce-backend.onrender.com`

### Step 6: Test Backend
Open in browser: `https://your-backend-url.onrender.com/api/products`

You should see JSON response with products!

---

## Frontend Deployment (Vercel)

### Step 1: Update API URL in Frontend
Before deploying frontend, update the backend URL:

1. Open `frontend/src/api/api.js`
2. Find this line:
```javascript
const API_URL = 'http://localhost:5000/api';
```

3. Change to your Render backend URL:
```javascript
const API_URL = 'https://your-backend-url.onrender.com/api';
```

4. Commit and push changes:
```bash
git add .
git commit -m "Update API URL for production"
git push origin main
```

### Step 2: Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub account
3. Authorize Vercel

### Step 3: Import Project
1. Click **Add New** → **Project**
2. Import `E-Commerce-Platform` repository
3. Click **Import**

### Step 4: Configure Project
**Framework Preset:** Vite  
**Root Directory:** `frontend`  
**Build Command:** `npm run build`  
**Output Directory:** `dist`  
**Install Command:** `npm install`

### Step 5: Environment Variables (Optional)
If you have any frontend env variables, add them here.

For now, you can skip this.

### Step 6: Deploy
1. Click **Deploy**
2. Wait 2-3 minutes
3. Your frontend will be live at: `https://your-project.vercel.app`

### Step 7: Test Website
1. Open your Vercel URL
2. Test all features:
   - Browse products ✅
   - Add to cart ✅
   - Login/Register ✅
   - Dark mode ✅
   - Spin wheel ✅
   - Admin panel ✅

---

## Environment Variables Reference

### Backend (.env)
```env
# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname

# Authentication
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long

# Server
PORT=5000
NODE_ENV=production

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Email Service (Optional)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password

# Frontend URL (for CORS)
FRONTEND_URL=https://your-frontend.vercel.app
```

### Frontend (if needed)
```env
VITE_API_URL=https://your-backend.onrender.com/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

---

## Testing Deployment

### Backend Health Check
```bash
curl https://your-backend.onrender.com/api/products
```

Should return JSON with products.

### Frontend Check
1. Open browser: `https://your-frontend.vercel.app`
2. Open DevTools → Network tab
3. Check if API calls are working
4. Test features:
   - Product listing
   - Add to cart
   - User registration
   - Login
   - Admin panel

---

## Troubleshooting

### Backend Issues

**Problem: "Cannot connect to MongoDB"**
- Check MongoDB Atlas IP whitelist (should be 0.0.0.0/0)
- Verify connection string is correct
- Check database user password

**Problem: "Port already in use"**
- Render automatically assigns port, don't worry about this

**Problem: "Module not found"**
- Check `package.json` has all dependencies
- Redeploy with `npm install`

### Frontend Issues

**Problem: "API calls failing"**
- Check API_URL in `api.js` is correct
- Check backend is running
- Check CORS settings in backend

**Problem: "Build failed"**
- Check all imports are correct
- Check no console errors locally
- Check `package.json` scripts

**Problem: "White screen"**
- Check browser console for errors
- Check API URL is correct
- Check backend is responding

### Common Issues

**Problem: "CORS Error"**
Add this to backend `server.js`:
```javascript
app.use(cors({
  origin: ['https://your-frontend.vercel.app', 'http://localhost:5173'],
  credentials: true
}));
```

**Problem: "JWT Token Invalid"**
- Check JWT_SECRET is same in production
- Clear browser cookies
- Try login again

---

## Post-Deployment Checklist

- [ ] Backend is live and responding
- [ ] Frontend is live and loading
- [ ] Products are displaying
- [ ] User can register/login
- [ ] Cart functionality works
- [ ] Admin panel accessible
- [ ] Dark mode working
- [ ] Spin wheel working
- [ ] Images loading correctly
- [ ] Mobile responsive
- [ ] No console errors

---

## Custom Domain (Optional)

### Vercel Custom Domain
1. Go to Vercel project settings
2. Click **Domains**
3. Add your domain
4. Update DNS records as shown

### Render Custom Domain
1. Go to Render dashboard
2. Click your service → **Settings**
3. Add custom domain
4. Update DNS records

---

## Monitoring & Maintenance

### Render Dashboard
- Check logs for errors
- Monitor response times
- Check uptime

### Vercel Dashboard
- Check deployment logs
- Monitor bandwidth usage
- Check analytics

---

## Free Tier Limitations

### Render Free Tier
- ⚠️ Sleeps after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds
- 750 hours/month free

**Solution**: Use cron job to ping every 14 minutes

### Vercel Free Tier
- 100GB bandwidth/month
- Unlimited deployments
- No sleep time

### MongoDB Atlas Free Tier
- 512MB storage
- Shared RAM
- Good for 1000+ users

---

## Upgrade Options

When your app grows:

**Render**: $7/month for always-on server  
**Vercel**: $20/month for Pro features  
**MongoDB**: $9/month for 2GB storage  

---

## Support

If you face issues:
1. Check Render/Vercel logs
2. Check browser console
3. Check MongoDB Atlas metrics
4. Review this guide again
5. Check GitHub issues

---

## Success! 🎉

Your E-Commerce Platform is now live!

**Share your links:**
- Frontend: `https://your-project.vercel.app`
- Backend: `https://your-backend.onrender.com`
- GitHub: `https://github.com/navneetsaini027/E-Commerce-Platform`

**Add to resume:**
- Live Demo: [Your Vercel URL]
- Source Code: [Your GitHub URL]
- Tech Stack: MERN Stack

---

**Congratulations on deploying your first full-stack application! 🚀**
