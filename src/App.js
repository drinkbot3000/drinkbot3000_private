import React, { useState, useEffect, useReducer, useCallback, useMemo } from 'react';
import PWAInstallPrompt from './PWAInstallPrompt';

// Components
import AgeVerification from './components/AgeVerification';
import DisclaimerModal from './components/DisclaimerModal';
import SafetyScreens from './components/SafetyScreens';
import SplashScreen from './components/SplashScreen';
import SetupScreen from './components/SetupScreen';
import BACDisplay from './components/BACDisplay';
import DrinkList from './components/DrinkList';
import ConfirmModal from './components/ConfirmModal';

// Hooks
import { useBAC, useOptimizedHandlers, useTimeFormatting } from './hooks/useBAC';

// Utils
import { validateLocalStorageData, RateLimiter } from './utils/security';
import { CONSTANTS, ROBOT_GREETINGS, ROBOT_COMMENTS } from './utils/constants';

// Initial state
const initialState = {
  ageVerified: false,
  setupComplete: false,
  gender: '',
  weight: '',
  bac: 0,
  drinks: [],
  startTime: null,
  mode: '',
  estimateDrinks: '',
  estimateHours: '',
  showSplash: true,
  showConfirmModal: false,
  confirmModalMessage: '',
  confirmModalAction: null,
  weightError: '',
  showDisclaimerModal: false,
  disclaimerAccepted: false,
  currentSafetyScreen: 0,
  safetyScreensComplete: false,
  robotMessage: '',
};

// Reducer with security-enhanced actions
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
      return { ...state, drinks: [], bac: 0, startTime: Date.now() };
    case 'RESET_APP':
      return {
        ...initialState,
        showSplash: false,
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
    case 'NEXT_SAFETY_SCREEN':
      return {
        ...state,
        currentSafetyScreen: state.currentSafetyScreen + 1,
      };
    default:
      return state;
  }
}

// Rate limiter for actions
const addDrinkLimiter = new RateLimiter(20, 60000); // Max 20 drinks per minute

