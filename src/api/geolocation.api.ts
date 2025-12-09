/**
 * Geolocation API
 * Handles all geolocation service API calls with type safety
 * Separates API communication from business logic
 */

import { requestWithRetry, ApiError } from '../services/api.service';

/**
 * Parsed geolocation response
 */
export interface GeolocationData {
  status: string;
  countryCode: string;
  country: string;
}

/**
 * Geolocation service result
 */
export interface GeolocationResult {
  countryCode: string;
  country: string;
  service: string;
}

/**
 * Geolocation service configuration
 */
interface GeolocationService {
  name: string;
  endpoint: string;
  parseResponse: (data: any) => GeolocationData;
}

/**
 * Rate limit callback function type
 */
type OnRateLimitCallback = () => void;

/**
 * Geolocation service configuration
 */
export const GEOLOCATION_SERVICES: GeolocationService[] = [
  {
    name: 'ipapi',
    endpoint: 'https://ipapi.co/json/',
    parseResponse: (data: any): GeolocationData => ({
      status: data.country_code ? 'success' : 'fail',
      countryCode: data.country_code,
      country: data.country_name,
    }),
  },
  {
    name: 'ip-api',
    endpoint: 'https://ip-api.com/json/?fields=status,country,countryCode',
    parseResponse: (data: any): GeolocationData => ({
      status: data.status,
      countryCode: data.countryCode,
      country: data.country,
    }),
  },
  {
    name: 'ipwhois',
    endpoint: 'https://ipwhois.app/json/',
    parseResponse: (data: any): GeolocationData => ({
      status: data.success ? 'success' : 'fail',
      countryCode: data.country_code,
      country: data.country,
    }),
  },
];

/**
 * Configuration for geolocation API requests
 */
const GEO_CONFIG = {
  timeout: 8000, // 8 second timeout per service
  maxRetries: 2, // Retry each service up to 2 times
};

/**
 * Fetch geolocation data from a specific service with retry logic
 * @param service - Service configuration object
 * @param onRateLimit - Optional callback when rate limited
 * @returns Parsed geolocation data
 * @throws {Error} If the request fails after retries
 */
export async function fetchGeolocationFromService(
  service: GeolocationService,
  onRateLimit: OnRateLimitCallback | null = null
): Promise<GeolocationData> {
  try {
    // Fetch with retry logic
    const rawData = await requestWithRetry(
      service.endpoint,
      {
        timeout: GEO_CONFIG.timeout,
        credentials: false,
        cache: 'no-cache',
      },
      GEO_CONFIG.maxRetries,
      (error: Error) => shouldRetryGeoRequest(error, onRateLimit)
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
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`${service.name}: ${message}`);
  }
}

/**
 * Try all geolocation services until one succeeds
 * @param onRateLimit - Optional callback when rate limited
 * @returns Geolocation result with country code, country, and service name
 * @throws {Error} If all services fail
 */
export async function fetchGeolocationFromAllServices(
  onRateLimit: OnRateLimitCallback | null = null
): Promise<GeolocationResult> {
  const errors: string[] = [];

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
        service: service.name,
      };
    } catch (error) {
      // Log this service's failure and continue to next
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      errors.push(errorMessage);
      console.warn(`Geolocation service ${service.name} failed:`, errorMessage);
      continue;
    }
  }

  // All services failed
  throw new Error(`All geolocation services failed: ${errors.join('; ')}`);
}

/**
 * Determine if a geolocation request should be retried
 * @param error - The error that occurred
 * @param onRateLimit - Optional callback when rate limited
 * @returns Whether to retry
 */
function shouldRetryGeoRequest(
  error: Error,
  onRateLimit: OnRateLimitCallback | null
): boolean {
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
  if (
    error.message &&
    (error.message.includes('rate limit') || error.message.includes('Too many requests'))
  ) {
    if (onRateLimit) {
      onRateLimit();
    }
    return false;
  }

  // Retry other errors (timeouts, server errors, etc.)
  return true;
}
