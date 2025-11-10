/**
 * Formatting utilities for display
 */

import { BAC_CONSTANTS } from '../constants/index.js';

/**
 * Format BAC for display
 * @param {number} bac - BAC value
 * @param {number} decimals - Number of decimal places (default: 3)
 * @returns {string} Formatted BAC string
 */
export const formatBAC = (bac, decimals = 3) => {
  return bac.toFixed(decimals);
};

/**
 * Format time from timestamp
 * @param {number} timestamp - Unix timestamp in milliseconds
 * @returns {string} Formatted time string (e.g., "3:45 PM")
 */
export const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

/**
 * Format sober time for display
 * @param {number} bac - Current BAC value
 * @returns {string} Formatted sober time or placeholder
 */
export const formatSoberTime = (bac) => {
  if (bac === 0) return '--:--';

  const minutesToSober = Math.ceil((bac / BAC_CONSTANTS.METABOLISM_RATE) * 60);
  const soberTime = new Date(Date.now() + minutesToSober * 60000);

  return soberTime.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

/**
 * Get BAC status information based on current BAC level
 * @param {number} bac - Current BAC value
 * @returns {Object} Status object with text, color, and background classes
 */
export const getBACStatus = (bac) => {
  if (bac === 0) {
    return {
      text: 'Sober',
      color: 'text-green-600',
      bg: 'bg-green-50',
    };
  }
  if (bac < BAC_CONSTANTS.MILD_THRESHOLD) {
    return {
      text: 'Mild',
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
    };
  }
  if (bac < BAC_CONSTANTS.LEGAL_LIMIT) {
    return {
      text: 'Impaired',
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    };
  }
  return {
    text: 'Intoxicated',
    color: 'text-red-600',
    bg: 'bg-red-50',
  };
};

/**
 * Format drink description for display
 * @param {Object} drink - Drink object
 * @returns {string} Formatted drink description
 */
export const formatDrinkDescription = (drink) => {
  if (drink.type && drink.type !== 'Standard Drink') {
    return drink.type;
  }
  return `${drink.standardDrinks.toFixed(1)} standard drink(s)`;
};

/**
 * Format duration in hours and minutes
 * @param {number} milliseconds - Duration in milliseconds
 * @returns {string} Formatted duration (e.g., "2h 30m")
 */
export const formatDuration = (milliseconds) => {
  const totalMinutes = Math.floor(milliseconds / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) {
    return `${minutes}m`;
  }
  if (minutes === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${minutes}m`;
};
