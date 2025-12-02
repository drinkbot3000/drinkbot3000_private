/**
 * DrinkBot3000 - Main Application Component
 * Blood Alcohol Content (BAC) tracking application
 *
 * REFACTORED: Now uses TrackerContext for centralized state management
 */

import React, { useState, useEffect, useCallback } from 'react';
import PWAInstallPrompt from './PWAInstallPrompt';

// State Management
import { TrackerProvider, useTracker } from './state/TrackerContext';

// Components
import { AgeVerification } from './components/AgeVerification';
import { SafetyScreens } from './components/SafetyScreens';
import { GeolocationConsent } from './components/GeolocationVerification';
import { Disclaimer } from './components/Disclaimer';
import { Setup } from './components/Setup';
import { MainLayout } from './components/MainLayout';
import { Calculator } from './components/Calculator';
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
import {
  calculateEstimateBAC,
  getBACStatus as getBACStatusService,
  calculateSoberTime,
  calculateStandardDrinks,
} from './services/bacCalculation.service';
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

// Initial state
const initialState = {
  ageVerified: false,
  setupComplete: false,
  gender: '',
  weight: '',
  bac: 0,
  drinks: [],
  startTime: null,
  currentJoke: '',
  showJoke: false,
  mode: '',
  estimateDrinks: '',
  estimateHours: '',
  activeTab: 'tracker',
  calcDrinks: '',
  calcHours: '',
  calcBAC: null,
  showSettings: false,
  showHelp: false,
  customDrinkOz: '',
  customDrinkABV: '5',
  customDrinkName: '',
  showCustomDrink: false,
  savedCustomDrinks: [],
  robotMessage: '',
  showConfirmModal: false,
  confirmModalMessage: '',
  confirmModalAction: null,
  showDrinkHistory: false,
  weightError: '',
  customTipAmount: '',
  showDisclaimerModal: false,
  disclaimerAccepted: false,
  tipError: '',
  showRefundPolicy: false,
  showReceipt: false,
  currentReceipt: null,
  receipts: [],
  currentSafetyScreen: 0,
  safetyScreensComplete: false,
  showGeoConsent: false,
  geoConsentGiven: false,
  geoVerified: false,
  geoBlocked: false,
  geoCountry: '',
  geoError: null,
  geoVerifying: false,
  geoTechnicalError: false,
  settingsEditGender: '',
  settingsEditWeight: '',
  settingsEditMode: false,
  hasBeenImpaired: false,
  useSlowMetabolism: true,
};

// Reducer
function appReducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'SET_MULTIPLE':
      return { ...state, ...action.values };
    case 'ADD_DRINK':
      return { ...state, drinks: [...state.drinks, action.drink] };
    case 'REMOVE_DRINK':
      return { ...state, drinks: state.drinks.filter((d) => d.id !== action.id) };
    case 'UNDO_DRINK':
      return { ...state, drinks: state.drinks.slice(0, -1) };
    case 'CLEAR_DRINKS':
      return {
        ...state,
        drinks: [],
        bac: 0,
        startTime: null,
        hasBeenImpaired: false,
        estimateDrinks: '',
        estimateHours: '',
        mode: '',
        setupComplete: false,
      };
    case 'RESET_APP':
      return {
        ...initialState,
        ageVerified: true,
        disclaimerAccepted: true,
        safetyScreensComplete: true,
      };
    case 'SHOW_CONFIRM':
      return {
        ...state,
        showConfirmModal: true,
        confirmModalMessage: action.message,
        confirmModalAction: action.action,
      };
    case 'HIDE_CONFIRM':
      return {
        ...state,
        showConfirmModal: false,
        confirmModalMessage: '',
        confirmModalAction: null,
      };
    case 'ADD_RECEIPT':
      return {
        ...state,
        receipts: [...state.receipts, action.receipt],
        currentReceipt: action.receipt,
      };
    case 'NEXT_SAFETY_SCREEN':
      return {
        ...state,
        currentSafetyScreen: state.currentSafetyScreen + 1,
      };
    case 'ADD_CUSTOM_DRINK':
      return {
        ...state,
        savedCustomDrinks: [...state.savedCustomDrinks, action.drink],
      };
    case 'DELETE_CUSTOM_DRINK':
      return {
        ...state,
        savedCustomDrinks: state.savedCustomDrinks.filter((d) => d.id !== action.id),
      };
    default:
      return state;
  }
}

/**
 * Main App Content (uses TrackerContext)
 */
