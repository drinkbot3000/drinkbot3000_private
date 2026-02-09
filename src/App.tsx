/**
 * DrinkBot3000 - Main Application Component
 * Blood Alcohol Content (BAC) tracking application
 *
 * REFACTORED: Separated concerns into focused hooks and components
 */

import React, { useCallback } from 'react';

// State Management
import {
  UserProvider,
  useUser,
  BACProvider,
  useBAC,
  UIProvider,
  useUI,
  ModalProvider,
  useModal,
  CustomDrinksProvider,
  useCustomDrinks,
} from './stores';

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
import FeatureErrorBoundary from './components/FeatureErrorBoundary';

// Constants
import { CONSTANTS } from './constants';

/**
 * Main App Content (uses all stores)
 */
function BACTrackerContent(): JSX.Element {
  // Import all stores
  const userStore = useUser();
  const bacStore = useBAC();
  const uiStore = useUI();
  const modalStore = useModal();
  const customDrinksStore = useCustomDrinks();

  // Combine state for easier access (temporary during migration)
  const state = {
    ...userStore.state,
    ...bacStore.state,
    ...uiStore.state,
    ...modalStore.state,
    ...customDrinksStore.state,
  };

  // Create unified setField function that routes to correct store
  const setField = useCallback(
    (field: string, value: unknown) => {
      // User store fields
      if (
        [
          'ageVerified',
          'disclaimerAccepted',
          'safetyScreensComplete',
          'currentSafetyScreen',
          'setupComplete',
          'gender',
          'weight',
          'geoConsentGiven',
          'geoVerified',
          'geoBlocked',
          'geoCountry',
          'geoError',
        ].includes(field)
      ) {
        userStore.setField(field, value);
      }
      // BAC store fields
      else if (
        [
          'bac',
          'drinks',
          'startTime',
          'hasBeenImpaired',
          'useSlowMetabolism',
          'calcDrinks',
          'calcHours',
          'calcBAC',
        ].includes(field)
      ) {
        bacStore.setField(field, value);
      }
      // UI store fields
      else if (
        [
          'showSplash',
          'showSettings',
          'showHelp',
          'showGeoConsent',
          'geoVerifying',
          'geoTechnicalError',
          'settingsEditMode',
          'settingsEditGender',
          'settingsEditWeight',
        ].includes(field)
      ) {
        uiStore.setField(field, value);
      }
      // Modal store fields
      else if (
        [
          'showJoke',
          'currentJoke',
          'robotMessage',
          'showConfirmModal',
          'confirmModalMessage',
          'confirmModalAction',
          'showDisclaimerModal',
          'showRefundPolicy',
          'showReceipt',
          'showAgeRestrictionModal',
        ].includes(field)
      ) {
        modalStore.setField(field, value);
      }
      // Custom drinks store fields
      else if (
        [
          'customDrinkOz',
          'customDrinkABV',
          'customDrinkName',
          'showCustomDrink',
          'savedCustomDrinks',
          'weightError',
          'tipError',
          'customTipAmount',
        ].includes(field)
      ) {
        customDrinksStore.setField(field, value);
      }
    },
    [userStore, bacStore, uiStore, modalStore, customDrinksStore]
  );

  // Create unified setMultiple function
  const setMultiple = useCallback(
    (values: Record<string, unknown>) => {
      const userFields: Record<string, unknown> = {};
      const bacFields: Record<string, unknown> = {};
      const uiFields: Record<string, unknown> = {};
      const modalFields: Record<string, unknown> = {};
      const customDrinksFields: Record<string, unknown> = {};

      Object.entries(values).forEach(([field, value]) => {
        if (
          [
            'ageVerified',
            'disclaimerAccepted',
            'safetyScreensComplete',
            'currentSafetyScreen',
            'setupComplete',
            'gender',
            'weight',
            'geoConsentGiven',
            'geoVerified',
            'geoBlocked',
            'geoCountry',
            'geoError',
          ].includes(field)
        ) {
          userFields[field] = value;
        } else if (
          [
            'bac',
            'drinks',
            'startTime',
            'hasBeenImpaired',
            'useSlowMetabolism',
            'calcDrinks',
            'calcHours',
            'calcBAC',
          ].includes(field)
        ) {
          bacFields[field] = value;
        } else if (
          [
            'showSplash',
            'showSettings',
            'showHelp',
            'showGeoConsent',
            'geoVerifying',
            'geoTechnicalError',
            'settingsEditMode',
            'settingsEditGender',
            'settingsEditWeight',
          ].includes(field)
        ) {
          uiFields[field] = value;
        } else if (
          [
            'showJoke',
            'currentJoke',
            'robotMessage',
            'showConfirmModal',
            'confirmModalMessage',
            'confirmModalAction',
            'showDisclaimerModal',
            'showRefundPolicy',
            'showReceipt',
            'showAgeRestrictionModal',
          ].includes(field)
        ) {
          modalFields[field] = value;
        } else if (
          [
            'customDrinkOz',
            'customDrinkABV',
            'customDrinkName',
            'showCustomDrink',
            'savedCustomDrinks',
            'showDrinkHistory',
            'weightError',
            'tipError',
            'customTipAmount',
          ].includes(field)
        ) {
          customDrinksFields[field] = value;
        }
      });

      if (Object.keys(userFields).length > 0) userStore.setMultiple(userFields);
      if (Object.keys(bacFields).length > 0) bacStore.setMultiple(bacFields);
      if (Object.keys(uiFields).length > 0) uiStore.setMultiple(uiFields);
      if (Object.keys(modalFields).length > 0) modalStore.setMultiple(modalFields);
      if (Object.keys(customDrinksFields).length > 0)
        customDrinksStore.setMultiple(customDrinksFields);
    },
    [userStore, bacStore, uiStore, modalStore, customDrinksStore]
  );

  // Extract actions from stores
  const addDrinkAction = bacStore.addDrink;
  const removeDrink = bacStore.removeDrink;
  const undoDrink = bacStore.undoDrink;
  const clearDrinksAction = bacStore.clearDrinks;
  const addCustomDrinkAction = customDrinksStore.addCustomDrink;
  const deleteCustomDrinkAction = customDrinksStore.deleteCustomDrink;
  const showConfirm = modalStore.showConfirm;
  const hideConfirm = modalStore.hideConfirm;

  // Robot message display
  const showRobotMessage = useCallback(
    (message: string) => {
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
    dispatch: (action: any) => {
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

  const setupHandlers = useSetup(state, setField, setMultiple, null, showRobotMessage);

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
      <FeatureErrorBoundary
        featureName="Onboarding"
        featureDescription="complete the initial setup"
        fallbackAction={() => window.location.reload()}
        showSafetyNote={false}
      >
        <OnboardingFlow
          state={state as any}
          handlers={{
            ...onboardingHandlers,
            handleSetup: setupHandlers.handleSetup,
          }}
          setField={setField}
        />
      </FeatureErrorBoundary>
    );
  }

  return (
    <FeatureErrorBoundary
      featureName="BAC Tracker"
      featureDescription="track your drinks and BAC level"
      showSafetyNote={true}
    >
      <TrackerInterface
        state={state as any}
        setField={setField}
        setMultiple={setMultiple}
        drinkHandlers={drinkHandlers as any}
        settingsHandlers={settingsHandlers as any}
        miscHandlers={{
          tellJoke: setupHandlers.tellJoke,
        }}
        hideConfirm={hideConfirm}
      />
    </FeatureErrorBoundary>
  );
}

/**
 * Main App Component with All Store Providers
 */
export default function BACTracker(): JSX.Element {
  return (
    <UserProvider>
      <BACProvider>
        <UIProvider>
          <ModalProvider>
            <CustomDrinksProvider>
              <BACTrackerContent />
            </CustomDrinksProvider>
          </ModalProvider>
        </UIProvider>
      </BACProvider>
    </UserProvider>
  );
}
