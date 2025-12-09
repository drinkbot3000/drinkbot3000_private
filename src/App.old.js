/**
 * DrinkBot3000 - Main Application Component
 * Blood Alcohol Content (BAC) tracking application
 */

import React, { useState, useEffect, useReducer, useCallback } from 'react';
import PWAInstallPrompt from './PWAInstallPrompt';

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
  calculateBAC,
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
import { generateReceipt, downloadReceipt } from './services/receipt.service';

// Hooks
import { useRobotMessage } from './hooks/useRobotMessage';
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

export default function BACTracker() {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Robot message hook
  const showRobotMessage = useCallback(
    (message) => {
      dispatch({ type: 'SET_FIELD', field: 'robotMessage', value: message });
      setTimeout(() => {
        dispatch({ type: 'SET_FIELD', field: 'robotMessage', value: '' });
      }, CONSTANTS.ROBOT_MESSAGE_DURATION);
    },
    []
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

    if (ageCheck === 'true') {
      dispatch({ type: 'SET_FIELD', field: 'ageVerified', value: true });
    }
    if (disclaimerCheck === 'true') {
      dispatch({ type: 'SET_FIELD', field: 'disclaimerAccepted', value: true });
    }
    if (safetyCheck === 'true') {
      dispatch({ type: 'SET_FIELD', field: 'safetyScreensComplete', value: true });
    }
    if (geoCheck === 'true') {
      dispatch({ type: 'SET_FIELD', field: 'geoVerified', value: true });
    }
    if (geoCountry) {
      dispatch({ type: 'SET_FIELD', field: 'geoCountry', value: geoCountry });
    }
    if (geoConsentCheck === 'true') {
      dispatch({ type: 'SET_FIELD', field: 'geoConsentGiven', value: true });
    }
    if (savedReceipts) {
      dispatch({ type: 'SET_FIELD', field: 'receipts', value: savedReceipts });
    }
    if (saved) {
      dispatch({
        type: 'SET_MULTIPLE',
        values: {
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
        },
      });
    }
  }, []);

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
  useBACCalculation({ dispatch, state });

  // URL parameter parsing
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const drinks = urlParams.get('drinks');
    const hours = urlParams.get('hours');
    const tab = urlParams.get('tab');

    if (drinks && hours) {
      const drinksNum = parseFloat(drinks);
      const hoursNum = parseFloat(hours);
      if (!isNaN(drinksNum) && !isNaN(hoursNum) && drinksNum > 0 && hoursNum > 0) {
        dispatch({ type: 'SET_FIELD', field: 'calcDrinks', value: drinks });
        dispatch({ type: 'SET_FIELD', field: 'calcHours', value: hours });
        dispatch({ type: 'SET_FIELD', field: 'activeTab', value: 'calculator' });
      }
    }
    if (tab === 'calculator' || tab === 'tracker') {
      dispatch({ type: 'SET_FIELD', field: 'activeTab', value: tab });
    }
  }, []);

  // Event Handlers
  const handleAgeVerification = (isOfAge) => {
    if (isOfAge) {
      setItem(STORAGE_KEYS.AGE_VERIFIED, 'true');
      dispatch({ type: 'SET_FIELD', field: 'ageVerified', value: true });
      dispatch({ type: 'SET_FIELD', field: 'showGeoConsent', value: true });
    } else {
      alert('You must be of legal drinking age to use this app.');
    }
  };

  const handleGeoConsentAccept = async () => {
    dispatch({ type: 'SET_FIELD', field: 'geoConsentGiven', value: true });
    setItem(STORAGE_KEYS.GEO_CONSENT_GIVEN, 'true');
    dispatch({ type: 'SET_FIELD', field: 'showGeoConsent', value: false });
    dispatch({ type: 'SET_FIELD', field: 'geoVerifying', value: true });

    try {
      const result = await checkGeographicRestriction();
      dispatch({ type: 'SET_FIELD', field: 'geoVerifying', value: false });

      if (result.allowed) {
        dispatch({ type: 'SET_FIELD', field: 'geoVerified', value: true });
        dispatch({ type: 'SET_FIELD', field: 'geoCountry', value: result.country });
        dispatch({ type: 'SET_FIELD', field: 'geoBlocked', value: false });
        dispatch({ type: 'SET_FIELD', field: 'geoTechnicalError', value: false });
        dispatch({ type: 'SET_FIELD', field: 'showDisclaimerModal', value: true });
      } else {
        if (result.technicalError) {
          dispatch({ type: 'SET_FIELD', field: 'geoTechnicalError', value: true });
          dispatch({ type: 'SET_FIELD', field: 'geoBlocked', value: true });
          dispatch({ type: 'SET_FIELD', field: 'geoCountry', value: result.country });
        } else {
          dispatch({ type: 'SET_FIELD', field: 'geoBlocked', value: true });
          dispatch({ type: 'SET_FIELD', field: 'geoCountry', value: result.country });
          dispatch({ type: 'SET_FIELD', field: 'geoTechnicalError', value: false });
        }
      }
      if (result.error) {
        dispatch({ type: 'SET_FIELD', field: 'geoError', value: result.error });
      }
    } catch (error) {
      console.error('Geographic verification failed:', error);
      dispatch({ type: 'SET_FIELD', field: 'geoVerifying', value: false });
      dispatch({ type: 'SET_FIELD', field: 'geoError', value: error.message });
      dispatch({ type: 'SET_FIELD', field: 'geoBlocked', value: true });
      dispatch({ type: 'SET_FIELD', field: 'geoTechnicalError', value: true });
      dispatch({ type: 'SET_FIELD', field: 'geoCountry', value: 'Unknown' });
    }
  };

  const handleGeoConsentDecline = () => {
    dispatch({ type: 'SET_FIELD', field: 'ageVerified', value: false });
    dispatch({ type: 'SET_FIELD', field: 'showGeoConsent', value: false });
    removeItem(STORAGE_KEYS.AGE_VERIFIED);
  };

  const handleGeoBypass = () => {
    dispatch({ type: 'SET_FIELD', field: 'geoVerified', value: true });
    dispatch({ type: 'SET_FIELD', field: 'geoBlocked', value: false });
    dispatch({ type: 'SET_FIELD', field: 'geoCountry', value: 'USA (Manual Override)' });
    setItem(STORAGE_KEYS.GEO_VERIFIED, 'true');
    setItem(STORAGE_KEYS.USER_COUNTRY, 'USA (Manual Override)');
    dispatch({ type: 'SET_FIELD', field: 'showDisclaimerModal', value: true });
  };

  const handleGeoRetry = () => {
    dispatch({ type: 'SET_FIELD', field: 'geoBlocked', value: false });
    dispatch({ type: 'SET_FIELD', field: 'showGeoConsent', value: true });
  };

  const handleGeoGoBack = () => {
    dispatch({ type: 'SET_FIELD', field: 'ageVerified', value: false });
    dispatch({ type: 'SET_FIELD', field: 'geoBlocked', value: false });
    removeItem(STORAGE_KEYS.AGE_VERIFIED);
    removeItem(STORAGE_KEYS.GEO_CONSENT_GIVEN);
  };

  const handleDisclaimerAccept = () => {
    setItem(STORAGE_KEYS.DISCLAIMER_ACCEPTED, 'true');
    dispatch({ type: 'SET_FIELD', field: 'disclaimerAccepted', value: true });
    dispatch({ type: 'SET_FIELD', field: 'showDisclaimerModal', value: false });
    dispatch({ type: 'SET_FIELD', field: 'currentSafetyScreen', value: 0 });
  };

  const handleSafetyScreenNext = () => {
    if (state.currentSafetyScreen < 3) {
      dispatch({ type: 'NEXT_SAFETY_SCREEN' });
    } else {
      setItem(STORAGE_KEYS.SAFETY_SCREENS_COMPLETE, 'true');
      dispatch({ type: 'SET_FIELD', field: 'safetyScreensComplete', value: true });
    }
  };

  const handleSafetyScreenDecline = () => {
    removeItem(STORAGE_KEYS.AGE_VERIFIED);
    removeItem(STORAGE_KEYS.DISCLAIMER_ACCEPTED);
    removeItem(STORAGE_KEYS.SAFETY_SCREENS_COMPLETE);
    dispatch({ type: 'SET_FIELD', field: 'ageVerified', value: false });
    dispatch({ type: 'SET_FIELD', field: 'disclaimerAccepted', value: false });
    dispatch({ type: 'SET_FIELD', field: 'safetyScreensComplete', value: false });
    dispatch({ type: 'SET_FIELD', field: 'currentSafetyScreen', value: 0 });
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
      dispatch({ type: 'SET_FIELD', field: 'weightError', value: error });
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
    dispatch({ type: 'SET_FIELD', field: 'weightError', value: '' });
    dispatch({ type: 'SET_FIELD', field: 'setupComplete', value: true });
    if (state.mode === 'live') {
      dispatch({ type: 'SET_FIELD', field: 'startTime', value: Date.now() });
    }
    const greeting = ROBOT_GREETINGS[Math.floor(Math.random() * ROBOT_GREETINGS.length)];
    showRobotMessage(greeting);
  };

  const handleModeSelect = (selectedMode) => {
    dispatch({ type: 'SET_FIELD', field: 'mode', value: selectedMode });
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
      dispatch({ type: 'SET_FIELD', field: 'startTime', value: Date.now() });
    }

    dispatch({ type: 'ADD_DRINK', drink: newDrink });

    const comment = ROBOT_COMMENTS[Math.floor(Math.random() * ROBOT_COMMENTS.length)];
    showRobotMessage(comment);
  };

  const clearDrinks = () => {
    if (state.drinks.length > 0) {
      dispatch({ type: 'CLEAR_DRINKS' });
      showRobotMessage('*whirrs loudly* All drinks cleared from memory! Starting fresh! 🤖');
    } else {
      showRobotMessage('No drinks to clear!');
    }
  };

  const deleteDrink = (id) => {
    dispatch({ type: 'REMOVE_DRINK', id });
    showRobotMessage('*whirrs* Drink removed from records! 🤖');
  };

  const tellJoke = () => {
    const randomJoke = JOKES[Math.floor(Math.random() * JOKES.length)];
    dispatch({ type: 'SET_FIELD', field: 'currentJoke', value: randomJoke });
    dispatch({ type: 'SET_FIELD', field: 'showJoke', value: true });
    setTimeout(() => {
      dispatch({ type: 'SET_FIELD', field: 'showJoke', value: false });
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

    dispatch({ type: 'SET_FIELD', field: 'calcBAC', value: result });
  };

  const handlePaymentSuccess = () => {
    const amount = parseFloat(state.customTipAmount) || 5;
    const receipt = generateReceipt(amount);
    dispatch({ type: 'ADD_RECEIPT', receipt });
    dispatch({ type: 'SET_FIELD', field: 'showReceipt', value: true });
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

    dispatch({ type: 'ADD_CUSTOM_DRINK', drink });
    dispatch({ type: 'SET_FIELD', field: 'customDrinkName', value: '' });
    dispatch({ type: 'SET_FIELD', field: 'customDrinkOz', value: '' });
    dispatch({ type: 'SET_FIELD', field: 'customDrinkABV', value: '5' });
    dispatch({ type: 'SET_FIELD', field: 'showCustomDrink', value: false });
    showRobotMessage('*beep boop* Custom drink saved! 🤖');
  };

  const handleDeleteCustomDrink = (id) => {
    dispatch({ type: 'DELETE_CUSTOM_DRINK', id });
    showRobotMessage('Custom drink deleted! 🤖');
  };

  // Settings handlers
  const handleSettingsEditToggle = () => {
    dispatch({
      type: 'SET_MULTIPLE',
      values: {
        settingsEditMode: !state.settingsEditMode,
        settingsEditGender: state.gender,
        settingsEditWeight: state.weight,
      },
    });
  };

  const handleSettingsSave = () => {
    const error = validateWeight(state.settingsEditWeight);
    if (error) {
      dispatch({ type: 'SET_FIELD', field: 'weightError', value: error });
      return;
    }

    dispatch({
      type: 'SHOW_CONFIRM',
      message: 'Changing your profile will reset your current BAC tracking. Continue?',
      action: () => {
        dispatch({
          type: 'SET_MULTIPLE',
          values: {
            gender: state.settingsEditGender,
            weight: state.settingsEditWeight,
            drinks: [],
            bac: 0,
            startTime: null,
            hasBeenImpaired: false,
            settingsEditMode: false,
            weightError: '',
          },
        });
        dispatch({ type: 'HIDE_CONFIRM' });
        showRobotMessage('Profile updated! Tracker has been reset. 🤖');
      },
    });
  };

  const handleSettingsCancel = () => {
    dispatch({
      type: 'SET_MULTIPLE',
      values: {
        settingsEditMode: false,
        weightError: '',
      },
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
        onGenderChange={(gender) => dispatch({ type: 'SET_FIELD', field: 'gender', value: gender })}
        onWeightChange={(weight) => dispatch({ type: 'SET_FIELD', field: 'weight', value: weight })}
        onModeSelect={handleModeSelect}
        onEstimateDrinksChange={(value) =>
          dispatch({ type: 'SET_FIELD', field: 'estimateDrinks', value })
        }
        onEstimateHoursChange={(value) =>
          dispatch({ type: 'SET_FIELD', field: 'estimateHours', value })
        }
        onMetabolismChange={(value) =>
          dispatch({ type: 'SET_FIELD', field: 'useSlowMetabolism', value })
        }
        onComplete={handleSetup}
      />
    );
  }

  // Main app interface
  return (
    <>
      <MainLayout
        activeTab={state.activeTab}
        onTabChange={(tab) => dispatch({ type: 'SET_FIELD', field: 'activeTab', value: tab })}
        onSettingsClick={() => dispatch({ type: 'SET_FIELD', field: 'showSettings', value: true })}
        onHelpClick={() => dispatch({ type: 'SET_FIELD', field: 'showHelp', value: true })}
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
                dispatch({
                  type: 'SET_FIELD',
                  field: 'showCustomDrink',
                  value: !state.showCustomDrink,
                })
              }
              onCustomDrinkNameChange={(value) =>
                dispatch({ type: 'SET_FIELD', field: 'customDrinkName', value })
              }
              onCustomDrinkOzChange={(value) =>
                dispatch({ type: 'SET_FIELD', field: 'customDrinkOz', value })
              }
              onCustomDrinkABVChange={(value) =>
                dispatch({ type: 'SET_FIELD', field: 'customDrinkABV', value })
              }
              onSaveCustomDrink={handleSaveCustomDrink}
              onDeleteCustomDrink={handleDeleteCustomDrink}
              onAddDrink={addDrink}
            />
            <DrinkHistoryList
              drinks={state.drinks}
              showHistory={state.showDrinkHistory}
              onToggleHistory={() =>
                dispatch({
                  type: 'SET_FIELD',
                  field: 'showDrinkHistory',
                  value: !state.showDrinkHistory,
                })
              }
              onDeleteDrink={deleteDrink}
              onClearDrinks={clearDrinks}
            />
            <SupportSection
              customTipAmount={state.customTipAmount}
              onCustomTipChange={(value) =>
                dispatch({ type: 'SET_FIELD', field: 'customTipAmount', value })
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
            onDrinksChange={(value) => dispatch({ type: 'SET_FIELD', field: 'calcDrinks', value })}
            onHoursChange={(value) => dispatch({ type: 'SET_FIELD', field: 'calcHours', value })}
            onCalculate={calculateQuickBAC}
          />
        )}
      </MainLayout>

      {/* Modals */}
      <HelpModal
        isOpen={state.showHelp}
        onClose={() => dispatch({ type: 'SET_FIELD', field: 'showHelp', value: false })}
      />
      <SettingsModal
        isOpen={state.showSettings}
        onClose={() => dispatch({ type: 'SET_FIELD', field: 'showSettings', value: false })}
        gender={state.gender}
        weight={state.weight}
        editMode={state.settingsEditMode}
        editGender={state.settingsEditGender}
        editWeight={state.settingsEditWeight}
        weightError={state.weightError}
        useSlowMetabolism={state.useSlowMetabolism}
        onEditModeToggle={handleSettingsEditToggle}
        onGenderChange={(gender) =>
          dispatch({ type: 'SET_FIELD', field: 'settingsEditGender', value: gender })
        }
        onWeightChange={(weight) =>
          dispatch({ type: 'SET_FIELD', field: 'settingsEditWeight', value: weight })
        }
        onMetabolismChange={(value) =>
          dispatch({ type: 'SET_FIELD', field: 'useSlowMetabolism', value })
        }
        onSaveSettings={handleSettingsSave}
        onCancelEdit={handleSettingsCancel}
        onShowRefundPolicy={() =>
          dispatch({ type: 'SET_FIELD', field: 'showRefundPolicy', value: true })
        }
      />
      <RefundPolicyModal
        isOpen={state.showRefundPolicy}
        onClose={() => dispatch({ type: 'SET_FIELD', field: 'showRefundPolicy', value: false })}
      />
      <ReceiptModal
        isOpen={state.showReceipt}
        onClose={() => dispatch({ type: 'SET_FIELD', field: 'showReceipt', value: false })}
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
        onCancel={() => dispatch({ type: 'HIDE_CONFIRM' })}
      />

      <PWAInstallPrompt />
    </>
  );
}
