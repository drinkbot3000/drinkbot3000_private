import React from 'react';

/**
 * RobotMessageDisplay - Displays temporary robot messages with animation
 *
 * Modern pattern: Uses React.memo since this component mounts/unmounts frequently
 * and we want to optimize the render cycle
 *
 * @param {string} message - The message to display
 * @param {boolean} isVisible - Whether the message should be shown
 */
const RobotMessageDisplay = React.memo(({ message, isVisible }) => {
  if (!isVisible || !message) return null;

  return (
    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 mb-6 border-2 border-purple-200 animate-pulse">
      <p className="text-purple-900 font-medium text-center">{message}</p>
    </div>
  );
});

RobotMessageDisplay.displayName = 'RobotMessageDisplay';

export default RobotMessageDisplay;
