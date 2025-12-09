/**
 * AgeVerification Component
 * Age gate for alcohol-related content
 */

import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { CONSTANTS } from '../../constants';

interface AgeVerificationProps {
  onVerify: (isOfAge: boolean) => void;
}

export function AgeVerification({ onVerify }: AgeVerificationProps): JSX.Element {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 mb-6 bg-red-100 rounded-full">
            <ShieldAlert className="w-16 h-16 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Age Verification Required</h1>
          <p className="text-lg text-gray-700 mb-2">
            This app involves alcohol consumption tracking.
          </p>
          <p className="text-md text-gray-600 mb-6">
            You must be {CONSTANTS.LEGAL_DRINKING_AGE} or older to use this app.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => onVerify(true)}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-green-700 hover:to-emerald-700 transition shadow-lg"
          >
            I am {CONSTANTS.LEGAL_DRINKING_AGE} or Older
          </button>

          <button
            onClick={() => onVerify(false)}
            className="w-full bg-gray-200 text-gray-700 py-4 rounded-xl font-semibold text-lg hover:bg-gray-300 transition"
          >
            I am Under {CONSTANTS.LEGAL_DRINKING_AGE}
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            By clicking "I am {CONSTANTS.LEGAL_DRINKING_AGE} or Older", you confirm that you are of
            legal drinking age in your jurisdiction.
          </p>
        </div>
      </div>
    </div>
  );
}
