/**
 * Geographic Verification Service
 * Restricts access to USA only for legal and compliance simplicity
 * Privacy: IP address is NOT stored, check is one-time only
 */

import { getItem, setItem, removeItem, STORAGE_KEYS } from './storage.service';
import { fetchGeolocationFromAllServices } from '../api/geolocation.api';

/**
 * Geographic restriction check result
 */
export interface GeographicRestrictionResult {
  allowed: boolean;
  country: string;
  countryCode?: string;
  error: string | null;
  technicalError?: boolean;
  errorDetails?: string[];
  warning?: string;
  rateLimited?: boolean;
  cached?: boolean;
  service?: string;
}

/**
 * Cached verification result
 */
interface CachedVerification {
  allowed: boolean;
  country: string;
  countryCode?: string;
  error: null;
  cached: true;
}

/**
 * Allowed country codes (USA only)
 * Using allowlist approach for maximum clarity and security
 */
const ALLOWED_COUNTRIES = ['US'];

/**
 * Configuration for geolocation verification
 */
const GEO_CONFIG = {
  rateLimitCacheDuration: 300000, // 5 minutes - cache rate limit errors
};

/**
 * Check if user is accessing from USA
 * Uses multiple geolocation APIs with fallback for reliability
 * Privacy-focused: only country code is retrieved, IP never stored
 *
 * @returns Geographic restriction check result
 */
export async function checkGeographicRestriction(): Promise<GeographicRestrictionResult> {
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
        service,
      };
    } catch (error) {
      // All services failed - this is a technical error, not geo-blocking
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('All geolocation services failed:', errorMessage);
      sessionStorage.setItem('geoErrorLogged', 'true');

      // Extract error details if available
      const errorDetails = errorMessage ? [errorMessage] : ['Unknown error'];

      // Return technical error response
      return {
        allowed: false,
        country: 'Unknown',
        error: 'Unable to verify location due to technical issues. All geolocation services are currently unavailable.',
        technicalError: true,
        errorDetails,
        warning: 'This appears to be a temporary technical issue, not a geographic restriction.',
      };
    }
  } catch (error) {
    // Unexpected error in verification logic
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Unexpected geographic verification error:', errorMessage);

    return {
      allowed: false,
      country: 'Unknown',
      error: errorMessage || 'Geographic verification failed unexpectedly',
      technicalError: true,
      warning: 'This appears to be a technical issue. Please try again or contact support.',
    };
  }
}

/**
 * Get cached verification result if available
 */
function getCachedVerification(): CachedVerification | null {
  const geoVerified = getItem<boolean | string>(STORAGE_KEYS.GEO_VERIFIED);
  if (!geoVerified) return null;

  const countryCode = getItem<string>(STORAGE_KEYS.GEO_COUNTRY_CODE);
  const country = getItem<string>(STORAGE_KEYS.GEO_COUNTRY) || 'Unknown';

  return {
    allowed: geoVerified === true || geoVerified === 'true',
    country,
    countryCode: countryCode || undefined,
    error: null,
    cached: true,
  };
}

/**
 * Cache verification result in localStorage
 */
function cacheVerification(allowed: boolean, country: string, countryCode: string): void {
  setItem(STORAGE_KEYS.GEO_VERIFIED, allowed);
  setItem(STORAGE_KEYS.GEO_COUNTRY, country);
  if (countryCode) {
    setItem(STORAGE_KEYS.GEO_COUNTRY_CODE, countryCode);
  }
}

/**
 * Check if we're currently rate limited
 */
function checkRateLimit(): GeographicRestrictionResult | null {
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
      rateLimited: true,
    };
  }

  // Rate limit expired, clear it
  clearRateLimit();
  return null;
}

/**
 * Cache rate limit error
 */
function cacheRateLimit(): void {
  const rateLimitUntil = Date.now() + GEO_CONFIG.rateLimitCacheDuration;
  sessionStorage.setItem('geoRateLimitUntil', rateLimitUntil.toString());
}

/**
 * Clear rate limit cache
 */
function clearRateLimit(): void {
  sessionStorage.removeItem('geoRateLimitUntil');
}

/**
 * Reset geographic verification (for testing/debugging only)
 */
export function resetGeographicVerification(): void {
  removeItem(STORAGE_KEYS.GEO_VERIFIED);
  removeItem(STORAGE_KEYS.GEO_COUNTRY);
  removeItem(STORAGE_KEYS.GEO_COUNTRY_CODE);
  clearRateLimit();
  sessionStorage.removeItem('geoErrorLogged');
}

/**
 * Stored country information
 */
export interface StoredCountryInfo {
  verified: boolean;
  country: string;
}

/**
 * Get stored country if already verified
 */
export function getStoredCountry(): StoredCountryInfo | null {
  const verified = getItem<boolean | string>(STORAGE_KEYS.GEO_VERIFIED);
  const country = getItem<string>(STORAGE_KEYS.GEO_COUNTRY);

  if (verified && country) {
    return {
      verified: verified === true || verified === 'true',
      country: country,
    };
  }

  return null;
}
