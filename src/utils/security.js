/**
 * Security utilities for input sanitization and validation
 * Prevents XSS, injection attacks, and validates user inputs
 */

/**
 * Sanitizes string input by removing potentially dangerous characters
 * Prevents XSS attacks by escaping HTML entities
 * @param {string} input - The input string to sanitize
 * @returns {string} - Sanitized string safe for display
 */
export const sanitizeString = (input) => {
  if (typeof input !== 'string') {
    return String(input);
  }

  // Remove any HTML tags
  let sanitized = input.replace(/<[^>]*>/g, '');

  // Escape HTML entities
  sanitized = sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');

  // Limit length to prevent DoS
  return sanitized.slice(0, 1000);
};

/**
 * Validates and sanitizes numeric input
 * @param {string|number} input - The numeric input to validate
 * @param {object} options - Validation options
 * @param {number} options.min - Minimum allowed value
 * @param {number} options.max - Maximum allowed value
 * @param {boolean} options.allowDecimals - Whether to allow decimal values
 * @param {boolean} options.allowNegative - Whether to allow negative values
 * @returns {object} - {isValid: boolean, value: number|null, error: string|null}
 */
export const validateNumber = (input, options = {}) => {
  const {
    min = -Infinity,
    max = Infinity,
    allowDecimals = true,
    allowNegative = true,
  } = options;

  // Convert to string for validation
  const inputStr = String(input).trim();

  // Check if empty
  if (inputStr === '') {
    return { isValid: false, value: null, error: 'Input cannot be empty' };
  }

  // Check for invalid characters
  const numRegex = allowDecimals
    ? /^-?\d+\.?\d*$/
    : /^-?\d+$/;

  if (!numRegex.test(inputStr)) {
    return { isValid: false, value: null, error: 'Invalid number format' };
  }

  const num = parseFloat(inputStr);

  // Check if NaN
  if (isNaN(num)) {
    return { isValid: false, value: null, error: 'Not a valid number' };
  }

  // Check for negative values
  if (!allowNegative && num < 0) {
    return { isValid: false, value: null, error: 'Negative values not allowed' };
  }

  // Check min/max bounds
  if (num < min) {
    return { isValid: false, value: null, error: `Value must be at least ${min}` };
  }

  if (num > max) {
    return { isValid: false, value: null, error: `Value must be less than ${max}` };
  }

  // Check for unreasonably large numbers (prevent DoS)
  if (Math.abs(num) > Number.MAX_SAFE_INTEGER) {
    return { isValid: false, value: null, error: 'Number too large' };
  }

  return { isValid: true, value: num, error: null };
};

/**
 * Validates weight input specifically for BAC calculations
 * @param {string|number} weight - Weight in pounds
 * @returns {object} - {isValid: boolean, value: number|null, error: string|null}
 */
export const validateWeight = (weight) => {
  return validateNumber(weight, {
    min: 50,
    max: 500,
    allowDecimals: true,
    allowNegative: false,
  });
};

/**
 * Validates drink count input
 * @param {string|number} drinks - Number of drinks
 * @returns {object} - {isValid: boolean, value: number|null, error: string|null}
 */
export const validateDrinkCount = (drinks) => {
  return validateNumber(drinks, {
    min: 0,
    max: 50, // Reasonable upper limit
    allowDecimals: true,
    allowNegative: false,
  });
};

/**
 * Validates hours input
 * @param {string|number} hours - Number of hours
 * @returns {object} - {isValid: boolean, value: number|null, error: string|null}
 */
export const validateHours = (hours) => {
  return validateNumber(hours, {
    min: 0,
    max: 48, // Reasonable upper limit (2 days)
    allowDecimals: true,
    allowNegative: false,
  });
};

/**
 * Validates alcohol by volume (ABV) percentage
 * @param {string|number} abv - ABV percentage
 * @returns {object} - {isValid: boolean, value: number|null, error: string|null}
 */
export const validateABV = (abv) => {
  return validateNumber(abv, {
    min: 0,
    max: 100,
    allowDecimals: true,
    allowNegative: false,
  });
};

/**
 * Validates drink volume in ounces
 * @param {string|number} ounces - Volume in ounces
 * @returns {object} - {isValid: boolean, value: number|null, error: string|null}
 */
export const validateOunces = (ounces) => {
  return validateNumber(ounces, {
    min: 0.1,
    max: 200, // Reasonable upper limit
    allowDecimals: true,
    allowNegative: false,
  });
};

