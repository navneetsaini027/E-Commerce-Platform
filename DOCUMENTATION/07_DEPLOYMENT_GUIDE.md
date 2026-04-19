# 🚀 Deployment Guide

## GitHub Push Instructions

### Step 1: Initialize Git (if not already done)
```bash
cd aashirwad-fashion
git init
```

### Step 2: Add all files
```bash
git add .
```

### Step 3: Create initial commit
```bash
git commit -m "Initial commit: Aashirwad Fashion E-Commerce Platform

Features:
- Complete MERN stack implementation
- Dark/Light mode with starry night theme
- Spin the wheel rewards system
- Product management with reviews
- User authentication (Google OAuth)
- Admin dashboard
- Real-time notifications
- Shopping cart and wishlist
- Order management
- Recently viewed products
- Quick view modal
- Responsive design
- And many more premium features!"
```

### Step 4: Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `aashirwad-fashion`
3. Description: `Premium Fashion E-Commerce Platform - MERN Stack`
4. Choose Public or Private
5. **DO NOT** initialize with README (we already have one)
6. Click "Create repository"

### Step 5: Connect to GitHub
```bash
# Replace 'yourusername' with your GitHub username
git remote add origin https://github.com/yourusername/aashirwad-fashion.git

# Or use SSH (if configured)
git remote add origin git@github.com:yourusername/aashirwad-fashion.git
```

### Step 6: Push to GitHub
```bash
git branch -M main
git push -u origin main
```

---

## 🔐 Important: Before Pushing

### ✅ Checklist:
- [x] .gitignore files created
- [x] .env files NOT included (only .env.example)
- [x] node_modules folders ignored
- [x] Sensitive data removed
- [x] README.md created
- [x] LICENSE added

### ⚠️ Security Check:
Make sure these are in .gitignore:
```
node_modules/
.env
.env.local
*.log
.DS_Store
.vscode/
```

---

## 🌐 Deployment Options

### Option 1: Vercel (Frontend) + Railway (Backend)

#### Frontend (Vercel):
1. Go to https://vercel.com
2. Import GitHub repository
3. Framework: Vite
4. Root Directory: `frontend`
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. Deploy

#### Backend (Railway):
1. Go to https://railway.app
2. New Project → Deploy from GitHub
3. Select repository
4. Root Directory: `backend`
5. Add environment variables from .env
6. Deploy

### Option 2: Render (Full Stack)

#### Backend:
1. Go to https://render.com
2. New → Web Service
3. Connect GitHub repository
4. Root Directory: `backend`
5. Build Command: `npm install`
6. Start Command: `npm start`
7. Add environment variables
8. Create Web Service

#### Frontend:
1. New → Static Site
2. Connect GitHub repository
3. Root Directory: `frontend`
4. Build Command: `npm run build`
5. Publish Directory: `dist`
6. Create Static Site

### Option 3: Heroku (Backend) + Netlify (Frontend)

#### Backend (Heroku):
```bash
cd backend
heroku create aashirwad-fashion-api
heroku config:set MONGO_URI=your_uri
heroku config:set JWT_SECRET=your_secret
git push heroku main
```

#### Frontend (Netlify):
1. Go to https://netlify.com
2. New site from Git
3. Select repository
4. Base directory: `frontend`
5. Build command: `npm run build`
6. Publish directory: `dist`
7. Deploy

---

## 🗄️ Database Setup (MongoDB Atlas)

1. Go to https://cloud.mongodb.com
2. Create new cluster (Free tier available)
3. Create database user
4. Whitelist IP: `0.0.0.0/0` (allow from anywhere)
5. Get connection string
6. Update MONGO_URI in environment variables

---

## 🔧 Environment Variables for Production

### Backend:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your_production_secret_key
PORT=5000
ADMIN_USERNAME=admin
ADMIN_PASSWORD=secure_password
GOOGLE_CLIENT_ID=your_google_client_id
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
NODE_ENV=production
```

### Frontend:
Update API base URL in `src/api/api.js`:
```javascript
const API = axios.create({
  baseURL: 'https://your-backend-url.com/api',
});
```

---

## 📊 Post-Deployment Checklist

- [ ] Backend API is accessible
- [ ] Frontend loads correctly
- [ ] Database connection working
- [ ] Authentication working (Google OAuth)
- [ ] Products loading
- [ ] Cart functionality working
- [ ] Order placement working
- [ ] Admin panel accessible
- [ ] Email notifications working
- [ ] All API endpoints responding

---

## 🐛 Troubleshooting

### CORS Issues:
Update backend `server.js`:
```javascript
app.use(cors({ 
  origin: ['https://your-frontend-url.com'], 
  credentials: true 
}));
```

### MongoDB Connection:
- Check IP whitelist in MongoDB Atlas
- Verify connection string format
- Ensure database user has correct permissions

### Build Errors:
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear cache: `npm cache clean --force`
- Check Node.js version compatibility

---

## 📈 Monitoring & Analytics

### Recommended Tools:
- **Sentry** - Error tracking
- **Google Analytics** - User analytics
- **LogRocket** - Session replay
- **Uptime Robot** - Uptime monitoring

---

## 🔄 CI/CD Setup (Optional)

### GitHub Actions:
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run build
```

---

## 📞 Support

If you encounter issues:
1. Check logs in deployment platform
2. Verify environment variables
3. Test API endpoints with Postman
4. Check browser console for errors

---

**Happy Deploying! 🚀**