export default function BACTracker() {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Performance-optimized handlers
  const handlers = useOptimizedHandlers(dispatch, state);

  // BAC calculation hook with memoization
  const { currentBAC, soberTime, bacStatus, isOverLegalLimit } = useBAC(state);

  // Time formatting hook
  const { formatTime, formatSoberTime } = useTimeFormatting();

  // Load saved data with security validation
  useEffect(() => {
    const saved = localStorage.getItem('bacTrackerData');
    const ageCheck = localStorage.getItem('ageVerified');
    const disclaimerCheck = localStorage.getItem('disclaimerAccepted');
    const safetyCheck = localStorage.getItem('safetyScreensComplete');

    if (ageCheck === 'true') {
      handlers.handleFieldChange('ageVerified', true);
    }

    if (disclaimerCheck === 'true') {
      handlers.handleFieldChange('disclaimerAccepted', true);
    }

    if (safetyCheck === 'true') {
      handlers.handleFieldChange('safetyScreensComplete', true);
    }

    if (saved && ageCheck === 'true') {
      try {
        const validatedData = validateLocalStorageData(saved);
        if (validatedData) {
          handlers.handleMultipleFields({ ...validatedData, showSplash: false });
        }
      } catch (e) {
        console.error('Failed to load saved data:', e);
      }
    }
  }, [handlers]); // handlers is stable due to useOptimizedHandlers

  // Save to localStorage with security
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
      };
      localStorage.setItem('bacTrackerData', JSON.stringify(dataToSave));
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
  ]);

  // Update BAC every second (optimized)
  useEffect(() => {
    if (!state.setupComplete) return;

    const interval = setInterval(() => {
      handlers.handleFieldChange('bac', currentBAC);
    }, 1000);

    return () => clearInterval(interval);
  }, [state.setupComplete, currentBAC, handlers]);

  // Show robot message with timeout
  const showRobotMessage = useCallback(
    (message) => {
      handlers.handleFieldChange('robotMessage', message);
      setTimeout(() => {
        handlers.handleFieldChange('robotMessage', '');
      }, CONSTANTS.ROBOT_MESSAGE_DURATION);
    },
    [handlers]
  );

  // Age verification handler
  const handleAgeVerification = useCallback(
    (isOfAge) => {
      if (isOfAge) {
        localStorage.setItem('ageVerified', 'true');
        handlers.handleFieldChange('ageVerified', true);
        handlers.handleFieldChange('showDisclaimerModal', true);
      } else {
        alert('You must be of legal drinking age to use this app.');
      }
    },
    [handlers]
  );

  // Disclaimer acceptance handler
  const handleDisclaimerAccept = useCallback(() => {
    localStorage.setItem('disclaimerAccepted', 'true');
    handlers.handleFieldChange('disclaimerAccepted', true);
    handlers.handleFieldChange('showDisclaimerModal', false);
    handlers.handleFieldChange('currentSafetyScreen', 0);
  }, [handlers]);

  // Disclaimer decline handler
  const handleDisclaimerDecline = useCallback(() => {
    handlers.handleFieldChange('ageVerified', false);
    localStorage.removeItem('ageVerified');
  }, [handlers]);

  // Safety screen next handler
  const handleSafetyScreenNext = useCallback(() => {
    if (state.currentSafetyScreen < 3) {
      dispatch({ type: 'NEXT_SAFETY_SCREEN' });
    } else {
      localStorage.setItem('safetyScreensComplete', 'true');
      handlers.handleFieldChange('safetyScreensComplete', true);
    }
  }, [state.currentSafetyScreen, handlers]);

  // Setup handler
  const handleSetup = useCallback(() => {
    if (state.gender && state.weight && parseFloat(state.weight) > 0 && !state.weightError) {
      handlers.handleFieldChange('setupComplete', true);

      if (state.mode === 'live') {
        handlers.handleFieldChange('startTime', Date.now());
      }

      const greeting = ROBOT_GREETINGS[Math.floor(Math.random() * ROBOT_GREETINGS.length)];
      showRobotMessage(greeting);
    }
  }, [state.gender, state.weight, state.weightError, state.mode, handlers, showRobotMessage]);

  // Mode selection handler
  const handleModeSelect = useCallback(
    (selectedMode) => {
      handlers.handleFieldChange('mode', selectedMode);
    },
    [handlers]
  );

  // Back button handler
  const handleBack = useCallback(() => {
    handlers.handleMultipleFields({
      mode: '',
      gender: '',
      weight: '',
      estimateDrinks: '',
      estimateHours: '',
      weightError: '',
    });
  }, [handlers]);

  // Add drink handler with rate limiting
  const handleAddDrink = useCallback(() => {
    if (!addDrinkLimiter.isAllowed('addDrink')) {
      showRobotMessage('*beep boop* Please slow down! Too many drinks added too quickly! 🤖');
      return;
    }

    const newDrink = {
      id: Date.now(),
      timestamp: Date.now(),
      standardDrinks: 1,
      type: 'Standard Drink',
    };
    handlers.handleAddDrink(newDrink);

    const comment = ROBOT_COMMENTS[Math.floor(Math.random() * ROBOT_COMMENTS.length)];
    showRobotMessage(comment);
  }, [handlers, showRobotMessage]);

  // Undo drink handler
  const handleUndoDrink = useCallback(() => {
    if (state.drinks.length > 0) {
      handlers.handleUndoDrink();
      showRobotMessage('*beep boop* Last drink removed from records! 🤖');
    }
  }, [state.drinks.length, handlers, showRobotMessage]);

  // Delete drink handler
  const handleDeleteDrink = useCallback(
    (id) => {
      handlers.handleRemoveDrink(id);
      showRobotMessage('*whirrs* Drink removed from records! 🤖');
    },
    [handlers, showRobotMessage]
  );

  // Reset app handler
  const handleResetApp = useCallback(() => {
    dispatch({
      type: 'SHOW_CONFIRM',
      message: 'Are you sure you want to reset the app? All data will be permanently deleted.',
      action: () => {
        localStorage.removeItem('bacTrackerData');
        dispatch({ type: 'RESET_APP' });
        dispatch({ type: 'HIDE_CONFIRM' });
      },
    });
  }, []);

  // Confirm modal handlers
  const handleConfirmAction = useCallback(() => {
    if (state.confirmModalAction) {
      state.confirmModalAction();
    }
  }, [state.confirmModalAction]);

  const handleCancelConfirm = useCallback(() => {
    dispatch({ type: 'HIDE_CONFIRM' });
  }, []);

  // Memoized formatted sober time
  const formattedSoberTime = useMemo(() => {
    return formatSoberTime(soberTime);
  }, [soberTime, formatSoberTime]);

  // Robot message display
  const RobotMessage = useMemo(() => {
    if (!state.robotMessage) return null;

    return (
      <div
        className="fixed bottom-6 right-6 bg-indigo-600 text-white px-6 py-4 rounded-xl shadow-2xl max-w-sm z-50 animate-bounce"
        role="status"
        aria-live="polite"
      >
        <p className="font-medium">{state.robotMessage}</p>
      </div>
    );
  }, [state.robotMessage]);

  // Render appropriate screen based on state
  if (!state.ageVerified) {
    return (
      <AgeVerification
        onVerification={handleAgeVerification}
        legalDrinkingAge={CONSTANTS.LEGAL_DRINKING_AGE}
      />
    );
  }

  if (state.showDisclaimerModal || (!state.disclaimerAccepted && state.ageVerified)) {
    return (
      <DisclaimerModal
        onAccept={handleDisclaimerAccept}
        onDecline={handleDisclaimerDecline}
        legalDrinkingAge={CONSTANTS.LEGAL_DRINKING_AGE}
      />
    );
  }

  if (!state.safetyScreensComplete && state.disclaimerAccepted) {
    return (
      <SafetyScreens
        currentScreen={state.currentSafetyScreen}
        onNext={handleSafetyScreenNext}
      />
    );
  }

  if (state.showSplash && state.safetyScreensComplete) {
    return (
      <SplashScreen
        onContinue={() => handlers.handleFieldChange('showSplash', false)}
      />
    );
  }

  if (!state.setupComplete) {
    return (
      <SetupScreen
        mode={state.mode}
        gender={state.gender}
        weight={state.weight}
        weightError={state.weightError}
        estimateDrinks={state.estimateDrinks}
        estimateHours={state.estimateHours}
        onFieldChange={handlers.handleFieldChange}
        onModeSelect={handleModeSelect}
        onSetup={handleSetup}
        onBack={handleBack}
        constants={CONSTANTS}
      />
    );
  }

  // Main tracker interface (placeholder - would need full implementation)
  return (
    <>
      <div
        className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6"
        role="main"
        aria-labelledby="app-title"
      >
        <div className="max-w-md mx-auto">
          <header className="text-center mb-6">
            <h1 id="app-title" className="text-3xl font-bold text-gray-800 mb-2">
              DrinkBot3000
            </h1>
            <p className="text-gray-600">Your responsible drinking companion</p>
          </header>

          <BACDisplay
            bac={currentBAC}
            status={bacStatus}
            soberTime={formattedSoberTime}
            minutesToSober={Math.ceil((currentBAC / CONSTANTS.METABOLISM_RATE) * 60)}
            isOverLegalLimit={isOverLegalLimit}
          />

          {state.mode === 'live' && (
            <>
              <div className="mb-6 flex gap-3">
                <button
                  onClick={handleAddDrink}
                  className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition focus:outline-none focus:ring-4 focus:ring-indigo-300"
                  aria-label="Add a standard drink to tracking"
                >
                  Add Drink
                </button>
                <button
                  onClick={handleUndoDrink}
                  disabled={state.drinks.length === 0}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-gray-300"
                  aria-label="Undo last drink"
                >
                  Undo
                </button>
              </div>

              <DrinkList
                drinks={state.drinks}
                onDeleteDrink={handleDeleteDrink}
                formatTime={formatTime}
              />
            </>
          )}

          <button
            onClick={handleResetApp}
            className="w-full mt-6 bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition focus:outline-none focus:ring-4 focus:ring-red-300"
            aria-label="Reset application and clear all data"
          >
            Reset App
          </button>
        </div>
      </div>

      <ConfirmModal
        isOpen={state.showConfirmModal}
        message={state.confirmModalMessage}
        onConfirm={handleConfirmAction}
        onCancel={handleCancelConfirm}
      />

      {RobotMessage}

      <PWAInstallPrompt />
    </>
  );
}
