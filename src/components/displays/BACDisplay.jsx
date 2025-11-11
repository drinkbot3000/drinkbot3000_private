import React from 'react';

/**
 * BACDisplay - Displays the current Blood Alcohol Content percentage with status
 *
 * Modern pattern: Uses React.memo for optimization since BAC updates frequently
 * but we want to prevent unnecessary re-renders when props haven't changed.
 *
 * @param {number} bac - Blood Alcohol Content as a decimal (e.g., 0.08 for 0.08%)
 * @param {object} status - Status object with { label, bgColor, message }
 */
const BACDisplay = React.memo(({ bac, status }) => {
  return (
    <div className={`rounded-2xl shadow-xl p-8 mb-6 ${status.bgColor}`}>
      <div className="text-center">
        <div className="text-6xl font-bold text-white mb-2">
          {bac.toFixed(3)}%
        </div>
        <div className="text-xl text-white font-medium mb-4">{status.label}</div>
        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
          <p className="text-white text-sm">{status.message}</p>
        </div>
      </div>
    </div>
  );
});

BACDisplay.displayName = 'BACDisplay';

export default BACDisplay;
