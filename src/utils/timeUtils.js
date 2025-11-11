import CONSTANTS from '../constants/appConstants';

/**
 * Format timestamp to time string
 * @param {number} timestamp - Timestamp to format
 * @returns {string} Formatted time
 */
export const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

/**
 * Calculate estimated sober time
 * @param {number} bac - Current BAC
 * @returns {string} Estimated sober time
 */
export const getSoberTime = (bac) => {
  if (bac === 0) return '--:--';
  const minutesToSober = Math.ceil((bac / CONSTANTS.METABOLISM_RATE) * 60);
  const soberTime = new Date(Date.now() + minutesToSober * 60000);
  return soberTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};

/**
 * Calculate elapsed time since first drink
 * @param {Array} drinks - List of drinks
 * @param {number} startTime - Start time
 * @returns {string} Elapsed time formatted
 */
export const calculateElapsedTime = (drinks, startTime) => {
  if (drinks.length === 0) return '0m';
  const firstDrinkTime = startTime || drinks[0].timestamp;
  const elapsedMs = Date.now() - firstDrinkTime;
  const hours = Math.floor(elapsedMs / (1000 * 60 * 60));
  const minutes = Math.floor((elapsedMs % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};
