// Geographic Verification Service
// Restricts access to USA only for legal and compliance simplicity
// Privacy: IP address is NOT stored, check is one-time only

import { getItem, setItem, removeItem, STORAGE_KEYS } from './storage.service';
import { fetchGeolocationFromAllServices } from '../api/geolocation.api';

/**
 * Allowed country codes (USA only)
 * Using allowlist approach for maximum clarity and security
 */
const ALLOWED_COUNTRIES = ['US'];

/**
 * Configuration for geolocation verification
 */
const GEO_CONFIG = {
  rateLimitCacheDuration: 300000 // 5 minutes - cache rate limit errors
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

    // Try to fetch geolocation from any available service
    try {
      const geoData = await fetchGeolocationFromAllServices(cacheRateLimit);

      const { countryCode, country, service } = geoData;
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
        service
      };

    } catch (error) {
      // All services failed - this is a technical error, not geo-blocking
      console.error('All geolocation services failed:', error.message);
      sessionStorage.setItem('geoErrorLogged', 'true');

      // Extract error details if available
      const errorDetails = error.message ? [error.message] : ['Unknown error'];

      // Return technical error response
      return {
        allowed: false,
        country: 'Unknown',
        error: 'Unable to verify location due to technical issues. All geolocation services are currently unavailable.',
        technicalError: true,
        errorDetails,
        warning: 'This appears to be a temporary technical issue, not a geographic restriction.'
      };
    }

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
 * Get cached verification result if available
 * @private
 */
function getCachedVerification() {
  const geoVerified = getItem(STORAGE_KEYS.GEO_VERIFIED);
  if (!geoVerified) return null;

  const countryCode = getItem(STORAGE_KEYS.GEO_COUNTRY_CODE);
  const country = getItem(STORAGE_KEYS.GEO_COUNTRY) || 'Unknown';

  return {
    allowed: geoVerified === true || geoVerified === 'true',
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
  setItem(STORAGE_KEYS.GEO_VERIFIED, allowed);
  setItem(STORAGE_KEYS.GEO_COUNTRY, country);
  if (countryCode) {
    setItem(STORAGE_KEYS.GEO_COUNTRY_CODE, countryCode);
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
  const rateLimitUntil = Date.now() + GEO_CONFIG.rateLimitCacheDuration;
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
  removeItem(STORAGE_KEYS.GEO_VERIFIED);
  removeItem(STORAGE_KEYS.GEO_COUNTRY);
  removeItem(STORAGE_KEYS.GEO_COUNTRY_CODE);
  clearRateLimit();
  sessionStorage.removeItem('geoErrorLogged');
}

/**
 * Get stored country if already verified
 */
export function getStoredCountry() {
  const verified = getItem(STORAGE_KEYS.GEO_VERIFIED);
  const country = getItem(STORAGE_KEYS.GEO_COUNTRY);

  if (verified && country) {
    return {
      verified: verified === true || verified === 'true',
      country: country
    };
  }

  return null;
}
