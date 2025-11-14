/**
 * TimeInfo Component
 * Displays elapsed time and estimated sober time
 */

import React from 'react';
import { Clock, Coffee } from 'lucide-react';

/**
 * TimeInfo Component
 *
 * @param {Object} props
 * @param {string} props.elapsedTime - Formatted elapsed time string (e.g., "2h 30m")
 * @param {string} props.soberTime - Formatted sober time string (e.g., "3h 15m")
 * @param {boolean} props.show - Whether to show the component (when drinks.length > 0)
 */
const TimeInfo = ({ elapsedTime, soberTime, show = true }) => {
  if (!show) return null;

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
};

export default TimeInfo;
