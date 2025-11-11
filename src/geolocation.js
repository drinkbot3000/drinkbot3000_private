// Geographic Verification Service
// Restricts access to USA only for legal and compliance simplicity
// Privacy: IP address is NOT stored, check is one-time only

/**
 * Allowed country codes (USA only)
 * Using allowlist approach for maximum clarity and security
 */
const ALLOWED_COUNTRIES = ['US'];

/**
 * Geolocation API configuration
 */
const GEO_API_CONFIG = {
  endpoint: 'https://ip-api.com/json/',
  fields: 'status,country,countryCode',
  timeout: 10000, // 10 second timeout
  rateLimitCacheDuration: 300000, // 5 minutes - cache rate limit errors
};

/**
 * Check if user is accessing from USA
 * Uses IP-API.com free tier (no API key required)
 * Privacy-focused: only country code is retrieved, IP never stored
 *
 * @returns {Promise<{allowed: boolean, country: string, countryCode?: string, error: string|null}>}
 */
export async function checkGeographicRestriction() {
  try {
    // Check if user has already been verified
    const cachedResult = getCachedVerification();
    if (cachedResult) {
      return cachedResult;
    }

    // Check if we're currently rate limited
    const rateLimitError = checkRateLimit();
    if (rateLimitError) {
      return rateLimitError;
    }

    // Fetch user's country from IP geolocation service
    const geoData = await fetchGeolocation();

    // Validate response
    if (geoData.status !== 'success') {
      throw new Error('Could not determine country');
    }

    const { countryCode, country } = geoData;
    const isAllowed = ALLOWED_COUNTRIES.includes(countryCode);

    // Cache verification result (NOT the IP address)
    cacheVerification(isAllowed, country);

    return {
      allowed: isAllowed,
      country,
      countryCode,
      error: null
    };

  } catch (error) {
    // Only log to console once, not repeatedly
    if (!sessionStorage.getItem('geoErrorLogged')) {
      console.error('Geographic verification error:', error);
      sessionStorage.setItem('geoErrorLogged', 'true');
    }

    // Fail closed: deny access on error for USA-only service
    // This prevents unauthorized access if verification fails
    return {
      allowed: false,
      country: 'Unknown',
      error: error.message,
      warning: 'Geographic verification failed - access denied for security'
    };
  }
}

/**
 * Fetch geolocation data from IP-API service
 * @private
 */
async function fetchGeolocation() {
  const url = `${GEO_API_CONFIG.endpoint}?fields=${GEO_API_CONFIG.fields}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), GEO_API_CONFIG.timeout);

  try {
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'omit', // No cookies
      headers: {
        'Accept': 'application/json'
      },
      signal: controller.signal
    });

    if (!response.ok) {
      // Handle specific error codes
      if (response.status === 403) {
        // Rate limit or access restriction - cache this error
        cacheRateLimit();
        throw new Error('Geolocation service temporarily unavailable (rate limit). Please try again in a few minutes.');
      } else if (response.status === 429) {
        // Explicit rate limit
        cacheRateLimit();
        throw new Error('Too many requests. Please try again in a few minutes.');
      } else if (response.status >= 500) {
        throw new Error('Geolocation service is currently down. Please try again later.');
      } else {
        throw new Error(`Geolocation service error: ${response.status}`);
      }
    }

    // Clear any cached rate limit on success
    clearRateLimit();

    return await response.json();
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Get cached verification result if available
 * @private
 */
function getCachedVerification() {
  const geoVerified = localStorage.getItem('geoVerified');
  if (!geoVerified) return null;

  return {
    allowed: geoVerified === 'true',
    country: localStorage.getItem('userCountry') || 'Unknown',
    error: null,
    cached: true
  };
}

/**
 * Cache verification result in localStorage
 * @private
 */
function cacheVerification(allowed, country) {
  localStorage.setItem('geoVerified', allowed.toString());
  localStorage.setItem('userCountry', country);
}

/**
 * Check if we're currently rate limited
 * @private
 */
function checkRateLimit() {
  const rateLimitUntil = sessionStorage.getItem('geoRateLimitUntil');
  if (!rateLimitUntil) return null;

  const now = Date.now();
  const limitTime = parseInt(rateLimitUntil, 10);

  if (now < limitTime) {
    const minutesLeft = Math.ceil((limitTime - now) / 60000);
    return {
      allowed: false,
      country: 'Unknown',
      error: `Service temporarily unavailable. Please try again in ${minutesLeft} minute${minutesLeft > 1 ? 's' : ''}.`,
      rateLimited: true
    };
  }

  // Rate limit expired, clear it
  clearRateLimit();
  return null;
}

/**
 * Cache rate limit error
 * @private
 */
function cacheRateLimit() {
  const rateLimitUntil = Date.now() + GEO_API_CONFIG.rateLimitCacheDuration;
  sessionStorage.setItem('geoRateLimitUntil', rateLimitUntil.toString());
}

/**
 * Clear rate limit cache
 * @private
 */
function clearRateLimit() {
  sessionStorage.removeItem('geoRateLimitUntil');
}

/**
 * Reset geographic verification (for testing/debugging only)
 */
export function resetGeographicVerification() {
  localStorage.removeItem('geoVerified');
  localStorage.removeItem('userCountry');
  clearRateLimit();
  sessionStorage.removeItem('geoErrorLogged');
}

/**
 * Get stored country if already verified
 */
export function getStoredCountry() {
  const verified = localStorage.getItem('geoVerified');
  const country = localStorage.getItem('userCountry');

  if (verified && country) {
    return {
      verified: verified === 'true',
      country: country
    };
  }

  return null;
}
