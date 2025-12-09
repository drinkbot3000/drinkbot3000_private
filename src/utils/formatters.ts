/**
 * Formatting Utilities
 * Helper functions for formatting data
 */

/**
 * Format timestamp to readable time
 * @param timestamp - Unix timestamp
 * @returns Formatted time string
 */
export const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Calculate elapsed time from start time
 * @param startTime - Start timestamp
 * @returns Formatted elapsed time (e.g., "2h 30m")
 */
export const calculateElapsedTime = (startTime: number | null): string => {
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
 * @param date - Date to format
 * @returns Formatted date string
 */
export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Format date and time for display
 * @param date - Date to format
 * @returns Formatted date and time string
 */
export const formatDateTime = (date: string | Date): string => {
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
 * @param soberTime - Estimated sober time
 * @returns Formatted sober time message
 */
export const formatSoberTime = (soberTime: Date): string => {
  const now = new Date();
  const diffMs = soberTime.getTime() - now.getTime();

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
 * @param soberTime - Estimated sober time
 * @returns Formatted duration string (e.g., "2h 30m")
 */
export const formatSoberDuration = (soberTime: Date): string => {
  const now = new Date();
  const diffMs = soberTime.getTime() - now.getTime();

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
 * @param bac - BAC percentage
 * @returns Formatted BAC string
 */
export const formatBAC = (bac: number): string => {
  return bac.toFixed(3);
};

/**
 * Format currency
 * @param amount - Amount to format
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number): string => {
  return `$${amount.toFixed(2)}`;
};
