import CONSTANTS from '../constants/appConstants';

/**
 * Validates weight input
 * @param {string|number} weight - Weight value to validate
 * @returns {string} Error message if invalid, empty string if valid
 */
export const validateWeight = (weight) => {
  const w = parseFloat(weight);
  if (isNaN(w)) return 'Please enter a valid number';
  if (w < CONSTANTS.MIN_WEIGHT) return `Weight must be at least ${CONSTANTS.MIN_WEIGHT} lbs`;
  if (w > CONSTANTS.MAX_WEIGHT) return `Weight must be less than ${CONSTANTS.MAX_WEIGHT} lbs`;
  return '';
};
