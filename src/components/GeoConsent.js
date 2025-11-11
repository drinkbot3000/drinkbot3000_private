import React from 'react';
import { Globe } from 'lucide-react';

export default function GeoConsent({ onAccept, onDecline }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 p-6 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-24 h-24 mb-6 bg-blue-100 rounded-full">
            <Globe className="w-16 h-16 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">🇺🇸 USA Location Verification</h1>
          <p className="text-lg text-gray-700 mb-4">
            This is a USA-only service. We need to verify you're in the United States.
          </p>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 mb-6 border-2 border-blue-200">
          <p className="text-gray-800 font-semibold mb-3">What We Check:</p>
          <ul className="text-sm text-gray-700 space-y-2 text-left">
            <li>✓ Your country only (via IP address)</li>
            <li>✓ One-time verification only</li>
            <li>✓ NOT your precise location within USA (no GPS)</li>
            <li>✓ IP address is NOT stored</li>
          </ul>
        </div>

        <div className="bg-amber-50 rounded-lg p-4 mb-6 border border-amber-200">
          <p className="text-amber-900 font-semibold mb-2">🇺🇸 USA-Only Access:</p>
          <p className="text-sm text-amber-800">
            DrinkBot3000 is only available to users physically located in the United States. We must verify your location for legal compliance and service restrictions.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={onAccept}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transition shadow-lg"
          >
            I Consent to USA Location Verification
          </button>

          <button
            onClick={onDecline}
            className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition"
          >
            I Do Not Consent
          </button>
        </div>

        <div className="mt-4 text-center">
          <a href="/privacy.html" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
            Read our Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
}
