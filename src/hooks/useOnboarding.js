/**
 * useOnboarding Hook
 * Handles all onboarding flow logic (age verification, geo consent, disclaimer, safety screens)
 */

import { useCallback } from 'react';
import { setItem, removeItem, STORAGE_KEYS } from '../services/storage.service';
import { checkGeographicRestriction } from '../services/geolocation.service';

/**
 * Hook for managing onboarding flow
 * @param {Function} setField - Function to update a single state field
 * @param {Function} setMultiple - Function to update multiple state fields
 * @returns {Object} Onboarding handler functions
 */
export const useOnboarding = (setField, setMultiple) => {
  const handleAgeVerification = useCallback(
    (isOfAge) => {
      if (isOfAge) {
        setItem(STORAGE_KEYS.AGE_VERIFIED, 'true');
        setMultiple({ ageVerified: true, showGeoConsent: true });
      } else {
        setField('showAgeRestrictionModal', true);
      }
    },
    [setField, setMultiple]
  );

  const handleGeoConsentAccept = useCallback(async () => {
    setItem(STORAGE_KEYS.GEO_CONSENT_GIVEN, 'true');
    setMultiple({ geoConsentGiven: true, showGeoConsent: false, geoVerifying: true });

    try {
      const result = await checkGeographicRestriction();
      const updates = { geoVerifying: false };

      if (result.allowed) {
        Object.assign(updates, {
          geoVerified: true,
          geoCountry: result.country,
          geoBlocked: false,
          geoTechnicalError: false,
          showDisclaimerModal: true,
        });
      } else {
        Object.assign(updates, {
          geoBlocked: true,
          geoCountry: result.country,
          geoTechnicalError: result.technicalError || false,
        });
      }

      if (result.error) {
        updates.geoError = result.error;
      }

      setMultiple(updates);
    } catch (error) {
      console.error('Geographic verification failed:', error);
      setMultiple({
        geoVerifying: false,
        geoError: error.message,
        geoBlocked: true,
        geoTechnicalError: true,
        geoCountry: 'Unknown',
      });
    }
  }, [setMultiple]);

  const handleGeoConsentDecline = useCallback(() => {
    removeItem(STORAGE_KEYS.AGE_VERIFIED);
    setMultiple({ ageVerified: false, showGeoConsent: false });
  }, [setMultiple]);

  const handleGeoBypass = useCallback(() => {
    setItem(STORAGE_KEYS.GEO_VERIFIED, 'true');
    setItem(STORAGE_KEYS.USER_COUNTRY, 'USA (Manual Override)');
    setMultiple({
      geoVerified: true,
      geoBlocked: false,
      geoCountry: 'USA (Manual Override)',
      showDisclaimerModal: true,
    });
  }, [setMultiple]);

  const handleGeoRetry = useCallback(() => {
    setMultiple({ geoBlocked: false, showGeoConsent: true });
  }, [setMultiple]);

  const handleGeoGoBack = useCallback(() => {
    removeItem(STORAGE_KEYS.AGE_VERIFIED);
    removeItem(STORAGE_KEYS.GEO_CONSENT_GIVEN);
    setMultiple({ ageVerified: false, geoBlocked: false });
  }, [setMultiple]);

  const handleDisclaimerAccept = useCallback(() => {
    setItem(STORAGE_KEYS.DISCLAIMER_ACCEPTED, 'true');
    setMultiple({ disclaimerAccepted: true, showDisclaimerModal: false, currentSafetyScreen: 0 });
  }, [setMultiple]);

  const handleSafetyScreenNext = useCallback(
    (currentSafetyScreen) => {
      if (currentSafetyScreen < 3) {
        setField('currentSafetyScreen', currentSafetyScreen + 1);
      } else {
        setItem(STORAGE_KEYS.SAFETY_SCREENS_COMPLETE, 'true');
        setField('safetyScreensComplete', true);
      }
    },
    [setField]
  );

  const handleSafetyScreenDecline = useCallback(() => {
    removeItem(STORAGE_KEYS.AGE_VERIFIED);
    removeItem(STORAGE_KEYS.DISCLAIMER_ACCEPTED);
    removeItem(STORAGE_KEYS.SAFETY_SCREENS_COMPLETE);
    setMultiple({
      ageVerified: false,
      disclaimerAccepted: false,
      safetyScreensComplete: false,
      currentSafetyScreen: 0,
    });
  }, [setMultiple]);

  return {
    handleAgeVerification,
    handleGeoConsentAccept,
    handleGeoConsentDecline,
    handleGeoBypass,
    handleGeoRetry,
    handleGeoGoBack,
    handleDisclaimerAccept,
    handleSafetyScreenNext,
    handleSafetyScreenDecline,
  };
};
