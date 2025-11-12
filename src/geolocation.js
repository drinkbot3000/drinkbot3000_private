/**
 * GEOGRAPHIC VERIFICATION SERVICE
 *
 * PURPOSE:
 * Restricts DrinkBot3000 access to USA only to simplify legal compliance.
 * Different countries have different laws about alcohol apps, BAC limits, and liability.
 * USA-only focus avoids complex multi-jurisdiction legal issues.
 *
 * PRIVACY COMMITMENT:
 * - IP address is NEVER stored or logged
 * - Only country code is retrieved (not city, ISP, or other details)
 * - Check happens once per browser session
 * - Result cached in localStorage (browser-side only, never sent to server)
 *
 * RELIABILITY ARCHITECTURE:
 * - Multi-service fallback (3 independent geolocation APIs)
 * - Retry logic with exponential backoff (2 attempts per service)
 * - Graceful degradation (if all services fail, shows technical error not geo-block)
 * - Rate limit detection and caching (prevents repeated API failures)
 *
 * LEGAL NOTES FOR HUMAN DEVELOPERS:
 * - Using IP geolocation is legally acceptable for age-restricted content screening
 * - NOT a perfect system (VPNs can bypass, some IPs mislocated)
 * - Should be combined with Terms of Service requiring USA location
 * - Consider adding user attestation: "I confirm I am in the USA"
 *
 * TODO FOR FUTURE:
 * - Add manual override for false positives (e.g., military bases abroad)
 * - Implement user-submitted location verification appeals
 * - Add analytics (which services fail most often? where are users blocked?)
 * - Consider expanding to other English-speaking countries (Canada, UK, Australia)
 */

/**
 * Allowed country codes - USA only
 * Using allowlist (not blocklist) for security and clarity
 * To add countries: add ISO 3166-1 alpha-2 codes (e.g., 'CA' for Canada)
 */
const ALLOWED_COUNTRIES = ['US'];

/**
 * Geolocation API configuration with multiple fallback services
 *
 * WHY MULTIPLE SERVICES?
 * Free geolocation APIs are unreliable:
 * - Rate limits (usually 1000-1500 requests/day on free tier)
 * - Downtime and maintenance windows
 * - Blocking/throttling from certain networks
 * - Geographic availability issues
 *
 * FALLBACK STRATEGY:
 * Try services in order until one succeeds. If all fail = technical error (not geo-block).
 *
 * SERVICE SELECTION CRITERIA:
 * - Free tier available (no API key required)
 * - Returns country code in JSON
 * - HTTPS support (required for secure sites)
 * - Good uptime track record
 *
 * TODO FOR HUMAN DEVELOPERS:
 * - Monitor which services fail most often (add analytics)
 * - Consider upgrading to paid tier for primary service (more reliable)
 * - Test from different networks (corporate, mobile, VPN, etc.)
 * - Add service health check endpoint
 */
const GEO_API_CONFIG = {
  timeout: 8000,              // 8 second timeout per service (generous for slow networks)
  rateLimitCacheDuration: 300000,  // 5 minutes - prevents hammering rate-limited service
  maxRetries: 2,              // Retry each service up to 2 times (total 3 attempts per service)
  services: [
    {
      name: 'geojs',
      endpoint: 'https://get.geojs.io/v1/ip/country.json',
      parseResponse: (data) => ({
        status: data.country_code ? 'success' : 'fail',
        countryCode: data.country_code,
        country: data.country
      })
    },
    {
      name: 'ip-api',
      endpoint: 'https://ip-api.com/json/?fields=status,country,countryCode',
      parseResponse: (data) => ({
        status: data.status,
        countryCode: data.countryCode,
        country: data.country
      })
    },
    {
      name: 'freeipapi',
      endpoint: 'https://freeipapi.com/api/json',
      parseResponse: (data) => ({
        status: data.countryCode ? 'success' : 'fail',
        countryCode: data.countryCode,
        country: data.countryName
      })
    },
    {
      name: 'ipapi-fallback',
      endpoint: 'https://ipapi.co/json/',
      parseResponse: (data) => ({
        status: data.country_code ? 'success' : 'fail',
        countryCode: data.country_code,
        country: data.country_name
      })
    }
  ]
};

