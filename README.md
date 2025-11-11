# 🤖 DrinkBot3000 - Netlify Deployment Guide

**Professional, production-ready BAC tracker with modern best practices applied.**

## 📚 Documentation Quick Links

- **[NETLIFY_SETUP.md](NETLIFY_SETUP.md)** - Complete GitHub + Netlify integration guide
- **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** - Pre/post deployment verification checklist
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Simple drag-and-drop deployment guide
- **[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)** - Full codebase documentation
- **[START_HERE.md](START_HERE.md)** - Getting started guide
- **[PUBLIC_HEALTH_REQUIREMENTS.md](PUBLIC_HEALTH_REQUIREMENTS.md)** - Why DrinkBot3000 doesn't need IRB/HIPAA compliance

## 📦 What's Included

This package contains everything you need to deploy DrinkBot3000 to Netlify:

- ✅ Complete React app with all features
- ✅ Legal documents (privacy, terms, refund policies)
- ✅ 4 comprehensive safety screens
- ✅ Receipt & refund system
- ✅ Age verification
- ✅ USA-only geographic restrictions
- ✅ Modern build configuration (Node.js 22, optimized headers)
- ✅ SEO ready (sitemap.xml, robots.txt)
- ✅ PWA support (offline functionality)

## 🚀 Quick Deploy to Netlify (5 minutes)

### Option 1: Netlify Drop (Easiest - No Git Required)

1. **Build the project:**
   ```bash
   npm install
   npm run build
   ```

2. **Go to Netlify Drop:**
   - Visit: https://app.netlify.com/drop
   - Drag and drop the entire `build` folder
   - Done! Your site is live!

### Option 2: Deploy via Git (Recommended for Updates)

1. **Create a GitHub repository:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - DrinkBot3000"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/drinkbot3000.git
   git push -u origin main
   ```

2. **Connect to Netlify:**
   - Go to https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub and select your repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `build`
   - Click "Deploy site"

3. **Wait for deployment:**
   - First deployment takes 2-3 minutes
   - You'll get a live URL like: `https://random-name-12345.netlify.app`

### Option 3: Netlify CLI (For Developers)

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify:**
   ```bash
   netlify login
   ```

3. **Deploy:**
   ```bash
   npm run build
   netlify deploy --prod
   ```

## 🔧 Configuration

### Custom Domain (Optional)

