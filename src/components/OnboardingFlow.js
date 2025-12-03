/**
 * OnboardingFlow Component
 * Renders the appropriate onboarding screen based on app state
 */

import React, { lazy, Suspense } from 'react';
import { PWAProvider } from '../contexts/PWAContext';

// Lazy load onboarding components (only used once during initial setup)
const AgeVerification = lazy(() =>
  import('./AgeVerification').then((module) => ({ default: module.AgeVerification }))
);
const GeolocationConsent = lazy(() =>
  import('./GeolocationVerification').then((module) => ({ default: module.GeolocationConsent }))
);
const Disclaimer = lazy(() =>
  import('./Disclaimer').then((module) => ({ default: module.Disclaimer }))
);
const SafetyScreens = lazy(() =>
  import('./SafetyScreens').then((module) => ({ default: module.SafetyScreens }))
);
const Setup = lazy(() => import('./Setup').then((module) => ({ default: module.Setup })));

// Loading component for Suspense
const LoadingScreen = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

/**
 * Determines and renders the appropriate onboarding screen
 * @param {Object} props - Component props
 * @param {Object} props.state - Current app state
 * @param {Object} props.handlers - Onboarding event handlers
 * @param {Function} props.setField - Function to update a single state field
 * @returns {JSX.Element|null} The appropriate onboarding screen or null
 */
export const OnboardingFlow = ({ state, handlers, setField }) => {
  // Age verification
  if (!state.ageVerified) {
    return (
      <PWAProvider>
        <Suspense fallback={<LoadingScreen />}>
          <AgeVerification onVerify={handlers.handleAgeVerification} />
        </Suspense>
      </PWAProvider>
    );
  }

  // Geolocation consent/verification
  if (state.showGeoConsent || state.geoVerifying || state.geoBlocked) {
    const geoState = state.geoVerifying
      ? 'loading'
      : state.geoBlocked
        ? state.geoTechnicalError
          ? 'technical-error'
          : 'blocked'
        : 'consent';

    return (
      <PWAProvider>
        <Suspense fallback={<LoadingScreen />}>
          <GeolocationConsent
            state={geoState}
            country={state.geoCountry}
            error={state.geoError}
            onAccept={handlers.handleGeoConsentAccept}
            onDecline={handlers.handleGeoConsentDecline}
            onBypass={handlers.handleGeoBypass}
            onRetry={handlers.handleGeoRetry}
            onGoBack={handlers.handleGeoGoBack}
          />
        </Suspense>
      </PWAProvider>
    );
  }

  // Disclaimer
  if (state.showDisclaimerModal) {
    return (
      <PWAProvider>
        <Suspense fallback={<LoadingScreen />}>
          <Disclaimer onAccept={handlers.handleDisclaimerAccept} />
        </Suspense>
      </PWAProvider>
    );
  }

  // Safety screens
  if (!state.safetyScreensComplete) {
    return (
      <PWAProvider>
        <Suspense fallback={<LoadingScreen />}>
          <SafetyScreens
            currentScreen={state.currentSafetyScreen}
            onNext={() => handlers.handleSafetyScreenNext(state.currentSafetyScreen)}
            onDecline={handlers.handleSafetyScreenDecline}
          />
        </Suspense>
      </PWAProvider>
    );
  }

  // Setup
  if (!state.setupComplete) {
    return (
      <PWAProvider>
        <Suspense fallback={<LoadingScreen />}>
          <Setup
            gender={state.gender}
            weight={state.weight}
            weightError={state.weightError}
            onGenderChange={(gender) => setField('gender', gender)}
            onWeightChange={(weight) => setField('weight', weight)}
            onSubmit={handlers.handleSetup}
          />
        </Suspense>
      </PWAProvider>
    );
  }

  // If all onboarding is complete, return null
  return null;
};
