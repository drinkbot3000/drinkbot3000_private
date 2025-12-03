/**
 * DrinkBot3000 - Main Application Component
 * Blood Alcohol Content (BAC) tracking application
 *
 * REFACTORED: Separated concerns into focused hooks and components
 */

import React, { useCallback } from 'react';

// State Management
import { TrackerProvider, useTracker } from './state/TrackerContext';

// Hooks
import { useBACCalculation } from './hooks/useBACCalculation';
import { usePersistence } from './hooks/usePersistence';
import { useDrinkManagement } from './hooks/useDrinkManagement';
import { useOnboarding } from './hooks/useOnboarding';
import { useSettings } from './hooks/useSettings';
import { useSetup } from './hooks/useSetup';

// Components
import { OnboardingFlow } from './components/OnboardingFlow';
import { TrackerInterface } from './components/TrackerInterface';

// Constants
import { CONSTANTS } from './constants';

/**
 * Main App Content (uses TrackerContext)
 */
function BACTrackerContent() {
  const {
    state,
    setField,
    setMultiple,
    addDrink: addDrinkAction,
    removeDrink,
    undoDrink,
    clearDrinks: clearDrinksAction,
    addReceipt,
    addCustomDrink: addCustomDrinkAction,
    deleteCustomDrink: deleteCustomDrinkAction,
    showConfirm,
    hideConfirm,
  } = useTracker();

  // Robot message display
  const showRobotMessage = useCallback(
    (message) => {
      setField('robotMessage', message);
      setTimeout(() => {
        setField('robotMessage', '');
      }, CONSTANTS.ROBOT_MESSAGE_DURATION);
    },
    [setField]
  );

  // Custom hooks for different concerns
  usePersistence(state, setMultiple);

  useBACCalculation({
    dispatch: (action) => {
      if (action.type === 'SET_FIELD') {
        setField(action.field, action.value);
      } else if (action.type === 'SET_MULTIPLE') {
        setMultiple(action.values);
      }
    },
    state,
  });

  const onboardingHandlers = useOnboarding(setField, setMultiple);

  const drinkHandlers = useDrinkManagement(
    state,
    {
      setField,
      setMultiple,
      addDrink: addDrinkAction,
      removeDrink,
      undoDrink,
      clearDrinks: clearDrinksAction,
      addCustomDrink: addCustomDrinkAction,
      deleteCustomDrink: deleteCustomDrinkAction,
    },
    showRobotMessage
  );

  const settingsHandlers = useSettings(
    state,
    setField,
    setMultiple,
    showConfirm,
    hideConfirm,
    showRobotMessage
  );

  const setupHandlers = useSetup(state, setField, setMultiple, addReceipt, showRobotMessage);

  // Check if onboarding is complete
  const onboardingComplete =
    state.ageVerified &&
    state.geoVerified &&
    state.disclaimerAccepted &&
    state.safetyScreensComplete &&
    state.setupComplete &&
    !state.showGeoConsent &&
    !state.geoVerifying &&
    !state.geoBlocked &&
    !state.showDisclaimerModal;

  // Render onboarding flow or main tracker interface
  if (!onboardingComplete) {
    return (
      <OnboardingFlow
        state={state}
        handlers={{
          ...onboardingHandlers,
          handleSetup: setupHandlers.handleSetup,
        }}
        setField={setField}
      />
    );
  }

  return (
    <TrackerInterface
      state={state}
      setField={setField}
      setMultiple={setMultiple}
      drinkHandlers={drinkHandlers}
      settingsHandlers={settingsHandlers}
      miscHandlers={{
        tellJoke: setupHandlers.tellJoke,
        handlePaymentSuccess: setupHandlers.handlePaymentSuccess,
      }}
      hideConfirm={hideConfirm}
    />
  );
}

/**
 * Main App Component with Context Provider
 */
export default function BACTracker() {
  return (
    <TrackerProvider>
      <BACTrackerContent />
    </TrackerProvider>
  );
}
