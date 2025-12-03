/**
 * DrinkBot3000 - Main Application Component
 * Blood Alcohol Content (BAC) tracking application
 *
 * REFACTORED: Now uses TrackerContext for centralized state management
 */

import React, { useEffect, useCallback } from 'react';
import PWAInstallPrompt from './PWAInstallPrompt';
import { PWAProvider } from './contexts/PWAContext';

// State Management
import { TrackerProvider, useTracker } from './state/TrackerContext';

// Components
import { AgeVerification } from './components/AgeVerification';
import { SafetyScreens } from './components/SafetyScreens';
import { GeolocationConsent } from './components/GeolocationVerification';
import { Disclaimer } from './components/Disclaimer';
import { Setup } from './components/Setup';
import { MainLayout } from './components/MainLayout';
import { ConfirmModal } from './components/common';
import {
  BACDisplay,
  TimeInfo,
  AddDrinkPanel,
  DrinkHistoryList,
  SupportSection,
  MessageDisplay,
} from './components/Tracker';
import {
  HelpModal,
  SettingsModal,
  RefundPolicyModal,
  ReceiptModal,
} from './components/Modals';

// Services
import { checkGeographicRestriction } from './services/geolocation.service';
import { validateWeight } from './services/validation.service';
import {
  getItem,
  setItem,
  removeItem,
  STORAGE_KEYS,
} from './services/storage.service';
import { generateReceipt } from './services/receipt.service';

// Hooks
import { useBACCalculation } from './hooks/useBACCalculation';

// Constants
import { CONSTANTS, JOKES, ROBOT_GREETINGS, ROBOT_COMMENTS } from './constants';

/**
 * Main App Content (uses TrackerContext)
 */
