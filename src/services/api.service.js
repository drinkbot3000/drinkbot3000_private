/**
 * API Service
 * Generic HTTP client with timeout, retry logic, and error handling
 * Provides a consistent interface for all API calls
 */

/**
 * HTTP request options
 * @typedef {Object} RequestOptions
 * @property {string} method - HTTP method (GET, POST, etc.)
 * @property {Object} [headers] - Request headers
 * @property {*} [body] - Request body (will be JSON stringified)
 * @property {number} [timeout] - Request timeout in milliseconds
 * @property {AbortSignal} [signal] - Optional abort signal
 * @property {boolean} [credentials] - Include credentials (default: false)
 * @property {string} [cache] - Cache mode (default: 'no-cache')
 */

/**
 * API error class with additional context
 */
export class ApiError extends Error {
  constructor(message, statusCode, response) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.response = response;
  }
}

/**
 * Make an HTTP request with timeout and error handling
 * @param {string} url - The URL to fetch
 * @param {RequestOptions} options - Request options
 * @returns {Promise<any>} The response data
 * @throws {ApiError} If the request fails
 */
export async function request(url, options = {}) {
  const {
    method = 'GET',
    headers = {},
    body = null,
    timeout = 8000,
    signal = null,
    credentials = false,
    cache = 'no-cache'
  } = options;

  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  // Use provided signal or controller signal
  const finalSignal = signal || controller.signal;

  try {
    const fetchOptions = {
      method,
      headers: {
        'Accept': 'application/json',
        ...headers
      },
      credentials: credentials ? 'include' : 'omit',
      cache,
      signal: finalSignal
    };

    // Add body if present
    if (body) {
      fetchOptions.headers['Content-Type'] = 'application/json';
      fetchOptions.body = JSON.stringify(body);
    }

    const response = await fetch(url, fetchOptions);

    // Handle non-OK responses
    if (!response.ok) {
      const errorMessage = getErrorMessage(response.status);
      throw new ApiError(errorMessage, response.status, response);
    }

    // Parse JSON response
    const data = await response.json();
    return data;

  } catch (error) {
    // Handle abort/timeout errors
    if (error.name === 'AbortError') {
      throw new ApiError('Request timeout - service took too long to respond', 408);
    }

    // Re-throw ApiError as-is
    if (error instanceof ApiError) {
      throw error;
    }

    // Wrap other errors
    throw new ApiError(error.message || 'Network request failed', 0, null);

  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Make a GET request
 * @param {string} url - The URL to fetch
 * @param {RequestOptions} options - Request options
 * @returns {Promise<any>} The response data
 */
export async function get(url, options = {}) {
  return request(url, { ...options, method: 'GET' });
}

/**
 * Make a POST request
 * @param {string} url - The URL to fetch
 * @param {*} body - Request body
 * @param {RequestOptions} options - Request options
 * @returns {Promise<any>} The response data
 */
export async function post(url, body, options = {}) {
  return request(url, { ...options, method: 'POST', body });
}

/**
 * Make a request with retry logic
 * @param {string} url - The URL to fetch
 * @param {RequestOptions} options - Request options
 * @param {number} maxRetries - Maximum number of retries (default: 2)
 * @param {Function} shouldRetry - Function to determine if error should be retried
 * @returns {Promise<any>} The response data
 */
export async function requestWithRetry(url, options = {}, maxRetries = 2, shouldRetry = defaultShouldRetry) {
  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await request(url, options);
    } catch (error) {
      lastError = error;

      // Check if we should retry this error
      if (!shouldRetry(error, attempt)) {
        throw error;
      }

      // Don't wait after the last attempt
      if (attempt < maxRetries) {
        // Exponential backoff: 1s, 2s, 4s...
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
      }
    }
  }

  throw lastError;
}

/**
 * Default retry logic - don't retry rate limits or client errors
 * @param {Error} error - The error that occurred
 * @returns {boolean} Whether to retry
 */
function defaultShouldRetry(error) {
  // Don't retry rate limit errors
  if (error instanceof ApiError) {
    if (error.statusCode === 429 || error.statusCode === 403) {
      return false;
    }
    // Don't retry client errors (4xx except 429)
    if (error.statusCode >= 400 && error.statusCode < 500) {
      return false;
    }
  }
  return true;
}

/**
 * Get a user-friendly error message based on status code
 * @param {number} statusCode - HTTP status code
 * @returns {string} Error message
 */
function getErrorMessage(statusCode) {
  switch (statusCode) {
    case 400:
      return 'Bad request';
    case 401:
      return 'Unauthorized';
    case 403:
      return 'Service temporarily unavailable (rate limit or access restriction)';
    case 404:
      return 'Resource not found';
    case 429:
      return 'Too many requests. Service rate limited.';
    case 500:
      return 'Internal server error';
    case 502:
      return 'Bad gateway';
    case 503:
      return 'Service unavailable';
    case 504:
      return 'Gateway timeout';
    default:
      if (statusCode >= 500) {
        return 'Service is currently down';
      }
      return `Request failed with status ${statusCode}`;
  }
}
