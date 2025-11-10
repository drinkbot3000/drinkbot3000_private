import React from 'react';
import { AlertTriangle } from 'lucide-react';

/**
 * DisclaimerModal Component
 * Displays legal disclaimer with ARIA labels for accessibility
 */
const DisclaimerModal = ({ onAccept, onDecline, legalDrinkingAge = 21 }) => {
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-900 p-6 flex items-center justify-center"
      role="main"
      aria-labelledby="disclaimer-title"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="disclaimer-title"
        aria-describedby="disclaimer-content"
      >
        <div className="text-center mb-6">
          <div
            className="inline-flex items-center justify-center w-20 h-20 mb-4 bg-red-100 rounded-full"
            aria-hidden="true"
          >
            <AlertTriangle className="w-12 h-12 text-red-600" />
          </div>
          <h1
            id="disclaimer-title"
            className="text-2xl font-bold text-gray-800 mb-2"
          >
            Important Legal Disclaimer
          </h1>
          <p className="text-sm text-gray-600">Please read carefully before continuing</p>
        </div>

        <div
          id="disclaimer-content"
          className="space-y-4 text-sm text-gray-700 mb-6 bg-gray-50 p-6 rounded-lg max-h-96 overflow-y-auto"
          role="article"
          aria-label="Disclaimer text"
          tabIndex="0"
        >
          <div className="font-bold text-red-700 text-lg mb-4" role="alert">
            ⚠️ THIS APP IS FOR INFORMATIONAL PURPOSES ONLY
          </div>

          <div className="space-y-3">
            <section aria-labelledby="disclaimer-medical-device">
              <p id="disclaimer-medical-device" className="font-semibold">NOT A MEDICAL DEVICE:</p>
              <p>This application is NOT a medical device and should NOT be used to determine fitness to drive, operate machinery, or make any safety-critical decisions. Blood Alcohol Content (BAC) calculations are ESTIMATES ONLY and may not accurately reflect your actual BAC.</p>
            </section>

            <section aria-labelledby="disclaimer-medical-advice">
              <p id="disclaimer-medical-advice" className="font-semibold mt-4">NO MEDICAL ADVICE:</p>
              <p>This app does not provide medical advice, diagnosis, or treatment. Consult a qualified healthcare professional for medical concerns. The developer is not liable for any health consequences resulting from app use.</p>
            </section>

            <section aria-labelledby="disclaimer-accuracy">
              <p id="disclaimer-accuracy" className="font-semibold mt-4">ACCURACY DISCLAIMER:</p>
              <p>BAC calculations are based on general population averages. Individual metabolism varies significantly due to genetics, health conditions, medications, food consumption, hydration, and other factors. Actual BAC may be higher or lower than estimated.</p>
            </section>

            <section aria-labelledby="disclaimer-legal">
              <p id="disclaimer-legal" className="font-semibold mt-4">LEGAL CONSEQUENCES:</p>
              <p>Using this app does NOT protect you from DUI/DWI charges or other legal consequences. Law enforcement uses certified breathalyzer devices. You may be impaired even if this app shows a low BAC.</p>
            </section>

            <section aria-labelledby="disclaimer-never-drink">
              <p id="disclaimer-never-drink" className="font-semibold mt-4">NEVER DRINK AND DRIVE:</p>
              <p>Impairment begins at ANY BAC level. Even small amounts of alcohol impair judgment, reaction time, and coordination. Never drive, operate machinery, or engage in dangerous activities after consuming ANY amount of alcohol.</p>
            </section>

            <section aria-labelledby="disclaimer-risk">
              <p id="disclaimer-risk" className="font-semibold mt-4">ASSUMPTION OF RISK:</p>
              <p>By using this app, you assume all risks and agree that the developer, its affiliates, and contributors are NOT liable for any damages, injuries, accidents, legal issues, or other consequences arising from your use of this application or decisions based on its output.</p>
            </section>

            <p className="font-bold text-red-700 mt-6 text-base" role="alert">
              IF YOU DO NOT AGREE TO THESE TERMS, DO NOT USE THIS APP.
            </p>
          </div>
        </div>

        <div className="space-y-3" role="group" aria-label="Disclaimer response options">
          <button
            onClick={onAccept}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-lg focus:outline-none focus:ring-4 focus:ring-indigo-300"
            aria-label="I understand and accept the disclaimer terms"
          >
            I Understand and Accept
          </button>

          <button
            onClick={onDecline}
            className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition focus:outline-none focus:ring-4 focus:ring-gray-300"
            aria-label="I do not accept the disclaimer terms"
          >
            I Do Not Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default DisclaimerModal;