function BACTrackerContent() {
  const { state, setField, setMultiple, addDrink: addDrinkAction, removeDrink, undoDrink, clearDrinks: clearDrinksAction, addReceipt, addCustomDrink: addCustomDrinkAction, deleteCustomDrink: deleteCustomDrinkAction, showConfirm, hideConfirm } = useTracker();

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

  // Save to localStorage
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

  // BAC calculation effect using custom hook
  useBACCalculation({ dispatch: (action) => {
    if (action.type === 'SET_FIELD') {
      setField(action.field, action.value);
    } else if (action.type === 'SET_MULTIPLE') {
      setMultiple(action.values);
    }
  }, state });


  // Event Handlers
  const handleAgeVerification = (isOfAge) => {
    if (isOfAge) {
      setItem(STORAGE_KEYS.AGE_VERIFIED, 'true');
      setMultiple({ ageVerified: true, showGeoConsent: true });
    } else {
      alert('You must be of legal drinking age to use this app.');
    }
  };

  const handleGeoConsentAccept = async () => {
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
  };

  const handleGeoConsentDecline = () => {
    removeItem(STORAGE_KEYS.AGE_VERIFIED);
    setMultiple({ ageVerified: false, showGeoConsent: false });
  };

  const handleGeoBypass = () => {
    setItem(STORAGE_KEYS.GEO_VERIFIED, 'true');
    setItem(STORAGE_KEYS.USER_COUNTRY, 'USA (Manual Override)');
    setMultiple({
      geoVerified: true,
      geoBlocked: false,
      geoCountry: 'USA (Manual Override)',
      showDisclaimerModal: true,
    });
  };

  const handleGeoRetry = () => {
    setMultiple({ geoBlocked: false, showGeoConsent: true });
  };

  const handleGeoGoBack = () => {
    removeItem(STORAGE_KEYS.AGE_VERIFIED);
    removeItem(STORAGE_KEYS.GEO_CONSENT_GIVEN);
    setMultiple({ ageVerified: false, geoBlocked: false });
  };

  const handleDisclaimerAccept = () => {
    setItem(STORAGE_KEYS.DISCLAIMER_ACCEPTED, 'true');
    setMultiple({ disclaimerAccepted: true, showDisclaimerModal: false, currentSafetyScreen: 0 });
  };

  const handleSafetyScreenNext = () => {
    if (state.currentSafetyScreen < 3) {
      setField('currentSafetyScreen', state.currentSafetyScreen + 1);
    } else {
      setItem(STORAGE_KEYS.SAFETY_SCREENS_COMPLETE, 'true');
      setField('safetyScreensComplete', true);
    }
  };

  const handleSafetyScreenDecline = () => {
    removeItem(STORAGE_KEYS.AGE_VERIFIED);
    removeItem(STORAGE_KEYS.DISCLAIMER_ACCEPTED);
    removeItem(STORAGE_KEYS.SAFETY_SCREENS_COMPLETE);
    setMultiple({
      ageVerified: false,
      disclaimerAccepted: false,
      safetyScreensComplete: false,
      currentSafetyScreen: 0,
    });
  };

  const handleSetup = () => {
    if (!state.gender) {
      showRobotMessage('Please select your gender to continue.');
      return;
    }
    if (!state.weight) {
      showRobotMessage('Please enter your weight to continue.');
      return;
    }
    const error = validateWeight(state.weight);
    if (error) {
      setField('weightError', error);
      showRobotMessage(error);
      return;
    }

    setMultiple({
      weightError: '',
      setupComplete: true,
      startTime: Date.now(),
    });

    const greeting = ROBOT_GREETINGS[Math.floor(Math.random() * ROBOT_GREETINGS.length)];
    showRobotMessage(greeting);
  };

  const addDrink = (name = 'Standard Drink', oz = null, abv = null) => {
    if (!state.setupComplete || !state.gender || !state.weight) {
      showRobotMessage('Please complete setup first before adding drinks.');
      return;
    }

    if (!state.startTime) {
      setField('startTime', Date.now());
    }

    addDrinkAction(name, oz, abv);

    const comment = ROBOT_COMMENTS[Math.floor(Math.random() * ROBOT_COMMENTS.length)];
    showRobotMessage(comment);
  };

  const clearDrinks = () => {
    if (state.drinks.length > 0) {
      clearDrinksAction();
      showRobotMessage('*whirrs loudly* All drinks cleared from memory! Starting fresh! 🤖');
    } else {
      showRobotMessage('No drinks to clear!');
    }
  };

  const deleteDrink = (id) => {
    removeDrink(id);
    showRobotMessage('*whirrs* Drink removed from records! 🤖');
  };

  const tellJoke = () => {
    const randomJoke = JOKES[Math.floor(Math.random() * JOKES.length)];
    setMultiple({ currentJoke: randomJoke, showJoke: true });
    setTimeout(() => {
      setField('showJoke', false);
    }, CONSTANTS.JOKE_DURATION);
  };

  const handlePaymentSuccess = () => {
    const amount = parseFloat(state.customTipAmount) || 5;
    const receipt = generateReceipt(amount);
    addReceipt(receipt);
    setField('showReceipt', true);
    showRobotMessage('*beeps gratefully* Thank you for your support! 🤖💚');
  };

  const handleSaveCustomDrink = () => {
    const { customDrinkName, customDrinkOz, customDrinkABV } = state;
    if (!customDrinkName || !customDrinkOz || !customDrinkABV) {
      showRobotMessage('Please fill in all fields for custom drink.');
      return;
    }

    const drink = {
      id: Date.now(),
      name: customDrinkName,
      oz: parseFloat(customDrinkOz),
      abv: parseFloat(customDrinkABV),
    };

    addCustomDrinkAction(drink);
    setMultiple({
      customDrinkName: '',
      customDrinkOz: '',
      customDrinkABV: '5',
      showCustomDrink: false,
    });
    showRobotMessage('*beep boop* Custom drink saved! 🤖');
  };

  const handleDeleteCustomDrink = (id) => {
    deleteCustomDrinkAction(id);
    showRobotMessage('Custom drink deleted! 🤖');
  };

  // Settings handlers
  const handleSettingsEditToggle = () => {
    setMultiple({
      settingsEditMode: !state.settingsEditMode,
      settingsEditGender: state.gender,
      settingsEditWeight: state.weight,
    });
  };

  const handleSettingsSave = () => {
    const error = validateWeight(state.settingsEditWeight);
    if (error) {
      setField('weightError', error);
      return;
    }

    showConfirm(
      'Changing your profile will reset your current BAC tracking. Continue?',
      () => {
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
        showRobotMessage('Profile updated! Tracker has been reset. 🤖');
      }
    );
  };

  const handleSettingsCancel = () => {
    setMultiple({
      settingsEditMode: false,
      weightError: '',
    });
  };

  // Render flow screens
  if (!state.ageVerified) {
    return (
      <PWAProvider>
        <AgeVerification onVerify={handleAgeVerification} />
      </PWAProvider>
    );
  }

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
          onAccept={handleGeoConsentAccept}
          onDecline={handleGeoConsentDecline}
          onBypass={handleGeoBypass}
          onRetry={handleGeoRetry}
          onGoBack={handleGeoGoBack}
        />
      </PWAProvider>
    );
  }

  if (state.showDisclaimerModal) {
    return (
      <PWAProvider>
        <Disclaimer onAccept={handleDisclaimerAccept} />
      </PWAProvider>
    );
  }

  if (!state.safetyScreensComplete) {
    return (
      <PWAProvider>
        <SafetyScreens
          currentScreen={state.currentSafetyScreen}
          onNext={handleSafetyScreenNext}
          onDecline={handleSafetyScreenDecline}
        />
      </PWAProvider>
    );
  }

  if (!state.setupComplete) {
    return (
      <PWAProvider>
        <Setup
          gender={state.gender}
          weight={state.weight}
          weightError={state.weightError}
          onGenderChange={(gender) => setField('gender', gender)}
          onWeightChange={(weight) => setField('weight', weight)}
          onSubmit={handleSetup}
        />
      </PWAProvider>
    );
  }

  // Main app interface
  return (
    <PWAProvider>
      <MainLayout
        onSettingsClick={() => setField('showSettings', true)}
        onHelpClick={() => setField('showHelp', true)}
      >
        <MessageDisplay
          robotMessage={state.robotMessage}
          joke={state.currentJoke}
          showJoke={state.showJoke}
        />
        <BACDisplay bac={state.bac} hasBeenImpaired={state.hasBeenImpaired} />
        <TimeInfo startTime={state.startTime} bac={state.bac} useSlowMetabolism={state.useSlowMetabolism} />
        <AddDrinkPanel
          showCustomDrink={state.showCustomDrink}
          customDrinkName={state.customDrinkName}
          customDrinkOz={state.customDrinkOz}
          customDrinkABV={state.customDrinkABV}
          savedCustomDrinks={state.savedCustomDrinks}
          onToggleCustomDrink={() =>
            setField('showCustomDrink', !state.showCustomDrink)
          }
          onCustomDrinkChange={(field, value) => {
            if (field === 'name') {
              setField('customDrinkName', value);
            } else if (field === 'oz') {
              setField('customDrinkOz', value);
            } else if (field === 'abv') {
              setField('customDrinkABV', value);
            }
          }}
          onAddCustomDrink={() => {
            const { customDrinkName, customDrinkOz, customDrinkABV } = state;
            if (!customDrinkOz || !customDrinkABV) {
              showRobotMessage('Please fill in volume and ABV for custom drink.');
              return;
            }
            const name = customDrinkName || 'Custom Drink';
            addDrink(name, parseFloat(customDrinkOz), parseFloat(customDrinkABV));
            setMultiple({
              customDrinkName: '',
              customDrinkOz: '',
              customDrinkABV: '5',
              showCustomDrink: false,
            });
          }}
          onSaveCustomDrink={handleSaveCustomDrink}
          onDeleteCustomDrink={handleDeleteCustomDrink}
          onCancelCustomDrink={() => {
            setMultiple({
              customDrinkName: '',
              customDrinkOz: '',
              customDrinkABV: '5',
              showCustomDrink: false,
            });
          }}
          onAddDrink={addDrink}
        />
        <DrinkHistoryList
          drinks={state.drinks}
          showHistory={state.showDrinkHistory}
          onToggleHistory={() =>
            setField('showDrinkHistory', !state.showDrinkHistory)
          }
          onDeleteDrink={deleteDrink}
          onUndoLast={undoDrink}
          onClearAll={clearDrinks}
        />
        <SupportSection
          customTipAmount={state.customTipAmount}
          onCustomTipChange={(value) =>
            setField('customTipAmount', value)
          }
          onPaymentSuccess={handlePaymentSuccess}
          onTellJoke={tellJoke}
        />
      </MainLayout>

      {/* Modals */}
      <HelpModal
        isOpen={state.showHelp}
        onClose={() => setField('showHelp', false)}
      />
      <SettingsModal
        isOpen={state.showSettings}
        onClose={() => setField('showSettings', false)}
        gender={state.gender}
        weight={state.weight}
        editMode={state.settingsEditMode}
        editGender={state.settingsEditGender}
        editWeight={state.settingsEditWeight}
        weightError={state.weightError}
        useSlowMetabolism={state.useSlowMetabolism}
        onEditModeToggle={handleSettingsEditToggle}
        onGenderChange={(gender) =>
          setField('settingsEditGender', gender)
        }
        onWeightChange={(weight) =>
          setField('settingsEditWeight', weight)
        }
        onMetabolismChange={(value) =>
          setField('useSlowMetabolism', value)
        }
        onSaveSettings={handleSettingsSave}
        onCancelEdit={handleSettingsCancel}
        onShowRefundPolicy={() =>
          setField('showRefundPolicy', true)
        }
      />
      <RefundPolicyModal
        isOpen={state.showRefundPolicy}
        onClose={() => setField('showRefundPolicy', false)}
      />
      <ReceiptModal
        isOpen={state.showReceipt}
        onClose={() => setField('showReceipt', false)}
        receipt={state.currentReceipt}
      />
      <ConfirmModal
        isOpen={state.showConfirmModal}
        message={state.confirmModalMessage}
        onConfirm={() => {
          if (state.confirmModalAction) {
            state.confirmModalAction();
          }
        }}
        onCancel={() => hideConfirm()}
      />

      <PWAInstallPrompt />
    </PWAProvider>
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
