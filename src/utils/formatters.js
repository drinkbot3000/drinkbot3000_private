/**
 * Formatting Utilities
 * Helper functions for formatting data
 */

/**
 * Format timestamp to readable time
 * @param {number} timestamp - Unix timestamp
 * @returns {string} Formatted time string
 */
export const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Calculate elapsed time from start time
 * @param {number} startTime - Start timestamp
 * @returns {string} Formatted elapsed time (e.g., "2h 30m")
 */
export const calculateElapsedTime = (startTime) => {
  if (!startTime) return '0m';

  const elapsed = Date.now() - startTime;
  const hours = Math.floor(elapsed / (1000 * 60 * 60));
  const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

/**
 * Format date for display
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Format date and time for display
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date and time string
 */
export const formatDateTime = (date) => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format sober time estimate
 * @param {Date} soberTime - Estimated sober time
 * @returns {string} Formatted sober time message
 */
export const formatSoberTime = (soberTime) => {
  const now = new Date();
  const diffMs = soberTime - now;

  if (diffMs <= 0) {
    return 'You should be sober now';
  }

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.ceil((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) {
    return `Estimated sober in ${hours}h ${minutes}m (${soberTime.toLocaleTimeString()})`;
  }
  return `Estimated sober in ${minutes}m (${soberTime.toLocaleTimeString()})`;
};

/**
 * Format time duration until sober (just the duration part)
 * @param {Date} soberTime - Estimated sober time
 * @returns {string} Formatted duration string (e.g., "2h 30m")
 */
export const formatSoberDuration = (soberTime) => {
  const now = new Date();
  const diffMs = soberTime - now;

  if (diffMs <= 0) {
    return '0m';
  }

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.ceil((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

/**
 * Format BAC for display
 * @param {number} bac - BAC percentage
 * @returns {string} Formatted BAC string
 */
export const formatBAC = (bac) => {
  return bac.toFixed(3);
};

/**
 * Format currency
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  return `$${amount.toFixed(2)}`;
};