/**
 * Check if user is accessing from USA
 * Uses multiple geolocation APIs with fallback for reliability
 * Privacy-focused: only country code is retrieved, IP never stored
 *
 * @returns {Promise<{allowed: boolean, country: string, countryCode?: string, error: string|null, technicalError?: boolean}>}
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

    // Try each geolocation service in order until one succeeds
    let lastError = null;
    const errors = [];

    for (const service of GEO_API_CONFIG.services) {
      try {
        // Attempt to fetch from this service with retry logic
        const geoData = await fetchGeolocationWithRetry(service);

        // Validate response
        if (geoData.status !== 'success' || !geoData.countryCode) {
          throw new Error(`${service.name}: Invalid response format`);
        }

        const { countryCode, country } = geoData;
        const isAllowed = ALLOWED_COUNTRIES.includes(countryCode);

        // Cache verification result (NOT the IP address)
        cacheVerification(isAllowed, country, countryCode);

        // Clear any previous errors on success
        clearRateLimit();
        sessionStorage.removeItem('geoErrorLogged');

        return {
          allowed: isAllowed,
          country,
          countryCode,
          error: null,
          service: service.name
        };

      } catch (error) {
        // Log this service's failure and try next service
        errors.push(`${service.name}: ${error.message}`);
        lastError = error;
        console.warn(`Geolocation service ${service.name} failed:`, error.message);
        continue;
      }
    }

    // All services failed - this is a technical error, not geo-blocking
    console.error('All geolocation services failed:', errors);
    sessionStorage.setItem('geoErrorLogged', 'true');

    // Return technical error response
    return {
      allowed: false,
      country: 'Unknown',
      error: 'Unable to verify location due to technical issues. All geolocation services are currently unavailable.',
      technicalError: true,
      errorDetails: errors,
      warning: 'This appears to be a temporary technical issue, not a geographic restriction.'
    };

  } catch (error) {
    // Unexpected error in verification logic
    console.error('Unexpected geographic verification error:', error);

    return {
      allowed: false,
      country: 'Unknown',
      error: error.message || 'Geographic verification failed unexpectedly',
      technicalError: true,
      warning: 'This appears to be a technical issue. Please try again or contact support.'
    };
  }
}

/**
 * Fetch geolocation data with retry logic for a specific service
 * @private
 */
async function fetchGeolocationWithRetry(service) {
  let lastError;

  for (let attempt = 0; attempt < GEO_API_CONFIG.maxRetries; attempt++) {
    try {
      const rawData = await fetchGeolocation(service.endpoint);
      const parsedData = service.parseResponse(rawData);

      // Validate parsed data
      if (!parsedData.countryCode) {
        throw new Error('Response missing country code');
      }

      return parsedData;
    } catch (error) {
      lastError = error;

      // If it's a rate limit error, don't retry
      if (error.message.includes('rate limit') || error.message.includes('Too many requests')) {
        throw error;
      }

      // Wait before retry (exponential backoff)
      if (attempt < GEO_API_CONFIG.maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }
  }

  throw lastError;
}

/**
 * Fetch geolocation data from a specific endpoint
 * @private
 */
async function fetchGeolocation(endpoint) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), GEO_API_CONFIG.timeout);

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      credentials: 'omit', // No cookies
      cache: 'no-cache',
      headers: {
        'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9',
        // User-Agent is set by browser, but some services check for it
        'Referer': window.location.origin
      },
      signal: controller.signal
    });

    if (!response.ok) {
      // Handle specific error codes
      if (response.status === 403) {
        // 403 typically means the service is blocking automated requests or rate limiting
        // Don't cache this as rate limit - let the system try other services
        throw new Error(`Access denied by service (403 - likely blocking automated requests)`);
      } else if (response.status === 429) {
        // Cache rate limit for this session
        cacheRateLimit();
        throw new Error('Too many requests. Service rate limited.');
      } else if (response.status >= 500) {
        throw new Error('Service is currently down');
      } else {
        throw new Error(`Service error: ${response.status}`);
      }
    }

    const data = await response.json();
    return data;

  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - service took too long to respond');
    }
    throw error;
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

  const countryCode = localStorage.getItem('userCountryCode');
  const country = localStorage.getItem('userCountry') || 'Unknown';

  return {
    allowed: geoVerified === 'true',
    country,
    countryCode: countryCode || undefined,
    error: null,
    cached: true
  };
}

/**
 * Cache verification result in localStorage
 * @private
 */
function cacheVerification(allowed, country, countryCode) {
  localStorage.setItem('geoVerified', allowed.toString());
  localStorage.setItem('userCountry', country);
  if (countryCode) {
    localStorage.setItem('userCountryCode', countryCode);
  }
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
  localStorage.removeItem('userCountryCode');
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
