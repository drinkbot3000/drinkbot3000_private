/**
 * useSettings Hook
 * Handles settings modal and profile editing operations
 */

import { useCallback } from 'react';
import { validateWeight } from '../services/validation.service';
import { EMOJIS } from '../constants';

/**
 * Hook for managing settings operations
 * @param {Object} state - Current tracker state
 * @param {Function} setField - Function to update a single state field
 * @param {Function} setMultiple - Function to update multiple state fields
 * @param {Function} showConfirm - Function to show confirmation modal
 * @param {Function} hideConfirm - Function to hide confirmation modal
 * @param {Function} showRobotMessage - Function to display robot messages
 * @returns {Object} Settings handler functions
 */
export const useSettings = (
  state,
  setField,
  setMultiple,
  showConfirm,
  hideConfirm,
  showRobotMessage
) => {
  const handleSettingsEditToggle = useCallback(() => {
    setMultiple({
      settingsEditMode: !state.settingsEditMode,
      settingsEditGender: state.gender,
      settingsEditWeight: state.weight,
    });
  }, [state.settingsEditMode, state.gender, state.weight, setMultiple]);

  const handleSettingsSave = useCallback(() => {
    const error = validateWeight(state.settingsEditWeight);
    if (error) {
      setField('weightError', error);
      return;
    }

    showConfirm('Changing your profile will reset your current BAC tracking. Continue?', () => {
      setMultiple({
        gender: state.settingsEditGender,
        weight: state.settingsEditWeight,
        drinks: [],
        bac: 0,
        startTime: null,
        hasBeenImpaired: false,
        settingsEditMode: false,
        weightError: '',
      });
      hideConfirm();
      showRobotMessage(`Profile updated! Tracker has been reset. ${EMOJIS.ROBOT}`);
    });
  }, [
    state.settingsEditWeight,
    state.settingsEditGender,
    setField,
    setMultiple,
    showConfirm,
    hideConfirm,
    showRobotMessage,
  ]);

  const handleSettingsCancel = useCallback(() => {
    setMultiple({
      settingsEditMode: false,
      weightError: '',
    });
  }, [setMultiple]);

  return {
    handleSettingsEditToggle,
    handleSettingsSave,
    handleSettingsCancel,
  };
};
