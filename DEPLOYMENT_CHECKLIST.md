# 🚀 DrinkBot3000 Deployment Checklist

Use this checklist to ensure a successful deployment to Netlify.

---

## Pre-Deployment

### Code Quality
- [x] Build completes locally (`npm run build`)
- [x] No critical errors in build output
- [x] All dependencies installed (`npm install`)
- [x] Tests pass (if applicable)
- [x] Code committed to GitHub

### Configuration
- [x] `netlify.toml` configured
- [x] `.nvmrc` specifies Node.js version (22)
- [x] `package.json` has `"homepage": "."`
- [x] `_headers` file created in `public/`
- [x] `sitemap.xml` created in `public/`
- [x] `robots.txt` updated with sitemap

### Content Review
- [ ] Age verification (21+) enforced
- [ ] All safety warnings present
- [ ] Geographic restrictions working (USA only)
- [ ] Legal documents complete:
  - [ ] Privacy policy
  - [ ] Terms of service
  - [ ] Refund policy
- [ ] Contact information accurate

---

## Netlify Setup

### Initial Configuration
- [ ] GitHub account connected to Netlify
- [ ] Repository `drinkbot3000/drinkbot3000_private` selected
- [ ] Build command: `npm run build`
- [ ] Publish directory: `build`
- [ ] Production branch: `main` (or your default)

### Site Settings
- [ ] Site name customized (e.g., `drinkbot3000`)
- [ ] Auto-publish enabled for main branch
- [ ] Deploy previews enabled for PRs
- [ ] Build notifications configured (optional)

### Environment Variables (if needed)
- [ ] All required env vars set
- [ ] Production values different from development
- [ ] Secrets never committed to repo

---

## First Deployment

### Build Process
- [ ] Build triggered successfully
- [ ] Build log shows no errors
- [ ] Build time reasonable (< 5 minutes)
- [ ] Published to CDN

### Initial Tests
- [ ] Site loads at Netlify URL
- [ ] No blank page/white screen
- [ ] No JavaScript errors in console
- [ ] Assets loading correctly (check Network tab)

---

## Functionality Testing

### Core Features
- [ ] Age verification modal appears
- [ ] Can verify age (21+)
- [ ] Can decline (shows blocked screen)
- [ ] Safety warning screens display
- [ ] All safety screens can be navigated
- [ ] Can decline at any safety screen

### Geographic Verification
- [ ] USA location detected correctly
- [ ] Non-USA blocked (test with VPN if possible)
- [ ] Decline option available
- [ ] Error handling works if geolocation fails

### BAC Tracker
- [ ] Can enter weight
- [ ] Can select gender
- [ ] Setup completes successfully
- [ ] Can add drinks
- [ ] BAC calculates correctly
- [ ] Time-based metabolism works
- [ ] Can undo last drink
- [ ] Can clear all drinks
- [ ] Drink history displays

### Calculator Tab
- [ ] Can switch to calculator
- [ ] Can input drinks and hours
- [ ] BAC estimate calculates
- [ ] Results display correctly

### Settings
- [ ] Settings modal opens
- [ ] Can view current settings
- [ ] Can reset app
- [ ] Confirmation works
- [ ] App resets correctly

### PWA Features
- [ ] Service worker registers (check console)
- [ ] Install prompt appears (on supported browsers)
- [ ] Can install to home screen
- [ ] Works offline after first visit
- [ ] Updates detected correctly
- [ ] Manifest.json loads correctly

---

## Legal Documents

### Privacy Policy
- [ ] Loads at `/privacy.html`
- [ ] All content displays
- [ ] Links work
- [ ] Formatted correctly
- [ ] Mobile responsive

### Terms of Service
- [ ] Loads at `/terms.html`
- [ ] All sections present
- [ ] Links work
- [ ] Formatted correctly
- [ ] Mobile responsive

### Refund Policy
- [ ] Loads at `/refund.html`
- [ ] All content displays
- [ ] Contact info correct
- [ ] Formatted correctly
- [ ] Mobile responsive

---

## Cross-Browser Testing

### Desktop
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Mobile
- [ ] iOS Safari
- [ ] iOS Chrome
- [ ] Android Chrome
- [ ] Android Firefox

### Tablet
- [ ] iPad Safari
- [ ] Android tablet

---

## Performance Testing

### Speed
- [ ] First contentful paint < 2s
- [ ] Time to interactive < 3s
- [ ] Largest contentful paint < 2.5s
- [ ] Total page size reasonable (< 500KB)

### Lighthouse Scores (aim for 90+)
- [ ] Performance: ___
- [ ] Accessibility: ___
- [ ] Best Practices: ___
- [ ] SEO: ___
- [ ] PWA: ___

### Network Conditions
- [ ] Fast 3G (test with throttling)
- [ ] Slow 3G (test with throttling)
- [ ] Offline (after initial visit)

---

## Security

