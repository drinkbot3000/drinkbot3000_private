/**
 * Modern Storage Access API utilities
 * Handles Safari Tracking Prevention and Private Browsing gracefully
 */

/**
 * Check if Storage Access API is supported
 */
export function isStorageAccessSupported() {
  return 'hasStorageAccess' in document && 'requestStorageAccess' in document;
}

/**
 * Check if we currently have storage access
 */
export async function hasStorageAccess() {
  if (!isStorageAccessSupported()) {
    // Assume we have access if API is not supported
    return true;
  }

  try {
    return await document.hasStorageAccess();
  } catch (error) {
    console.warn('[Storage Access] Check failed:', error);
    return false;
  }
}

/**
 * Request storage access from the user
 * @returns {Promise<boolean>} True if access granted, false otherwise
 */
export async function requestStorageAccess() {
  if (!isStorageAccessSupported()) {
    console.log('[Storage Access] API not supported, assuming access granted');
    return true;
  }

  try {
    // Check if we already have access
    const hasAccess = await document.hasStorageAccess();
    if (hasAccess) {
      console.log('[Storage Access] Access already granted');
      return true;
    }

    // Request access - this may show a browser prompt
    await document.requestStorageAccess();
    console.log('[Storage Access] Access granted by user');
    return true;
  } catch (error) {
    // User denied or browser blocked the request
    console.warn('[Storage Access] Request denied:', error.message);
    return false;
  }
}

/**
 * Initialize storage access check on app load
 * Silently checks without prompting the user
 */
export async function initStorageAccess() {
  if (!isStorageAccessSupported()) {
    return { hasAccess: true, canRequest: false };
  }

  try {
    const hasAccess = await document.hasStorageAccess();
    return {
      hasAccess,
      canRequest: !hasAccess,
      isSupported: true
    };
  } catch (error) {
    console.warn('[Storage Access] Init check failed:', error);
    return {
      hasAccess: false,
      canRequest: false,
      isSupported: true,
      error: error.message
    };
  }
}

/**
 * Test if cache storage is actually available
 * More reliable than just checking Storage Access API
 */
export async function testCacheStorageAccess() {
  try {
    // Try to open a test cache
    const cacheName = 'storage-test';
    const cache = await caches.open(cacheName);
    await caches.delete(cacheName);
    return true;
  } catch (error) {
    console.warn('[Storage Access] Cache storage blocked:', error.message);
    return false;
  }
}

/**
 * Comprehensive storage check - combines all methods
 */
export async function checkStorageAvailability() {
  const [apiAccess, cacheAccess] = await Promise.all([
    hasStorageAccess(),
    testCacheStorageAccess()
  ]);

  return {
    apiAccess,
    cacheAccess,
    available: apiAccess && cacheAccess,
    isSupported: isStorageAccessSupported()
  };
}
