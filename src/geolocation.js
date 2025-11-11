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

    // Fetch user's country from IP geolocation service
    const geoData = await fetchGeolocation();

    // Validate response
    if (geoData.status !== 'success') {
      throw new Error('Could not determine country');
    }

    const { countryCode, country } = geoData;

    // Ensure we have valid country information
    if (!countryCode) {
      throw new Error('Country code not provided by geolocation service');
    }

    const isAllowed = ALLOWED_COUNTRIES.includes(countryCode);

    // Use country name if available, otherwise use country code
    const countryName = country || countryCode || 'Unknown';

    // Cache verification result (NOT the IP address)
    cacheVerification(isAllowed, countryName);

    return {
      allowed: isAllowed,
      country: countryName,
      countryCode,
      error: null
    };

  } catch (error) {
    console.error('Geographic verification error:', error);

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
      throw new Error(`Geolocation service error: ${response.status}`);
    }

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
 * Reset geographic verification (for testing/debugging only)
 */
export function resetGeographicVerification() {
  localStorage.removeItem('geoVerified');
  localStorage.removeItem('userCountry');
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