### HTTPS
- [ ] Site loads over HTTPS
- [ ] No mixed content warnings
- [ ] SSL certificate valid
- [ ] Redirects HTTP → HTTPS

### Headers
- [ ] Security headers present (check Network tab)
- [ ] X-Frame-Options: DENY
- [ ] X-Content-Type-Options: nosniff
- [ ] X-XSS-Protection enabled
- [ ] Referrer-Policy set

### Content
- [ ] No sensitive data in client code
- [ ] No API keys exposed
- [ ] No hardcoded secrets
- [ ] User data handled properly

---

## SEO

### Meta Tags
- [ ] Title tag present and descriptive
- [ ] Meta description present
- [ ] Open Graph tags configured
- [ ] Twitter card tags configured
- [ ] Canonical URL set

### Discoverability
- [ ] `robots.txt` allows indexing
- [ ] Sitemap.xml accessible
- [ ] Sitemap referenced in robots.txt
- [ ] Structured data (optional)

### Social Sharing
- [ ] Shares correctly on Facebook
- [ ] Shares correctly on Twitter
- [ ] Share image displays (if configured)

---

## Monitoring

### Analytics (optional)
- [ ] Analytics installed
- [ ] Tracking code working
- [ ] Events configured
- [ ] Goals set up

### Uptime Monitoring (optional)
- [ ] Uptime monitor configured
- [ ] Alerts set up
- [ ] Contact methods verified

### Error Tracking (optional)
- [ ] Error tracking installed
- [ ] Errors reported correctly
- [ ] Alerts configured

---

## Documentation

### URLs Recorded
- [ ] Production URL: _________________________
- [ ] Privacy policy URL: _________________________
- [ ] Terms URL: _________________________
- [ ] Refund URL: _________________________

### Credentials Secured
- [ ] Netlify login credentials saved
- [ ] Domain registrar credentials saved (if applicable)
- [ ] GitHub credentials saved
- [ ] Other credentials documented

### Team Access
- [ ] Team members added to Netlify
- [ ] Permissions configured
- [ ] Notification preferences set

---

## Post-Launch

### Immediate (First Hour)
- [ ] Monitor deploy logs
- [ ] Check error rates
- [ ] Verify analytics working
- [ ] Test all critical paths
- [ ] Monitor social media mentions

### First Day
- [ ] Review analytics data
- [ ] Check for console errors
- [ ] Monitor uptime
- [ ] Gather user feedback
- [ ] Fix critical issues

### First Week
- [ ] Review performance metrics
- [ ] Analyze user behavior
- [ ] Address bug reports
- [ ] Plan improvements
- [ ] Update documentation

---

## Rollback Plan

### If Issues Arise
1. [ ] Access Netlify dashboard
2. [ ] Navigate to Deploys
3. [ ] Find last working deployment
4. [ ] Click "Publish deploy"
5. [ ] Verify site working
6. [ ] Investigate issue offline
7. [ ] Fix and redeploy

### Communication
- [ ] Status page updated (if applicable)
- [ ] Users notified (if needed)
- [ ] Team informed
- [ ] Incident documented

---

## Compliance

### Legal Requirements
- [ ] Privacy policy reflects actual practices
- [ ] Terms of service legally sound
- [ ] Refund policy clear and fair
- [ ] Age verification enforced (21+)
- [ ] Geographic restrictions enforced (USA)

### Data Protection
- [ ] No unnecessary data collected
- [ ] LocalStorage use disclosed
- [ ] No cookies (or cookie banner if used)
- [ ] User data not shared
- [ ] Deletion process documented

### Liability Protection
- [ ] Disclaimers prominent
- [ ] Safety warnings clear
- [ ] Not medical advice disclaimer
- [ ] No guarantee of accuracy disclaimer
- [ ] Liability limitations stated

---

## Final Sign-Off

### Review
- [ ] All checklist items completed
- [ ] No critical issues outstanding
- [ ] Documentation updated
- [ ] Team informed

### Approval
- [ ] Technical lead approval: ____________ Date: _______
- [ ] Product owner approval: ____________ Date: _______
- [ ] Legal review (if req'd): ____________ Date: _______

### Go-Live
- [ ] Deployment confirmed
- [ ] Monitoring active
- [ ] Team ready to respond
- [ ] Celebration scheduled! 🎉

---

## Notes

Use this space for deployment-specific notes:

```
Deployment Date: _______________
Deployed By: _______________
Git Commit: _______________
Build Number: _______________

Issues Encountered:


Resolutions:


Follow-up Items:


```

---

## Success Criteria

Your deployment is successful when:
- ✅ All checklist items complete
- ✅ No critical bugs
- ✅ Performance metrics met
- ✅ Legal requirements satisfied
- ✅ Team confident in stability

---

**The world needs DrinkBot3000. Let's ship it! 🚀**

**Remember: Drink Responsibly. Never Drink and Drive.** 🤖
