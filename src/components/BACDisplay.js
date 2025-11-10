import React from 'react';
import { Activity, Clock, AlertCircle } from 'lucide-react';

/**
 * BACDisplay Component
 * Displays current BAC level, status, and estimated sober time with ARIA labels
 */
const BACDisplay = ({ bac, status, soberTime, minutesToSober, isOverLegalLimit }) => {
  return (
    <div
      className="bg-white rounded-2xl shadow-xl p-6 mb-6"
      role="region"
      aria-labelledby="bac-display-heading"
    >
      <h2 id="bac-display-heading" className="sr-only">
        Blood Alcohol Content Display
      </h2>

      {/* Main BAC Display */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-2">
          <Activity className="w-6 h-6 text-indigo-600 mr-2" aria-hidden="true" />
          <h3 className="text-lg font-semibold text-gray-700">Current BAC</h3>
        </div>
        <div
          className="text-6xl font-bold text-gray-800 mb-2"
          role="status"
          aria-live="polite"
          aria-atomic="true"
          aria-label={`Current blood alcohol content is ${bac.toFixed(3)} percent`}
        >
          {bac.toFixed(3)}%
        </div>

        <div
          className={`inline-block px-4 py-2 rounded-full ${status.bg} ${status.color} font-semibold`}
          role="status"
          aria-live="polite"
          aria-label={`Status: ${status.text}`}
        >
          {status.text}
        </div>
      </div>

      {/* Legal Limit Warning */}
      {isOverLegalLimit && (
        <div
          className="bg-red-50 border-2 border-red-300 rounded-lg p-4 mb-4"
          role="alert"
          aria-live="assertive"
        >
          <div className="flex items-start">
            <AlertCircle className="w-6 h-6 text-red-600 mr-3 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="font-bold text-red-900 mb-1">Over Legal Limit</p>
              <p className="text-sm text-red-800">
                You are above the 0.08% legal limit. Do not drive, operate machinery, or make important decisions.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Sober Time Estimate */}
      {bac > 0 && (
        <div className="bg-indigo-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-indigo-600 mr-2" aria-hidden="true" />
              <span className="font-medium text-gray-700">Estimated Sober Time:</span>
            </div>
            <span
              className="text-lg font-bold text-indigo-600"
              aria-label={`Estimated to be sober at ${soberTime}`}
            >
              {soberTime}
            </span>
          </div>
          <p className="text-xs text-gray-600 mt-2" role="note">
            Based on average metabolism of 0.015% per hour. Individual results may vary significantly.
          </p>
        </div>
      )}

      {/* Safety Message */}
      <div
        className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200"
        role="note"
        aria-label="Safety reminder"
      >
        <p className="text-xs text-amber-800 text-center">
          ⚠️ Never drive after drinking, even if BAC is below the legal limit. Impairment begins at ANY BAC level.
        </p>
      </div>
    </div>
  );
};

export default BACDisplay;