1. Go to your Netlify site settings
2. Domain management → Add custom domain
3. Follow DNS instructions
4. Enable HTTPS (automatic via Let's Encrypt)

### Environment Variables (If Needed Later)

If you add Stripe or other services:
1. Site settings → Build & deploy → Environment
2. Add variables (e.g., REACT_APP_STRIPE_KEY)
3. Redeploy

## 📁 Project Structure

```
drinkbot3000-netlify/
├── public/
│   ├── index.html          # Main HTML file
│   ├── privacy.html        # Privacy policy
│   ├── terms.html          # Terms of service
│   └── refund.html         # Refund policy
├── src/
│   ├── App.js              # Main React app (BACTracker)
│   ├── index.js            # React bootstrap
│   └── index.css           # Global styles
├── package.json            # Dependencies
├── netlify.toml            # Netlify configuration
└── README.md               # This file
```

## 🌐 Legal Document URLs

After deployment, your legal documents will be accessible at:
- Privacy: `https://your-site.netlify.app/privacy.html`
- Terms: `https://your-site.netlify.app/terms.html`
- Refund: `https://your-site.netlify.app/refund.html`

**Important:** Update your app store submissions with these URLs!

## ⚙️ Build Settings

The project uses Create React App with these settings:

- **Node Version:** 22 (specified in `.nvmrc`)
- **Build Command:** `npm run build`
- **Publish Directory:** `build`
- **Build Environment:** CI=false (warnings don't fail build)
- **Dependencies:** Automatically installed from package.json
- **Security Headers:** Configured in `_headers` file
- **Redirects:** SPA routing configured in `netlify.toml`

## 🔒 Security Headers

Netlify.toml includes security headers:
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin

## 📱 Mobile App Deployment

This is the **web version**. For mobile apps:

1. Use this as your legal docs host
2. Convert to mobile with Capacitor
3. Reference these URLs in App Store/Play Store submissions
4. See REMAINING_TASKS.md for full mobile conversion guide

## 🐛 Troubleshooting

### Build Fails

**Error:** "Module not found"
- **Fix:** Run `npm install` to install dependencies

**Error:** "Build exceeded memory limit"
- **Fix:** In Netlify settings, increase Node memory:
  ```
  Environment → NODE_OPTIONS = --max-old-space-size=4096
  ```

### Blank Page After Deployment

**Problem:** App shows blank white screen
- **Fix:** Check browser console for errors
- **Fix:** Ensure `homepage` in package.json is correct (or remove it)

### Legal Docs 404

**Problem:** privacy.html returns 404
- **Fix:** Ensure files are in `public/` folder before build
- **Fix:** Check netlify.toml redirects are configured

## 📊 Analytics (Optional)

To add analytics:

1. **Netlify Analytics** (Paid):
   - Site settings → Analytics → Enable

2. **Google Analytics** (Free):
   - Add tracking code to `public/index.html`
   - Update Privacy Policy

3. **Plausible** (Privacy-friendly):
   - Add script to `public/index.html`
   - No cookies, GDPR compliant

## 🔄 Continuous Deployment

With Git option, every push auto-deploys:

```bash
# Make changes
git add .
git commit -m "Updated safety warnings"
git push

# Netlify auto-builds and deploys
```

## 💰 Costs

### Netlify Free Tier Includes:
- ✅ 100 GB bandwidth/month
- ✅ 300 build minutes/month
- ✅ Automatic HTTPS
- ✅ Continuous deployment
- ✅ Custom domain support
- ✅ Form handling (100 submissions/month)

**Your app will likely stay within free tier!**

### Paid Features (Optional):
- Analytics: $9/month
- Functions: $25/month (not needed for this app)
- More bandwidth: $0.20/GB after 100GB

## 🎉 Post-Deployment Checklist

After your site is live:

- [ ] Test all features work
- [ ] Test all 4 safety screens display
- [ ] Verify privacy.html loads
- [ ] Verify terms.html loads
- [ ] Verify refund.html loads
- [ ] Test age verification
- [ ] Test BAC calculations
- [ ] Test on mobile devices
- [ ] Test on different browsers
- [ ] Copy live URLs for app store submissions

## 📝 Update Legal Documents

To update legal docs after deployment:

1. Edit files in `public/` folder
2. Commit and push (if using Git)
   ```bash
   git add public/privacy.html
   git commit -m "Updated privacy policy"
   git push
   ```
3. Or re-deploy via Netlify Drop

## 🌍 International Compliance

The app includes country restrictions built-in:
- 16-17 prohibited countries
- Age requirements by country
- All documented in legal files

**No additional configuration needed!**

## 🆘 Support

Having issues? Check these resources:

1. **Netlify Docs:** https://docs.netlify.com
2. **React Docs:** https://react.dev
3. **Netlify Community:** https://answers.netlify.com
4. **GitHub Issues:** (Create issues in your repo)

## 📧 Contact

For DrinkBot3000 questions:
- Email: drinkbot3000@gmail.com

For Netlify questions:
- Support: https://www.netlify.com/support

---

## 🚀 Quick Start Commands

```bash
# Install dependencies
npm install

# Run locally (for testing)
npm start
# Opens http://localhost:3000

# Build for production
npm run build

# Deploy to Netlify (with CLI)
netlify deploy --prod
```

---

## 📄 License

MIT License - See package.json

---

**Built with ❤️ and a commitment to user safety.**

🤖 DrinkBot3000 - Drink Responsibly. Never Drink and Drive. 🤖
