import React from 'react';
import { ShieldAlert } from 'lucide-react';

/**
 * AgeVerification Component
 * Displays age verification screen with ARIA labels for accessibility
 */
const AgeVerification = ({ onVerification, legalDrinkingAge = 21 }) => {
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 flex items-center justify-center"
      role="main"
      aria-labelledby="age-verification-title"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full"
        role="dialog"
        aria-modal="true"
        aria-labelledby="age-verification-title"
        aria-describedby="age-verification-description"
      >
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-24 h-24 mb-6 bg-red-100 rounded-full"
            aria-hidden="true"
          >
            <ShieldAlert className="w-16 h-16 text-red-600" />
          </div>
          <h1
            id="age-verification-title"
            className="text-3xl font-bold text-gray-800 mb-4"
          >
            Age Verification Required
          </h1>
          <div id="age-verification-description">
            <p className="text-lg text-gray-700 mb-2">
              This app involves alcohol consumption tracking.
            </p>
            <p className="text-md text-gray-600">
              You must be {legalDrinkingAge} years or older to continue.
            </p>
          </div>
        </div>

        <div className="space-y-4" role="group" aria-label="Age verification options">
          <button
            onClick={() => onVerification(true)}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-green-700 hover:to-emerald-700 transition shadow-lg focus:outline-none focus:ring-4 focus:ring-green-300"
            aria-label={`I confirm I am ${legalDrinkingAge} years or older`}
          >
            I am {legalDrinkingAge} or Older
          </button>

          <button
            onClick={() => onVerification(false)}
            className="w-full bg-gray-200 text-gray-700 py-4 rounded-xl font-semibold text-lg hover:bg-gray-300 transition focus:outline-none focus:ring-4 focus:ring-gray-300"
            aria-label={`I am under ${legalDrinkingAge} years old`}
          >
            I am Under {legalDrinkingAge}
          </button>
        </div>

        <div
          className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200"
          role="note"
          aria-label="Legal notice"
        >
          <p className="text-xs text-amber-800 text-center">
            By clicking "I am {legalDrinkingAge} or Older", you confirm that you are of legal drinking age in your jurisdiction.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AgeVerification;
