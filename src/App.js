import React, { useState, useEffect, useReducer } from 'react';
import { AlertCircle, Beer, User, Scale, Smile, Calculator, Activity, Settings, Trash2, Clock, X, Heart, Coffee, DollarSign, ShieldAlert, Download, AlertTriangle, FileText, RefreshCw, CheckCircle, Pill, Bed, Car, Phone, Package } from 'lucide-react';
import PWAInstallPrompt from './PWAInstallPrompt';

// Constants
const CONSTANTS = {
  METABOLISM_RATE: 0.015,
  GRAMS_PER_STANDARD_DRINK: 14,
  LBS_TO_KG: 0.453592,
  MALE_BODY_WATER: 0.68,
  FEMALE_BODY_WATER: 0.55,
  STANDARD_DRINK_OZ: 0.6,
  LEGAL_LIMIT: 0.08,
  MIN_WEIGHT: 50,
  MAX_WEIGHT: 500,
  ROBOT_MESSAGE_DURATION: 5000,
  JOKE_DURATION: 7000,
  MIN_TIP_AMOUNT: 3,
  LEGAL_DRINKING_AGE: 21,
  REFUND_WINDOW_DAYS: 30,
};

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
  customDrinkOz: '',
  customDrinkABV: '5',
  robotMessage: '',
  showSplash: true,
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
  currentSafetyScreen: 0, // For multi-screen safety warnings
  safetyScreensComplete: false,
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
      return { ...state, drinks: state.drinks.filter(d => d.id !== action.id) };
    case 'UNDO_DRINK':
      return { ...state, drinks: state.drinks.slice(0, -1) };
    case 'CLEAR_DRINKS':
      return { ...state, drinks: [], bac: 0, startTime: Date.now() };
    case 'RESET_APP':
      return { ...initialState, showSplash: false, ageVerified: true, disclaimerAccepted: true, safetyScreensComplete: true };
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
    default:
      return state;
  }
}

