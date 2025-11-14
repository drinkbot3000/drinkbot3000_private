/**
 * Formatting Utilities
 * Functions for formatting data for display
 */

/**
 * Format timestamp as locale time string
 *
 * @param {number} timestamp - Unix timestamp
 * @returns {string} Formatted time string
 *
 * @example
 * formatTime(1699564800000)
 * // Returns: "3:00:00 PM" (locale-dependent)
 */
export const formatTime = (timestamp) => {
  if (!timestamp) {
    return '';
  }

  try {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  } catch (error) {
    console.error('Error formatting time:', error);
    return '';
  }
};

/**
 * Format timestamp as locale date and time string
 *
 * @param {number} timestamp - Unix timestamp
 * @returns {string} Formatted date and time string
 *
 * @example
 * formatDateTime(1699564800000)
 * // Returns: "11/9/2023, 3:00:00 PM" (locale-dependent)
 */
export const formatDateTime = (timestamp) => {
  if (!timestamp) {
    return '';
  }

  try {
    const date = new Date(timestamp);
    return date.toLocaleString();
  } catch (error) {
    console.error('Error formatting date/time:', error);
    return '';
  }
};

/**
 * Format currency amount
 *
 * @param {number} amount - Amount in dollars
 * @param {string} currency - Currency code (default: 'USD')
 * @returns {string} Formatted currency string
 *
 * @example
 * formatCurrency(5.00)
 * // Returns: "$5.00"
 */
export const formatCurrency = (amount, currency = 'USD') => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '$0.00';
  }

  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(amount);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return `$${amount.toFixed(2)}`;
  }
};

/**
 * Format drink details for display
 *
 * @param {Object} drink - Drink object
 * @returns {string} Formatted drink description
 *
 * @example
 * formatDrinkDetails({ name: 'Beer', oz: 12, abv: 5, standardDrinks: 1.0 })
 * // Returns: "Beer (12 oz, 5% ABV) - 1.0 drinks"
 */
export const formatDrinkDetails = (drink) => {
  if (!drink) {
    return '';
  }

  const { name, type, oz, abv, standardDrinks } = drink;
  const drinkName = name || type || 'Drink';
  const ozStr = oz ? `${oz} oz` : '';
  const abvStr = abv ? `${abv}% ABV` : '';
  const drinksStr = standardDrinks ? `${standardDrinks.toFixed(1)} drinks` : '';

  const details = [ozStr, abvStr].filter(Boolean).join(', ');
  const detailsPart = details ? ` (${details})` : '';
  const drinksPart = drinksStr ? ` - ${drinksStr}` : '';

  return `${drinkName}${detailsPart}${drinksPart}`;
};

/**
 * Format weight for display
 *
 * @param {number|string} weight - Weight in pounds
 * @returns {string} Formatted weight string
 *
 * @example
 * formatWeight(180)
 * // Returns: "180 lbs"
 */
export const formatWeight = (weight) => {
  const numWeight = parseFloat(weight);

  if (isNaN(numWeight) || numWeight <= 0) {
    return '';
  }

  return `${numWeight} lbs`;
};

/**
 * Format gender for display
 *
 * @param {string} gender - Gender value
 * @returns {string} Formatted gender string
 *
 * @example
 * formatGender('male')
 * // Returns: "Male"
 */
export const formatGender = (gender) => {
  if (!gender) {
    return '';
  }

  return gender.charAt(0).toUpperCase() + gender.slice(1);
};

/**
 * Format plural text
 *
 * @param {number} count - Count
 * @param {string} singular - Singular form
 * @param {string} plural - Plural form (optional, defaults to singular + 's')
 * @returns {string} Formatted plural text
 *
 * @example
 * formatPlural(1, 'drink') // Returns: "1 drink"
 * formatPlural(2, 'drink') // Returns: "2 drinks"
 * formatPlural(1, 'glass', 'glasses') // Returns: "1 glass"
 */
export const formatPlural = (count, singular, plural) => {
  const pluralForm = plural || `${singular}s`;
  return `${count} ${count === 1 ? singular : pluralForm}`;
};

/**
 * Truncate text to specified length
 *
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @param {string} suffix - Suffix for truncated text (default: '...')
 * @returns {string} Truncated text
 *
 * @example
 * truncateText('This is a long text', 10)
 * // Returns: "This is a..."
 */
export const truncateText = (text, maxLength, suffix = '...') => {
  if (!text || text.length <= maxLength) {
    return text || '';
  }

  return text.substring(0, maxLength - suffix.length) + suffix;
};

/**
 * Format file size in human-readable format
 *
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted size string
 *
 * @example
 * formatFileSize(1536)
 * // Returns: "1.5 KB"
 */
export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) {
    return '0 B';
  }

  const units = ['B', 'KB', 'MB', 'GB'];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${units[i]}`;
};

/**
 * Format phone number (US format)
 *
 * @param {string} phone - Phone number
 * @returns {string} Formatted phone number
 *
 * @example
 * formatPhoneNumber('1234567890')
 * // Returns: "(123) 456-7890"
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) {
    return '';
  }

  // Remove non-numeric characters
  const cleaned = phone.replace(/\D/g, '');

  // Format as (XXX) XXX-XXXX
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }

  return phone;
};

/**
 * Format receipt ID
 *
 * @param {string} id - Receipt ID
 * @returns {string} Formatted receipt ID
 *
 * @example
 * formatReceiptId('DBT-1699564800000-ABC123XYZ')
 * // Returns: "DBT-1699564800000-ABC123XYZ"
 */
export const formatReceiptId = (id) => {
  return id || 'UNKNOWN';
};

/**
 * Format percentage
 *
 * @param {number} value - Value (0-1 or 0-100)
 * @param {boolean} isDecimal - Whether value is decimal (0-1) or percentage (0-100)
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted percentage
 *
 * @example
 * formatPercentage(0.5, true) // Returns: "50%"
 * formatPercentage(50, false) // Returns: "50%"
 */
export const formatPercentage = (value, isDecimal = true, decimals = 0) => {
  const percentage = isDecimal ? value * 100 : value;
  return `${percentage.toFixed(decimals)}%`;
};
