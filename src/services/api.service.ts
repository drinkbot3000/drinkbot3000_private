/**
 * API Service
 * Generic HTTP client with timeout, retry logic, and error handling
 * Provides a consistent interface for all API calls with full type safety
 */

/**
 * HTTP request options
 */
export interface RequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  signal?: AbortSignal | null;
  credentials?: boolean;
  cache?: RequestCache;
}

/**
 * Retry decision function type
 */
export type ShouldRetryFunction = (error: Error, attempt: number) => boolean;

/**
 * API error class with additional context
 */
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly response: Response | null;

  constructor(message: string, statusCode: number, response: Response | null = null) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.response = response;

    // Restore prototype chain for instanceof checks
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

/**
 * Make an HTTP request with timeout and error handling
 * @param url - The URL to fetch
 * @param options - Request options
 * @returns The response data
 * @throws {ApiError} If the request fails
 */
export async function request<T = any>(url: string, options: RequestOptions = {}): Promise<T> {
  const {
    method = 'GET',
    headers = {},
    body = null,
    timeout = 8000,
    signal = null,
    credentials = false,
    cache = 'no-cache',
  } = options;

  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  // Use provided signal or controller signal
  const finalSignal = signal || controller.signal;

  try {
    const fetchOptions: RequestInit = {
      method,
      headers: {
        Accept: 'application/json',
        ...headers,
      },
      credentials: credentials ? 'include' : 'omit',
      cache,
      signal: finalSignal,
    };

    // Add body if present
    if (body) {
      fetchOptions.headers = {
        ...fetchOptions.headers,
        'Content-Type': 'application/json',
      };
      fetchOptions.body = JSON.stringify(body);
    }

    const response = await fetch(url, fetchOptions);

    // Handle non-OK responses
    if (!response.ok) {
      const errorMessage = getErrorMessage(response.status);
      throw new ApiError(errorMessage, response.status, response);
    }

    // Parse JSON response
    const data: T = await response.json();
    return data;
  } catch (error) {
    // Handle abort/timeout errors
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError('Request timeout - service took too long to respond', 408);
    }

    // Re-throw ApiError as-is
    if (error instanceof ApiError) {
      throw error;
    }

    // Wrap other errors
    const message = error instanceof Error ? error.message : 'Network request failed';
    throw new ApiError(message, 0, null);
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Make a GET request
 * @param url - The URL to fetch
 * @param options - Request options
 * @returns The response data
 */
export async function get<T = any>(url: string, options: RequestOptions = {}): Promise<T> {
  return request<T>(url, { ...options, method: 'GET' });
}

/**
 * Make a POST request
 * @param url - The URL to fetch
 * @param body - Request body
 * @param options - Request options
 * @returns The response data
 */
export async function post<T = any>(
  url: string,
  body: any,
  options: RequestOptions = {}
): Promise<T> {
  return request<T>(url, { ...options, method: 'POST', body });
}

/**
 * Make a request with retry logic
 * @param url - The URL to fetch
 * @param options - Request options
 * @param maxRetries - Maximum number of retries (default: 2)
 * @param shouldRetry - Function to determine if error should be retried
 * @returns The response data
 */
export async function requestWithRetry<T = any>(
  url: string,
  options: RequestOptions = {},
  maxRetries = 2,
  shouldRetry: ShouldRetryFunction = defaultShouldRetry
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await request<T>(url, options);
    } catch (error) {
      lastError = error as Error;

      // Check if we should retry this error
      if (!shouldRetry(lastError, attempt)) {
        throw error;
      }

      // Don't wait after the last attempt
      if (attempt < maxRetries) {
        // Exponential backoff: 1s, 2s, 4s...
        await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
      }
    }
  }

  throw lastError;
}

/**
 * Default retry logic - don't retry rate limits or client errors
 * @param error - The error that occurred
 * @param attempt - Current attempt number (unused in default logic)
 * @returns Whether to retry
 */
function defaultShouldRetry(error: Error, attempt: number): boolean {
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
 * @param statusCode - HTTP status code
 * @returns Error message
 */
function getErrorMessage(statusCode: number): string {
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
