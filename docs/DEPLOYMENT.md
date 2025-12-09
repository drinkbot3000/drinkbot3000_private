# Deployment Guide

Complete guide to deploying DrinkBot3000.

## Current Deployment Status

**Platform:** Netlify
**Status:** Live and Deployed
**Type:** Progressive Web App (PWA)
**Deployment:** Automatic via GitHub Actions

## Overview

DrinkBot3000 is a static React application that can be deployed to any static hosting platform. The production instance is currently deployed on Netlify.

## Deployment Options

### Option 1: Netlify (Recommended - Currently Used)

#### Automated Deployment (via Git)

**Current Setup:**
- Automatic deployment on push to `main` branch
- GitHub Actions workflow handles builds
- Deploy previews for pull requests

**Manual Setup for New Instance:**

1. **Connect Repository**
   ```bash
   # Push your code to GitHub
   git push origin main
   ```

2. **Create Netlify Site**
   - Go to [app.netlify.com](https://app.netlify.com)
   - Click "Add new site" > "Import an existing project"
   - Connect to GitHub
   - Select your repository

3. **Configure Build Settings**
   ```
   Build command: npm run build
   Publish directory: build
   Node version: 22
   ```

4. **Deploy**
   - Click "Deploy site"
   - Wait for build to complete
   - Site is live!

#### Drag & Drop Deployment

For quick deploys without Git:

```bash
# Build locally
npm run build

# Go to https://app.netlify.com/drop
# Drag the build/ folder
# Site is deployed instantly
```

#### Netlify Configuration

The `netlify.toml` file includes:
- Build settings
- Redirect rules for SPA routing
- Security headers (CSP, XSS protection)
- Cache control
- Node.js version specification

### Option 2: Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow prompts
# Production: vercel --prod
```

### Option 3: GitHub Pages

```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json
"homepage": "https://yourusername.github.io/drinkbot3000",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}

# Deploy
npm run deploy
```

### Option 4: AWS S3 + CloudFront

```bash
# Build
npm run build

# Sync to S3
aws s3 sync build/ s3://your-bucket-name

# Configure CloudFront for SPA routing
# Add security headers
```

### Option 5: Docker

```dockerfile
# Dockerfile
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```bash
# Build and run
docker build -t drinkbot3000 .
docker run -p 80:80 drinkbot3000
```

## Environment Variables

Create `.env` file for local development:

```bash
# API Keys (if using external services)
REACT_APP_STRIPE_KEY=your_stripe_key
REACT_APP_GEO_API_KEY=your_geo_key

# Environment
REACT_APP_ENV=production
```

**Note:** Current deployment uses Stripe Payment Links (no keys needed in frontend)

## Post-Deployment Checklist

### Required Verifications

- [ ] **App loads** at your deployment URL
- [ ] **All routes work** (test navigation)
- [ ] **Legal documents accessible**
  - `/privacy.html`
  - `/terms.html`
  - `/refund.html`
- [ ] **PWA features work**
  - Service worker registers
  - Offline mode works
  - Install prompt appears
