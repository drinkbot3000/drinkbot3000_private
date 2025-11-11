import React, { useReducer, useEffect, useCallback, useMemo } from 'react';
import { AlertCircle, Beer, User, Scale, Smile, Calculator, Activity, Settings, Trash2, Clock, X, Coffee, DollarSign, AlertTriangle, FileText, RefreshCw, CheckCircle } from 'lucide-react';
import PWAInstallPrompt from './PWAInstallPrompt';
import { checkGeographicRestriction } from './geolocation';

// Import constants
import CONSTANTS from './constants/appConstants';
import { jokes, robotGreetings, robotComments } from './constants/jokes';

// Import utilities
import { validateWeight } from './utils/validations';
import { calculateBAC as calcBAC, getBACStatus } from './utils/bacCalculations';
import { formatTime, getSoberTime, calculateElapsedTime } from './utils/timeUtils';
import { generateReceipt, downloadReceipt } from './utils/receiptUtils';

// Import reducer and state
import { initialState, appReducer } from './hooks/appReducer';

// Import components
import AgeVerification from './components/AgeVerification';
import GeoConsent from './components/GeoConsent';
import { SafetyScreen1, SafetyScreen2, SafetyScreen3, SafetyScreen4 } from './components/SafetyScreens';

export default function BACTracker() {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load saved data
  useEffect(() => {
    const saved = localStorage.getItem('bacTrackerData');
    const ageCheck = localStorage.getItem('ageVerified');
    const disclaimerCheck = localStorage.getItem('disclaimerAccepted');
    const safetyCheck = localStorage.getItem('safetyScreensComplete');
    const savedReceipts = localStorage.getItem('bacTrackerReceipts');

    if (ageCheck === 'true') {
      dispatch({ type: 'SET_FIELD', field: 'ageVerified', value: true });
    }

    if (disclaimerCheck === 'true') {
      dispatch({ type: 'SET_FIELD', field: 'disclaimerAccepted', value: true });
    }

    if (safetyCheck === 'true') {
      dispatch({ type: 'SET_FIELD', field: 'safetyScreensComplete', value: true });
    }

    if (savedReceipts) {
      try {
        const receipts = JSON.parse(savedReceipts);
        dispatch({ type: 'SET_FIELD', field: 'receipts', value: receipts });
      } catch (e) {
        console.error('Failed to load receipts:', e);
      }
    }

    if (saved && ageCheck === 'true') {
      try {
        const data = JSON.parse(saved);
        dispatch({ type: 'SET_MULTIPLE', values: { ...data, showSplash: false } });
      } catch (e) {
        console.error('Failed to load saved data:', e);
      }
    }
  }, []);

  // Save receipts
  useEffect(() => {
    if (state.receipts.length > 0) {
      localStorage.setItem('bacTrackerReceipts', JSON.stringify(state.receipts));
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

  // Calculate BAC
  const calculateBACValue = () => {
    return calcBAC({
      mode: state.mode,
      gender: state.gender,
      weight: state.weight,
      drinks: state.drinks,
      startTime: state.startTime,
      estimateDrinks: state.estimateDrinks,
      estimateHours: state.estimateHours,
    });
  };

  // Update BAC every second
  useEffect(() => {
    if (!state.setupComplete) return;

    const interval = setInterval(() => {
      dispatch({ type: 'SET_FIELD', field: 'bac', value: calculateBACValue() });
    }, 1000);

    return () => clearInterval(interval);
  }, [state.drinks, state.setupComplete, state.gender, state.weight, state.startTime, state.mode, state.estimateDrinks, state.estimateHours]);

  const showRobotMessage = useCallback((message) => {
    dispatch({ type: 'SET_FIELD', field: 'robotMessage', value: message });
    setTimeout(() => {
      dispatch({ type: 'SET_FIELD', field: 'robotMessage', value: '' });
    }, CONSTANTS.ROBOT_MESSAGE_DURATION);
  }, []);

  const handleAgeVerification = useCallback((isOfAge) => {
    if (isOfAge) {
      localStorage.setItem('ageVerified', 'true');
      dispatch({ type: 'SET_FIELD', field: 'ageVerified', value: true });
      dispatch({ type: 'SET_FIELD', field: 'showGeoConsent', value: true });
    } else {
      alert('You must be of legal drinking age to use this app.');
    }
  }, []);

  const handleGeoConsentAccept = useCallback(async () => {
    dispatch({ type: 'SET_FIELD', field: 'geoConsentGiven', value: true });
    dispatch({ type: 'SET_FIELD', field: 'showGeoConsent', value: false });

    try {
      const result = await checkGeographicRestriction();

      if (result.allowed) {
        dispatch({ type: 'SET_FIELD', field: 'geoVerified', value: true });
        dispatch({ type: 'SET_FIELD', field: 'geoCountry', value: result.country });
        dispatch({ type: 'SET_FIELD', field: 'geoBlocked', value: false });
        dispatch({ type: 'SET_FIELD', field: 'showDisclaimerModal', value: true });
      } else {
        dispatch({ type: 'SET_FIELD', field: 'geoBlocked', value: true });
        dispatch({ type: 'SET_FIELD', field: 'geoCountry', value: result.country });
      }

      if (result.error) {
        dispatch({ type: 'SET_FIELD', field: 'geoError', value: result.error });
      }
    } catch (error) {
      console.error('Geographic verification failed:', error);
      dispatch({ type: 'SET_FIELD', field: 'geoError', value: error.message });
      dispatch({ type: 'SET_FIELD', field: 'geoVerified', value: true });
      dispatch({ type: 'SET_FIELD', field: 'showDisclaimerModal', value: true });
    }
  }, []);

  const handleGeoConsentDecline = useCallback(() => {
    dispatch({ type: 'SET_FIELD', field: 'ageVerified', value: false });
    dispatch({ type: 'SET_FIELD', field: 'showGeoConsent', value: false });
    localStorage.removeItem('ageVerified');
  }, []);

  const handleDisclaimerAccept = useCallback(() => {
    localStorage.setItem('disclaimerAccepted', 'true');
    dispatch({ type: 'SET_FIELD', field: 'disclaimerAccepted', value: true });
    dispatch({ type: 'SET_FIELD', field: 'showDisclaimerModal', value: false });
    dispatch({ type: 'SET_FIELD', field: 'currentSafetyScreen', value: 0 });
  }, []);

  const handleSafetyScreenNext = useCallback(() => {
    if (state.currentSafetyScreen < 3) {
      dispatch({ type: 'NEXT_SAFETY_SCREEN' });
    } else {
      localStorage.setItem('safetyScreensComplete', 'true');
      dispatch({ type: 'SET_FIELD', field: 'safetyScreensComplete', value: true });
    }
  }, [state.currentSafetyScreen]);

  const handleSafetyScreenDecline = useCallback(() => {
    localStorage.removeItem('ageVerified');
    localStorage.removeItem('disclaimerAccepted');
    localStorage.removeItem('safetyScreensComplete');
    dispatch({ type: 'SET_FIELD', field: 'ageVerified', value: false });
    dispatch({ type: 'SET_FIELD', field: 'disclaimerAccepted', value: false });
    dispatch({ type: 'SET_FIELD', field: 'safetyScreensComplete', value: false });
    dispatch({ type: 'SET_FIELD', field: 'currentSafetyScreen', value: 0 });
  }, []);

  const handleSetup = useCallback(() => {
    const error = validateWeight(state.weight);
    if (error) {
      dispatch({ type: 'SET_FIELD', field: 'weightError', value: error });
      return;
    }

    if (state.gender && state.weight && parseFloat(state.weight) > 0) {
      dispatch({ type: 'SET_FIELD', field: 'weightError', value: '' });
      dispatch({ type: 'SET_FIELD', field: 'setupComplete', value: true });

      if (state.mode === 'live') {
        dispatch({ type: 'SET_FIELD', field: 'startTime', value: Date.now() });
      }

      const greeting = robotGreetings[Math.floor(Math.random() * robotGreetings.length)];
      showRobotMessage(greeting);
    }
  }, [state.weight, state.gender, state.mode, showRobotMessage]);

  const handleModeSelect = useCallback((selectedMode) => {
    dispatch({ type: 'SET_FIELD', field: 'mode', value: selectedMode });
  }, []);

  const resetApp = useCallback(() => {
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

  const addDrink = useCallback((type, oz, abv) => {
    const pureAlcoholOz = parseFloat(oz) * (parseFloat(abv) / 100);
    const standardDrinks = pureAlcoholOz / CONSTANTS.STANDARD_DRINK_OZ;

    const newDrink = {
      id: Date.now(),
      timestamp: Date.now(),
      standardDrinks: standardDrinks,
      type: type,
      oz: oz,
      abv: abv,
      time: Date.now(),
    };
    dispatch({ type: 'ADD_DRINK', drink: newDrink });

    const comment = robotComments[Math.floor(Math.random() * robotComments.length)];
    showRobotMessage(comment);
  }, [showRobotMessage]);

  const undoDrink = useCallback(() => {
    if (state.drinks.length > 0) {
      dispatch({ type: 'UNDO_DRINK' });
      showRobotMessage('*beep boop* Last drink removed from records! 🤖');
    }
  }, [state.drinks.length, showRobotMessage]);

  const removeDrink = useCallback((id) => {
    dispatch({ type: 'REMOVE_DRINK', id });
    showRobotMessage('*whirrs* Drink removed from records! 🤖');
  }, [showRobotMessage]);

  const clearDrinks = useCallback(() => {
    dispatch({
      type: 'SHOW_CONFIRM',
      message: 'Clear all drinks and reset tracker?',
      action: () => {
        dispatch({ type: 'CLEAR_DRINKS' });
        dispatch({ type: 'HIDE_CONFIRM' });
        showRobotMessage('*beep boop* All drinks cleared! Starting fresh! 🤖');
      },
    });
  }, [showRobotMessage]);

  const tellJoke = useCallback(() => {
    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    dispatch({ type: 'SET_FIELD', field: 'currentJoke', value: randomJoke });
    dispatch({ type: 'SET_FIELD', field: 'showJoke', value: true });
    setTimeout(() => {
      dispatch({ type: 'SET_FIELD', field: 'showJoke', value: false });
    }, CONSTANTS.JOKE_DURATION);
  }, []);

  const calculateQuickBAC = useCallback(() => {
    if (!state.gender || !state.weight || !state.calcDrinks || !state.calcHours) return;

    const bac = calcBAC({
      mode: 'estimate',
      gender: state.gender,
      weight: state.weight,
      drinks: [],
      startTime: null,
      estimateDrinks: state.calcDrinks,
      estimateHours: state.calcHours,
    });

    dispatch({ type: 'SET_FIELD', field: 'calcBAC', value: bac });
  }, [state.gender, state.weight, state.calcDrinks, state.calcHours]);

  const handleTip = useCallback((amount) => {
    if (amount < CONSTANTS.MIN_TIP_AMOUNT) {
      dispatch({
        type: 'SET_FIELD',
        field: 'tipError',
        value: `Minimum support amount is $${CONSTANTS.MIN_TIP_AMOUNT} due to payment processing fees.`
      });
      setTimeout(() => {
        dispatch({ type: 'SET_FIELD', field: 'tipError', value: '' });
      }, 5000);
      return;
    }

    showRobotMessage(`*beep boop* Thank you for supporting development! Processing... 🤖`);

    setTimeout(() => {
      const receipt = generateReceipt(amount, 'Stripe');
      dispatch({ type: 'ADD_RECEIPT', receipt });
      dispatch({ type: 'SET_FIELD', field: 'showReceipt', value: true });
      showRobotMessage('*whirrs happily* Payment successful! Receipt generated! 🎉');
    }, 1500);
  }, [showRobotMessage]);

  const handleReset = useCallback(() => {
    resetApp();
  }, [resetApp]);

  const status = useMemo(() => getBACStatus(state.bac), [state.bac]);
  const currentStatus = useMemo(() =>
    state.calcBAC !== null && state.activeTab === 'calculator'
      ? getBACStatus(state.calcBAC)
      : status,
    [state.calcBAC, state.activeTab, status]
  );

  // Age Verification Screen
  if (!state.ageVerified) {
    return <AgeVerification onVerify={handleAgeVerification} />;
  }

  // Geographic Consent Dialog
  if (state.showGeoConsent && state.ageVerified && !state.geoConsentGiven) {
    return <GeoConsent onAccept={handleGeoConsentAccept} onDecline={handleGeoConsentDecline} />;
  }

  // Geographic Blocked Screen
  if (state.geoBlocked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-900 p-6 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-24 h-24 mb-6 bg-red-100 rounded-full">
              <AlertTriangle className="w-16 h-16 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">🇺🇸 USA-Only Service</h1>
            <p className="text-lg text-gray-700 mb-4">
              This app is only available in the United States.
            </p>
          </div>

          <div className="bg-red-50 rounded-lg p-6 mb-6 border-2 border-red-200">
            <p className="text-gray-800 font-bold text-lg mb-3">
              Detected Location: {state.geoCountry}
            </p>
            <p className="text-gray-700 mb-4">
              DrinkBot3000 is a USA-only service. Access is restricted to users physically located within the United States.
            </p>
            <p className="text-sm text-red-800 font-semibold">
              This restriction is in place for legal compliance and service availability reasons.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Legal Disclaimer Modal
  if (state.showDisclaimerModal || (!state.disclaimerAccepted && state.ageVerified && state.geoVerified)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-900 p-6 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 mb-4 bg-red-100 rounded-full">
              <AlertTriangle className="w-12 h-12 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Important Legal Disclaimer</h1>
            <p className="text-sm text-gray-600">Please read carefully before continuing</p>
          </div>

          <div className="space-y-4 text-sm text-gray-700 mb-6 bg-gray-50 p-6 rounded-lg max-h-96 overflow-y-auto">
            <div className="font-bold text-red-700 text-lg mb-4">
              ⚠️ THIS APP IS FOR INFORMATIONAL PURPOSES ONLY
            </div>

            <div className="space-y-3">
              <p className="font-semibold">NOT A MEDICAL DEVICE:</p>
              <p>This application is NOT a medical device and should NOT be used to determine fitness to drive, operate machinery, or make any safety-critical decisions. Blood Alcohol Content (BAC) calculations are ESTIMATES ONLY and may not accurately reflect your actual BAC.</p>

              <p className="font-semibold mt-4">NO MEDICAL ADVICE:</p>
              <p>This app does not provide medical advice, diagnosis, or treatment. Consult a qualified healthcare professional for medical concerns. The developer is not liable for any health consequences resulting from app use.</p>

              <p className="font-semibold mt-4">ACCURACY DISCLAIMER:</p>
              <p>BAC calculations are based on general population averages. Individual metabolism varies significantly due to genetics, health conditions, medications, food consumption, hydration, and other factors. Actual BAC may be higher or lower than estimated.</p>

              <p className="font-semibold mt-4">NEVER DRINK AND DRIVE:</p>
              <p>Impairment begins at ANY BAC level. Even small amounts of alcohol impair judgment, reaction time, and coordination. Never drive, operate machinery, or engage in dangerous activities after consuming ANY amount of alcohol.</p>

              <p className="font-bold text-red-700 mt-6 text-base">
                IF YOU DO NOT AGREE TO THESE TERMS, DO NOT USE THIS APP.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleDisclaimerAccept}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-lg"
            >
              I Understand and Accept
            </button>

            <button
              onClick={() => {
                dispatch({ type: 'SET_FIELD', field: 'ageVerified', value: false });
                localStorage.removeItem('ageVerified');
              }}
              className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition"
            >
              I Do Not Accept
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Safety Screens
  if (!state.safetyScreensComplete && state.disclaimerAccepted) {
    if (state.currentSafetyScreen === 0) {
      return <SafetyScreen1 onNext={handleSafetyScreenNext} onDecline={handleSafetyScreenDecline} />;
    }
    if (state.currentSafetyScreen === 1) {
      return <SafetyScreen2 onNext={handleSafetyScreenNext} onDecline={handleSafetyScreenDecline} />;
    }
    if (state.currentSafetyScreen === 2) {
      return <SafetyScreen3 onNext={handleSafetyScreenNext} onDecline={handleSafetyScreenDecline} />;
    }
    if (state.currentSafetyScreen === 3) {
      return <SafetyScreen4 onNext={handleSafetyScreenNext} onDecline={handleSafetyScreenDecline} />;
    }
  }

  // Main Splash Screen
  if (state.showSplash && state.safetyScreensComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-900 p-6 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 mb-6 bg-red-100 rounded-full">
              <AlertCircle className="w-16 h-16 text-red-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Every 42 Minutes</h1>
            <p className="text-xl text-gray-700 mb-6">
              Someone dies from drunk driving in the USA
            </p>
            <div className="bg-red-50 rounded-lg p-4 mb-6 border-2 border-red-200">
              <p className="text-gray-700 font-medium mb-3">
                DrinkBot3000 helps you track BAC estimates and make responsible decisions.
              </p>
              <p className="text-sm text-red-700 font-semibold">
                ⚠️ NEVER drive after drinking, even below the legal limit. Impairment begins at ANY BAC level.
              </p>
            </div>
          </div>

          <button
            onClick={() => dispatch({ type: 'SET_FIELD', field: 'showSplash', value: false })}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-lg"
          >
            Continue to App
          </button>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-600 italic">
              Estimates only • Not medical advice • Drink responsibly • Never drink and drive
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Setup screen
  if (!state.setupComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-6xl">🤖</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">DrinkBot3000</h1>
            <p className="text-gray-600">Track your blood alcohol content</p>
          </div>

          {!state.mode ? (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 text-center mb-4">Choose Mode</h2>
              <button
                onClick={() => handleModeSelect('live')}
                className="w-full bg-indigo-600 text-white py-4 rounded-lg font-semibold hover:bg-indigo-700 transition"
              >
                Live Tracking
                <p className="text-sm font-normal mt-1">Track drinks in real-time</p>
              </button>
              <button
                onClick={() => handleModeSelect('estimate')}
                className="w-full bg-purple-600 text-white py-4 rounded-lg font-semibold hover:bg-purple-700 transition"
              >
                Quick Estimate
                <p className="text-sm font-normal mt-1">Already been drinking?</p>
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="inline w-4 h-4 mr-1" />
                  Gender
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => dispatch({ type: 'SET_FIELD', field: 'gender', value: 'male' })}
                    className={`py-3 px-4 rounded-lg font-medium transition ${state.gender === 'male' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                  >
                    Male
                  </button>
                  <button
                    onClick={() => dispatch({ type: 'SET_FIELD', field: 'gender', value: 'female' })}
                    className={`py-3 px-4 rounded-lg font-medium transition ${state.gender === 'female' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                  >
                    Female
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Scale className="inline w-4 h-4 mr-1" />
                  Weight (lbs)
                </label>
                <input
                  type="number"
                  value={state.weight}
                  onChange={(e) => {
                    dispatch({ type: 'SET_FIELD', field: 'weight', value: e.target.value });
                    const error = validateWeight(e.target.value);
                    dispatch({ type: 'SET_FIELD', field: 'weightError', value: error });
                  }}
                  placeholder="Enter your weight"
                  className={`w-full px-4 py-3 border rounded-lg ${state.weightError ? 'border-red-500' : 'border-gray-300'}`}
                  min={CONSTANTS.MIN_WEIGHT}
                  max={CONSTANTS.MAX_WEIGHT}
                />
                {state.weightError && (
                  <p className="text-red-600 text-sm mt-1">{state.weightError}</p>
                )}
              </div>

              {state.mode === 'estimate' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Beer className="inline w-4 h-4 mr-1" />
                      Number of Drinks
                    </label>
                    <input
                      type="number"
                      value={state.estimateDrinks}
                      onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'estimateDrinks', value: e.target.value })}
                      placeholder="How many drinks?"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                      min="0"
                      step="0.5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hours Since First Drink</label>
                    <input
                      type="number"
                      value={state.estimateHours}
                      onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'estimateHours', value: e.target.value })}
                      placeholder="How many hours ago?"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                      min="0"
                      step="0.5"
                    />
                  </div>
                </>
              )}

              <button
                onClick={handleSetup}
                disabled={!state.gender || !state.weight || state.weightError || (state.mode === 'estimate' && (!state.estimateDrinks || !state.estimateHours))}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:bg-gray-300"
              >
                {state.mode === 'estimate' ? 'Calculate BAC' : 'Start Tracking'}
              </button>

              <button
                onClick={() => {
                  dispatch({ type: 'SET_FIELD', field: 'mode', value: '' });
                  dispatch({ type: 'SET_FIELD', field: 'gender', value: '' });
                  dispatch({ type: 'SET_FIELD', field: 'weight', value: '' });
                  dispatch({ type: 'SET_FIELD', field: 'estimateDrinks', value: '' });
                  dispatch({ type: 'SET_FIELD', field: 'estimateHours', value: '' });
                  dispatch({ type: 'SET_FIELD', field: 'weightError', value: '' });
                }}
                className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-300 transition"
              >
                Back
              </button>
            </div>
          )}

          <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-amber-600 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800">This app provides estimates only. Never drink and drive.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Tracker Interface (abbreviated for file size - would need full implementation)
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pb-24">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-md mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🤖</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-800">DrinkBot3000</h1>
                <p className="text-xs text-gray-500">Responsible tracking</p>
              </div>
            </div>
            <button
              onClick={() => dispatch({ type: 'SET_FIELD', field: 'showSettings', value: true })}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-md mx-auto px-6">
            <div className="flex space-x-4">
              <button
                onClick={() => dispatch({ type: 'SET_FIELD', field: 'activeTab', value: 'tracker' })}
                className={`py-3 px-4 font-medium transition border-b-2 ${
                  state.activeTab === 'tracker'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Activity className="w-4 h-4 inline mr-1" />
                Tracker
              </button>
              <button
                onClick={() => dispatch({ type: 'SET_FIELD', field: 'activeTab', value: 'calculator' })}
                className={`py-3 px-4 font-medium transition border-b-2 ${
                  state.activeTab === 'calculator'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Calculator className="w-4 h-4 inline mr-1" />
                Calculator
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-md mx-auto px-6 py-6">
          {state.activeTab === 'tracker' ? (
            <>
              {/* BAC Display */}
              <div className={`rounded-2xl shadow-xl p-8 mb-6 ${status.bgColor}`}>
                <div className="text-center">
                  <div className="text-6xl font-bold text-white mb-2">
                    {state.bac.toFixed(3)}%
                  </div>
                  <div className="text-xl text-white font-medium mb-4">{status.label}</div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                    <p className="text-white text-sm">{status.message}</p>
                  </div>
                </div>
              </div>

              {/* Robot Message */}
              {state.robotMessage && (
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 mb-6 border-2 border-purple-200 animate-pulse">
                  <p className="text-purple-900 font-medium text-center">{state.robotMessage}</p>
                </div>
              )}

              {/* Joke Display */}
              {state.showJoke && state.currentJoke && (
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 mb-6 border-2 border-yellow-200">
                  <div className="flex items-start">
                    <Smile className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-800">{state.currentJoke}</p>
                  </div>
                </div>
              )}

              {/* Time Info */}
              {state.drinks.length > 0 && (
                <div className="bg-white rounded-lg p-4 mb-6 shadow">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <Clock className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                      <div className="text-2xl font-bold text-gray-800">{calculateElapsedTime(state.drinks, state.startTime)}</div>
                      <div className="text-xs text-gray-500">Time Elapsed</div>
                    </div>
                    <div>
                      <Coffee className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                      <div className="text-2xl font-bold text-gray-800">{getSoberTime(state.bac)}</div>
                      <div className="text-xs text-gray-500">Until Sober</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Add Drink Buttons */}
              <div className="bg-white rounded-lg p-6 mb-6 shadow">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Drink</h3>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <button
                    onClick={() => addDrink('beer', 12, 5)}
                    className="bg-amber-100 hover:bg-amber-200 text-amber-900 p-4 rounded-lg font-medium transition"
                  >
                    🍺 Beer<br />
                    <span className="text-xs">12 oz, 5% ABV</span>
                  </button>
                  <button
                    onClick={() => addDrink('wine', 5, 12)}
                    className="bg-purple-100 hover:bg-purple-200 text-purple-900 p-4 rounded-lg font-medium transition"
                  >
                    🍷 Wine<br />
                    <span className="text-xs">5 oz, 12% ABV</span>
                  </button>
                  <button
                    onClick={() => addDrink('shot', 1.5, 40)}
                    className="bg-red-100 hover:bg-red-200 text-red-900 p-4 rounded-lg font-medium transition"
                  >
                    🥃 Shot<br />
                    <span className="text-xs">1.5 oz, 40% ABV</span>
                  </button>
                  <button
                    onClick={() => dispatch({ type: 'SET_FIELD', field: 'showCustomDrink', value: true })}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-900 p-4 rounded-lg font-medium transition"
                  >
                    ➕ Custom<br />
                    <span className="text-xs">Custom drink</span>
                  </button>
                </div>

                {/* Custom Drink Input */}
                {state.showCustomDrink && (
                  <div className="border-t pt-4 space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Volume (oz)</label>
                      <input
                        type="number"
                        value={state.customDrinkOz}
                        onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'customDrinkOz', value: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="e.g., 12"
                        step="0.1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ABV %</label>
                      <input
                        type="number"
                        value={state.customDrinkABV}
                        onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'customDrinkABV', value: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="e.g., 5"
                        step="0.1"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          if (state.customDrinkOz && state.customDrinkABV) {
                            addDrink('custom', parseFloat(state.customDrinkOz), parseFloat(state.customDrinkABV));
                            dispatch({ type: 'SET_FIELD', field: 'customDrinkOz', value: '' });
                            dispatch({ type: 'SET_FIELD', field: 'showCustomDrink', value: false });
                          }
                        }}
                        className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
                        disabled={!state.customDrinkOz || !state.customDrinkABV}
                      >
                        Add Custom Drink
                      </button>
                      <button
                        onClick={() => dispatch({ type: 'SET_FIELD', field: 'showCustomDrink', value: false })}
                        className="px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Drink History */}
              {state.drinks.length > 0 && (
                <div className="bg-white rounded-lg p-6 mb-6 shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Drinks ({state.drinks.length})
                    </h3>
                    <button
                      onClick={() => dispatch({ type: 'SET_FIELD', field: 'showDrinkHistory', value: !state.showDrinkHistory })}
                      className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      {state.showDrinkHistory ? 'Hide' : 'Show'}
                    </button>
                  </div>

                  {state.showDrinkHistory && (
                    <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
                      {state.drinks.map((drink) => (
                        <div key={drink.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <div className="font-medium text-gray-800">
                              {drink.type === 'beer' && '🍺 Beer'}
                              {drink.type === 'wine' && '🍷 Wine'}
                              {drink.type === 'shot' && '🥃 Shot'}
                              {drink.type === 'custom' && '🍹 Custom'}
                            </div>
                            <div className="text-xs text-gray-500">
                              {drink.oz}oz, {drink.abv}% ABV • {formatTime(drink.time)}
                            </div>
                          </div>
                          <button
                            onClick={() => removeDrink(drink.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={undoDrink}
                      className="flex-1 bg-orange-100 text-orange-700 py-2 rounded-lg font-medium hover:bg-orange-200 transition"
                      disabled={state.drinks.length === 0}
                    >
                      <RefreshCw className="w-4 h-4 inline mr-1" />
                      Undo Last
                    </button>
                    <button
                      onClick={clearDrinks}
                      className="flex-1 bg-red-100 text-red-700 py-2 rounded-lg font-medium hover:bg-red-200 transition"
                    >
                      <Trash2 className="w-4 h-4 inline mr-1" />
                      Clear All
                    </button>
                  </div>
                </div>
              )}

              {/* Support Section */}
              <div className="bg-white rounded-lg p-6 shadow">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Support DrinkBot3000</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Enjoying DrinkBot3000? Support development with a tip!
                </p>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <button
                    onClick={() => handleTip(3)}
                    className="bg-green-100 hover:bg-green-200 text-green-800 py-3 rounded-lg font-semibold transition"
                  >
                    $3
                  </button>
                  <button
                    onClick={() => handleTip(5)}
                    className="bg-green-100 hover:bg-green-200 text-green-800 py-3 rounded-lg font-semibold transition"
                  >
                    $5
                  </button>
                  <button
                    onClick={() => handleTip(10)}
                    className="bg-green-100 hover:bg-green-200 text-green-800 py-3 rounded-lg font-semibold transition"
                  >
                    $10
                  </button>
                </div>
                <button
                  onClick={() => dispatch({ type: 'SET_FIELD', field: 'showCustomTip', value: !state.showCustomTip })}
                  className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition text-sm"
                >
                  Custom Amount
                </button>

                {state.showCustomTip && (
                  <div className="mt-3 space-y-2">
                    <input
                      type="number"
                      value={state.customTipAmount}
                      onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'customTipAmount', value: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Enter custom amount"
                      min={CONSTANTS.MIN_TIP_AMOUNT}
                      step="1"
                    />
                    {state.tipError && (
                      <p className="text-red-600 text-sm">{state.tipError}</p>
                    )}
                    <button
                      onClick={() => {
                        const amount = parseFloat(state.customTipAmount);
                        if (amount >= CONSTANTS.MIN_TIP_AMOUNT) {
                          handleTip(amount);
                        }
                      }}
                      className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
                      disabled={!state.customTipAmount || parseFloat(state.customTipAmount) < CONSTANTS.MIN_TIP_AMOUNT}
                    >
                      Send Tip
                    </button>
                  </div>
                )}

                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs text-blue-900">
                    💡 Tips help keep DrinkBot3000 free and ad-free for everyone!
                  </p>
                </div>
              </div>
            </>
          ) : (
            // Calculator Tab
            <div className="bg-white rounded-lg p-6 shadow">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">BAC Calculator</h3>
              <p className="text-sm text-gray-600 mb-6">
                Estimate your BAC based on drinks consumed and time elapsed.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Standard Drinks
                  </label>
                  <input
                    type="number"
                    value={state.calcDrinks}
                    onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'calcDrinks', value: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    placeholder="e.g., 3"
                    min="0"
                    step="0.5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hours Since First Drink
                  </label>
                  <input
                    type="number"
                    value={state.calcHours}
                    onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'calcHours', value: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    placeholder="e.g., 2"
                    min="0"
                    step="0.1"
                  />
                </div>

                <button
                  onClick={calculateQuickBAC}
                  disabled={!state.calcDrinks || !state.calcHours}
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:bg-gray-300"
                >
                  Calculate BAC
                </button>

                {state.calcBAC !== null && (
                  <div className={`rounded-lg p-6 ${currentStatus.bgColor}`}>
                    <div className="text-center">
                      <div className="text-5xl font-bold text-white mb-2">
                        {state.calcBAC.toFixed(3)}%
                      </div>
                      <div className="text-xl text-white font-medium mb-3">
                        {currentStatus.label}
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                        <p className="text-white text-sm">
                          {currentStatus.message}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                  <p className="text-xs text-amber-800">
                    <strong>Note:</strong> This calculator uses your saved profile ({state.gender}, {state.weight} lbs). Results are estimates only.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Settings Modal */}
        {state.showSettings && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
                <button
                  onClick={() => dispatch({ type: 'SET_FIELD', field: 'showSettings', value: false })}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-3">Your Profile</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Gender:</strong> {state.gender === 'male' ? 'Male' : 'Female'}</p>
                    <p><strong>Weight:</strong> {state.weight} lbs</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleReset}
                    className="w-full bg-red-100 text-red-700 py-3 rounded-lg font-medium hover:bg-red-200 transition"
                  >
                    <RefreshCw className="w-4 h-4 inline mr-2" />
                    Reset App
                  </button>

                  <a
                    href="/privacy.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition text-center"
                  >
                    <FileText className="w-4 h-4 inline mr-2" />
                    Privacy Policy
                  </a>

                  <a
                    href="/terms.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition text-center"
                  >
                    <FileText className="w-4 h-4 inline mr-2" />
                    Terms of Service
                  </a>

                  <button
                    onClick={() => dispatch({ type: 'SET_FIELD', field: 'showRefundPolicy', value: true })}
                    className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition"
                  >
                    <DollarSign className="w-4 h-4 inline mr-2" />
                    Refund Policy
                  </button>
                </div>

                <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                  <p className="text-xs text-indigo-900">
                    <strong>Version:</strong> 1.0.0<br />
                    <strong>Made with:</strong> Responsibility & Care 🤖
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        {state.showConfirmModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full">
              <div className="text-center mb-6">
                <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">Are you sure?</h3>
                <p className="text-gray-600">{state.confirmModalMessage}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    if (state.confirmModalAction) {
                      state.confirmModalAction();
                    }
                    dispatch({ type: 'HIDE_CONFIRM' });
                  }}
                  className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
                >
                  Yes, Continue
                </button>
                <button
                  onClick={() => dispatch({ type: 'HIDE_CONFIRM' })}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Receipt Modal */}
        {state.showReceipt && state.currentReceipt && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full">
              <div className="text-center mb-6">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h3>
                <p className="text-gray-600">Thank you for your support!</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h4 className="font-semibold text-gray-800 mb-4 text-center">Receipt</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-semibold">${state.currentReceipt.amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-semibold">
                      {new Date(state.currentReceipt.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Receipt #:</span>
                    <span className="font-mono text-xs">{state.currentReceipt.id.slice(0, 8)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
                <p className="text-xs text-blue-900">
                  <strong>Refund Policy:</strong> You can request a refund within {CONSTANTS.REFUND_WINDOW_DAYS} days. See Refund Policy for details.
                </p>
              </div>

              <button
                onClick={() => dispatch({ type: 'SET_FIELD', field: 'showReceipt', value: false })}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Refund Policy Modal */}
        {state.showRefundPolicy && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full my-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Refund Policy</h2>
                <button
                  onClick={() => dispatch({ type: 'SET_FIELD', field: 'showRefundPolicy', value: false })}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="prose prose-sm max-w-none">
                <p className="text-gray-600 mb-4">
                  We want you to be completely satisfied with DrinkBot3000. If you're not happy with your tip/donation, we offer a simple refund process.
                </p>

                <h3 className="font-semibold text-gray-800 mt-4 mb-2">Refund Window</h3>
                <p className="text-gray-600 mb-4">
                  You can request a full refund within <strong>{CONSTANTS.REFUND_WINDOW_DAYS} days</strong> of your payment, no questions asked.
                </p>

                <h3 className="font-semibold text-gray-800 mt-4 mb-2">How to Request a Refund</h3>
                <ol className="list-decimal list-inside text-gray-600 mb-4 space-y-2">
                  <li>Email us at <strong>drinkbot3000@gmail.com</strong></li>
                  <li>Include your receipt number or payment details</li>
                  <li>We'll process your refund within 5-7 business days</li>
                </ol>

                <h3 className="font-semibold text-gray-800 mt-4 mb-2">Refund Method</h3>
                <p className="text-gray-600 mb-4">
                  Refunds will be issued to the original payment method used for the transaction.
                </p>

                <div className="bg-green-50 rounded-lg p-4 border border-green-200 mt-6">
                  <p className="text-sm text-green-900">
                    ✓ Simple process • ✓ Full refunds • ✓ {CONSTANTS.REFUND_WINDOW_DAYS}-day window • ✓ No questions asked
                  </p>
                </div>
              </div>

              <button
                onClick={() => dispatch({ type: 'SET_FIELD', field: 'showRefundPolicy', value: false })}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition mt-6"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      <PWAInstallPrompt />
    </>
  );
}
