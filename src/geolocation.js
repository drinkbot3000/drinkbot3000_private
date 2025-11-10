// Geographic Verification Service
// Uses IP-based geolocation to check if user is in a prohibited country
// Privacy: IP address is NOT stored, check is one-time only

const PROHIBITED_COUNTRIES = [
  'AF', // Afghanistan
  'SA', // Saudi Arabia
  'KW', // Kuwait
  'IR', // Iran
  'PK', // Pakistan
  'BD', // Bangladesh
  'LY', // Libya
  'SO', // Somalia
  'SD', // Sudan
  'YE', // Yemen
  'MR', // Mauritania
  'BN', // Brunei
  'MV', // Maldives
  'IQ', // Iraq
  'SY', // Syria
];

/**
 * Check if user's country is prohibited
 * Uses IP-API.com free tier (no API key required)
 * Privacy-focused: only country code is retrieved
 *
 * @returns {Promise<{allowed: boolean, country: string, error: string|null}>}
 */
export async function checkGeographicRestriction() {
  try {
    // Check if user has already been verified
    const geoVerified = localStorage.getItem('geoVerified');
    if (geoVerified) {
      return {
        allowed: geoVerified === 'true',
        country: localStorage.getItem('userCountry') || 'Unknown',
        error: null,
        cached: true
      };
    }

    // Make ONE request to IP geolocation service
    // Using IP-API.com free tier - no auth required, privacy-focused
    const response = await fetch('https://ip-api.com/json/?fields=status,country,countryCode', {
      method: 'GET',
      // No credentials, no cookies
      credentials: 'omit',
      // Request minimal data
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Geolocation service unavailable');
    }

    const data = await response.json();

    if (data.status !== 'success') {
      throw new Error('Could not determine country');
    }

    const countryCode = data.countryCode;
    const countryName = data.country;
    const isProhibited = PROHIBITED_COUNTRIES.includes(countryCode);

    // Store verification result (NOT the IP address)
    localStorage.setItem('geoVerified', (!isProhibited).toString());
    localStorage.setItem('userCountry', countryName);

    // Return result immediately - no data persisted except localStorage flag
    return {
      allowed: !isProhibited,
      country: countryName,
      countryCode: countryCode,
      error: null
    };

  } catch (error) {
    console.error('Geographic verification error:', error);

    // In case of error, allow access but log warning
    // This prevents false positives due to network issues
    return {
      allowed: true,
      country: 'Unknown',
      error: error.message,
      warning: 'Geographic verification failed - proceeding with caution'
    };
  }
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
