# Troubleshooting Guide

Solutions to common issues with DrinkBot3000.

## Quick Fixes

### Application Won't Start

**Error:** `npm start` fails

**Solutions:**
```bash
# Check Node version (need 18+)
node --version

# Clear and reinstall
rm -rf node_modules package-lock.json
npm install

# Start again
npm start
```

### Port Already in Use

**Error:** `Port 3000 is already in use`

**Solutions:**
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
PORT=3001 npm start

# Find and kill process manually (Mac/Linux)
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Build Fails

**Error:** Build errors or crashes

**Solutions:**
```bash
# Clear build cache
rm -rf build node_modules package-lock.json

# Reinstall dependencies
npm install

# Try build
npm run build

# Check for errors in console
# Fix any linting or compilation errors
```

## Development Issues

### Hot Reload Not Working

**Problem:** Changes don't appear in browser

**Solutions:**
1. Check browser console for errors
2. Hard refresh: `Ctrl + Shift + R` (Windows/Linux) or `Cmd + Shift + R` (Mac)
3. Restart dev server
4. Clear browser cache
5. Check file is saved

### Linting Errors

**Error:** ESLint shows errors

**Solutions:**
```bash
# Auto-fix issues
npm run lint:fix

# Check specific file
npx eslint src/path/to/file.js

# Disable rule temporarily (use sparingly)
// eslint-disable-next-line rule-name
```

### Test Failures

**Error:** Tests fail or won't run

**Solutions:**
```bash
# Clear test cache
npm test -- --clearCache

# Update snapshots
npm test -- -u

# Run specific test
npm test -- ComponentName

# Debug test
node --inspect-brk node_modules/.bin/jest --runInBand
```

### Import Errors

**Error:** `Module not found` or import issues

**Solutions:**
1. Check file path is correct
2. Check file extension (.js vs .jsx)
3. Check import name matches export
4. Restart dev server
5. Check node_modules installed

## Deployment Issues

### Blank Page After Deploy

**Problem:** Site loads but shows blank page

**Solutions:**
1. **Check browser console** for errors
2. **Check homepage in package.json**
   ```json
   "homepage": "."
   ```
3. **Check build output**
   ```bash
   npm run build
   ls -la build/
   ```
4. **Check routing configuration** (SPA redirects)
5. **Verify static files** copied to build

### 404 Errors on Page Refresh

**Problem:** Direct URLs return 404

**Solution:** Configure SPA redirects

**Netlify** (`public/_redirects`):
```
/*    /index.html   200
```

**Netlify** (`netlify.toml`):
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Vercel** (`vercel.json`):
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Legal Documents Return 404

**Problem:** `/privacy.html` returns 404

**Solutions:**
1. Check files exist in `public/` folder
2. Verify files copied to build:
   ```bash
   ls build/*.html
   ```
3. Check file names (case-sensitive)
4. Rebuild:
   ```bash
   npm run build
   ```

### Deployment Build Fails

**Problem:** Build fails on hosting platform

**Solutions:**
1. **Check Node version**
   - Netlify: Set in `netlify.toml`
   ```toml
   [build.environment]
     NODE_VERSION = "22"
   ```
   - Vercel: Set in dashboard or `vercel.json`

2. **Check build logs** for specific errors

3. **Test build locally**
   ```bash
   npm run build
   ```

4. **Check environment variables** are set

### Slow Load Times

**Problem:** Site loads slowly

**Solutions:**
1. **Enable compression** (Brotli/Gzip)
   - Auto-enabled on Netlify/Vercel

2. **Add caching headers**
   ```toml
   [[headers]]
     for = "/static/*"
     [headers.values]
       Cache-Control = "public, max-age=31536000, immutable"
   ```

3. **Optimize images**
   - Compress images
   - Use WebP format
   - Lazy load images

4. **Check bundle size**
   ```bash
   npm run build
   npx source-map-explorer build/static/js/*.js
   ```

5. **Add CDN** (Cloudflare, CloudFront)

## Runtime Issues

### BAC Calculation Incorrect

