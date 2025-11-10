/**
 * BACDisplay Component
 * Displays the current BAC value with status indicator
 */

import React, { useMemo } from 'react';
import { formatBAC, getBACStatus } from '../../utils/formatting';

/**
 * @param {Object} props
 * @param {number} props.bac - Current BAC value
 * @param {string} [props.className] - Additional CSS classes
 */
const BACDisplay = ({ bac, className = '' }) => {
  const status = useMemo(() => getBACStatus(bac), [bac]);

  return (
    <div className={`${status.bg} p-8 text-center ${className}`} role="region" aria-label="Blood Alcohol Content Display">
      <div className="mb-4">
        <div className="w-16 h-16 bg-slate-700 rounded-xl flex items-center justify-center mx-auto">
          <span className="text-4xl" role="img" aria-label="Robot icon">
            🤖
          </span>
        </div>
      </div>

      <h2 className="text-sm font-medium text-gray-600 mb-2">
        Current BAC
      </h2>

      <div
        className={`text-6xl font-bold ${status.color} mb-2`}
        aria-live="polite"
        aria-atomic="true"
      >
        {formatBAC(bac)}%
      </div>

      <div
        className={`inline-block px-4 py-1 rounded-full ${status.color} bg-white bg-opacity-50 font-semibold`}
        role="status"
        aria-label={`Status: ${status.text}`}
      >
        {status.text}
      </div>
    </div>
  );
};

export default React.memo(BACDisplay);
