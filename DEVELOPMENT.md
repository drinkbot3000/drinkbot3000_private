# DrinkBot3000 - Developer Documentation

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Critical Functions Explained](#critical-functions-explained)
4. [Known Limitations](#known-limitations)
5. [TODO List for Future Development](#todo-list-for-future-development)
6. [Testing Requirements](#testing-requirements)
7. [Security Considerations](#security-considerations)
8. [Deployment Notes](#deployment-notes)

---

## Overview

**DrinkBot3000** is a Progressive Web App (PWA) for tracking Blood Alcohol Concentration (BAC) using the scientifically-validated Widmark Formula. It provides real-time BAC tracking, quick estimates, and dangerous BAC warnings.

**Key Technologies:**
- React 18 with Hooks (useState, useEffect, useReducer)
- Tailwind CSS for styling
- Lucide React for icons
- PWA capabilities (works offline, installable)
- Stripe integration for payments (1-time $5 purchase)

**Legal Scope:**
- USA only (geographic verification via IP)
- 21+ age requirement
- Educational/informational purposes
- NOT a replacement for breathalyzer or medical advice

---

## Architecture

### State Management
Uses React's `useReducer` for centralized state management. All state changes go through the reducer for predictability.

**Important Pattern - Atomic Updates:**
```javascript
// BAD - Creates race conditions
dispatch({ type: 'SET_FIELD', field: 'weight', value: 150 });
dispatch({ type: 'SET_FIELD', field: 'drinks', value: [] });
// ^ Between these, UI renders with new weight + old drinks = WRONG BAC!

// GOOD - All changes together
dispatch({
  type: 'SET_MULTIPLE',
  values: { weight: 150, drinks: [], bac: 0, startTime: null }
});
```

See `updateProfile()` in src/App.js:1122 for a real example.

### BAC Calculation Engine

**Formula: Widmark Formula (established 1932)**
```
BAC = (Alcohol in grams / (Weight in kg × Body water constant)) × 100 - (Metabolism rate × Time)
```

**Constants:**
- Standard drink = 14g pure alcohol (US definition)
- Male body water = 58% (0.58)
- Female body water = 49% (0.49)
- Metabolism rate = 0.015% per hour (conservative)

**Implementation:** See `calculateBAC()` in src/App.js:280

**Two Modes:**
1. **Live Mode** (Tracker tab): Real-time tracking with per-drink timestamps
2. **Estimate Mode** (Calculator tab): Quick calculation assuming all drinks at start

### Margin of Error Calculation

BAC calculators provide ESTIMATES, not exact measurements. We calculate and display margin of error for transparency.

**Sources of Error:**
- Metabolism rate varies ±30-50% between people
- Body water percentage varies with fitness, age, hydration
- Food intake affects absorption (not modeled)
- Drink pacing affects peak BAC (not modeled)

**Implementation:** See `calculateBACMargin()` in src/App.js:858

**Example:** If calculated BAC = 0.08%, display range: 0.065% - 0.095%

### Warning System

**Medical Thresholds (CDC-based):**
- 0.00%: Sober
- 0.03%: Mild effects
- 0.08%: Legal limit (USA)
- 0.15%: Severe impairment (blackout risk)
- 0.20%: Dangerous (needs assistance)
- 0.25%: Poisoning risk
- 0.30%: Life-threatening
- 0.40%: Critical emergency

**Emergency Banners:**
Displayed at 0.20% and above with:
- Alcohol poisoning symptoms checklist
- "CALL 911 NOW" instruction (text only, not clickable tel: link)
- Warning not to leave person alone

**Implementation:** See `getBACStatus()` in src/App.js:902

### Geographic Verification

**Purpose:** Restrict to USA for legal compliance simplicity

**Implementation:** src/geolocation.js
- Multi-service fallback (3 APIs: ipapi.co, ip-api.com, ipwhois.app)
- Retry logic with exponential backoff (2 attempts per service)
- Rate limit detection and caching
- Technical error vs geo-blocking distinction

**Privacy:**
- Only country code retrieved (not city, ISP, etc.)
- IP address NEVER stored
- Result cached in browser localStorage only

**Known Issues:**
- VPNs can bypass
- Some IPs mislocated (especially mobile carriers, military)
- Free API rate limits (1000-1500 requests/day)

### Notification System (Optional Drink Timing Feature)

**Purpose:** Help users maintain a target BAC level by notifying them when to have their next drink

**User Requirements:**
- Must be explicitly enabled in Settings (opt-in only)
- Requires browser notification permission
- User must set target BAC (0.02% - 0.08% range, default 0.05%)

**Implementation:** src/App.js:427-558 (monitoring useEffect) + src/App.js:1355-1443 (toggle handler)

**Architecture:**

1. **State Management:**
   - `notificationConsent` - User has agreed to notifications
   - `notificationsEnabled` - Feature is turned on
   - `targetBAC` - Desired BAC level to maintain
   - `lastNotificationTime` - Throttling/spam prevention
   - `notificationPermission` - Browser permission status

2. **Monitoring Logic (useEffect):**
   - Runs every 30 seconds when enabled (configurable via `CONSTANTS.NOTIFICATION_CHECK_INTERVAL_MS`)
   - Only monitors in Tracker mode (not Calculator mode)
   - Safety: Disabled if BAC ≥ 0.08% (legal limit)
   - Wrapped in try-catch for graceful error handling

3. **Notification Triggers:**
   - BAC drops below target level, OR
   - BAC will drop below target within 5 minutes (configurable via `CONSTANTS.NOTIFICATION_ADVANCE_HOURS`)
   - Throttled to max 1 notification per 15 minutes (configurable via `CONSTANTS.NOTIFICATION_COOLDOWN_MS`)

4. **Drink Calculation:**
   - Uses reverse Widmark formula: drinks = (BAC increase × body water volume) / grams per drink
   - Calculates minimum standard drinks needed to reach target BAC
   - Accounts for user's gender, weight, current BAC

**Constants (src/App.js:36-50):**
```javascript
NOTIFICATION_CHECK_INTERVAL_MS: 30000,     // 30-second check interval
NOTIFICATION_COOLDOWN_MS: 15 * 60 * 1000, // 15-minute cooldown
NOTIFICATION_ADVANCE_HOURS: 0.083,         // 5-minute advance warning
DEFAULT_TARGET_BAC: 0.05,                  // Safe social drinking level
MIN_TARGET_BAC: 0.02,                      // Light buzz minimum
MAX_TARGET_BAC: 0.08,                      // Legal limit maximum
```

**Safety Features:**
- Only active when: consent given, permission granted, tracker mode, has drinks
- Automatically disabled at dangerous BAC levels
- Graceful error handling prevents crashes
- No notifications if user has no drinks logged
- Clear opt-out path (toggle off in Settings)

**Privacy Considerations:**
- All processing happens client-side (no server calls)
- Notification data stored in localStorage only
- User can disable anytime
- No tracking of notification events
- Browser-native notification permission flow

**UI/UX:**
- Toggle switch in Settings modal (src/App.js:3267-3349)
- Slider to adjust target BAC with visual feedback
- Test notification sent on first enable
- Clear feedback messages via DrinkBot robot
- Permission denied state handled gracefully
- Clicking notification focuses the app

**Performance:**
- 30-second interval balances responsiveness vs battery life
- Minimal CPU impact (simple arithmetic)
- No network requests
- Efficient guard clauses exit early
- Cleanup function clears interval on unmount

**Error Handling:**
- Try-catch around calculateBAC() call
- Graceful fallback if Notification API fails
- Browser support detection
- Permission state validation
- Console logging for debugging

**Known Limitations:**
- Browser must support Notification API (most modern browsers do)
- User might dismiss/block permission
- Notifications may not work on iOS in some contexts
- No service worker push notifications (local only)
- Requires app to be open/background (not fully closed)

**Testing Considerations:**
- Test with different target BAC levels (0.02%, 0.05%, 0.08%)
- Test permission denied/dismissed scenarios
- Test disabling notifications mid-session
- Verify throttling (only 1 notification per 15 min)
- Test with multiple drinks at different times
- Verify safety cutoff at 0.08% BAC
- Test browser compatibility (Chrome, Firefox, Safari, Edge)

**Future Enhancements:**
- Service Worker integration for offline notifications
- Notification sound/vibration customization
- Multiple target BAC presets
- Smart scheduling based on typical drinking patterns
- Hydration reminders integration

---

## Critical Functions Explained

### `calculateBAC()` - src/App.js:280
**What it does:** Calculates current BAC using Widmark Formula
**Returns:** Number (BAC as percentage, e.g., 0.08)
**Critical for:** All BAC displays, warnings, impairment tracking

**Does:**
- Validates gender and weight exist
- Handles two modes (live/estimate) differently
- Performs defensive checks on all drink data
- Returns 0 on any error (fail-safe)

**Does NOT do:**
- Account for food intake
- Model absorption delay (assumes instant)
- Adjust for individual metabolism differences
- Factor in hydration, medications, liver health

### `calculateBACMargin()` - src/App.js:858
**What it does:** Calculates uncertainty range for BAC estimate
**Returns:** Object with {min, max, marginPercent}
**Critical for:** Transparent accuracy communication to users

**Algorithm:**
- Base margin: ±0.015% (typical measurement error)
- Scales with BAC level (higher BAC = more uncertainty)
- Capped at 30% of calculated BAC

### `getBACStatus()` - src/App.js:902
**What it does:** Determines warning level and UI colors based on BAC
**Returns:** Object with {label, color, bgColor, message, margin, showEmergency}
**Critical for:** All warning displays, emergency banners

**10 Warning Levels:**
1. Sober (0.00%)
2. Recently Impaired (0.00% but was >0.08% recently)
3. Mild Effect (<0.03%)
4. Impaired (0.03-0.08%)
5. Intoxicated (0.08-0.15%)
6. Severe Impairment (0.15-0.20%)
7. Dangerous (0.20-0.25%)
8. Poisoning Risk (0.25-0.30%)
9. Life-Threatening (0.30-0.40%)
10. Critical (≥0.40%)

### `updateProfile()` - src/App.js:1122
**What it does:** Updates gender/weight and resets BAC tracking
**Critical pattern:** Uses SET_MULTIPLE for atomic state update

**Why reset everything?**
- Weight change invalidates all previous BAC calculations
- Old drinks + new weight = WRONG BAC
- Must start fresh session

### `addDrink()` - src/App.js:630
**What it does:** Adds drink to tracking system
**Validates:**
- Setup completed
- Gender and weight set
- Drink size (0-64 oz)
- ABV (0-100%)

**Auto-initializes:** startTime for live mode (if not set)

### `checkGeographicRestriction()` - src/geolocation.js:57
**What it does:** Verifies user is in USA using IP geolocation
**Returns:** Promise with {allowed, country, countryCode, error, technicalError}

**Fallback Logic:**
1. Check cache (localStorage)
2. Check rate limit (sessionStorage)
3. Try ipapi.co (2 retries)
4. Try ip-api.com (2 retries)
5. Try ipwhois.app (2 retries)
6. If all fail: return technical error (not geo-block)

---

## Known Limitations

### BAC Calculation Accuracy

**What's Missing:**
1. **Absorption delay:** Real peak BAC occurs 20-30 minutes after drinking
   - Current: Assumes instant absorption
   - TODO: Add absorption curve modeling

2. **Food effects:** Food slows absorption significantly
   - Current: Not accounted for
   - TODO: Add "drinking on empty stomach?" toggle

3. **Individual metabolism:** Varies by genetics, liver health, medications
   - Current: Uses population average (0.015%/hr)
   - TODO: Allow user calibration with breathalyzer comparison

4. **Body composition:** Current uses binary gender
   - Current: Male=58% water, Female=49% water
   - TODO: More sophisticated model (BMI, age, fitness level)

5. **Drink pacing:** Rapid consumption → higher peak BAC
   - Current: Only timestamps used, not pacing algorithm
   - TODO: Detect rapid consumption, warn about higher peak

### Geographic Verification

**Limitations:**
1. **VPN bypass:** Users can use VPN to fake USA location
   - TODO: Add user attestation "I confirm I am in USA"
   - TODO: Combine with payment verification (US billing address)

2. **False positives:** Some legitimate USA users blocked
   - Examples: Military bases abroad, certain ISPs, mobile carriers
   - TODO: Add manual verification appeal process

3. **Rate limits:** Free APIs limit requests
   - Current: 3 services × ~1000 requests/day = ~3000 total
   - TODO: Upgrade to paid tier for primary service

4. **No analytics:** Can't see which services fail most
   - TODO: Add error tracking and service health monitoring

### Emergency Calling

**Current Status:**
- Removed `tel:911` links (reliability uncertain)
- Now shows text instruction: "Manually dial 9-1-1 on your phone"

**Limitations:**
1. **Not tested:** Never verified tel: links work on all devices
2. **International users:** 911 doesn't work outside USA (but app is USA-only)

**TODO for Human Developers:**
- Test tel:911 on iOS Safari, Android Chrome, various carriers
- If verified working: Re-add as `<a href="tel:911">`
- Consider adding international emergency numbers if expanding countries
- Add emergency contact quick-dial feature (user-configured)

### Payment System

**Current:**
- Stripe integration for $5 one-time payment
- NOT TESTED with real money (only Stripe test mode)

**TODO Before Production:**
- [ ] Test with real credit cards
- [ ] Verify webhook handling (payment confirmation)
- [ ] Test refund process
- [ ] Add receipt email
- [ ] Verify tax calculation (varies by state)
- [ ] Add subscription option (vs one-time)
- [ ] Handle failed payments gracefully
- [ ] Add payment history for users

### Accessibility

**Missing:**
- Screen reader testing
- Keyboard navigation
- High contrast mode
- Font size adjustment
- Color-blind friendly colors

**TODO:**
- Add ARIA labels
- Test with VoiceOver (iOS) and TalkBack (Android)
- Add keyboard shortcuts
- Support prefers-contrast media query

### Testing

**Current Test Coverage:** ~0%
- NO unit tests
- NO integration tests
- NO E2E tests

**Critical Functions That MUST Have Tests:**
1. `calculateBAC()` - Core algorithm
2. `calculateBACMargin()` - Margin calculation
3. `getBACStatus()` - Warning levels
4. `checkGeographicRestriction()` - Geo verification
5. Reducer logic - State management

**TODO:**
- Add Jest for unit tests
- Add React Testing Library for component tests
- Add Cypress or Playwright for E2E tests
- Test edge cases: 0 weight, negative hours, NaN inputs
- Test all 10 warning levels trigger correctly
- Test all 3 geolocation services

---

## TODO List for Future Development

### High Priority (Critical for Production)

1. **Payment Testing**
   - [ ] Test Stripe with real credit cards
   - [ ] Verify webhook security
   - [ ] Test tax calculation for all 50 states
   - [ ] Add receipt generation

2. **Legal Review**
   - [ ] Lawyer review of Terms of Service
   - [ ] Privacy Policy audit
   - [ ] Age verification compliance check
   - [ ] Liability waiver review

3. **Testing Suite**
   - [ ] Unit tests for calculateBAC
   - [ ] Integration tests for state management
   - [ ] E2E tests for critical flows
   - [ ] Cross-browser testing

4. **Security Audit**
   - [ ] XSS vulnerability scan
   - [ ] SQL injection check (if database added)
   - [ ] CSRF protection
   - [ ] API key security review

### Medium Priority (Quality Improvements)

5. **BAC Accuracy Enhancements**
   - [ ] Add absorption delay modeling (20-30min peak)
   - [ ] Add "food intake" toggle
   - [ ] Add user calibration with breathalyzer
   - [ ] Time-of-day metabolism adjustment

6. **UX Improvements**
   - [ ] Add "time until sober" countdown
   - [ ] Add profile history / undo
   - [ ] Add metric system option (kg, mL)
   - [ ] Dark mode support
   - [ ] Accessibility improvements

7. **Geographic Expansion**
   - [ ] Add Canada support
   - [ ] Add UK support (different legal limit: 0.08% England, 0.05% Scotland)
   - [ ] Add Australia support
   - [ ] Localize BAC limits per country

8. **Analytics & Monitoring**
   - [ ] Track which geolocation services fail
   - [ ] Monitor BAC calculation errors
   - [ ] User behavior analytics (privacy-respecting)
   - [ ] Error tracking (Sentry or similar)

### Low Priority (Nice to Have)

9. **Social Features**
   - [ ] Share BAC estimate (anonymized)
   - [ ] Group tracking (designated driver coordination)
   - [ ] Leaderboard (gamification - use carefully!)

10. **Advanced Features**
    - [ ] Drink database (searchable by brand)
    - [ ] Barcode scanner for drinks
    - [ ] Integration with ride-share apps (Uber/Lyft)
    - [ ] Smart watch support
    - [ ] Voice input for adding drinks

---

## Testing Requirements

### Manual Testing Checklist

**Before Each Release:**
- [ ] Test on iOS Safari (most common mobile browser)
- [ ] Test on Android Chrome
- [ ] Test on desktop Chrome, Firefox, Safari, Edge
- [ ] Test offline mode (PWA functionality)
- [ ] Test with network throttling (slow 3G)
- [ ] Test geolocation from different ISPs
- [ ] Test all 10 BAC warning levels
- [ ] Test profile update clears drinks
- [ ] Test custom drink save/delete
- [ ] Test payment flow (test mode)

### Edge Cases to Test

**Input Validation:**
- [ ] Weight: 0, -1, 1000, "abc", null
- [ ] Drinks: 0, 100, -5, 0.5, "abc"
- [ ] Hours: 0, -1, 72, 0.25, "abc"
- [ ] ABV: 0, -5, 101, 200, "abc"
- [ ] Oz: 0, -10, 128, "abc"

**State Management:**
- [ ] Add drink before setup
- [ ] Change weight with drinks tracked
- [ ] Switch tabs rapidly
- [ ] Close browser mid-session
- [ ] Clear localStorage mid-session

**Geolocation:**
- [ ] All 3 services down (mock)
- [ ] Rate limited (mock)
- [ ] Timeout (mock)
- [ ] Invalid response format (mock)
- [ ] Network error (offline)

---

## Security Considerations

### Current Security Posture

**Good:**
- No user passwords (no auth = no password breaches)
- No server-side storage of PII
- HTTPS required (enforced by PWA)
- No SQL database (no SQLi risk)
- Input validation on all user inputs

**Needs Improvement:**

1. **XSS Risk:**
   - Custom drink names rendered without sanitization
   - TODO: Add DOMPurify or similar
   - Test with: `<script>alert('XSS')</script>` in drink name

2. **localStorage Security:**
   - All data in localStorage (accessible via JS)
   - Not encrypted
   - Shared across tabs/windows
   - TODO: Consider IndexedDB with encryption for sensitive data

3. **API Keys:**
   - No API keys currently (good!)
   - If adding backend: Use environment variables, NEVER commit keys

4. **Payment Security:**
   - Using Stripe (PCI compliant - good!)
   - Webhook signature verification needed
   - TODO: Verify webhook implementation before production

5. **Content Security Policy:**
   - Not configured
   - TODO: Add CSP headers to prevent XSS

### Security TODO List

- [ ] Add Content Security Policy headers
- [ ] Implement DOMPurify for user input sanitization
- [ ] Add rate limiting to prevent abuse
- [ ] Audit all localStorage usage
- [ ] Implement webhook signature verification (Stripe)
- [ ] Add CAPTCHA to payment flow (prevent fraud)
- [ ] Security headers audit (HSTS, X-Frame-Options, etc.)

---

## Deployment Notes

### Build Process

```bash
npm run build
```

Outputs to `build/` directory. Optimized bundle:
- JS: ~68KB gzipped
- CSS: ~6KB gzipped

### Environment Variables

**Required for Production:**
- `REACT_APP_STRIPE_PUBLIC_KEY` - Stripe publishable key
- `REACT_APP_SERVER_URL` - Backend API URL (if applicable)

**Setting Environment Variables:**
```bash
# .env.production (DO NOT COMMIT)
REACT_APP_STRIPE_PUBLIC_KEY=pk_live_...
REACT_APP_SERVER_URL=https://api.drinkbot3000.com
```

### PWA Configuration

**Manifest:** `public/manifest.json`
- App name: DrinkBot3000
- Icons: 192x192, 512x512
- Start URL: ./
- Display: standalone

**Service Worker:**
- Auto-generated by Create React App
- Caches static assets for offline use
- TODO: Add custom caching strategy for API responses

### Deployment Platforms

**Tested On:**
- None yet

**Recommended:**
- Vercel (easy PWA deployment)
- Netlify (good PWA support)
- GitHub Pages (free, but no backend)
- AWS S3 + CloudFront (scalable)

**Deployment Checklist:**
- [ ] Set environment variables
- [ ] Configure custom domain
- [ ] Enable HTTPS (required for PWA)
- [ ] Set up CDN (CloudFront, Cloudflare)
- [ ] Configure cache headers
- [ ] Test PWA install on mobile
- [ ] Verify service worker registration
- [ ] Set up error monitoring (Sentry)
- [ ] Set up analytics (privacy-respecting)

### Backend Requirements

**Current:** 100% client-side (no backend)

**Future Backend Needs:**
- Stripe webhook handler (payment confirmation)
- User account storage (optional)
- Analytics aggregation
- Geolocation service health checks

**Recommended Stack:**
- Node.js + Express (simple API)
- PostgreSQL (user data)
- Redis (caching, rate limiting)
- Deploy: Heroku, Railway, Render

---

## Code Quality Improvements Needed

### Linting
- [ ] Add ESLint configuration
- [ ] Add Prettier for formatting
- [ ] Add pre-commit hooks (Husky)
- [ ] Fix all linting errors

### TypeScript Migration
Current: Plain JavaScript
TODO: Migrate to TypeScript for type safety

**Priority Areas for Types:**
- State management (reducer types)
- BAC calculation functions
- Geolocation service

### Code Organization
- [ ] Split App.js (currently 2800+ lines)
- [ ] Extract components (DrinkList, BACDisplay, etc.)
- [ ] Create hooks (useBAC, useGeolocation)
- [ ] Separate concerns (UI vs logic)

### Performance
- [ ] Memoize expensive calculations (useMemo)
- [ ] Lazy load tabs (React.lazy)
- [ ] Optimize re-renders (React.memo)
- [ ] Audit bundle size

---

## Questions for Product Owner

Before continuing development, clarify:

1. **Age Verification:** How to verify 21+ age?
   - Honor system?
   - ID verification service (Jumio, Onfido)?
   - Require payment (age signal)?

2. **Liability:** What's the plan if users:
   - Drive drunk based on BAC estimate?
   - Sue for "inaccurate" BAC calculation?
   - Get alcohol poisoning?

3. **Monetization:**
   - $5 one-time payment sustainable?
   - Consider subscription model?
   - Ads? (probably bad UX for safety app)

4. **Target Audience:**
   - College students?
   - Casual drinkers?
   - People with alcohol concerns?
   - (Affects features, tone, marketing)

5. **Geographic Expansion:**
   - Stay USA-only?
   - Expand to Canada/UK/Australia?
   - (Affects legal complexity)

6. **Data Collection:**
   - Anonymous usage analytics?
   - Individual drink tracking data?
   - (Privacy implications)

---

## Contributing Guidelines

**Code Style:**
- Use functional components (not class components)
- Use Hooks for state (useState, useEffect, useReducer)
- Prefer const over let, never use var
- Use meaningful variable names
- Comment WHY, not WHAT

**Git Workflow:**
- Create feature branch from main
- Use descriptive commit messages
- Reference issue numbers in commits
- PR requires review before merge

**Testing:**
- Add tests for all new functions
- Maintain >80% code coverage
- Test edge cases

**Documentation:**
- Update DEVELOPMENT.md for architecture changes
- Add inline comments for complex logic
- Update README for user-facing changes

---

## Contact & Support

**Repository:** [Private - drinkbot3000/drinkbot3000_private]

**Issues:** Use GitHub Issues for bug reports and feature requests

**Security Issues:** Email security@drinkbot3000.com (do NOT file public issues)

---

*Last Updated: 2025-11-12 - Added Notification System documentation*
*Version: 1.0.0*