/**
 * Validates tip/payment amount
 * @param {string|number} amount - Payment amount in dollars
 * @param {number} minAmount - Minimum allowed amount
 * @returns {object} - {isValid: boolean, value: number|null, error: string|null}
 */
export const validatePaymentAmount = (amount, minAmount = 3) => {
  return validateNumber(amount, {
    min: minAmount,
    max: 10000, // Reasonable upper limit
    allowDecimals: true,
    allowNegative: false,
  });
};

/**
 * Validates localStorage data to prevent injection attacks
 * @param {string} data - JSON string from localStorage
 * @returns {object|null} - Parsed object or null if invalid
 */
export const validateLocalStorageData = (data) => {
  if (!data || typeof data !== 'string') {
    return null;
  }

  try {
    const parsed = JSON.parse(data);

    // Ensure it's an object
    if (typeof parsed !== 'object' || parsed === null) {
      return null;
    }

    // Sanitize all string values in the object
    const sanitized = {};
    for (const key in parsed) {
      if (parsed.hasOwnProperty(key)) {
        const value = parsed[key];

        if (typeof value === 'string') {
          sanitized[key] = sanitizeString(value);
        } else if (typeof value === 'number') {
          // Validate numbers aren't dangerous
          if (isNaN(value) || !isFinite(value)) {
            sanitized[key] = 0;
          } else {
            sanitized[key] = value;
          }
        } else if (Array.isArray(value)) {
          // Sanitize array elements
          sanitized[key] = value.map(item => {
            if (typeof item === 'object' && item !== null) {
              return validateLocalStorageData(JSON.stringify(item));
            }
            return item;
          }).filter(item => item !== null);
        } else if (typeof value === 'boolean') {
          sanitized[key] = value;
        } else {
          sanitized[key] = value;
        }
      }
    }

    return sanitized;
  } catch (e) {
    console.error('Failed to validate localStorage data:', e);
    return null;
  }
};

/**
 * Sanitizes and validates gender input
 * @param {string} gender - Gender value
 * @returns {string|null} - Valid gender or null
 */
export const validateGender = (gender) => {
  const validGenders = ['male', 'female'];
  const sanitized = sanitizeString(gender).toLowerCase().trim();

  if (validGenders.includes(sanitized)) {
    return sanitized;
  }

  return null;
};

/**
 * Rate limiting helper to prevent rapid submissions
 */
export class RateLimiter {
  constructor(maxAttempts = 5, windowMs = 60000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
    this.attempts = new Map();
  }

  /**
   * Check if action is allowed
   * @param {string} key - Unique identifier for the action
   * @returns {boolean} - True if allowed, false if rate limited
   */
  isAllowed(key) {
    const now = Date.now();
    const userAttempts = this.attempts.get(key) || [];

    // Filter out old attempts
    const recentAttempts = userAttempts.filter(
      time => now - time < this.windowMs
    );

    if (recentAttempts.length >= this.maxAttempts) {
      return false;
    }

    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);

    return true;
  }

  /**
   * Clear rate limit for a key
   * @param {string} key - Unique identifier for the action
   */
  clear(key) {
    this.attempts.delete(key);
  }
}

/**
 * Content Security Policy helpers
 */
export const CSPHelpers = {
  /**
   * Validates that a URL is safe for external resources
   * @param {string} url - URL to validate
   * @returns {boolean} - True if safe
   */
  isSafeURL: (url) => {
    if (!url || typeof url !== 'string') {
      return false;
    }

    try {
      const parsed = new URL(url);

      // Only allow http, https, and data URLs
      const safeProtocols = ['http:', 'https:', 'data:'];
      if (!safeProtocols.includes(parsed.protocol)) {
        return false;
      }

      // Block suspicious patterns
      const suspiciousPatterns = [
        'javascript:',
        'vbscript:',
        'data:text/html',
        'data:application/javascript',
      ];

      if (suspiciousPatterns.some(pattern => url.toLowerCase().includes(pattern))) {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  },
};

export default {
  sanitizeString,
  validateNumber,
  validateWeight,
  validateDrinkCount,
  validateHours,
  validateABV,
  validateOunces,
  validatePaymentAmount,
  validateLocalStorageData,
  validateGender,
  RateLimiter,
  CSPHelpers,
};
