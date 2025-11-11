import React from 'react';
import { Clock, Coffee } from 'lucide-react';

/**
 * TimeInfoBox - Displays elapsed time and estimated time until sober
 *
 * Modern pattern: Uses React.memo to optimize re-renders.
 * Although these values update frequently, memoization still helps
 * by preventing re-renders when parent updates but these specific props haven't changed.
 *
 * @param {string} elapsedTime - Formatted elapsed time (e.g., "2h 15m")
 * @param {string} soberTime - Formatted time until sober (e.g., "3:45 PM")
 * @param {boolean} showWhen - Whether to display the component (usually when drinks.length > 0)
 */
const TimeInfoBox = React.memo(({ elapsedTime, soberTime, showWhen }) => {
  if (!showWhen) return null;

  return (
    <div className="bg-white rounded-lg p-4 mb-6 shadow">
      <div className="grid grid-cols-2 gap-4 text-center">
        <div>
          <Clock className="w-5 h-5 text-gray-400 mx-auto mb-1" />
          <div className="text-2xl font-bold text-gray-800">{elapsedTime}</div>
          <div className="text-xs text-gray-500">Time Elapsed</div>
        </div>
        <div>
          <Coffee className="w-5 h-5 text-gray-400 mx-auto mb-1" />
          <div className="text-2xl font-bold text-gray-800">{soberTime}</div>
          <div className="text-xs text-gray-500">Until Sober</div>
        </div>
      </div>
    </div>
  );
});

TimeInfoBox.displayName = 'TimeInfoBox';

export default TimeInfoBox;
