/**
 * BAC Status Utility
 * Determines the status level, colors, and message based on Blood Alcohol Content
 */

const LEGAL_LIMIT = 0.08;

/**
 * Get BAC status information
 * @param {number} bac - Blood Alcohol Content percentage
 * @returns {object} Status object with label, bgColor, and message
 */
export const getBACStatus = (bac) => {
  if (bac === 0) {
    return {
      label: 'Sober',
      bgColor: 'bg-gradient-to-br from-green-500 to-emerald-600',
      message: 'You are sober. Stay safe!'
    };
  }

  if (bac < 0.03) {
    return {
      label: 'Mild',
      bgColor: 'bg-gradient-to-br from-yellow-500 to-amber-600',
      message: 'Slight euphoria and talkativeness. Coordination may be slightly impaired.'
    };
  }

  if (bac < LEGAL_LIMIT) {
    return {
      label: 'Impaired',
      bgColor: 'bg-gradient-to-br from-orange-500 to-red-500',
      message: 'Impaired judgment and coordination. DO NOT drive or operate machinery.'
    };
  }

  return {
    label: 'Intoxicated',
    bgColor: 'bg-gradient-to-br from-red-600 to-rose-700',
    message: 'Legally intoxicated. Severe impairment. Seek assistance if needed.'
  };
};

/**
 * Legacy format for backward compatibility
 * Returns {text, color, bg} format
 */
export const getBACStatusLegacy = (bac) => {
  if (bac === 0) return { text: 'Sober', color: 'text-green-600', bg: 'bg-green-50' };
  if (bac < 0.03) return { text: 'Mild', color: 'text-yellow-600', bg: 'bg-yellow-50' };
  if (bac < LEGAL_LIMIT) return { text: 'Impaired', color: 'text-orange-600', bg: 'bg-orange-50' };
  return { text: 'Intoxicated', color: 'text-red-600', bg: 'bg-red-50' };
};