**Problem:** BAC doesn't match expected value

**Checks:**
1. Verify input data (weight, gender, drinks)
2. Check drink standard drinks value
3. Verify time calculations
4. Check for console errors

**Debug:**
```javascript
// Add logging in bacCalculation.service.js
console.log('Calculating BAC with:', { weight, gender, drinks });
```

### Data Not Persisting

**Problem:** Data lost on refresh

**Solutions:**
1. **Check localStorage** available
   ```javascript
   console.log('localStorage available:', typeof Storage !== 'undefined');
   ```

2. **Check browser settings**
   - Private mode disables localStorage
   - Browser extensions may block

3. **Check storage quota**
   ```javascript
   navigator.storage.estimate().then(estimate => {
     console.log('Storage:', estimate);
   });
   ```

4. **Verify storage.service.js** working
   ```javascript
   import { getItem, setItem } from './services/storage.service';
   setItem('test', 'value');
   console.log(getItem('test')); // Should log 'value'
   ```

### Service Worker Issues

**Problem:** Service worker not updating

**Solutions:**
1. **Clear service worker**
   - Chrome DevTools > Application > Service Workers
   - Click "Unregister"

2. **Hard refresh**
   - `Ctrl + Shift + R` (Windows/Linux)
   - `Cmd + Shift + R` (Mac)

3. **Clear cache**
   - Chrome DevTools > Application > Clear storage

4. **Check service worker registration**
   ```javascript
   navigator.serviceWorker.getRegistrations().then(registrations => {
     console.log('Registered workers:', registrations);
   });
   ```

### PWA Not Installing

**Problem:** Install prompt doesn't appear

**Requirements:**
1. HTTPS enabled (automatic on most hosts)
2. Valid manifest.json
3. Service worker registered
4. Meets PWA criteria

**Check:**
```bash
# Lighthouse PWA audit
npm run build
npx serve build
# Open Chrome DevTools > Lighthouse > PWA
```

## Security Issues

### CSP Violations

**Problem:** Content blocked by CSP

**Solution:** Update `netlify.toml` CSP headers
```toml
Content-Security-Policy = "default-src 'self'; script-src 'self' https://trusted-domain.com"
```

### API Key Exposed

**Problem:** API key visible in client code

**Solutions:**
1. **Use environment variables**
   ```javascript
   const key = process.env.REACT_APP_API_KEY;
   ```

2. **Don't commit .env files**
   - Add to `.gitignore`

3. **Rotate exposed keys immediately**

4. **Use backend proxy** for sensitive APIs

## Database/Storage Issues

### localStorage Full

**Error:** `QuotaExceededError`

**Solutions:**
```javascript
// Clear old data
localStorage.clear();

// Implement data cleanup
const clearOldData = () => {
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (/* old data logic */) {
      localStorage.removeItem(key);
    }
  });
};
```

## Performance Issues

### Slow Rendering

**Problem:** UI feels sluggish

**Solutions:**
1. **Check for unnecessary re-renders**
   ```javascript
   // Use React DevTools Profiler
   // Wrap expensive components in React.memo
   export const ExpensiveComponent = React.memo(Component);
   ```

2. **Optimize calculations**
   ```javascript
   // Use useMemo for expensive operations
   const value = useMemo(() => expensiveCalc(data), [data]);
   ```

3. **Check bundle size**
   ```bash
   npm run build
   npx source-map-explorer build/static/js/*.js
   ```

### Memory Leaks

**Problem:** Memory usage grows over time

**Solutions:**
1. **Cleanup effects**
   ```javascript
   useEffect(() => {
     const interval = setInterval(() => {}, 1000);
     return () => clearInterval(interval); // Cleanup
   }, []);
   ```

2. **Remove event listeners**
   ```javascript
   useEffect(() => {
     const handler = () => {};
     window.addEventListener('resize', handler);
     return () => window.removeEventListener('resize', handler);
   }, []);
   ```

## Browser Compatibility

### Feature Not Working in Safari

**Problem:** Works in Chrome but not Safari