export default function BACTracker() {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Jokes (family-friendly only)
  const jokes = [
    "Why don't scientists trust atoms? Because they make up everything!",
    "What do you call a bear with no teeth? A gummy bear!",
    "Why did the scarecrow win an award? He was outstanding in his field!",
    "What do you call a fake noodle? An impasta!",
    "What's orange and sounds like a parrot? A carrot!",
    "Why did the math book look so sad? Because it had too many problems!",
    "Why don't skeletons fight each other? They don't have the guts!",
    "What do you call a fish wearing a bowtie? Sofishticated!",
    "Why did the bicycle fall over? Because it was two-tired!",
    "What do you call a sleeping bull? A bulldozer!",
    "Why can't your nose be 12 inches long? Because then it would be a foot!",
    "What do you call cheese that isn't yours? Nacho cheese!",
    "Why don't programmers like nature? It has too many bugs!",
    "What do you call a snowman with a six-pack? An abdominal snowman!",
    "What do you call a lazy kangaroo? A pouch potato!",
    "Why don't mountains get cold? They wear snow caps!",
    "What do you call a magic dog? A labracadabrador!",
    "Why did the picture go to jail? It was framed!",
    "What do you call a boomerang that won't come back? A stick!",
    "What do you call a cow during an earthquake? A milkshake!",
  ];

  const robotGreetings = [
    "Greetings! I am DrinkBot3000, your safety companion! ðŸ¤–",
    "Beep boop! Ready to help you stay safe, dear friend! ðŸŽ©",
    "*mechanical bow* Your safety assistant reporting for duty! ðŸ¤–",
    "Salutations! Let us monitor responsibly together! ðŸ›¡ï¸",
    "*whirrs politely* I shall help you stay safe this evening! ðŸŽ©",
  ];

  const robotComments = [
    "*calculates thoughtfully* Remember to stay hydrated! ðŸ¤–",
    "Beep boop! Please pace yourself, valued user! ðŸŽ©",
    "*adjusts monocle* Safety first, always! ðŸ§",
    "*whirrs concernedly* Time for water, perhaps? ðŸ’§",
    "My sensors suggest taking it slow! ðŸ¤–",
    "*beeps approvingly* Excellent responsibility detected! ðŸ’¦",
    "*mechanical nod* You're making wise choices! ðŸŽ©",
  ];

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

  // Helper functions
  const getBodyWaterConstant = (g) => 
    g === 'male' ? CONSTANTS.MALE_BODY_WATER : CONSTANTS.FEMALE_BODY_WATER;

  const validateWeight = (weight) => {
    const w = parseFloat(weight);
    if (isNaN(w)) return 'Please enter a valid number';
    if (w < CONSTANTS.MIN_WEIGHT) return `Weight must be at least ${CONSTANTS.MIN_WEIGHT} lbs`;
    if (w > CONSTANTS.MAX_WEIGHT) return `Weight must be less than ${CONSTANTS.MAX_WEIGHT} lbs`;
    return '';
  };

  const calculateBAC = () => {
    if (state.mode === 'estimate') {
      if (!state.estimateDrinks || !state.estimateHours) return 0;
      
      const weightKg = parseFloat(state.weight) * CONSTANTS.LBS_TO_KG;
      const bodyWater = getBodyWaterConstant(state.gender);
      const numDrinks = parseFloat(state.estimateDrinks);
      const hours = parseFloat(state.estimateHours);
      
      const totalAlcoholGrams = numDrinks * CONSTANTS.GRAMS_PER_STANDARD_DRINK;
      const initialBAC = (totalAlcoholGrams / (weightKg * bodyWater * 1000)) * 100;
      const metabolized = CONSTANTS.METABOLISM_RATE * hours;
      
      return Math.max(0, initialBAC - metabolized);
    }
    
    if (state.mode === 'live') {
      if (!state.startTime || state.drinks.length === 0) return 0;

      const weightKg = parseFloat(state.weight) * CONSTANTS.LBS_TO_KG;
      const bodyWater = getBodyWaterConstant(state.gender);
      const currentTime = Date.now();
      
      let adjustedBAC = 0;

      state.drinks.forEach(drink => {
        const standardDrinks = drink.standardDrinks || 1;
        const alcoholGrams = standardDrinks * CONSTANTS.GRAMS_PER_STANDARD_DRINK;
        const hoursElapsed = (currentTime - drink.timestamp) / (1000 * 60 * 60);
        
        const drinkBAC = (alcoholGrams / (weightKg * bodyWater * 1000)) * 100;
        const metabolized = CONSTANTS.METABOLISM_RATE * hoursElapsed;
        const currentDrinkBAC = Math.max(0, drinkBAC - metabolized);
        
        adjustedBAC += currentDrinkBAC;
      });

      return Math.max(0, adjustedBAC);
    }
    
    return 0;
  };

  // Update BAC every second
  useEffect(() => {
    if (!state.setupComplete) return;

    const interval = setInterval(() => {
      dispatch({ type: 'SET_FIELD', field: 'bac', value: calculateBAC() });
    }, 1000);

    return () => clearInterval(interval);
  }, [state.drinks, state.setupComplete, state.gender, state.weight, state.startTime, state.mode, state.estimateDrinks, state.estimateHours]);

  const showRobotMessage = (message) => {
    dispatch({ type: 'SET_FIELD', field: 'robotMessage', value: message });
    setTimeout(() => {
      dispatch({ type: 'SET_FIELD', field: 'robotMessage', value: '' });
    }, CONSTANTS.ROBOT_MESSAGE_DURATION);
  };

  // Generate receipt
  const generateReceipt = (amount, paymentMethod = 'Stripe') => {
    const receipt = {
      id: `DBT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      date: new Date().toISOString(),
      amount: amount,
      stripeFee: (amount * 0.029 + 0.30).toFixed(2),
      netAmount: (amount - (amount * 0.029 + 0.30)).toFixed(2),
      paymentMethod: paymentMethod,
      description: 'Developer Support - DrinkBot3000',
      status: 'Completed',
      refundableUntil: new Date(Date.now() + (CONSTANTS.REFUND_WINDOW_DAYS * 24 * 60 * 60 * 1000)).toISOString(),
    };
    
    dispatch({ type: 'ADD_RECEIPT', receipt });
    return receipt;
  };

  // Download receipt
  const downloadReceipt = (receipt) => {
    const receiptText = `
â•”â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•—
â•‘              DRINKBOT3000 - PAYMENT RECEIPT               â•‘
â•‘                   Developer Support                        â•‘
â•šâ•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

Receipt #: ${receipt.id}
Date: ${new Date(receipt.date).toLocaleString()}
Status: ${receipt.status}

â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

Description: ${receipt.description}
Support Amount: $${receipt.amount.toFixed(2)}
Processing Fee: -$${receipt.stripeFee}
Net Amount: $${receipt.netAmount}

Payment Method: ${receipt.paymentMethod}
Payment Processor: Stripe, Inc.

â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

REFUND POLICY:
Eligible for refund until: ${new Date(receipt.refundableUntil).toLocaleDateString()}
Refund window: ${CONSTANTS.REFUND_WINDOW_DAYS} days from purchase date

To request a refund:
1. Email: support@drinkbot3000.com
2. Subject: "Refund Request - ${receipt.id}"
3. Include this receipt number

â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

THANK YOU FOR YOUR SUPPORT!

Your contribution helps keep DrinkBot3000 free and ad-free
for everyone.

Questions? Contact: support@drinkbot3000.com

Â© ${new Date().getFullYear()} DrinkBot3000. All rights reserved.
`;

    const blob = new Blob([receiptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DrinkBot3000-Receipt-${receipt.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAgeVerification = (isOfAge) => {
    if (isOfAge) {
      localStorage.setItem('ageVerified', 'true');
      dispatch({ type: 'SET_FIELD', field: 'ageVerified', value: true });
      dispatch({ type: 'SET_FIELD', field: 'showDisclaimerModal', value: true });
    } else {
      alert('You must be of legal drinking age to use this app.');
    }
  };

  const handleDisclaimerAccept = () => {
    localStorage.setItem('disclaimerAccepted', 'true');
    dispatch({ type: 'SET_FIELD', field: 'disclaimerAccepted', value: true });
    dispatch({ type: 'SET_FIELD', field: 'showDisclaimerModal', value: false });
    // Start safety screens sequence
    dispatch({ type: 'SET_FIELD', field: 'currentSafetyScreen', value: 0 });
  };

  const handleSafetyScreenNext = () => {
    if (state.currentSafetyScreen < 3) {
      dispatch({ type: 'NEXT_SAFETY_SCREEN' });
    } else {
      // All safety screens complete
      localStorage.setItem('safetyScreensComplete', 'true');
      dispatch({ type: 'SET_FIELD', field: 'safetyScreensComplete', value: true });
    }
  };

  const handleSetup = () => {
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
  };

  const handleModeSelect = (selectedMode) => {
    dispatch({ type: 'SET_FIELD', field: 'mode', value: selectedMode });
  };

  const resetApp = () => {
    dispatch({
      type: 'SHOW_CONFIRM',
      message: 'Are you sure you want to reset the app? All data will be permanently deleted.',
      action: () => {
        localStorage.removeItem('bacTrackerData');
        dispatch({ type: 'RESET_APP' });
        dispatch({ type: 'HIDE_CONFIRM' });
      },
    });
  };

  const addDrink = () => {
    const newDrink = {
      id: Date.now(),
      timestamp: Date.now(),
      standardDrinks: 1,
      type: 'Standard Drink',
    };
    dispatch({ type: 'ADD_DRINK', drink: newDrink });
    
    const comment = robotComments[Math.floor(Math.random() * robotComments.length)];
    showRobotMessage(comment);
  };

  const undoDrink = () => {
    if (state.drinks.length > 0) {
      dispatch({ type: 'UNDO_DRINK' });
      showRobotMessage('*beep boop* Last drink removed from records! ðŸ¤–');
    }
  };

  const deleteDrink = (id) => {
    dispatch({ type: 'REMOVE_DRINK', id });
    showRobotMessage('*whirrs* Drink removed from records! ðŸ¤–');
  };

  const addCustomDrink = (oz, abv) => {
    const pureAlcoholOz = parseFloat(oz) * (parseFloat(abv) / 100);
    const standardDrinks = pureAlcoholOz / CONSTANTS.STANDARD_DRINK_OZ;
    
    const newDrink = {
      id: Date.now(),
      timestamp: Date.now(),
      standardDrinks: standardDrinks,
      type: `${oz}oz @ ${abv}%`,
    };
    dispatch({ type: 'ADD_DRINK', drink: newDrink });
    
    showRobotMessage(`*calculates precisely* That's ${standardDrinks.toFixed(1)} standard drinks! ðŸ¤–`);
  };

  const tellJoke = () => {
    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    dispatch({ type: 'SET_FIELD', field: 'currentJoke', value: randomJoke });
    dispatch({ type: 'SET_FIELD', field: 'showJoke', value: true });
    setTimeout(() => {
      dispatch({ type: 'SET_FIELD', field: 'showJoke', value: false });
    }, CONSTANTS.JOKE_DURATION);
  };

  const calculateQuickBAC = () => {
    if (!state.gender || !state.weight || !state.calcDrinks || !state.calcHours) return;
    
    const weightKg = parseFloat(state.weight) * CONSTANTS.LBS_TO_KG;
    const bodyWater = getBodyWaterConstant(state.gender);
    const numDrinks = parseFloat(state.calcDrinks);
    const hours = parseFloat(state.calcHours);
    
    const totalAlcoholGrams = numDrinks * CONSTANTS.GRAMS_PER_STANDARD_DRINK;
    const initialBAC = (totalAlcoholGrams / (weightKg * bodyWater * 1000)) * 100;
    const metabolized = CONSTANTS.METABOLISM_RATE * hours;
    
    const result = Math.max(0, initialBAC - metabolized);
    dispatch({ type: 'SET_FIELD', field: 'calcBAC', value: result });
  };

  const getBACStatus = () => {
    const currentBAC = state.calcBAC !== null && state.activeTab === 'calculator' ? state.calcBAC : state.bac;
    if (currentBAC === 0) return { text: 'Sober', color: 'text-green-600', bg: 'bg-green-50' };
    if (currentBAC < 0.03) return { text: 'Mild', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    if (currentBAC < CONSTANTS.LEGAL_LIMIT) return { text: 'Impaired', color: 'text-orange-600', bg: 'bg-orange-50' };
    return { text: 'Intoxicated', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getSoberTime = (bac) => {
    if (bac === 0) return '--:--';
    const minutesToSober = Math.ceil((bac / CONSTANTS.METABOLISM_RATE) * 60);
    const soberTime = new Date(Date.now() + minutesToSober * 60000);
    return soberTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const handleTip = (amount) => {
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

    showRobotMessage(`*beep boop* Thank you for supporting development! Processing... ðŸ¤–`);
    
    setTimeout(() => {
      const receipt = generateReceipt(amount, 'Stripe');
      dispatch({ type: 'SET_FIELD', field: 'showReceipt', value: true });
      showRobotMessage('*whirrs happily* Payment successful! Receipt generated! ðŸŽ‰');
    }, 1500);
  };

  const status = getBACStatus();

  // Age Verification Screen
  if (!state.ageVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 mb-6 bg-red-100 rounded-full">
              <ShieldAlert className="w-16 h-16 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Age Verification Required</h1>
            <p className="text-lg text-gray-700 mb-2">
              This app involves alcohol consumption tracking.
            </p>
            <p className="text-md text-gray-600">
              You must be {CONSTANTS.LEGAL_DRINKING_AGE} years or older to continue.
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => handleAgeVerification(true)}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-green-700 hover:to-emerald-700 transition shadow-lg"
            >
              I am {CONSTANTS.LEGAL_DRINKING_AGE} or Older
            </button>

            <button
              onClick={() => handleAgeVerification(false)}
              className="w-full bg-gray-200 text-gray-700 py-4 rounded-xl font-semibold text-lg hover:bg-gray-300 transition"
            >
              I am Under {CONSTANTS.LEGAL_DRINKING_AGE}
            </button>
          </div>

          <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-xs text-amber-800 text-center">
              By clicking "I am {CONSTANTS.LEGAL_DRINKING_AGE} or Older", you confirm that you are of legal drinking age in your jurisdiction.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Legal Disclaimer Modal
  if (state.showDisclaimerModal || (!state.disclaimerAccepted && state.ageVerified)) {
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
              âš ï¸ THIS APP IS FOR INFORMATIONAL PURPOSES ONLY
            </div>

            <div className="space-y-3">
              <p className="font-semibold">NOT A MEDICAL DEVICE:</p>
              <p>This application is NOT a medical device and should NOT be used to determine fitness to drive, operate machinery, or make any safety-critical decisions. Blood Alcohol Content (BAC) calculations are ESTIMATES ONLY and may not accurately reflect your actual BAC.</p>

              <p className="font-semibold mt-4">NO MEDICAL ADVICE:</p>
              <p>This app does not provide medical advice, diagnosis, or treatment. Consult a qualified healthcare professional for medical concerns. The developer is not liable for any health consequences resulting from app use.</p>

              <p className="font-semibold mt-4">ACCURACY DISCLAIMER:</p>
              <p>BAC calculations are based on general population averages. Individual metabolism varies significantly due to genetics, health conditions, medications, food consumption, hydration, and other factors. Actual BAC may be higher or lower than estimated.</p>

              <p className="font-semibold mt-4">LEGAL CONSEQUENCES:</p>
              <p>Using this app does NOT protect you from DUI/DWI charges or other legal consequences. Law enforcement uses certified breathalyzer devices. You may be impaired even if this app shows a low BAC.</p>

              <p className="font-semibold mt-4">NEVER DRINK AND DRIVE:</p>
              <p>Impairment begins at ANY BAC level. Even small amounts of alcohol impair judgment, reaction time, and coordination. Never drive, operate machinery, or engage in dangerous activities after consuming ANY amount of alcohol.</p>

              <p className="font-semibold mt-4">ASSUMPTION OF RISK:</p>
              <p>By using this app, you assume all risks and agree that the developer, its affiliates, and contributors are NOT liable for any damages, injuries, accidents, legal issues, or other consequences arising from your use of this application or decisions based on its output.</p>

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

  // NEW: Multi-Screen Safety Warnings
  if (!state.safetyScreensComplete && state.disclaimerAccepted) {
    // Safety Screen 1: DUI / Impairment to the Slightest Degree
    if (state.currentSafetyScreen === 0) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-900 p-6 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-24 h-24 mb-6 bg-red-100 rounded-full">
                <Car className="w-16 h-16 text-red-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">NEVER DRIVE IMPAIRED</h1>
              <div className="bg-red-50 rounded-lg p-6 mb-6 border-2 border-red-200">
                <p className="text-gray-800 font-bold text-lg mb-4">
                  "Impairment to the Slightest Degree"
                </p>
                <p className="text-gray-700 mb-4">
                  You can be charged with DUI even BELOW the 0.08% legal limit if you show ANY signs of impairment.
                </p>
                <p className="text-red-700 font-semibold">
                  ANY alcohol consumption = impairment
                </p>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-4 border border-blue-200">
                <p className="font-semibold text-gray-800 mb-3">Use Rideshare Instead:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <span className="px-3 py-1 bg-black text-white rounded-full text-sm">Uber</span>
                  <span className="px-3 py-1 bg-pink-600 text-white rounded-full text-sm">Lyft</span>
                  <span className="px-3 py-1 bg-yellow-500 text-white rounded-full text-sm">Taxi</span>
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <p className="font-semibold text-gray-800 mb-3">Or Order Delivery:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <span className="px-3 py-1 bg-red-600 text-white rounded-full text-sm">DoorDash</span>
                  <span className="px-3 py-1 bg-green-600 text-white rounded-full text-sm">Instacart</span>
                  <span className="px-3 py-1 bg-orange-600 text-white rounded-full text-sm">Postmates</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleSafetyScreenNext}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-lg"
            >
              I Understand (1 of 4)
            </button>
          </div>
        </div>
      );
    }

    // Safety Screen 2: Don't Sleep When Drunk
    if (state.currentSafetyScreen === 1) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 p-6 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-24 h-24 mb-6 bg-purple-100 rounded-full">
                <Bed className="w-16 h-16 text-purple-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">Don't Go to Bed Drunk</h1>
              <div className="bg-purple-50 rounded-lg p-6 mb-6 border-2 border-purple-200">
                <p className="text-gray-800 font-bold text-lg mb-4">
                  âš ï¸ Sleep Can Be Dangerous When Intoxicated
                </p>
                <ul className="text-left text-gray-700 space-y-3">
                  <li className="flex items-start">
                    <span className="text-red-600 font-bold mr-2">â€¢</span>
                    <span>Risk of choking on vomit</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 font-bold mr-2">â€¢</span>
                    <span>Alcohol poisoning symptoms worsen</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 font-bold mr-2">â€¢</span>
                    <span>Dehydration and injuries from falls</span>
                  </li>
                </ul>
              </div>

              <div className="bg-green-50 rounded-lg p-4 mb-4 border border-green-200">
                <p className="font-semibold text-gray-800 mb-3">Plan Ahead:</p>
                <ul className="text-left text-sm text-gray-700 space-y-2">
                  <li>âœ“ Drink water throughout the evening</li>
                  <li>âœ“ Eat food before drinking</li>
                  <li>âœ“ Stay with friends who can monitor you</li>
                  <li>âœ“ Sleep on your side, not back</li>
                  <li>âœ“ Set multiple alarms</li>
                </ul>
              </div>

              <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                <p className="text-sm text-red-800 font-semibold">
                  If someone is passed out drunk, place them in the recovery position and seek medical help if needed.
                </p>
              </div>
            </div>

            <button
              onClick={handleSafetyScreenNext}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-lg"
            >
              I Understand (2 of 4)
            </button>
          </div>
        </div>
      );
    }

    // Safety Screen 3: Benzodiazepines Warning
    if (state.currentSafetyScreen === 2) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-orange-900 via-orange-800 to-orange-900 p-6 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-24 h-24 mb-6 bg-orange-100 rounded-full">
                <Pill className="w-16 h-16 text-orange-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">BENZODIAZEPINES WARNING</h1>
              <div className="bg-red-50 rounded-lg p-6 mb-6 border-2 border-red-300">
                <p className="text-red-900 font-bold text-xl mb-4">
                  â˜ ï¸ DEADLY COMBINATION â˜ ï¸
                </p>
                <p className="text-gray-800 mb-4">
                  <strong>Never mix alcohol with benzodiazepines!</strong>
                </p>
                <p className="text-gray-700 mb-4">
                  Common benzos include:
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-white p-2 rounded border border-red-200">Xanax</div>
                  <div className="bg-white p-2 rounded border border-red-200">Valium</div>
                  <div className="bg-white p-2 rounded border border-red-200">Ativan</div>
                  <div className="bg-white p-2 rounded border border-red-200">Klonopin</div>
                </div>
              </div>

              <div className="bg-orange-50 rounded-lg p-4 mb-4 border border-orange-200">
                <p className="font-semibold text-gray-800 mb-3">Dangers:</p>
                <ul className="text-left text-sm text-gray-700 space-y-2">
                  <li className="flex items-start">
                    <span className="text-red-600 font-bold mr-2">â€¢</span>
                    <span>Extreme sedation and respiratory depression</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 font-bold mr-2">â€¢</span>
                    <span>Increased risk of overdose and death</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 font-bold mr-2">â€¢</span>
                    <span>Severe impairment even at low doses</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 font-bold mr-2">â€¢</span>
                    <span>Memory blackouts and dangerous behavior</span>
                  </li>
                </ul>
              </div>

              <div className="bg-red-100 rounded-lg p-4 border-2 border-red-300">
                <p className="text-red-900 font-bold text-sm">
                  If you take benzodiazepines, DO NOT drink alcohol. If you've been drinking, DO NOT take benzos. This combination can be fatal.
                </p>
              </div>
            </div>

            <button
              onClick={handleSafetyScreenNext}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-lg"
            >
              I Understand (3 of 4)
            </button>
          </div>
        </div>
      );
    }

    // Safety Screen 4: Opiates Warning
    if (state.currentSafetyScreen === 3) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-24 h-24 mb-6 bg-gray-100 rounded-full">
                <AlertTriangle className="w-16 h-16 text-red-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">OPIATES WARNING</h1>
              <div className="bg-red-50 rounded-lg p-6 mb-6 border-2 border-red-300">
                <p className="text-red-900 font-bold text-xl mb-4">
                  â˜ ï¸ FATAL COMBINATION â˜ ï¸
                </p>
                <p className="text-gray-800 font-bold mb-4">
                  Alcohol + Opiates = HIGH RISK OF DEATH
                </p>
                <p className="text-gray-700 mb-4">
                  Common opiates/opioids:
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-white p-2 rounded border border-red-200">Oxycodone</div>
                  <div className="bg-white p-2 rounded border border-red-200">Hydrocodone</div>
                  <div className="bg-white p-2 rounded border border-red-200">Morphine</div>
                  <div className="bg-white p-2 rounded border border-red-200">Fentanyl</div>
                  <div className="bg-white p-2 rounded border border-red-200">Codeine</div>
                  <div className="bg-white p-2 rounded border border-red-200">Heroin</div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
                <p className="font-semibold text-gray-800 mb-3">Why It's Deadly:</p>
                <ul className="text-left text-sm text-gray-700 space-y-2">
                  <li className="flex items-start">
                    <span className="text-red-600 font-bold mr-2">â€¢</span>
                    <span><strong>Respiratory Depression:</strong> Both slow breathing</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 font-bold mr-2">â€¢</span>
                    <span><strong>You can stop breathing:</strong> Even in your sleep</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 font-bold mr-2">â€¢</span>
                    <span><strong>Overdose risk:</strong> Dramatically increased</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 font-bold mr-2">â€¢</span>
                    <span><strong>Death can occur quickly:</strong> Minutes, not hours</span>
                  </li>
                </ul>
              </div>

              <div className="bg-red-100 rounded-lg p-4 border-2 border-red-300 mb-4">
                <p className="text-red-900 font-bold text-sm mb-2">
                  ðŸš¨ NEVER MIX ALCOHOL WITH OPIATES ðŸš¨
                </p>
                <p className="text-red-800 text-sm">
                  If you take prescription pain medication, DO NOT drink. If you've been drinking, DO NOT take opiates. This combination kills thousands every year.
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <p className="text-sm text-blue-900">
                  <strong>Emergency:</strong> If someone is unresponsive after mixing alcohol and opiates, call 911 immediately. Mention both substances.
                </p>
              </div>
            </div>

            <button
              onClick={handleSafetyScreenNext}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-lg"
            >
              I Understand - Continue to App (4 of 4)
            </button>
          </div>
        </div>
      );
    }
  }

  // Main Splash Screen (original drunk driving statistic)
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
                âš ï¸ NEVER drive after drinking, even below the legal limit. Impairment begins at ANY BAC level.
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
              Estimates only â€¢ Not medical advice â€¢ Drink responsibly â€¢ Never drink and drive
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Setup screen and rest of the app continues...
  // (For brevity, keeping the rest of the app the same as before)
  
  if (!state.setupComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            {/* App Icon Integration - Use your uploaded icon here */}
            <div className="w-24 h-24 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4 overflow-hidden">
              {/* Replace this with your actual icon */}
              <img 
                src="/path/to/your/icon.png" 
                alt="DrinkBot3000 Icon" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to emoji if image doesn't load
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <span className="text-6xl" style={{ display: 'none' }}>ðŸ¤–</span>
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

  // Main App Interface
  const currentBAC = state.calcBAC !== null && state.activeTab === 'calculator' ? state.calcBAC : state.bac;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 pb-20">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-4">
            <div className="text-center">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-800">DrinkBot3000</h1>
                <button
                  onClick={() => dispatch({ type: 'SET_FIELD', field: 'showSettings', value: true })}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <Settings className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              {/* BAC Display */}
              <div className={`${status.bg} rounded-xl p-6 mb-4 border-2 ${status.color.replace('text-', 'border-')}`}>
                <div className="text-sm font-medium text-gray-600 mb-1">Current BAC</div>
                <div className={`text-5xl font-bold ${status.color} mb-2`}>
                  {currentBAC.toFixed(3)}%
                </div>
                <div className={`inline-block px-4 py-1 rounded-full text-sm font-semibold ${status.color} ${status.bg}`}>
                  {status.text}
                </div>

                {currentBAC >= CONSTANTS.LEGAL_LIMIT && (
                  <div className="mt-4 bg-red-100 border-2 border-red-300 rounded-lg p-3">
                    <p className="text-red-800 font-bold text-sm">
                      ⚠️ OVER LEGAL LIMIT - DO NOT DRIVE
                    </p>
                  </div>
                )}

                {state.mode === 'live' && currentBAC > 0 && (
                  <div className="mt-4 text-sm text-gray-600">
                    <Clock className="inline w-4 h-4 mr-1" />
                    Estimated sober: {getSoberTime(currentBAC)}
                  </div>
                )}
              </div>

              {/* Robot Message */}
              {state.robotMessage && (
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 mb-4 animate-fade-in">
                  <p className="text-sm text-indigo-900">{state.robotMessage}</p>
                </div>
              )}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white rounded-xl shadow-lg mb-4 p-2 flex gap-2">
            <button
              onClick={() => dispatch({ type: 'SET_FIELD', field: 'activeTab', value: 'tracker' })}
              className={`flex-1 py-3 rounded-lg font-semibold transition ${
                state.activeTab === 'tracker'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Activity className="inline w-5 h-5 mr-1" />
              Tracker
            </button>
            <button
              onClick={() => dispatch({ type: 'SET_FIELD', field: 'activeTab', value: 'calculator' })}
              className={`flex-1 py-3 rounded-lg font-semibold transition ${
                state.activeTab === 'calculator'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Calculator className="inline w-5 h-5 mr-1" />
              Calculator
            </button>
            <button
              onClick={() => dispatch({ type: 'SET_FIELD', field: 'activeTab', value: 'support' })}
              className={`flex-1 py-3 rounded-lg font-semibold transition ${
                state.activeTab === 'support'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Heart className="inline w-5 h-5 mr-1" />
              Support
            </button>
          </div>

          {/* Tracker Tab */}
          {state.activeTab === 'tracker' && (
            <div className="space-y-4">
              {state.mode === 'live' && (
                <>
                  {/* Add Drink Buttons */}
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Log a Drink</h2>

                    <button
                      onClick={addDrink}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition shadow-md mb-3"
                    >
                      <Beer className="inline w-6 h-6 mr-2" />
                      Add Standard Drink
                    </button>

                    {/* Custom Drink */}
                    <div className="border-t pt-4 mt-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-3">Custom Drink</h3>
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <label className="text-xs text-gray-600 block mb-1">Ounces</label>
                          <input
                            type="number"
                            value={state.customDrinkOz}
                            onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'customDrinkOz', value: e.target.value })}
                            placeholder="12"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            min="0"
                            step="0.5"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-600 block mb-1">ABV %</label>
                          <input
                            type="number"
                            value={state.customDrinkABV}
                            onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'customDrinkABV', value: e.target.value })}
                            placeholder="5"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            min="0"
                            max="100"
                            step="0.5"
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          if (state.customDrinkOz && state.customDrinkABV) {
                            addCustomDrink(state.customDrinkOz, state.customDrinkABV);
                            dispatch({ type: 'SET_FIELD', field: 'customDrinkOz', value: '' });
                            dispatch({ type: 'SET_FIELD', field: 'customDrinkABV', value: '5' });
                          }
                        }}
                        disabled={!state.customDrinkOz || !state.customDrinkABV}
                        className="w-full bg-purple-600 text-white py-2 rounded-lg font-medium hover:bg-purple-700 transition disabled:bg-gray-300"
                      >
                        Add Custom Drink
                      </button>
                    </div>
                  </div>

                  {/* Drink History */}
                  {state.drinks.length > 0 && (
                    <div className="bg-white rounded-xl shadow-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">
                          Drink History ({state.drinks.length})
                        </h2>
                        <button
                          onClick={undoDrink}
                          className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                          <RefreshCw className="inline w-4 h-4 mr-1" />
                          Undo Last
                        </button>
                      </div>

                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {state.drinks.slice().reverse().map((drink, index) => (
                          <div
                            key={drink.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <Beer className="w-5 h-5 text-indigo-600" />
                              <div>
                                <div className="font-medium text-gray-800 text-sm">
                                  {drink.type}
                                </div>
                                <div className="text-xs text-gray-600">
                                  {formatTime(drink.timestamp)}
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => deleteDrink(drink.id)}
                              className="p-2 hover:bg-red-100 rounded-lg transition"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => {
                          dispatch({
                            type: 'SHOW_CONFIRM',
                            message: 'Clear all drinks and reset BAC to zero?',
                            action: () => {
                              dispatch({ type: 'CLEAR_DRINKS' });
                              dispatch({ type: 'HIDE_CONFIRM' });
                              showRobotMessage('*beep boop* All drinks cleared! Fresh start! 🤖');
                            },
                          });
                        }}
                        className="w-full mt-4 bg-red-100 text-red-700 py-2 rounded-lg font-medium hover:bg-red-200 transition"
                      >
                        <Trash2 className="inline w-4 h-4 mr-1" />
                        Clear All Drinks
                      </button>
                    </div>
                  )}

                  {/* Fun Features */}
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Fun Features</h2>
                    <button
                      onClick={tellJoke}
                      className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 rounded-xl font-semibold hover:from-yellow-600 hover:to-orange-600 transition shadow-md"
                    >
                      <Smile className="inline w-5 h-5 mr-2" />
                      Tell Me a Joke
                    </button>
                  </div>
                </>
              )}

              {state.mode === 'estimate' && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="text-center">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Estimate Mode</h2>
                    <p className="text-gray-600 mb-4">
                      Based on {state.estimateDrinks} drink(s) over {state.estimateHours} hour(s)
                    </p>
                    <button
                      onClick={resetApp}
                      className="text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      Reset and Start Live Tracking
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Calculator Tab */}
          {state.activeTab === 'calculator' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">BAC Calculator</h2>
              <p className="text-sm text-gray-600 mb-6">
                Calculate estimated BAC based on drinks consumed and time elapsed.
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
                    placeholder="e.g., 3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
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
                    placeholder="e.g., 2"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    min="0"
                    step="0.5"
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
                  <div className="mt-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-2">Result:</h3>
                    <p className="text-gray-700">
                      Estimated BAC: <span className="font-bold text-indigo-600">{state.calcBAC.toFixed(3)}%</span>
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      Status: <span className={`font-semibold ${status.color}`}>{status.text}</span>
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-xs text-amber-800">
                  <AlertCircle className="inline w-4 h-4 mr-1" />
                  Results are estimates only. Never drive after drinking.
                </p>
              </div>
            </div>
          )}

          {/* Support Tab */}
          {state.activeTab === 'support' && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-400 to-red-500 rounded-full mb-4">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Support Development</h2>
                  <p className="text-gray-600">
                    DrinkBot3000 is free and ad-free. Your support helps keep it that way!
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-800 text-center mb-3">Quick Support</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {[3, 5, 10].map((amount) => (
                      <button
                        key={amount}
                        onClick={() => handleTip(amount)}
                        className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-md"
                      >
                        ${amount}
                      </button>
                    ))}
                  </div>

                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">or custom amount</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <input
                      type="number"
                      value={state.customTipAmount}
                      onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'customTipAmount', value: e.target.value })}
                      placeholder="Enter amount"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg"
                      min={CONSTANTS.MIN_TIP_AMOUNT}
                      step="1"
                    />
                    <button
                      onClick={() => {
                        const amount = parseFloat(state.customTipAmount);
                        if (amount >= CONSTANTS.MIN_TIP_AMOUNT) {
                          handleTip(amount);
                          dispatch({ type: 'SET_FIELD', field: 'customTipAmount', value: '' });
                        }
                      }}
                      disabled={!state.customTipAmount || parseFloat(state.customTipAmount) < CONSTANTS.MIN_TIP_AMOUNT}
                      className="px-6 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition disabled:bg-gray-300"
                    >
                      <DollarSign className="w-5 h-5" />
                    </button>
                  </div>

                  {state.tipError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-800">{state.tipError}</p>
                    </div>
                  )}

                  <p className="text-xs text-gray-600 text-center mt-4">
                    Minimum ${CONSTANTS.MIN_TIP_AMOUNT} due to payment processing fees
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="font-semibold text-gray-800 mb-3">What Your Support Does</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Keeps the app free for everyone</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span>No ads or data tracking</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Supports continued development</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Helps spread alcohol safety awareness</span>
                  </li>
                </ul>
              </div>

              {state.receipts.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Your Receipts</h3>
                  <div className="space-y-2">
                    {state.receipts.slice().reverse().map((receipt) => (
                      <div
                        key={receipt.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="font-medium text-gray-800 text-sm">
                            ${receipt.amount.toFixed(2)}
                          </div>
                          <div className="text-xs text-gray-600">
                            {new Date(receipt.date).toLocaleDateString()}
                          </div>
                        </div>
                        <button
                          onClick={() => downloadReceipt(receipt)}
                          className="p-2 hover:bg-indigo-100 rounded-lg transition"
                        >
                          <Download className="w-4 h-4 text-indigo-600" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => dispatch({ type: 'SET_FIELD', field: 'showRefundPolicy', value: true })}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition"
              >
                <FileText className="inline w-5 h-5 mr-2" />
                Refund Policy
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Settings Modal */}
      {state.showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
              <button
                onClick={() => dispatch({ type: 'SET_FIELD', field: 'showSettings', value: false })}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Profile</h3>
                <p className="text-sm text-gray-600">Gender: <span className="font-medium capitalize">{state.gender}</span></p>
                <p className="text-sm text-gray-600">Weight: <span className="font-medium">{state.weight} lbs</span></p>
                <p className="text-sm text-gray-600">Mode: <span className="font-medium capitalize">{state.mode}</span></p>
              </div>

              <button
                onClick={resetApp}
                className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
              >
                <Trash2 className="inline w-5 h-5 mr-2" />
                Reset App
              </button>

              <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-xs text-amber-800 text-center">
                  <AlertCircle className="inline w-4 h-4 mr-1" />
                  Resetting will clear all data permanently
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Joke Modal */}
      {state.showJoke && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-2xl p-8 max-w-md w-full">
            <div className="text-center">
              <Smile className="w-16 h-16 text-white mx-auto mb-4" />
              <p className="text-xl font-medium text-white mb-6">{state.currentJoke}</p>
              <button
                onClick={() => dispatch({ type: 'SET_FIELD', field: 'showJoke', value: false })}
                className="bg-white text-orange-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition"
              >
                Thanks! 😄
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      {state.showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Action</h3>
            <p className="text-gray-600 mb-6">{state.confirmModalMessage}</p>
            <div className="flex gap-3">
              <button
                onClick={() => dispatch({ type: 'HIDE_CONFIRM' })}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={state.confirmModalAction}
                className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {state.showReceipt && state.currentReceipt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Thank You!</h2>
              <p className="text-gray-600">Your support means everything</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-semibold text-gray-800">${state.currentReceipt.amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Processing Fee:</span>
                  <span className="text-gray-600">-${state.currentReceipt.stripeFee}</span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="font-semibold text-gray-800">Net Amount:</span>
                  <span className="font-bold text-green-600">${state.currentReceipt.netAmount}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <p className="text-xs text-gray-600">Receipt ID:</p>
                <p className="text-xs font-mono text-gray-800">{state.currentReceipt.id}</p>
                <p className="text-xs text-gray-600 mt-2">{new Date(state.currentReceipt.date).toLocaleString()}</p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => downloadReceipt(state.currentReceipt)}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
              >
                <Download className="inline w-5 h-5 mr-2" />
                Download Receipt
              </button>
              <button
                onClick={() => {
                  dispatch({ type: 'SET_FIELD', field: 'showReceipt', value: false });
                  dispatch({ type: 'SET_FIELD', field: 'currentReceipt', value: null });
                }}
                className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Close
              </button>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-900 text-center">
                Refund requests accepted within {CONSTANTS.REFUND_WINDOW_DAYS} days. Email: support@drinkbot3000.com
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Refund Policy Modal */}
      {state.showRefundPolicy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Refund Policy</h2>
              <button
                onClick={() => dispatch({ type: 'SET_FIELD', field: 'showRefundPolicy', value: false })}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4 text-sm text-gray-700">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h3 className="font-bold text-green-900 mb-2">{CONSTANTS.REFUND_WINDOW_DAYS}-Day Money-Back Guarantee</h3>
                <p className="text-green-800">
                  We offer a full refund within {CONSTANTS.REFUND_WINDOW_DAYS} days of your support contribution, no questions asked.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">How to Request a Refund:</h4>
                <ol className="list-decimal list-inside space-y-2 ml-2">
                  <li>Email: support@drinkbot3000.com</li>
                  <li>Subject: "Refund Request - [Your Receipt ID]"</li>
                  <li>Include your receipt ID from your receipt</li>
                  <li>Refunds processed within 5-7 business days</li>
                </ol>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-blue-900 text-xs">
                  <strong>Note:</strong> Processing fees charged by payment processors (typically $0.30 + 2.9%) are non-refundable as they're charged by third parties.
                </p>
              </div>

              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                <p className="text-amber-900">
                  <strong>Questions?</strong> Contact us anytime at support@drinkbot3000.com
                </p>
              </div>
            </div>

            <button
              onClick={() => dispatch({ type: 'SET_FIELD', field: 'showRefundPolicy', value: false })}
              className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <PWAInstallPrompt />
    </>
  );
}
