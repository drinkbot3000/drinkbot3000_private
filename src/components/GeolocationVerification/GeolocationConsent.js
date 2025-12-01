/**
 * GeolocationConsent Component
 * Handles geographic verification for USA-only access
 */

import React from 'react';
import { Globe, AlertCircle, AlertTriangle } from 'lucide-react';
import { Button } from '../common';

/**
 * Consent Screen - Ask permission for location check
 */
function ConsentScreen({ onAccept, onDecline }) {
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
            DrinkBot3000 is only available to users physically located in the United States. We must
            verify your location for legal compliance and service restrictions.
          </p>
        </div>

        <div className="space-y-3">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={onAccept}
            className="shadow-lg"
          >
            I Consent to USA Location Verification
          </Button>

          <Button
            variant="secondary"
            fullWidth
            onClick={onDecline}
          >
            I Do Not Consent
          </Button>
        </div>

        <div className="mt-4 text-center">
          <a href="/privacy.html" target="_blank" className="text-xs text-blue-600 hover:underline">
            Read our Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
}

/**
 * Loading Screen - Verifying location
 */
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 p-6 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 mb-6 bg-blue-100 rounded-full">
            <Globe className="w-16 h-16 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Verifying Location...</h1>
          <p className="text-lg text-gray-700 mb-6">Please wait while we verify your location.</p>
          <div className="flex justify-center mb-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
          <p className="text-sm text-gray-600">This usually takes just a few seconds.</p>
        </div>
      </div>
    </div>
  );
}

/**
 * Technical Error Screen - Service unavailable with bypass option
 */
function TechnicalErrorScreen({ error, onBypass, onRetry, onGoBack }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900 via-orange-800 to-orange-900 p-6 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-24 h-24 mb-6 bg-orange-100 rounded-full">
            <AlertCircle className="w-16 h-16 text-orange-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">⚠️ Verification Service Issue</h1>
          <p className="text-lg text-gray-700 mb-4">
            We couldn't verify your location due to a technical issue.
          </p>
        </div>

        <div className="bg-orange-50 rounded-lg p-6 mb-6 border-2 border-orange-200">
          <p className="text-gray-800 font-bold text-lg mb-3">Technical Error Details:</p>
          <p className="text-gray-700 mb-4 text-sm">
            {error || 'All geolocation services are currently unavailable.'}
          </p>
          <p className="text-sm text-orange-800 font-semibold">
            This appears to be a temporary service issue, not a geographic restriction.
          </p>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-200">
          <p className="text-sm text-blue-900 font-semibold mb-2">What you can do:</p>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• Wait a few minutes and try again (recommended)</li>
            <li>• Check your internet connection</li>
            <li>• Disable any ad blockers or privacy extensions</li>
            <li>• If you're in the USA, you can bypass this error</li>
          </ul>
        </div>

        <div className="bg-yellow-50 rounded-lg p-4 mb-4 border border-yellow-300">
          <p className="text-xs text-yellow-900 font-semibold mb-2">⚠️ Important Notice:</p>
          <p className="text-xs text-yellow-800">
            DrinkBot3000 is only available in the USA. By bypassing this error, you confirm that you
            are physically located in the United States. Using this service from outside the USA may
            violate terms of service and local laws.
          </p>
        </div>

        <div className="space-y-3">
          <Button variant="primary" fullWidth onClick={onBypass}>
            I'm in the USA - Continue Anyway
          </Button>

          <Button variant="success" fullWidth onClick={onRetry}>
            🔄 Try Again
          </Button>

          <Button variant="secondary" fullWidth onClick={onGoBack}>
            ← Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * Blocked Screen - User is outside USA
 */
function BlockedScreen({ country, onGoBack }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-900 p-6 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-24 h-24 mb-6 bg-red-100 rounded-full">
            <AlertTriangle className="w-16 h-16 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">🇺🇸 USA-Only Service</h1>
          <p className="text-lg text-gray-700 mb-4">
            This app is only available in the United States.
          </p>
        </div>

        <div className="bg-red-50 rounded-lg p-6 mb-6 border-2 border-red-200">
          <p className="text-gray-800 font-bold text-lg mb-3">Detected Location: {country}</p>
          <p className="text-gray-700 mb-4">
            DrinkBot3000 is a USA-only service. Access is restricted to users physically located
            within the United States.
          </p>
          <p className="text-sm text-red-800 font-semibold">
            This restriction is in place for legal compliance and service availability reasons.
          </p>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-200">
          <p className="text-sm text-blue-900 font-semibold mb-2">
            If you believe this is an error:
          </p>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• Check if you're using a VPN or proxy routing through a non-US server</li>
            <li>• Disable VPN/proxy and reload the page</li>
            <li>• Ensure you're physically located in the United States</li>
            <li>• Contact support at drinkbot3000@gmail.com</li>
          </ul>
        </div>

        <div className="text-center mb-4">
          <p className="text-xs text-gray-600">
            USA location verification is required for service access.
          </p>
        </div>

        <Button variant="secondary" fullWidth onClick={onGoBack}>
          ← Go Back
        </Button>
      </div>
    </div>
  );
}

/**
 * GeolocationConsent Component
 * Main component that renders the appropriate screen based on state
 *
 * @param {Object} props
 * @param {string} props.state - Current state: 'consent', 'loading', 'blocked', 'technical-error'
 * @param {string} props.country - Detected country name (for blocked state)
 * @param {string} props.error - Error message (for technical-error state)
 * @param {Function} props.onAccept - Handler for accepting consent
 * @param {Function} props.onDecline - Handler for declining consent
 * @param {Function} props.onBypass - Handler for bypassing technical error
 * @param {Function} props.onRetry - Handler for retrying verification
 * @param {Function} props.onGoBack - Handler for going back
 */
export function GeolocationConsent({
  state,
  country,
  error,
  onAccept,
  onDecline,
  onBypass,
  onRetry,
  onGoBack,
}) {
  switch (state) {
    case 'consent':
      return <ConsentScreen onAccept={onAccept} onDecline={onDecline} />;

    case 'loading':
      return <LoadingScreen />;

    case 'technical-error':
      return (
        <TechnicalErrorScreen
          error={error}
          onBypass={onBypass}
          onRetry={onRetry}
          onGoBack={onGoBack}
        />
      );

    case 'blocked':
      return <BlockedScreen country={country} onGoBack={onGoBack} />;

    default:
      return null;
  }
}
