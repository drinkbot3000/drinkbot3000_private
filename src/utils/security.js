/**
 * Security Utilities
 * Functions to sanitize and validate user input to prevent XSS and injection attacks
 */

/**
 * Sanitize string input to prevent XSS attacks
 * @param {string} input - User input to sanitize
 * @returns {string} - Sanitized string
 */
export const sanitizeString = (input) => {
  if (typeof input !== 'string') {
    return '';
  }

  // Remove any HTML tags and script content
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML
    .replace(/[<>]/g, '') // Remove angle brackets
    .trim();
};

/**
 * Validate and sanitize numeric input
 * @param {any} input - Input to validate as number
 * @param {Object} options - Validation options
 * @param {number} options.min - Minimum allowed value
 * @param {number} options.max - Maximum allowed value
 * @param {number} options.default - Default value if invalid
 * @returns {number} - Validated number or default
 */
export const sanitizeNumber = (input, options = {}) => {
  const { min = -Infinity, max = Infinity, default: defaultValue = 0 } = options;

  const num = parseFloat(input);

  if (isNaN(num) || !isFinite(num)) {
    return defaultValue;
  }

  if (num < min) {
    return min;
  }

  if (num > max) {
    return max;
  }

  return num;
};

/**
 * Safely get item from localStorage with error handling
 * @param {string} key - localStorage key
 * @param {any} defaultValue - Default value if not found or error
 * @returns {any} - Stored value or default
 */
export const safeLocalStorageGet = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return defaultValue;
    }

    // Try to parse JSON if it looks like JSON
    if (item.startsWith('{') || item.startsWith('[')) {
      try {
        return JSON.parse(item);
      } catch {
        return item;
      }
    }

    return item;
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error);
    return defaultValue;
  }
};

/**
 * Safely set item in localStorage with error handling
 * @param {string} key - localStorage key
 * @param {any} value - Value to store
 * @returns {boolean} - Success status
 */
export const safeLocalStorageSet = (key, value) => {
  try {
    const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
    localStorage.setItem(key, stringValue);
    return true;
  } catch (error) {
    console.error(`Error writing to localStorage (${key}):`, error);
    return false;
  }
};

/**
 * Safely remove item from localStorage
 * @param {string} key - localStorage key
 * @returns {boolean} - Success status
 */
export const safeLocalStorageRemove = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing from localStorage (${key}):`, error);
    return false;
  }
};

/**
 * Validate email format (basic validation)
 * @param {string} email - Email to validate
 * @returns {boolean} - Is valid email
 */
export const isValidEmail = (email) => {
  if (typeof email !== 'string') {
    return false;
  }

  // Basic email regex - not perfect but good enough for basic validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Sanitize object for safe JSON storage
 * Removes functions and circular references
 * @param {any} obj - Object to sanitize
 * @returns {any} - Sanitized object
 */
export const sanitizeForStorage = (obj) => {
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch (error) {
    console.error('Error sanitizing object for storage:', error);
    return null;
  }
};

/**
 * Check if string contains potentially malicious content
 * @param {string} input - String to check
 * @returns {boolean} - True if suspicious content detected
 */
export const containsMaliciousContent = (input) => {
  if (typeof input !== 'string') {
    return false;
  }

  const maliciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i, // Event handlers like onclick=
    /<iframe/i,
    /eval\(/i,
    /expression\(/i,
  ];

  return maliciousPatterns.some((pattern) => pattern.test(input));
};
