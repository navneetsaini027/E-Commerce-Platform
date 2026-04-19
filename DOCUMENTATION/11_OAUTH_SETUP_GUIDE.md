# Google & Facebook OAuth Setup Guide

## 🔐 Google OAuth Setup

### Step 1: Google Cloud Console Setup
1. **Google Cloud Console** pe jao: https://console.cloud.google.com/
2. **New Project** banao ya existing select karo
3. Left sidebar me **"APIs & Services"** > **"Credentials"** pe click karo
4. **"+ CREATE CREDENTIALS"** > **"OAuth client ID"** select karo
5. **Application type**: "Web application" select karo
6. **Name**: "Aashirwad Fashion" (kuch bhi naam de sakte ho)
7. **Authorized JavaScript origins** me add karo:
   - `http://localhost:5173` (development)
   - `http://localhost:3000` (if needed)
   - Production URL (jab deploy karo)
8. **Authorized redirect URIs** me add karo:
   - `http://localhost:5000/api/auth/google/callback`
   - Production backend URL (jab deploy karo)
9. **CREATE** button click karo
10. **Client ID** aur **Client Secret** copy karke save kar lo

### Step 2: Backend Setup
1. Install required packages:
```bash
cd aashirwad-fashion/backend
npm install passport passport-google-oauth20 express-session
```

2. `.env` file me add karo:
```env
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
CLIENT_URL=http://localhost:5173
```

### Step 3: Backend Code Update
File: `aashirwad-fashion/backend/server.js` me add karo:
```javascript
const passport = require('passport');
const session = require('express-session');

// Session middleware
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());
```

### Step 4: Passport Configuration
File: `aashirwad-fashion/backend/config/passport.js` (new file banao):
```javascript
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

module.exports = function(passport) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user exists
      let user = await User.findOne({ email: profile.emails[0].value });
      
      if (user) {
        return done(null, user);
      }
      
      // Create new user
      user = await User.create({
        name: profile.displayName,
        email: profile.emails[0].value,
        password: 'google-oauth-' + profile.id, // Random password
        googleId: profile.id,
      });
      
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  }));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};
```

### Step 5: Auth Routes Update
File: `aashirwad-fashion/backend/routes/auth.js` me add karo:
```javascript
const passport = require('passport');

// Google OAuth
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user._id, name: req.user.name, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );
    
    // Redirect to frontend with token
    res.redirect(`${process.env.CLIENT_URL}?token=${token}&user=${JSON.stringify({
      id: req.user._id,
      name: req.user.name,
      email: req.user.email
    })}`);
  }
);
```

---

## 📘 Facebook OAuth Setup

### Step 1: Facebook Developers Setup
1. **Facebook Developers** pe jao: https://developers.facebook.com/
2. **My Apps** > **Create App** click karo
3. **App Type**: "Consumer" select karo
4. **App Name**: "Aashirwad Fashion"
5. **App Contact Email**: Your email
6. Left sidebar me **Settings** > **Basic** pe jao
7. **App ID** aur **App Secret** copy kar lo
8. **Add Platform** > **Website** select karo
9. **Site URL**: `http://localhost:5173` add karo
10. Left sidebar me **Facebook Login** > **Settings** pe jao
11. **Valid OAuth Redirect URIs** me add karo:
    - `http://localhost:5000/api/auth/facebook/callback`

### Step 2: Backend Setup
1. Install package:
```bash
npm install passport-facebook
```

2. `.env` file me add karo:
```env
FACEBOOK_APP_ID=your_facebook_app_id_here
FACEBOOK_APP_SECRET=your_facebook_app_secret_here
```

### Step 3: Passport Configuration
File: `aashirwad-fashion/backend/config/passport.js` me add karo:
```javascript
const FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: '/api/auth/facebook/callback',
  profileFields: ['id', 'displayName', 'email']
},
async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ email: profile.emails[0].value });
    
    if (user) {
      return done(null, user);
    }
    
    user = await User.create({
      name: profile.displayName,
      email: profile.emails[0].value,
      password: 'facebook-oauth-' + profile.id,
      facebookId: profile.id,
    });
    
    done(null, user);
  } catch (err) {
    done(err, null);
  }
}));
```

### Step 4: Auth Routes
File: `aashirwad-fashion/backend/routes/auth.js` me add karo:
```javascript
// Facebook OAuth
router.get('/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
);

router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user._id, name: req.user.name, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );
    
    res.redirect(`${process.env.CLIENT_URL}?token=${token}&user=${JSON.stringify({
      id: req.user._id,
      name: req.user.name,
      email: req.user.email
    })}`);
  }
);
```

---

## 🎨 Frontend Update

File: `aashirwad-fashion/frontend/src/components/AuthModal.jsx` me update karo:

```javascript
const handleSocialLogin = (provider) => {
  // Redirect to backend OAuth route
  const backendUrl = 'http://localhost:5000';
  window.location.href = `${backendUrl}/api/auth/${provider.toLowerCase()}`;
};
```

File: `aashirwad-fashion/frontend/src/App.jsx` me add karo (useEffect):
```javascript
useEffect(() => {
  // Check for OAuth token in URL
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  const userStr = urlParams.get('user');
  
  if (token && userStr) {
    const user = JSON.parse(userStr);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    
    // Clean URL
    window.history.replaceState({}, document.title, window.location.pathname);
  }
}, []);
```

---

## 🚀 Quick Start (Without OAuth - Current Setup)

Abhi ke liye **Email/Password authentication** already kaam kar raha hai:

1. ✅ User icon click karo
2. ✅ "Sign Up" link click karo
3. ✅ Name, Email, Password enter karo
4. ✅ "Create Account" click karo
5. ✅ Login ho jayega!

**Google/Facebook buttons** abhi alert show karte hain. Production me enable karne ke liye upar ke steps follow karo.

---

## 📝 Summary

**Current Status:**
- ✅ Email/Password authentication: **WORKING**
- ⏳ Google OAuth: **Ready to enable** (follow steps above)
- ⏳ Facebook OAuth: **Ready to enable** (follow steps above)

**To Enable OAuth:**
1. Google/Facebook developer accounts banao
2. OAuth credentials generate karo
3. `.env` me credentials add karo
4. Backend packages install karo (`passport`, etc.)
5. Code uncomment/update karo

**Estimated Time:** 30-45 minutes for complete OAuth setup

---

## 🔗 Useful Links

- Google Cloud Console: https://console.cloud.google.com/
- Facebook Developers: https://developers.facebook.com/
- Passport.js Docs: http://www.passportjs.org/
- Google OAuth Guide: https://developers.google.com/identity/protocols/oauth2
- Facebook Login Guide: https://developers.facebook.com/docs/facebook-login/