function BACTrackerContent() {
  const { state, setField, setMultiple, addDrink: addDrinkAction, removeDrink, clearDrinks: clearDrinksAction, addReceipt, addCustomDrink: addCustomDrinkAction, deleteCustomDrink: deleteCustomDrinkAction, showConfirm, hideConfirm } = useTracker();

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
        mode: saved.mode || '',
        estimateDrinks: saved.estimateDrinks || '',
        estimateHours: saved.estimateHours || '',
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
        mode: state.mode,
        estimateDrinks: state.estimateDrinks,
        estimateHours: state.estimateHours,
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
    state.mode,
    state.estimateDrinks,
    state.estimateHours,
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

  // URL parameter parsing
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const drinks = urlParams.get('drinks');
    const hours = urlParams.get('hours');
    const tab = urlParams.get('tab');

    const updates = {};

    if (drinks && hours) {
      const drinksNum = parseFloat(drinks);
      const hoursNum = parseFloat(hours);
      if (!isNaN(drinksNum) && !isNaN(hoursNum) && drinksNum > 0 && hoursNum > 0) {
        updates.calcDrinks = drinks;
        updates.calcHours = hours;
        updates.activeTab = 'calculator';
      }
    }
    if (tab === 'calculator' || tab === 'tracker') {
      updates.activeTab = tab;
    }

    if (Object.keys(updates).length > 0) {
      setMultiple(updates);
    }
  }, [setMultiple]);

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
    if (!state.mode) {
      showRobotMessage('Please select a tracking mode.');
      return;
    }
    if (state.mode === 'estimate') {
      if (!state.estimateDrinks || !state.estimateHours) {
        showRobotMessage('Please enter number of drinks and time period for estimate mode.');
        return;
      }
      const drinks = parseFloat(state.estimateDrinks);
      const hours = parseFloat(state.estimateHours);
      if (isNaN(drinks) || drinks < 0 || isNaN(hours) || hours < 0) {
        showRobotMessage('Please enter valid numbers for drinks and hours.');
        return;
      }
    }

    const updates = { weightError: '', setupComplete: true };
    if (state.mode === 'live') {
      updates.startTime = Date.now();
    }
    setMultiple(updates);

    const greeting = ROBOT_GREETINGS[Math.floor(Math.random() * ROBOT_GREETINGS.length)];
    showRobotMessage(greeting);
  };

  const handleModeSelect = (selectedMode) => {
    setField('mode', selectedMode);
  };

  const addDrink = (name = 'Standard Drink', oz = null, abv = null) => {
    if (!state.setupComplete || !state.gender || !state.weight) {
      showRobotMessage('Please complete setup first before adding drinks.');
      return;
    }

    const standardDrinks =
      oz !== null && abv !== null ? calculateStandardDrinks(parseFloat(oz), parseFloat(abv)) : 1;

    const drinkType = oz !== null && abv !== null ? `${name} (${oz}oz @ ${abv}%)` : name;

    const newDrink = {
      id: Date.now(),
      timestamp: Date.now(),
      standardDrinks,
      type: drinkType,
      oz,
      abv,
    };

    if (state.mode === 'live' && !state.startTime) {
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

  const calculateQuickBAC = () => {
    if (!state.gender || !state.weight || !state.calcDrinks || !state.calcHours) {
      showRobotMessage('Please fill in all fields to calculate BAC.');
      return;
    }

    const result = calculateEstimateBAC({
      numDrinks: parseFloat(state.calcDrinks),
      hours: parseFloat(state.calcHours),
      weight: parseFloat(state.weight),
      gender: state.gender,
      useSlowMetabolism: state.useSlowMetabolism,
    });

    if (isNaN(result) || !isFinite(result) || result < 0) {
      showRobotMessage('Error in BAC calculation. Please check your inputs.');
      return;
    }

    setField('calcBAC', result);
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

  // Get current BAC status
  const currentBAC =
    state.activeTab === 'calculator' && state.calcBAC !== null ? state.calcBAC : state.bac;
  const status = getBACStatusService(currentBAC);

  // Calculate sober time
  const soberTime =
    currentBAC > 0 ? calculateSoberTime(currentBAC, state.useSlowMetabolism) : null;

  // Render flow screens
  if (!state.ageVerified) {
    return <AgeVerification onVerify={handleAgeVerification} />;
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
    );
  }

  if (state.showDisclaimerModal) {
    return <Disclaimer onAccept={handleDisclaimerAccept} />;
  }

  if (!state.safetyScreensComplete) {
    return (
      <SafetyScreens
        currentScreen={state.currentSafetyScreen}
        onNext={handleSafetyScreenNext}
        onDecline={handleSafetyScreenDecline}
      />
    );
  }

  if (!state.setupComplete) {
    return (
      <Setup
        gender={state.gender}
        weight={state.weight}
        mode={state.mode}
        estimateDrinks={state.estimateDrinks}
        estimateHours={state.estimateHours}
        weightError={state.weightError}
        useSlowMetabolism={state.useSlowMetabolism}
        onGenderChange={(gender) => setField('gender', gender)}
        onWeightChange={(weight) => setField('weight', weight)}
        onModeSelect={handleModeSelect}
        onEstimateDrinksChange={(value) => setField('estimateDrinks', value)}
        onEstimateHoursChange={(value) => setField('estimateHours', value)}
        onMetabolismChange={(value) => setField('useSlowMetabolism', value)}
        onComplete={handleSetup}
      />
    );
  }

  // Main app interface
  return (
    <>
      <MainLayout
        activeTab={state.activeTab}
        onTabChange={(tab) => setField('activeTab', tab)}
        onSettingsClick={() => setField('showSettings', true)}
        onHelpClick={() => setField('showHelp', true)}
      >
        {state.activeTab === 'tracker' ? (
          <>
            <MessageDisplay
              robotMessage={state.robotMessage}
              joke={state.currentJoke}
              showJoke={state.showJoke}
            />
            <BACDisplay bac={currentBAC} hasBeenImpaired={state.hasBeenImpaired} />
            <TimeInfo startTime={state.startTime} soberTime={soberTime} />
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
              onClearDrinks={clearDrinks}
            />
            <SupportSection
              customTipAmount={state.customTipAmount}
              onCustomTipChange={(value) =>
                setField('customTipAmount', value)
              }
              onPaymentSuccess={handlePaymentSuccess}
              onTellJoke={tellJoke}
            />
          </>
        ) : (
          <Calculator
            drinks={state.calcDrinks}
            hours={state.calcHours}
            calculatedBAC={state.calcBAC}
            gender={state.gender}
            onDrinksChange={(value) => setField('calcDrinks', value)}
            onHoursChange={(value) => setField('calcHours', value)}
            onCalculate={calculateQuickBAC}
          />
        )}
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
    </>
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
