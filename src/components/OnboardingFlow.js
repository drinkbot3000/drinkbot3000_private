/**
 * OnboardingFlow Component
 * Renders the appropriate onboarding screen based on app state
 */

import React from 'react';
import { PWAProvider } from '../contexts/PWAContext';
import { AgeVerification } from './AgeVerification';
import { GeolocationConsent } from './GeolocationVerification';
import { Disclaimer } from './Disclaimer';
import { SafetyScreens } from './SafetyScreens';
import { Setup } from './Setup';

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
        <AgeVerification onVerify={handlers.handleAgeVerification} />
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
      </PWAProvider>
    );
  }

  // Disclaimer
  if (state.showDisclaimerModal) {
    return (
      <PWAProvider>
        <Disclaimer onAccept={handlers.handleDisclaimerAccept} />
      </PWAProvider>
    );
  }

  // Safety screens
  if (!state.safetyScreensComplete) {
    return (
      <PWAProvider>
        <SafetyScreens
          currentScreen={state.currentSafetyScreen}
          onNext={() => handlers.handleSafetyScreenNext(state.currentSafetyScreen)}
          onDecline={handlers.handleSafetyScreenDecline}
        />
      </PWAProvider>
    );
  }

  // Setup
  if (!state.setupComplete) {
    return (
      <PWAProvider>
        <Setup
          gender={state.gender}
          weight={state.weight}
          weightError={state.weightError}
          onGenderChange={(gender) => setField('gender', gender)}
          onWeightChange={(weight) => setField('weight', weight)}
          onSubmit={handlers.handleSetup}
        />
      </PWAProvider>
    );
  }

  // If all onboarding is complete, return null
  return null;
};