**Solutions:**
1. **Check browser support**
   - Use [caniuse.com](https://caniuse.com)

2. **Add polyfills**
   ```bash
   npm install core-js
   ```

3. **Check for vendor prefixes**
   ```css
   -webkit-transform: ...;
   transform: ...;
   ```

### Mobile Issues

**Problem:** Issues on mobile devices

**Solutions:**
1. **Test viewport**
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1">
   ```

2. **Check touch events**
   ```javascript
   // Use onClick, not onMouseClick
   <button onClick={handleClick}>Click</button>
   ```

3. **Test on real devices**
   - iOS Safari
   - Android Chrome
   - Various screen sizes

## CI/CD Issues

### GitHub Actions Failing

**Problem:** Workflows fail

**Solutions:**
1. **Check logs** in Actions tab
2. **Run locally**
   ```bash
   npm ci
   npm run lint
   npm test
   npm run build
   ```
3. **Check secrets** configured
4. **Verify Node version** in workflow

### Netlify Build Failing

**Problem:** Deployment fails

**Solutions:**
1. **Check build logs** in Netlify dashboard
2. **Verify Node version** in `netlify.toml`
3. **Check build command** correct
4. **Test locally**
   ```bash
   npm run build
   ```

## Getting More Help

### Before Asking for Help

1. **Search existing issues** on GitHub
2. **Check documentation**
   - [README.md](../README.md)
   - [DEPLOYMENT.md](DEPLOYMENT.md)
   - [DEVELOPMENT.md](DEVELOPMENT.md)
3. **Try debugging**
   - Check browser console
   - Check network tab
   - Add console.log statements

### How to Report Issues

Create a GitHub issue with:

```markdown
## Description
[Clear description of the problem]

## Steps to Reproduce
1. Go to...
2. Click on...
3. See error

## Expected Behavior
[What should happen]

## Actual Behavior
[What actually happens]

## Environment
- OS: [e.g., Windows 11, macOS 14]
- Node version: [run `node --version`]
- npm version: [run `npm --version`]
- Browser: [e.g., Chrome 120, Safari 17]

## Error Messages
```
[Paste error messages and stack traces]
```

## Screenshots
[If applicable]

## Additional Context
[Any other relevant information]
```

### Contact

- **GitHub Issues:** [Create Issue](https://github.com/drinkbot3000/drinkbot3000_private/issues)
- **Email:** drinkbot3000@gmail.com
- **Response Time:** Within 48 hours

## Common Error Messages

### EADDRINUSE

**Error:** `EADDRINUSE: address already in use`

**Solution:** Port is already in use
```bash
npx kill-port 3000
```

### ENOENT

**Error:** `ENOENT: no such file or directory`

**Solution:** File or directory doesn't exist
- Check file path
- Check file was created
- Check working directory

### MODULE_NOT_FOUND

**Error:** `Cannot find module`

**Solution:**
```bash
npm install
# Or install specific module
npm install <module-name>
```

### CORS Error

**Error:** `Access to fetch...has been blocked by CORS policy`

**Solution:**
- Configure API server CORS headers
- Use proxy in development
- Check API endpoint URL

### QuotaExceededError

**Error:** `QuotaExceededError: The quota has been exceeded`

**Solution:** localStorage full
```javascript
localStorage.clear();
```

## Still Stuck?

If you can't find a solution:

1. **Create detailed issue** on GitHub
2. **Include all debugging info**
3. **Wait for response** (usually within 48 hours)
4. **Try workarounds** while waiting

## Quick Reference

### Check Installation
```bash
node --version    # Should be 18+
npm --version     # Should be 8+
git --version     # Any recent version
```

### Common Commands
```bash
npm install           # Install dependencies
npm start             # Start dev server
npm test              # Run tests
npm run build         # Build for production
npm run lint          # Check code
npm run format        # Format code
```

### Clear Everything
```bash
# Nuclear option - start fresh
rm -rf node_modules package-lock.json build
npm install
npm start
```

---

**Still having issues? We're here to help!**

Create an issue: https://github.com/drinkbot3000/drinkbot3000_private/issues
