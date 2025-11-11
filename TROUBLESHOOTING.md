# 🔧 Troubleshooting Guide

## "Can't Load React Code" Error

### Symptoms
- Blank page
- Loading spinner forever
- Error in console about loading JS/CSS files
- Works sometimes, fails other times

---

## Quick Fixes (Try These First)

### 1. Clear Service Worker Cache

**In Browser (Chrome/Edge):**
1. Press `F12` to open DevTools
2. Go to "Application" tab
3. Click "Service Workers" (left sidebar)
4. Click "Unregister" for drinkbot3000
5. Click "Clear storage" (left sidebar)
6. Check all boxes and click "Clear site data"
7. Reload page (`Ctrl+Shift+R` or `Cmd+Shift+R`)

**In Firefox:**
1. Press `F12` to open DevTools
2. Go to "Storage" tab
3. Right-click "Service Workers" → Clear all
4. Right-click "Cache Storage" → Clear all
5. Reload page

### 2. Hard Refresh (Force Reload)

- **Windows/Linux:** `Ctrl + Shift + R`
- **Mac:** `Cmd + Shift + R`
- **Or:** `Ctrl+F5` (Windows)

### 3. Disable Service Worker Temporarily

Add this to your browser console (F12):
```javascript
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(reg => reg.unregister())
})
```

Then reload the page.

---

## Specific Error Messages

### "Failed to load resource: net::ERR_FAILED"

**Cause:** Asset path mismatch or CORS issue

**Fix:**
1. Check browser console for exact file path
2. Verify file exists in build folder
3. Check Netlify deploy log for build errors
4. Ensure `homepage: "."` in package.json

### "Uncaught SyntaxError: Unexpected token '<'"

**Cause:** HTML being served instead of JavaScript (usually 404)

**Fix:**
1. Asset paths are wrong
2. Rebuild: `npm run build`
3. Check `build/index.html` has correct paths
4. Should be: `./static/js/main.*.js` (relative path)

### "Loading chunk failed"

**Cause:** Service worker cache interference or network issue

**Fix:**
1. Clear service worker cache (see above)
2. Rebuild: `rm -rf build && npm run build`
3. Check network tab in DevTools for failed requests

### Blank White Screen (No Error)

**Cause:** JavaScript error breaking React

**Fix:**
1. Open console (F12) - look for red errors
2. Check if any safety warnings from extensions/browser
3. Try incognito/private mode
4. Disable browser extensions

---

## Local Development Issues

### "npm start" shows blank page

**Check:**
```bash
# Verify dependencies installed
npm install

# Clear cache and restart
rm -rf node_modules
rm -rf build
npm install
npm start
```

### Port 3000 already in use

```bash
# Kill process on port 3000
# Mac/Linux:
lsof -ti:3000 | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F

# Or use different port
PORT=3001 npm start
```

---

## Netlify Deployment Issues

### Build succeeds but site blank

**Check Console (F12) for:**
- 404 errors on JS/CSS files
- MIME type errors
- Service worker errors

**Fix:**
1. Verify `netlify.toml` publish directory: `build`
2. Verify build command: `npm run build`
3. Check deploy logs for warnings
4. Ensure Node version 22 (we configured this)

### Assets return 404

**Check asset paths in deployed site:**
```
View Source → Look for:
<script src="./static/js/main.*.js">
<link href="./static/css/main.*.css">
```

Should be **relative** paths (starting with `./`) not absolute (`/static/...`)

**If paths are wrong:**
1. Verify `package.json` has `"homepage": "."`
2. Rebuild and redeploy

### Service Worker Registration Fails

**Check console for:**
```
Service Worker registration failed: [error]
```

**Common causes:**
- Not HTTPS (Netlify handles this automatically)
- Service worker scope issues
- Browser blocking in private mode

**Quick fix:**
Comment out service worker registration temporarily:
```javascript
// In src/index.js - temporarily disable
/*
if ('serviceWorker' in navigator) {
  // ... service worker code
}
*/
```

---

## Browser-Specific Issues

### Safari (Desktop/iOS)

**Issue:** Service worker caching too aggressively

**Fix:**
1. Safari → Develop → Empty Caches
2. Reload page
3. Check Settings → Privacy → Block All Cookies (should be OFF)

### Firefox

**Issue:** Enhanced Tracking Protection blocks storage

**Fix:**
1. Click shield icon in address bar
2. Disable "Enhanced Tracking Protection" for this site
3. Reload page

