/**
 * BACDisplay Component
 * Displays current BAC level with color-coded status
 */

import React from 'react';

/**
 * BACDisplay Component
 *
 * @param {Object} props
 * @param {number} props.bac - Current BAC value (e.g., 0.08)
 * @param {Object} props.status - BAC status object
 * @param {string} props.status.bgColor - Background color class
 * @param {string} props.status.label - Status label (e.g., "Legally Impaired")
 * @param {string} props.status.message - Status message
 */
const BACDisplay = ({ bac, status }) => {
  return (
    <div className={`rounded-2xl shadow-xl p-8 mb-6 ${status.bgColor}`}>
      <div className="text-center">
        <div className="text-6xl font-bold text-white mb-2">
          {bac.toFixed(3)}%
        </div>
        <div className="text-xl text-white font-medium mb-4">
          {status.label}
        </div>
        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
          <p className="text-white text-sm">{status.message}</p>
        </div>
      </div>
    </div>
  );
};

export default BACDisplay;