- [ ] **Mobile responsive** (test on phone)
- [ ] **Security headers** configured
  - Test at [securityheaders.com](https://securityheaders.com)
- [ ] **HTTPS enabled** (automatic on most platforms)

### Optional Enhancements

- [ ] **Custom domain** configured
- [ ] **DNS records** updated
- [ ] **SSL certificate** verified
- [ ] **Analytics** integrated
- [ ] **Error tracking** (Sentry) configured
- [ ] **Performance monitoring** enabled

## Custom Domain Setup

### Netlify

1. Go to Site Settings > Domain Management
2. Click "Add custom domain"
3. Enter your domain
4. Update DNS records:
   ```
   Type: CNAME
   Name: www
   Value: your-site.netlify.app
   ```
5. Wait for DNS propagation (up to 48 hours)
6. SSL certificate auto-generated

### Vercel

```bash
# Add domain via CLI
vercel domains add yourdomain.com

# Or via dashboard
# Settings > Domains > Add
```

## Monitoring & Maintenance

### Health Checks

```bash
# Check if site is up
curl -I https://your-site.netlify.app

# Check specific route
curl https://your-site.netlify.app/privacy.html
```

### Build Status

- Netlify: Check deployment tab in dashboard
- GitHub Actions: Check Actions tab in repository

### Error Monitoring

Consider adding:
- **Sentry** for error tracking
- **LogRocket** for session replay
- **Google Analytics** for usage metrics

## CI/CD Pipeline

Current setup uses GitHub Actions with 7 workflows:

### PR Checks
- Runs on: Pull requests
- Tests: Build, lint, security audit
- Deploys: Preview deployment

### CI Pipeline
- Runs on: Push to `main`
- Tests: Full test suite, coverage
- Monitoring: Lighthouse, performance

### Deploy
- Runs on: Push to `main`
- Builds: Production build
- Deploys: To Netlify
- Notifies: Deployment status

See [DEVELOPMENT.md](DEVELOPMENT.md) for CI/CD details.

## Rollback

### Netlify

1. Go to Deploys tab
2. Find previous deploy
3. Click "Publish deploy"

### Manual Rollback

```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Or checkout specific commit
git checkout abc123
npm run build
# Redeploy
```

## Security Considerations

### Headers

Configured in `netlify.toml`:
- Content-Security-Policy
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Strict-Transport-Security

### Data Privacy

- All user data stored locally (localStorage)
- No server-side data collection
- No cookies (except session)
- GDPR compliant

### API Security

- Stripe: Payment Links only (no API keys in frontend)
- Geolocation: API key can be in frontend (read-only)

## Troubleshooting

See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for common deployment issues.

### Build Fails

```bash
# Check Node version
node --version  # Need 18+

# Clear cache
rm -rf node_modules package-lock.json
npm install

# Try build again
npm run build
```

### Blank Page After Deploy

1. Check browser console for errors
2. Verify `homepage` in package.json
3. Check routing configuration
4. Verify all assets loaded (Network tab)

### 404 on Refresh

**Problem:** SPA routing not configured

**Solution:** Add redirects
```
# Netlify _redirects file
/*    /index.html   200
```

### Slow Load Times

- Enable gzip/brotli compression
- Add CDN (CloudFront, Cloudflare)
- Optimize images
- Enable caching headers
- Code splitting (lazy loading)

## Performance Optimization

### Current Metrics

- Lighthouse Score: 90+ (Mobile), 95+ (Desktop)
- Bundle Size: ~1MB (can be optimized)
- Load Time: <3s on 3G

### Improvements

See [MODERNIZATION_STRATEGY.md](MODERNIZATION_STRATEGY.md) for:
- Bundle size reduction (40% target)
- Code splitting implementation
- Image optimization
- Caching strategies

## Costs

### Free Tier Limits

**Netlify (Current):**
- 100 GB bandwidth/month
- 300 build minutes/month
- Unlimited sites
- Custom domains
- SSL included

**Vercel:**
- 100 GB bandwidth/month
- 6,000 build minutes/month
- Unlimited deployments

**GitHub Pages:**
- 100 GB bandwidth/month
- 100 GB storage
- Free for public repos

## Support

- **Netlify Docs:** https://docs.netlify.com
- **Project Issues:** https://github.com/drinkbot3000/drinkbot3000_private/issues
- **Email:** drinkbot3000@gmail.com

## Next Steps

After successful deployment:

1. Configure custom domain (optional)
2. Setup monitoring and analytics
3. Enable error tracking (Sentry)
4. Configure backups (Git + Netlify snapshots)
5. Document your deployment URLs
6. Test all features in production
7. Monitor performance and errors

## Resources

- [Netlify Documentation](https://docs.netlify.com)
- [Vercel Documentation](https://vercel.com/docs)
- [AWS S3 Static Website Hosting](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)
- [GitHub Pages](https://pages.github.com)