### Chrome

**Issue:** Extensions blocking JavaScript

**Fix:**
1. Try incognito mode
2. Disable extensions one by one
3. Check Console for blocked requests

---

## Network Issues

### Slow/Intermittent Connection

**Symptoms:**
- Works sometimes, fails others
- Very slow loading

**Fix:**
1. Check Network tab (F12) for slow requests
2. Verify CDN is working (Netlify provides this)
3. Try different network
4. Check Netlify status: https://www.netlifystatus.com

### Behind Corporate Firewall/Proxy

**Issue:** Company blocks certain resources

**Fix:**
1. Check with IT department
2. Try on personal device/network
3. Check proxy settings in browser

---

## Console Commands for Debugging

### Check if React loaded
```javascript
console.log(window.React);
// Should show React object, not undefined
```

### Check service worker status
```javascript
navigator.serviceWorker.getRegistrations().then(regs => {
  console.log('Service Workers:', regs);
});
```

### Check cached resources
```javascript
caches.keys().then(names => {
  console.log('Cache names:', names);
  names.forEach(name => {
    caches.open(name).then(cache => {
      cache.keys().then(keys => {
        console.log(`Cache ${name}:`, keys.map(k => k.url));
      });
    });
  });
});
```

### Force clear everything
```javascript
// Clear all caches
caches.keys().then(names => {
  names.forEach(name => caches.delete(name));
});

// Clear local storage
localStorage.clear();

// Unregister service workers
navigator.serviceWorker.getRegistrations().then(regs => {
  regs.forEach(reg => reg.unregister());
});

// Reload
location.reload();
```

---

## Still Not Working?

### Gather Debug Info

1. **Check browser console (F12)** - Copy exact error messages
2. **Check Network tab** - Look for failed requests (red)
3. **Check Application tab** - Service Worker status
4. **Check build folder:**
   ```bash
   ls -la build/
   ls -la build/static/js/
   ls -la build/static/css/
   cat build/index.html | grep -E "script|link"
   ```

### Create Clean Build

```bash
# Complete clean build
rm -rf node_modules
rm -rf build
rm package-lock.json
npm install
npm run build

# Test locally
npx serve -s build
# Open http://localhost:3000
```

### Test Without Service Worker

Create `public/index.html` temporarily without SW:

Comment out this section in `src/index.js`:
```javascript
// Service Worker Registration for PWA
// if ('serviceWorker' in navigator) { ... }
```

Rebuild and test.

---

## Prevention Tips

1. **Always hard refresh** after deploying (`Ctrl+Shift+R`)
2. **Clear service worker** between major updates
3. **Test in incognito** to avoid cache issues
4. **Check console** before reporting bugs
5. **Use multiple browsers** for testing

---

## Common "False Alarms"

### It's Working Fine!

Sometimes users think there's an error when:
- Loading takes 2-3 seconds (normal)
- Loading spinner shows (normal on first visit)
- Service worker logs messages (normal, not errors)
- Console shows "warnings" (yellow = ok, red = error)

**Good console messages:**
- ✅ "Service Worker registered successfully"
- ✅ "Precaching app shell"
- ✅ Build warnings (yellow) during development

**Bad console messages:**
- ❌ "Failed to load resource" (red)
- ❌ "Uncaught SyntaxError" (red)
- ❌ "404 Not Found" for main.js/main.css

---

## Contact Support

If none of these fixes work:

1. Open GitHub issue with:
   - Browser and version
   - Operating system
   - Exact error message from console
   - Screenshots
   - Network tab screenshot showing failed requests

2. Email: drinkbot3000@gmail.com

3. Include:
   - Netlify deploy URL
   - Browser console output
   - Steps to reproduce

---

## Nuclear Option (Last Resort)

**Complete reset:**

```bash
# 1. Clear everything locally
rm -rf node_modules build .cache

# 2. Fresh install
npm install

# 3. Fresh build
npm run build

# 4. In browser - clear EVERYTHING:
#    - Clear browsing data (All time)
#    - Clear cache
#    - Clear cookies
#    - Close all tabs
#    - Restart browser

# 5. Test in fresh incognito window

# 6. If still broken, try different browser
```

---

**Remember: 99% of "can't load" errors are caching issues!**

**Quick fix: Hard refresh (Ctrl+Shift+R) + Clear service worker**

🤖 DrinkBot3000 - We'll get this working! 🤖
