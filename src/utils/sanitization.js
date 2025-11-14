/**
 * Input Sanitization Utilities
 * Protects against XSS attacks and malicious input
 */

import DOMPurify from 'dompurify';

/**
 * Sanitize user-provided text input
 * Removes all HTML tags and potentially malicious content
 *
 * @param {string} input - User-provided input
 * @returns {string} Sanitized string safe for display
 *
 * @example
 * sanitizeText('<script>alert("XSS")</script>Hello')
 * // Returns: 'Hello'
 */
export const sanitizeText = (input) => {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // Remove all HTML tags - we don't want any markup in user input
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true
  }).trim();
};

/**
 * Validate and sanitize drink name
 * Only allows alphanumeric characters, spaces, and basic punctuation
 *
 * @param {string} name - Drink name to validate
 * @returns {{valid: boolean, sanitized: string, error: string|null}}
 *
 * @example
 * validateDrinkName('Beer 🍺<script>')
 * // Returns: { valid: false, sanitized: 'Beer', error: 'Invalid characters...' }
 */
export const validateDrinkName = (name) => {
  if (!name || typeof name !== 'string') {
    return {
      valid: false,
      sanitized: '',
      error: 'Drink name is required'
    };
  }

  // First sanitize to remove any HTML
  const sanitized = sanitizeText(name);

  // Check length
  if (sanitized.length === 0) {
    return {
      valid: false,
      sanitized: '',
      error: 'Drink name cannot be empty'
    };
  }

  if (sanitized.length > 50) {
    return {
      valid: false,
      sanitized: sanitized.substring(0, 50),
      error: 'Drink name too long (max 50 characters)'
    };
  }

  // Only allow safe characters: letters, numbers, spaces, and basic punctuation
  const safePattern = /^[a-zA-Z0-9\s\-'().,!?&]+$/;

  if (!safePattern.test(sanitized)) {
    return {
      valid: false,
      sanitized: sanitized.replace(/[^a-zA-Z0-9\s\-'().,!?&]/g, ''),
      error: 'Drink name contains invalid characters. Only letters, numbers, spaces, and basic punctuation allowed.'
    };
  }

  return {
    valid: true,
    sanitized,
    error: null
  };
};

/**
 * Sanitize numeric input
 * Ensures value is a valid number within specified bounds
 *
 * @param {any} value - Value to sanitize
 * @param {Object} options - Validation options
 * @param {number} options.min - Minimum allowed value
 * @param {number} options.max - Maximum allowed value
 * @param {number} options.decimals - Maximum decimal places (default: 2)
 * @returns {{valid: boolean, value: number|null, error: string|null}}
 *
 * @example
 * sanitizeNumericInput('12.5', { min: 0, max: 100 })
 * // Returns: { valid: true, value: 12.5, error: null }
 */
export const sanitizeNumericInput = (value, options = {}) => {
  const {
    min = -Infinity,
    max = Infinity,
    decimals = 2,
    allowNegative = false
  } = options;

  // Handle empty or invalid input
  if (value === null || value === undefined || value === '') {
    return {
      valid: false,
      value: null,
      error: 'Value is required'
    };
  }

  // Convert to number
  const numValue = parseFloat(value);

  // Check if valid number
  if (isNaN(numValue) || !isFinite(numValue)) {
    return {
      valid: false,
      value: null,
      error: 'Must be a valid number'
    };
  }

  // Check negative values
  if (!allowNegative && numValue < 0) {
    return {
      valid: false,
      value: null,
      error: 'Negative values not allowed'
    };
  }

  // Check bounds
  if (numValue < min) {
    return {
      valid: false,
      value: numValue,
      error: `Value must be at least ${min}`
    };
  }

  if (numValue > max) {
    return {
      valid: false,
      value: numValue,
      error: `Value must be at most ${max}`
    };
  }

  // Round to specified decimal places
  const rounded = Math.round(numValue * Math.pow(10, decimals)) / Math.pow(10, decimals);

  return {
    valid: true,
    value: rounded,
    error: null
  };
};

/**
 * Sanitize localStorage data
 * Validates structure and types of data loaded from localStorage
 * Prevents localStorage injection attacks
 *
 * @param {any} data - Data loaded from localStorage
 * @param {Object} schema - Expected schema
 * @returns {{valid: boolean, data: any, errors: string[]}}
 *
 * @example
 * const schema = {
 *   gender: { type: 'string', enum: ['male', 'female'] },
 *   weight: { type: 'string', pattern: /^\d+(\.\d+)?$/ }
 * };
 * sanitizeStorageData(data, schema)
 */
export const sanitizeStorageData = (data, schema) => {
  const errors = [];

  if (!data || typeof data !== 'object') {
    return {
      valid: false,
      data: null,
      errors: ['Invalid data structure']
    };
  }

  const sanitizedData = {};

  for (const [key, rules] of Object.entries(schema)) {
    const value = data[key];

    // Check required fields
    if (rules.required && (value === undefined || value === null)) {
      errors.push(`Missing required field: ${key}`);
      continue;
    }

    // Skip optional missing fields
    if (!rules.required && (value === undefined || value === null)) {
      continue;
    }

    // Type checking
    if (rules.type && typeof value !== rules.type) {
      errors.push(`Invalid type for ${key}: expected ${rules.type}, got ${typeof value}`);
      continue;
    }

    // Enum validation
    if (rules.enum && !rules.enum.includes(value)) {
      errors.push(`Invalid value for ${key}: must be one of ${rules.enum.join(', ')}`);
      continue;
    }

    // Pattern validation
    if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
      errors.push(`Invalid format for ${key}`);
      continue;
    }

    // Array validation
    if (rules.type === 'array' && !Array.isArray(value)) {
      errors.push(`${key} must be an array`);
      continue;
    }

    // If all validations pass, add to sanitized data
    sanitizedData[key] = value;
  }

  return {
    valid: errors.length === 0,
    data: sanitizedData,
    errors
  };
};

/**
 * Escape HTML entities
 * Additional layer of protection for displaying user content
 *
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
export const escapeHTML = (str) => {
  if (!str || typeof str !== 'string') {
    return '';
  }

  const entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;'
  };

  return str.replace(/[&<>"'\/]/g, (char) => entityMap[char]);
};
