import React from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * SplashScreen Component
 * Displays main splash screen with drunk driving statistics and ARIA labels for accessibility
 */
const SplashScreen = ({ onContinue }) => {
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-900 p-6 flex items-center justify-center"
      role="main"
      aria-labelledby="splash-title"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full"
        role="dialog"
        aria-modal="true"
        aria-labelledby="splash-title"
        aria-describedby="splash-description"
      >
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-24 h-24 mb-6 bg-red-100 rounded-full"
            aria-hidden="true"
          >
            <AlertCircle className="w-16 h-16 text-red-600" />
          </div>
          <h1
            id="splash-title"
            className="text-4xl font-bold text-gray-800 mb-4"
          >
            Every 42 Minutes
          </h1>
          <div id="splash-description">
            <p className="text-xl text-gray-700 mb-6">
              Someone dies from drunk driving in the USA
            </p>
            <div className="bg-red-50 rounded-lg p-4 mb-6 border-2 border-red-200" role="alert">
              <p className="text-gray-700 font-medium mb-3">
                DrinkBot3000 helps you track BAC estimates and make responsible decisions.
              </p>
              <p className="text-sm text-red-700 font-semibold">
                ⚠️ NEVER drive after drinking, even below the legal limit. Impairment begins at ANY BAC level.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onContinue}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-lg focus:outline-none focus:ring-4 focus:ring-indigo-300"
          aria-label="Continue to DrinkBot3000 application"
        >
          Continue to App
        </button>

        <div className="mt-6 text-center" role="note" aria-label="Disclaimer">
          <p className="text-xs text-gray-600 italic">
            Estimates only • Not medical advice • Drink responsibly • Never drink and drive
          </p>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
