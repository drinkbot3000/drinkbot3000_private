/**
 * Disclaimer Component
 * Legal disclaimer that users must accept before using the app
 */

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '../common';

export interface DisclaimerProps {
  onAccept: () => void;
  onDecline: () => void;
}

/**
 * Disclaimer Component
 */
export function Disclaimer({ onAccept, onDecline }: DisclaimerProps): JSX.Element {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-900 p-6 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-4 bg-red-100 rounded-full">
            <AlertTriangle className="w-12 h-12 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Important Legal Disclaimer</h1>
          <p className="text-sm text-gray-600">Please read carefully before continuing</p>
        </div>

        <div className="space-y-4 text-sm text-gray-700 mb-6 bg-gray-50 p-6 rounded-lg max-h-96 overflow-y-auto">
          <div className="font-bold text-red-700 text-lg mb-4">
            ⚠️ THIS APP IS FOR INFORMATIONAL PURPOSES ONLY
          </div>

          <div className="space-y-3">
            <div>
              <p className="font-semibold">NOT A MEDICAL DEVICE:</p>
              <p>
                This application is NOT a medical device and should NOT be used to determine fitness
                to drive, operate machinery, or make any safety-critical decisions. Blood Alcohol
                Content (BAC) calculations are ESTIMATES ONLY and may not accurately reflect your
                actual BAC.
              </p>
            </div>

            <div>
              <p className="font-semibold mt-4">NO MEDICAL ADVICE:</p>
              <p>
                This app does not provide medical advice, diagnosis, or treatment. Consult a
                qualified healthcare professional for medical concerns. The developer is not liable
                for any health consequences resulting from app use.
              </p>
            </div>

            <div>
              <p className="font-semibold mt-4">ACCURACY DISCLAIMER:</p>
              <p>
                BAC calculations are based on general population averages. Individual metabolism
                varies significantly due to genetics, health conditions, medications, food
                consumption, hydration, and other factors. Actual BAC may be higher or lower than
                estimated.
              </p>
            </div>

            <div>
              <p className="font-semibold mt-4">LEGAL CONSEQUENCES:</p>
              <p>
                Using this app does NOT protect you from DUI/DWI charges or other legal
                consequences. Law enforcement uses certified breathalyzer devices. You may be
                impaired even if this app shows a low BAC.
              </p>
            </div>

            <div>
              <p className="font-semibold mt-4">NEVER DRINK AND DRIVE:</p>
              <p>
                Impairment begins at ANY BAC level. Even small amounts of alcohol impair judgment,
                reaction time, and coordination. Never drive, operate machinery, or engage in
                dangerous activities after consuming ANY amount of alcohol.
              </p>
            </div>

            <div>
              <p className="font-semibold mt-4">ASSUMPTION OF RISK:</p>
              <p>
                By using this app, you assume all risks and agree that the developer, its
                affiliates, and contributors are NOT liable for any damages, injuries, accidents,
                legal issues, or other consequences arising from your use of this application or
                decisions based on its output.
              </p>
            </div>

            <div>
              <p className="font-bold text-red-700 mt-6 text-base">
                IF YOU DO NOT AGREE TO THESE TERMS, DO NOT USE THIS APP.
              </p>
            </div>
          </div>
        </div>

        <div className="my-4 py-3 text-center border-y border-gray-200">
          <a
            href="/terms.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-800 font-medium underline text-sm"
          >
            📜 Read Full Terms of Service
          </a>
        </div>

        <div className="space-y-3">
          <Button variant="primary" size="lg" fullWidth onClick={onAccept} className="shadow-lg">
            I Understand and Accept
          </Button>

          <Button variant="secondary" fullWidth onClick={onDecline}>
            I Do Not Accept
          </Button>
        </div>
      </div>
    </div>
  );
}
