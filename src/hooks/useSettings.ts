/**
 * useSettings Hook
 * Handles settings modal and profile editing operations with type safety
 */

import { useCallback } from 'react';
import { validateWeight } from '../services/validation.service';
import { EMOJIS } from '../constants';
import type { TrackerState, Gender } from '../types';

interface SettingsHandlers {
  handleSettingsEditToggle: () => void;
  handleSettingsSave: () => void;
  handleSettingsCancel: () => void;
}

type SetFieldFunction = (field: keyof TrackerState, value: unknown) => void;
type SetMultipleFunction = (updates: Partial<TrackerState>) => void;
type ShowConfirmFunction = (message: string, onConfirm: () => void) => void;
type HideConfirmFunction = () => void;
type ShowRobotMessageFunction = (message: string) => void;

/**
 * Hook for managing settings operations
 * @param state - Current tracker state
 * @param setField - Function to update a single state field
 * @param setMultiple - Function to update multiple state fields
 * @param showConfirm - Function to show confirmation modal
 * @param hideConfirm - Function to hide confirmation modal
 * @param showRobotMessage - Function to display robot messages
 * @returns Settings handler functions
 */
export const useSettings = (
  state: TrackerState,
  setField: SetFieldFunction,
  setMultiple: SetMultipleFunction,
  showConfirm: ShowConfirmFunction,
  hideConfirm: HideConfirmFunction,
  showRobotMessage: ShowRobotMessageFunction
): SettingsHandlers => {
  // Note: Assuming these fields exist in state for now
  // They may need to be added to TrackerState type definition
  const settingsEditMode = (state as any).settingsEditMode ?? false;
  const settingsEditGender = (state as any).settingsEditGender ?? state.userProfile?.gender;
  const settingsEditWeight = (state as any).settingsEditWeight ?? state.userProfile?.weight;

  const handleSettingsEditToggle = useCallback(() => {
    setMultiple({
      settingsEditMode: !settingsEditMode,
      settingsEditGender: state.userProfile?.gender,
      settingsEditWeight: state.userProfile?.weight,
    } as Partial<TrackerState>);
  }, [settingsEditMode, state.userProfile?.gender, state.userProfile?.weight, setMultiple]);

  const handleSettingsSave = useCallback(() => {
    const error = validateWeight(settingsEditWeight);
    if (error) {
      setField('weightError' as keyof TrackerState, error);
      return;
    }

    showConfirm('Changing your profile will reset your current BAC tracking. Continue?', () => {
      setMultiple({
        userProfile: {
          gender: settingsEditGender as Gender,
          weight: Number(settingsEditWeight),
          age: state.userProfile?.age ?? 21,
        },
        drinks: [],
        currentBAC: 0,
        startTime: null,
        hasBeenImpaired: false,
        settingsEditMode: false,
        weightError: '',
      } as Partial<TrackerState>);
      hideConfirm();
      showRobotMessage(`Profile updated! Tracker has been reset. ${EMOJIS.ROBOT}`);
    });
  }, [
    settingsEditWeight,
    settingsEditGender,
    state.userProfile?.age,
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
    } as Partial<TrackerState>);
  }, [setMultiple]);

  return {
    handleSettingsEditToggle,
    handleSettingsSave,
    handleSettingsCancel,
  };
};
