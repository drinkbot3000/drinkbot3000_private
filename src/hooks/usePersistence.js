/**
 * usePersistence Hook
 * Handles loading and saving tracker data to localStorage
 */

import { useEffect } from 'react';
import { getItem, setItem, STORAGE_KEYS } from '../services/storage.service';

/**
 * Hook to handle data persistence
 * @param {Object} state - Current tracker state
 * @param {Function} setMultiple - Function to update multiple state fields
 */
export const usePersistence = (state, setMultiple) => {
  // Load saved data on mount
  useEffect(() => {
    const saved = getItem(STORAGE_KEYS.BAC_TRACKER_DATA);
    const ageCheck = getItem(STORAGE_KEYS.AGE_VERIFIED);
    const disclaimerCheck = getItem(STORAGE_KEYS.DISCLAIMER_ACCEPTED);
    const safetyCheck = getItem(STORAGE_KEYS.SAFETY_SCREENS_COMPLETE);
    const savedReceipts = getItem(STORAGE_KEYS.RECEIPTS);
    const geoCheck = getItem(STORAGE_KEYS.GEO_VERIFIED);
    const geoCountry = getItem(STORAGE_KEYS.USER_COUNTRY);
    const geoConsentCheck = getItem(STORAGE_KEYS.GEO_CONSENT_GIVEN);

    const updates = {};

    if (ageCheck === 'true') updates.ageVerified = true;
    if (disclaimerCheck === 'true') updates.disclaimerAccepted = true;
    if (safetyCheck === 'true') updates.safetyScreensComplete = true;
    if (geoCheck === 'true') updates.geoVerified = true;
    if (geoCountry) updates.geoCountry = geoCountry;
    if (geoConsentCheck === 'true') updates.geoConsentGiven = true;
    if (savedReceipts) updates.receipts = savedReceipts;

    if (saved) {
      Object.assign(updates, {
        setupComplete: saved.setupComplete || false,
        gender: saved.gender || '',
        weight: saved.weight || '',
        drinks: saved.drinks || [],
        startTime: saved.startTime || null,
        savedCustomDrinks: saved.savedCustomDrinks || [],
        hasBeenImpaired: saved.hasBeenImpaired || false,
        useSlowMetabolism: saved.useSlowMetabolism !== undefined ? saved.useSlowMetabolism : true,
      });
    }

    if (Object.keys(updates).length > 0) {
      setMultiple(updates);
    }
  }, [setMultiple]);

  // Save receipts
  useEffect(() => {
    if (state.receipts.length > 0) {
      setItem(STORAGE_KEYS.RECEIPTS, state.receipts);
    }
  }, [state.receipts]);

  // Save tracker data to localStorage
  useEffect(() => {
    if (state.setupComplete) {
      const dataToSave = {
        setupComplete: state.setupComplete,
        gender: state.gender,
        weight: state.weight,
        drinks: state.drinks,
        startTime: state.startTime,
        savedCustomDrinks: state.savedCustomDrinks,
        hasBeenImpaired: state.hasBeenImpaired,
        useSlowMetabolism: state.useSlowMetabolism,
      };
      setItem(STORAGE_KEYS.BAC_TRACKER_DATA, dataToSave);
    }
  }, [
    state.setupComplete,
    state.gender,
    state.weight,
    state.drinks,
    state.startTime,
    state.savedCustomDrinks,
    state.hasBeenImpaired,
    state.useSlowMetabolism,
  ]);
};
