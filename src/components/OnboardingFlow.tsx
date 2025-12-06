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
import type { Gender } from '../types';

interface OnboardingState {
  ageVerified: boolean;
  showGeoConsent: boolean;
  geoVerifying: boolean;
  geoBlocked: boolean;
  geoTechnicalError: boolean;
  geoCountry: string;
  geoError: string;
  showDisclaimerModal: boolean;
  safetyScreensComplete: boolean;
  currentSafetyScreen: number;
  setupComplete: boolean;
  gender: Gender | null;
  weight: string;
  weightError: string;
}

interface OnboardingHandlers {
  handleAgeVerification: (isOfAge: boolean) => void;
  handleGeoConsentAccept: () => void;
  handleGeoConsentDecline: () => void;
  handleGeoBypass: () => void;
  handleGeoRetry: () => void;
  handleGeoGoBack: () => void;
  handleDisclaimerAccept: () => void;
  handleSafetyScreenNext: (currentScreen: number) => void;
  handleSafetyScreenDecline: () => void;
  handleSetup: () => void;
}

interface OnboardingFlowProps {
  state: OnboardingState;
  handlers: OnboardingHandlers;
  setField: (field: string, value: unknown) => void;
}

/**
 * Determines and renders the appropriate onboarding screen
 */
export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ state, handlers, setField }) => {
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
          onGenderChange={(gender: Gender) => setField('gender', gender)}
          onWeightChange={(weight: string) => setField('weight', weight)}
          onSubmit={handlers.handleSetup}
        />
      </PWAProvider>
    );
  }

  // If all onboarding is complete, return null
  return null;
};
