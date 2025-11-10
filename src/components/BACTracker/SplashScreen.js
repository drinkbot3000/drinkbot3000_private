/**
 * SplashScreen Component
 * Displays the initial warning about drunk driving statistics
 */

import React from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * @param {Object} props
 * @param {Function} props.onContinue - Callback when user clicks continue
 */
const SplashScreen = ({ onContinue }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-900 p-6 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-24 h-24 mb-6 bg-red-100 rounded-full"
            role="img"
            aria-label="Warning icon"
          >
            <AlertCircle className="w-16 h-16 text-red-600" aria-hidden="true" />
          </div>

          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Every 42 Minutes
          </h1>

          <p className="text-xl text-gray-700 mb-6">
            Someone dies from drunk driving in the USA
          </p>

          <div className="bg-red-50 rounded-lg p-4 mb-6 border-2 border-red-200">
            <p className="text-gray-700 font-medium">
              DrinkBot3000 helps you track your BAC and make responsible decisions.
            </p>
          </div>
        </div>

        <button
          onClick={onContinue}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          aria-label="Continue to application"
        >
          Continue to App
        </button>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 italic">
            Please drink responsibly. Never drink and drive.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
