/**
 * Geolocation API
 * Handles all geolocation service API calls
 * Separates API communication from business logic
 */

import { requestWithRetry, ApiError } from '../services/api.service';

/**
 * Geolocation service configuration
 */
export const GEOLOCATION_SERVICES = [
  {
    name: 'ipapi',
    endpoint: 'https://ipapi.co/json/',
    parseResponse: (data) => ({
      status: data.country_code ? 'success' : 'fail',
      countryCode: data.country_code,
      country: data.country_name
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
    name: 'ipwhois',
    endpoint: 'https://ipwhois.app/json/',
    parseResponse: (data) => ({
      status: data.success ? 'success' : 'fail',
      countryCode: data.country_code,
      country: data.country
    })
  }
];

/**
 * Configuration for geolocation API requests
 */
const GEO_CONFIG = {
  timeout: 8000, // 8 second timeout per service
  maxRetries: 2  // Retry each service up to 2 times
};

/**
 * Fetch geolocation data from a specific service with retry logic
 * @param {Object} service - Service configuration object
 * @param {Function} onRateLimit - Optional callback when rate limited
 * @returns {Promise<{status: string, countryCode: string, country: string}>}
 * @throws {ApiError} If the request fails after retries
 */
export async function fetchGeolocationFromService(service, onRateLimit = null) {
  try {
    // Fetch with retry logic
    const rawData = await requestWithRetry(
      service.endpoint,
      {
        timeout: GEO_CONFIG.timeout,
        credentials: false,
        cache: 'no-cache'
      },
      GEO_CONFIG.maxRetries,
      (error) => shouldRetryGeoRequest(error, onRateLimit)
    );

    // Parse the response using service-specific parser
    const parsedData = service.parseResponse(rawData);

    // Validate parsed data
    if (!parsedData.countryCode) {
      throw new Error('Response missing country code');
    }

    return parsedData;

  } catch (error) {
    // Re-throw with service name context
    if (error instanceof ApiError) {
      throw new Error(`${service.name}: ${error.message}`);
    }
    throw new Error(`${service.name}: ${error.message}`);
  }
}

/**
 * Try all geolocation services until one succeeds
 * @param {Function} onRateLimit - Optional callback when rate limited
 * @returns {Promise<{countryCode: string, country: string, service: string}>}
 * @throws {Error} If all services fail
 */
export async function fetchGeolocationFromAllServices(onRateLimit = null) {
  const errors = [];

  for (const service of GEOLOCATION_SERVICES) {
    try {
      const geoData = await fetchGeolocationFromService(service, onRateLimit);

      // Validate response
      if (geoData.status !== 'success' || !geoData.countryCode) {
        throw new Error(`${service.name}: Invalid response format`);
      }

      return {
        countryCode: geoData.countryCode,
        country: geoData.country,
        service: service.name
      };

    } catch (error) {
      // Log this service's failure and continue to next
      errors.push(error.message);
      console.warn(`Geolocation service ${service.name} failed:`, error.message);
      continue;
    }
  }

  // All services failed
  throw new Error(`All geolocation services failed: ${errors.join('; ')}`);
}

/**
 * Determine if a geolocation request should be retried
 * @param {Error} error - The error that occurred
 * @param {Function} onRateLimit - Optional callback when rate limited
 * @returns {boolean} Whether to retry
 */
function shouldRetryGeoRequest(error, onRateLimit) {
  // Handle rate limiting
  if (error instanceof ApiError && error.statusCode === 429) {
    if (onRateLimit) {
      onRateLimit();
    }
    return false; // Don't retry rate limits
  }

  // Handle 403 (may be rate limit or restriction)
  if (error instanceof ApiError && error.statusCode === 403) {
    return false; // Don't retry access restrictions
  }

  // Check error message for rate limit indicators
  if (error.message && (
    error.message.includes('rate limit') ||
    error.message.includes('Too many requests')
  )) {
    if (onRateLimit) {
      onRateLimit();
    }
    return false;
  }

  // Retry other errors (timeouts, server errors, etc.)
  return true;
}
