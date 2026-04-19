# 🔐 Google OAuth Redirect URI Fix - Complete Guide

## Problem
`redirect_uri_mismatch` error when trying to login with Google

## Root Cause
Your Google OAuth credentials are configured for `localhost`, but your frontend is now on Vercel (production URL).

---

## 📋 Current Setup Analysis

### Frontend (Vercel)
- **URL:** `https://e-commerce-platform.vercel.app` (or your actual Vercel URL)
- **Google OAuth:** Client-side (using `@react-oauth/google`)
- **Client ID:** `331730642980-27qqkceh8ijtemtkp2nrvtvh801or8h3.apps.googleusercontent.com`

### Backend (Render)
- **URL:** `https://e-commerce-platform-4a65.onrender.com`
- **Role:** Receives Google credential from frontend, creates JWT token

### How It Works
1. Frontend sends Google credential to backend
2. Backend verifies and creates user
3. Backend returns JWT token
4. **No redirect needed** - it's all API calls!

---

## ✅ Solution: Update Google Cloud Console

### Step 1: Go to Google Cloud Console
1. Open: https://console.cloud.google.com
2. Select your project
3. Go to **APIs & Services** → **Credentials**
4. Find your OAuth 2.0 Client ID (Web application)
5. Click on it to edit

### Step 2: Add Authorized JavaScript Origins

Under **Authorized JavaScript origins**, add:

```
http://localhost:5173
http://localhost:3000
https://e-commerce-platform.vercel.app
```

**Replace `e-commerce-platform.vercel.app` with your actual Vercel URL!**

### Step 3: Add Authorized Redirect URIs

Under **Authorized redirect URIs**, add:

```
http://localhost:5173
http://localhost:3000
https://e-commerce-platform.vercel.app
```

**Same URLs as above!**

### Step 4: Save Changes
Click **Save** button

---

## 🔍 How to Find Your Vercel URL

### Option 1: From Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Click your project: `E-Commerce-Platform`
3. Copy the URL from top (e.g., `https://e-commerce-platform-navneetsaini027.vercel.app`)

### Option 2: From Browser
1. Open your deployed website
2. Copy the URL from address bar

### Option 3: From GitHub
1. Go to your GitHub repo
2. Vercel bot will comment with deployment URL

---

## 📝 Complete Redirect URI List

Add ALL these to Google Cloud Console:

```
# Local Development
http://localhost:5173
http://localhost:3000

# Production (Vercel)
https://e-commerce-platform.vercel.app
https://e-commerce-platform-navneetsaini027.vercel.app

# Add your actual Vercel URL here!
https://YOUR_ACTUAL_VERCEL_URL.vercel.app
```

---

## 🧪 Testing After Update

### Step 1: Clear Browser Cache
- Press `Ctrl + Shift + Delete` (or Cmd + Shift + Delete on Mac)
- Clear cookies and cache
- Close browser completely

### Step 2: Test Locally First
1. Run frontend locally: `npm run dev`
2. Go to `http://localhost:5173`
3. Try Google login
4. Should work! ✅

### Step 3: Test on Vercel
1. Go to your Vercel URL
2. Try Google login
3. Should work! ✅

---

## ⚠️ Common Issues & Fixes

### Issue 1: Still Getting redirect_uri_mismatch
**Solution:**
- Wait 5-10 minutes for Google to update
- Clear browser cache completely
- Try incognito/private mode
- Check you added EXACT URL (no trailing slash)

### Issue 2: Google Login Button Not Showing
**Solution:**
- Check browser console for errors
- Verify `GOOGLE_CLIENT_ID` in `App.jsx` is correct
- Check internet connection

### Issue 3: Login Works Locally But Not on Vercel
**Solution:**
- Add your Vercel URL to Google Cloud Console
- Wait for changes to propagate
- Clear Vercel cache (redeploy)

---

## 🔐 Security Notes

1. **Never share your Client ID publicly** - It's already in your frontend code (this is OK, it's public)
2. **Never share your Client Secret** - Keep this in backend .env only
3. **Always use HTTPS** - Google requires HTTPS for production
4. **Whitelist only your domains** - Don't use wildcards

---

## 📊 Step-by-Step Screenshots Guide

### In Google Cloud Console:

1. **Find OAuth Credentials**
   - APIs & Services → Credentials
   - Look for "Web application" type
   - Click the pencil icon to edit

2. **Authorized JavaScript Origins Section**
   ```
   Add these URLs:
   - http://localhost:5173
   - https://your-vercel-url.vercel.app
   ```

3. **Authorized Redirect URIs Section**
   ```
   Add same URLs as above
   ```

4. **Click Save**

---

## ✅ Verification Checklist

- [ ] Added `http://localhost:5173` to Google Console
- [ ] Added your Vercel URL to Google Console
- [ ] Saved changes in Google Console
- [ ] Waited 5-10 minutes for propagation
- [ ] Cleared browser cache
- [ ] Tested on localhost - works ✅
- [ ] Tested on Vercel - works ✅

---

## 🎯 Your Specific URLs

**Add these to Google Cloud Console:**

```
Authorized JavaScript Origins:
- http://localhost:5173
- http://localhost:3000
- https://e-commerce-platform.vercel.app

Authorized Redirect URIs:
- http://localhost:5173
- http://localhost:3000
- https://e-commerce-platform.vercel.app
```

**Replace `e-commerce-platform.vercel.app` with your actual Vercel URL!**

---

## 🚀 After Fixing

1. Google login will work on both localhost and production
2. Users can register/login with Google
3. JWT token will be created
4. User data saved to MongoDB

---

## 📞 Still Having Issues?

1. Check Google Cloud Console logs
2. Check browser console (F12)
3. Check backend logs on Render
4. Verify all URLs are HTTPS (except localhost)
5. Make sure no typos in URLs

---

**Your Google OAuth should work perfectly after these changes!** 🎉
