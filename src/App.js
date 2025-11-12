import React, { useState, useEffect, useReducer } from 'react';
import { AlertCircle, Beer, User, Scale, Smile, Calculator, Activity, Settings, Trash2, Clock, X, Heart, Coffee, DollarSign, ShieldAlert, Download, AlertTriangle, FileText, RefreshCw, CheckCircle, Pill, Bed, Car, Phone, Package, Globe, HelpCircle, Share2 } from 'lucide-react';
import PWAInstallPrompt from './PWAInstallPrompt';
import { checkGeographicRestriction } from './geolocation';

// Constants
const CONSTANTS = {
  // Conservative BAC elimination rate based on Jones, A.W. (2010)
  // "Evidence-based survey of the elimination rates of ethanol from blood with applications in forensic casework"
  // Forensic Science International, 200(1-3), 1-20.
  // Using 10 mg/100mL/h (0.010% per hour) - the lower end of the physiological range
  // for fasted subjects, providing safer, more conservative estimates for sobriety time.
  METABOLISM_RATE: 0.010,
  // Typical variation in metabolism rate between individuals: ±30-50%
  METABOLISM_RATE_MIN: 0.007, // Slow metabolizers
  METABOLISM_RATE_MAX: 0.015, // Fast metabolizers
  GRAMS_PER_STANDARD_DRINK: 14,
  LBS_TO_KG: 0.453592,
  MALE_BODY_WATER: 0.68,
  FEMALE_BODY_WATER: 0.55,
  STANDARD_DRINK_OZ: 0.6,
  LEGAL_LIMIT: 0.08,
  // Dangerous BAC thresholds based on medical research
  SEVERE_IMPAIRMENT: 0.15, // Severe impairment, blackout risk
  DANGEROUS: 0.20,          // Confusion, disorientation, needs assistance
  POISONING_RISK: 0.25,     // Risk of alcohol poisoning, medical attention needed
  LIFE_THREATENING: 0.30,   // Loss of consciousness, respiratory depression
  CRITICAL: 0.40,           // Coma, respiratory failure, death risk
  MIN_WEIGHT: 50,
  MAX_WEIGHT: 500,
  ROBOT_MESSAGE_DURATION: 5000,
  JOKE_DURATION: 7000,
  MIN_TIP_AMOUNT: 3,
  LEGAL_DRINKING_AGE: 21,
  REFUND_WINDOW_DAYS: 30,
  // Stripe Payment Link - $5 payment to support DrinkBot3000 and spread safety messages!
  STRIPE_PAYMENT_LINK: 'https://buy.stripe.com/aFa14m7kE8UfdjB00g5sA01'
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
  showHelp: false,
  customDrinkOz: '',
  customDrinkABV: '5',
  customDrinkName: '',
  showCustomDrink: false,
  savedCustomDrinks: [],
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
  // Geographic verification state
  showGeoConsent: false,
  geoConsentGiven: false,
  geoVerified: false,
  geoBlocked: false,
  geoCountry: '',
  geoError: null,
  geoVerifying: false,
  geoTechnicalError: false,
  // Settings edit state
  settingsEditGender: '',
  settingsEditWeight: '',
  settingsEditMode: false,
  // Impairment tracking
  hasBeenImpaired: false,
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
    "Greetings! I am DrinkBot3000, your safety companion! 🤖",
    "Beep boop! Ready to help you stay safe, dear friend! 🎩",
    "*mechanical bow* Your safety assistant reporting for duty! 🤖",
    "Salutations! Let us monitor responsibly together! 🛡️",
    "*whirrs politely* I shall help you stay safe this evening! 🎩",
  ];

  const robotComments = [
    "*calculates thoughtfully* Remember to stay hydrated! 🤖",
    "Beep boop! Please pace yourself, valued user! 🎩",
    "*adjusts monocle* Safety first, always! 🧙",
    "*whirrs concernedly* Time for water, perhaps? 💧",
    "My sensors suggest taking it slow! 🤖",
    "*beeps approvingly* Excellent responsibility detected! 💦",
    "*mechanical nod* You're making wise choices! 🎩",
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
        savedCustomDrinks: state.savedCustomDrinks,
        hasBeenImpaired: state.hasBeenImpaired,
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
    state.savedCustomDrinks,
    state.hasBeenImpaired,
  ]);

  // Helper functions
  // Default to female body water constant (more conservative - higher BAC estimate)
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
    try {
      // Defensive checks for required data
      if (!state.gender || !state.weight) {
        return 0;
      }

      const weightValue = parseFloat(state.weight);
      if (isNaN(weightValue) || weightValue <= 0) {
        console.warn('Invalid weight value for BAC calculation');
        return 0;
      }

      if (state.mode === 'estimate') {
        if (!state.estimateDrinks || !state.estimateHours) return 0;

        const numDrinks = parseFloat(state.estimateDrinks);
        const hours = parseFloat(state.estimateHours);

        // Validate parsed values
        if (isNaN(numDrinks) || isNaN(hours) || numDrinks < 0 || hours < 0) {
          return 0;
        }

        const weightKg = weightValue * CONSTANTS.LBS_TO_KG;
        const bodyWater = getBodyWaterConstant(state.gender);

        const totalAlcoholGrams = numDrinks * CONSTANTS.GRAMS_PER_STANDARD_DRINK;
        const initialBAC = (totalAlcoholGrams / (weightKg * bodyWater * 1000)) * 100;
        const metabolized = CONSTANTS.METABOLISM_RATE * hours;

        return Math.max(0, initialBAC - metabolized);
      }

      if (state.mode === 'live') {
        if (!state.startTime || state.drinks.length === 0) return 0;

        const weightKg = weightValue * CONSTANTS.LBS_TO_KG;
        const bodyWater = getBodyWaterConstant(state.gender);
        const currentTime = Date.now();

        let adjustedBAC = 0;

        state.drinks.forEach(drink => {
          // Defensive check for drink data
          if (!drink || typeof drink.standardDrinks !== 'number' || !drink.timestamp) {
            console.warn('Invalid drink data encountered');
            return;
          }

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
    } catch (error) {
      console.error('Error calculating BAC:', error);
      return 0;
    }
  };

  // Update BAC every second
  useEffect(() => {
    if (!state.setupComplete) return;

    const interval = setInterval(() => {
      const currentBAC = calculateBAC();
      dispatch({ type: 'SET_FIELD', field: 'bac', value: currentBAC });

      // Track if user has been impaired (at or above legal limit)
      if (currentBAC >= CONSTANTS.LEGAL_LIMIT && !state.hasBeenImpaired) {
        dispatch({ type: 'SET_FIELD', field: 'hasBeenImpaired', value: true });
      }

      // Reset impairment flag only when completely sober
      if (currentBAC === 0 && state.hasBeenImpaired) {
        dispatch({ type: 'SET_FIELD', field: 'hasBeenImpaired', value: false });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [state.drinks, state.setupComplete, state.gender, state.weight, state.startTime, state.mode, state.estimateDrinks, state.estimateHours, state.hasBeenImpaired]);

  // URL Query Parameter Parsing
  useEffect(() => {
    const parseUrlParameters = () => {
      const urlParams = new URLSearchParams(window.location.search);

      // Calculator mode parameters
      const drinks = urlParams.get('drinks');
      const hours = urlParams.get('hours');
      const tab = urlParams.get('tab');

      // If drinks and hours are provided, switch to calculator tab and pre-fill
      if (drinks !== null && hours !== null) {
        const drinksNum = parseFloat(drinks);
        const hoursNum = parseFloat(hours);

        if (!isNaN(drinksNum) && !isNaN(hoursNum) && drinksNum > 0 && hoursNum > 0) {
          dispatch({ type: 'SET_FIELD', field: 'calcDrinks', value: drinks });
          dispatch({ type: 'SET_FIELD', field: 'calcHours', value: hours });
          dispatch({ type: 'SET_FIELD', field: 'activeTab', value: 'calculator' });
        }
      }

      // Tab switching parameter
      if (tab === 'calculator' || tab === 'tracker') {
        dispatch({ type: 'SET_FIELD', field: 'activeTab', value: tab });
      }
    };

    // Only parse URL parameters once when component mounts
    parseUrlParameters();
  }, []); // Empty dependency array - run once on mount

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
╔═══════════════════════════════════════════════════════════╗
║              DRINKBOT3000 - PAYMENT RECEIPT               ║
║                   Developer Support                        ║
╚═══════════════════════════════════════════════════════════╝

Receipt #: ${receipt.id}
Date: ${new Date(receipt.date).toLocaleString()}
Status: ${receipt.status}

─────────────────────────────────────────────────────────────

Description: ${receipt.description}
Support Amount: $${receipt.amount.toFixed(2)}
Processing Fee: -$${receipt.stripeFee}
Net Amount: $${receipt.netAmount}

Payment Method: ${receipt.paymentMethod}
Payment Processor: Stripe, Inc.

─────────────────────────────────────────────────────────────

REFUND POLICY:
Eligible for refund until: ${new Date(receipt.refundableUntil).toLocaleDateString()}
Refund window: ${CONSTANTS.REFUND_WINDOW_DAYS} days from purchase date

To request a refund:
1. Email: support@drinkbot3000.com
2. Subject: "Refund Request - ${receipt.id}"
3. Include this receipt number

─────────────────────────────────────────────────────────────

THANK YOU FOR YOUR SUPPORT!

Your contribution helps keep DrinkBot3000 free and ad-free
for everyone.

Questions? Contact: support@drinkbot3000.com

© ${new Date().getFullYear()} DrinkBot3000. All rights reserved.
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
      // Show geographic consent dialog first
      dispatch({ type: 'SET_FIELD', field: 'showGeoConsent', value: true });
    } else {
      alert('You must be of legal drinking age to use this app.');
    }
  };

  const handleGeoConsentAccept = async () => {
    dispatch({ type: 'SET_FIELD', field: 'geoConsentGiven', value: true });
    dispatch({ type: 'SET_FIELD', field: 'showGeoConsent', value: false });
    dispatch({ type: 'SET_FIELD', field: 'geoVerifying', value: true });

    // Perform geographic verification
    try {
      const result = await checkGeographicRestriction();

      dispatch({ type: 'SET_FIELD', field: 'geoVerifying', value: false });

      if (result.allowed) {
        // User is in an allowed country
        dispatch({ type: 'SET_FIELD', field: 'geoVerified', value: true });
        dispatch({ type: 'SET_FIELD', field: 'geoCountry', value: result.country });
        dispatch({ type: 'SET_FIELD', field: 'geoBlocked', value: false });
        dispatch({ type: 'SET_FIELD', field: 'geoTechnicalError', value: false });
        // Continue to disclaimer
        dispatch({ type: 'SET_FIELD', field: 'showDisclaimerModal', value: true });
      } else {
        // Check if this is a technical error or actual geo-blocking
        if (result.technicalError) {
          // Technical error - show special error screen with bypass option
          dispatch({ type: 'SET_FIELD', field: 'geoTechnicalError', value: true });
          dispatch({ type: 'SET_FIELD', field: 'geoBlocked', value: true });
          dispatch({ type: 'SET_FIELD', field: 'geoCountry', value: result.country });
        } else {
          // User is actually in a prohibited country
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
      // On unexpected error, treat as technical error
      dispatch({ type: 'SET_FIELD', field: 'geoBlocked', value: true });
      dispatch({ type: 'SET_FIELD', field: 'geoTechnicalError', value: true });
      dispatch({ type: 'SET_FIELD', field: 'geoCountry', value: 'Unknown' });
    }
  };

  const handleGeoConsentDecline = () => {
    dispatch({ type: 'SET_FIELD', field: 'ageVerified', value: false });
    dispatch({ type: 'SET_FIELD', field: 'showGeoConsent', value: false });
    localStorage.removeItem('ageVerified');
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

  const handleSafetyScreenDecline = () => {
    // User declined safety warnings - reset everything
    localStorage.removeItem('ageVerified');
    localStorage.removeItem('disclaimerAccepted');
    localStorage.removeItem('safetyScreensComplete');
    dispatch({ type: 'SET_FIELD', field: 'ageVerified', value: false });
    dispatch({ type: 'SET_FIELD', field: 'disclaimerAccepted', value: false });
    dispatch({ type: 'SET_FIELD', field: 'safetyScreensComplete', value: false });
    dispatch({ type: 'SET_FIELD', field: 'currentSafetyScreen', value: 0 });
  };

  const handleSetup = () => {
    try {
      // Comprehensive validation before completing setup
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

      const weightValue = parseFloat(state.weight);
      if (isNaN(weightValue) || weightValue <= 0) {
        showRobotMessage('Please enter a valid weight.');
        return;
      }

      if (!state.mode) {
        showRobotMessage('Please select a tracking mode.');
        return;
      }

      // For estimate mode, validate additional required fields
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

      // All validations passed - complete setup
      dispatch({ type: 'SET_FIELD', field: 'weightError', value: '' });
      dispatch({ type: 'SET_FIELD', field: 'setupComplete', value: true });

      if (state.mode === 'live') {
        dispatch({ type: 'SET_FIELD', field: 'startTime', value: Date.now() });
      }

      const greeting = robotGreetings[Math.floor(Math.random() * robotGreetings.length)];
      showRobotMessage(greeting);
    } catch (error) {
      console.error('Error during setup:', error);
      showRobotMessage('Setup failed. Please try again.');
    }
  };

  const handleModeSelect = (selectedMode) => {
    dispatch({ type: 'SET_FIELD', field: 'mode', value: selectedMode });
  };

  const addDrink = (name = 'Standard Drink', oz = null, abv = null) => {
    try {
      // Defensive check: ensure setup is complete
      if (!state.setupComplete) {
        console.warn('Cannot add drink: setup not complete');
        showRobotMessage('Please complete setup first before adding drinks.');
        return;
      }

      // Defensive check: ensure profile is valid
      if (!state.gender || !state.weight) {
        console.warn('Cannot add drink: profile incomplete');
        showRobotMessage('Please set your gender and weight in settings before adding drinks.');
        return;
      }

      let standardDrinks = 1;
      let drinkType = name;

      // If oz and abv are provided, calculate standard drinks
      if (oz !== null && abv !== null) {
        const ozValue = parseFloat(oz);
        const abvValue = parseFloat(abv);

        // Validate inputs with clear error messages
        if (isNaN(ozValue) || ozValue <= 0 || ozValue > 64) {
          showRobotMessage('Invalid drink size. Please use a value between 0 and 64 oz.');
          return;
        }
        if (isNaN(abvValue) || abvValue <= 0 || abvValue > 100) {
          showRobotMessage('Invalid ABV%. Please use a value between 0 and 100%.');
          return;
        }

        const pureAlcoholOz = ozValue * (abvValue / 100);
        standardDrinks = pureAlcoholOz / CONSTANTS.STANDARD_DRINK_OZ;
        drinkType = `${name} (${ozValue}oz @ ${abvValue}%)`;
      }

      const newDrink = {
        id: Date.now(),
        timestamp: Date.now(),
        standardDrinks: standardDrinks,
        type: drinkType,
      };

      // For live mode, ensure startTime is initialized
      if (state.mode === 'live' && !state.startTime) {
        dispatch({ type: 'SET_FIELD', field: 'startTime', value: Date.now() });
      }

      dispatch({ type: 'ADD_DRINK', drink: newDrink });

      const comment = robotComments[Math.floor(Math.random() * robotComments.length)];
      showRobotMessage(comment);
    } catch (error) {
      console.error('Error adding drink:', error);
      showRobotMessage('Error adding drink. Please check your inputs and try again.');
    }
  };

  const undoDrink = () => {
    try {
      if (state.drinks.length > 0) {
        dispatch({ type: 'UNDO_DRINK' });
        showRobotMessage('*beep boop* Last drink removed from records! 🤖');
      } else {
        showRobotMessage('No drinks to undo!');
      }
    } catch (error) {
      console.error('Error undoing drink:', error);
      showRobotMessage('Failed to undo drink. Please try again.');
    }
  };

  const clearDrinks = () => {
    try {
      if (state.drinks.length > 0) {
        dispatch({ type: 'CLEAR_DRINKS' });
        showRobotMessage('*whirrs loudly* All drinks cleared from memory! Starting fresh! 🤖');
      } else {
        showRobotMessage('No drinks to clear!');
      }
    } catch (error) {
      console.error('Error clearing drinks:', error);
      showRobotMessage('Failed to clear drinks. Please try again.');
    }
  };

  const deleteDrink = (id) => {
    try {
      if (!id) {
        console.warn('Attempted to delete drink without valid ID');
        return;
      }
      dispatch({ type: 'REMOVE_DRINK', id });
      showRobotMessage('*whirrs* Drink removed from records! 🤖');
    } catch (error) {
      console.error('Error deleting drink:', error);
      showRobotMessage('Failed to delete drink. Please try again.');
    }
  };

  const addCustomDrink = (oz, abv) => {
    try {
      const ozValue = parseFloat(oz);
      const abvValue = parseFloat(abv);

      // Defensive validation
      if (isNaN(ozValue) || ozValue <= 0 || ozValue > 64) {
        showRobotMessage('Invalid drink size. Please use a value between 0 and 64 oz.');
        return;
      }
      if (isNaN(abvValue) || abvValue <= 0 || abvValue > 100) {
        showRobotMessage('Invalid ABV%. Please use a value between 0 and 100%.');
        return;
      }

      const pureAlcoholOz = ozValue * (abvValue / 100);
      const standardDrinks = pureAlcoholOz / CONSTANTS.STANDARD_DRINK_OZ;

      const newDrink = {
        id: Date.now(),
        timestamp: Date.now(),
        standardDrinks: standardDrinks,
        type: `${ozValue}oz @ ${abvValue}%`,
      };

      // For live mode, ensure startTime is initialized
      if (state.mode === 'live' && !state.startTime) {
        dispatch({ type: 'SET_FIELD', field: 'startTime', value: Date.now() });
      }

      dispatch({ type: 'ADD_DRINK', drink: newDrink });

      showRobotMessage(`*calculates precisely* That's ${standardDrinks.toFixed(1)} standard drinks! 🤖`);
    } catch (error) {
      console.error('Error adding custom drink:', error);
      showRobotMessage('Failed to add custom drink. Please try again.');
    }
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
    try {
      // Defensive checks for all required inputs
      if (!state.gender || !state.weight || !state.calcDrinks || !state.calcHours) {
        showRobotMessage('Please fill in all fields to calculate BAC.');
        return;
      }

      const weightValue = parseFloat(state.weight);
      const numDrinks = parseFloat(state.calcDrinks);
      const hours = parseFloat(state.calcHours);

      // Validate all parsed values
      if (isNaN(weightValue) || weightValue <= 0) {
        showRobotMessage('Invalid weight value.');
        return;
      }
      if (isNaN(numDrinks) || numDrinks < 0) {
        showRobotMessage('Please enter a valid number of drinks (0 or more).');
        return;
      }
      if (isNaN(hours) || hours < 0) {
        showRobotMessage('Please enter a valid time period (0 or more hours).');
        return;
      }

      const weightKg = weightValue * CONSTANTS.LBS_TO_KG;
      const bodyWater = getBodyWaterConstant(state.gender);

      const totalAlcoholGrams = numDrinks * CONSTANTS.GRAMS_PER_STANDARD_DRINK;
      const initialBAC = (totalAlcoholGrams / (weightKg * bodyWater * 1000)) * 100;
      const metabolized = CONSTANTS.METABOLISM_RATE * hours;

      const result = Math.max(0, initialBAC - metabolized);
      dispatch({ type: 'SET_FIELD', field: 'calcBAC', value: result });
    } catch (error) {
      console.error('Error calculating quick BAC:', error);
      showRobotMessage('Failed to calculate BAC. Please check your inputs and try again.');
    }
  };

  // Calculate margin of error for BAC estimate
  // Based on individual variation in metabolism and body composition
  const calculateBACMargin = (bac) => {
    if (bac === 0) return { min: 0, max: 0, marginPercent: 0 };

    // Margin of error factors:
    // - Metabolism rate variation: ±30-50%
    // - Body composition variation: ±10-20%
    // - Combined typical error: ±0.01-0.02% for most users
    // Using conservative ±0.015% (±15 mg/dL) as base margin
    const baseMargin = 0.015;

    // Margin increases with higher BAC due to compounding uncertainties
    const scaledMargin = Math.min(baseMargin + (bac * 0.1), bac * 0.3);

    return {
      min: Math.max(0, bac - scaledMargin),
      max: bac + scaledMargin,
      marginPercent: ((scaledMargin / bac) * 100)
    };
  };

  const getBACStatus = () => {
    const currentBAC = state.calcBAC !== null && state.activeTab === 'calculator' ? state.calcBAC : state.bac;
    const margin = calculateBACMargin(currentBAC);

    // Special handling for users who have been impaired but are now sober
    if (currentBAC === 0 && state.hasBeenImpaired) return {
      label: 'Recently Impaired',
      color: 'text-orange-600',
      bgColor: 'bg-gradient-to-br from-orange-400 to-orange-600',
      message: '⚠️ WARNING: You recently exceeded the legal limit. Wait until fully recovered before driving. Impairment effects may persist even at 0.00% BAC.',
      margin,
      showEmergency: false
    };

    if (currentBAC === 0) return {
      label: 'Sober',
      color: 'text-green-600',
      bgColor: 'bg-gradient-to-br from-green-400 to-green-600',
      message: 'You are completely sober. Safe to drive and operate machinery.',
      margin,
      showEmergency: false
    };

    // Add impairment warning to all non-zero BAC levels if they've been impaired
    const impairmentWarning = state.hasBeenImpaired ? ' ⚠️ YOU HAVE BEEN OVER THE LEGAL LIMIT - DO NOT DRIVE.' : '';

    // CRITICAL & LIFE-THREATENING LEVELS - Medical Emergency
    if (currentBAC >= CONSTANTS.CRITICAL) return {
      label: '🚨 CRITICAL - CALL 911',
      color: 'text-white',
      bgColor: 'bg-gradient-to-br from-black via-red-900 to-black animate-pulse',
      message: '🚨 IMMEDIATE MEDICAL EMERGENCY - CALL 911 NOW! Risk of coma, respiratory failure, and death. DO NOT leave person alone. Monitor breathing and consciousness.',
      emergencyLevel: 'CRITICAL',
      margin,
      showEmergency: true
    };

    if (currentBAC >= CONSTANTS.LIFE_THREATENING) return {
      label: '🚨 LIFE-THREATENING',
      color: 'text-white',
      bgColor: 'bg-gradient-to-br from-red-900 via-red-700 to-red-900',
      message: '🚨 MEDICAL EMERGENCY: Loss of consciousness likely. Respiratory depression. CALL 911 IMMEDIATELY. Stay with person, monitor breathing, be prepared to perform CPR.',
      emergencyLevel: 'LIFE_THREATENING',
      margin,
      showEmergency: true
    };

    if (currentBAC >= CONSTANTS.POISONING_RISK) return {
      label: '⚠️ ALCOHOL POISONING RISK',
      color: 'text-white',
      bgColor: 'bg-gradient-to-br from-red-700 via-red-600 to-red-700',
      message: '⚠️ SEVERE DANGER: Risk of alcohol poisoning. Seek medical attention NOW. Signs: confusion, vomiting, seizures, slow breathing, pale/blue skin. DO NOT hesitate to call 911.',
      emergencyLevel: 'POISONING_RISK',
      margin,
      showEmergency: true
    };

    if (currentBAC >= CONSTANTS.DANGEROUS) return {
      label: '🛑 DANGEROUS LEVEL',
      color: 'text-white',
      bgColor: 'bg-gradient-to-br from-red-600 via-red-500 to-red-600',
      message: '🛑 DANGEROUS: Severe confusion, disorientation, inability to walk. Person needs immediate assistance. May need medical help. Monitor closely for worsening symptoms. Do NOT drive or operate anything.' + impairmentWarning,
      emergencyLevel: 'DANGEROUS',
      margin,
      showEmergency: true
    };

    if (currentBAC >= CONSTANTS.SEVERE_IMPAIRMENT) return {
      label: '🔴 SEVERE IMPAIRMENT',
      color: 'text-white',
      bgColor: 'bg-gradient-to-br from-red-500 via-red-400 to-red-500',
      message: '🔴 SEVERE IMPAIRMENT: High risk of blackout, severe loss of coordination and judgment. Vomiting likely. Person may need assistance. Absolutely NO driving, operating machinery, or dangerous activities.' + impairmentWarning,
      emergencyLevel: 'SEVERE',
      margin,
      showEmergency: false
    };

    // Standard levels
    if (currentBAC < 0.03) return {
      label: 'Mild Effect',
      color: 'text-yellow-600',
      bgColor: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
      message: 'Slight euphoria and relaxation. Minor impairment of reasoning and memory.' + impairmentWarning,
      margin,
      showEmergency: false
    };

    if (currentBAC < CONSTANTS.LEGAL_LIMIT) return {
      label: 'Impaired',
      color: 'text-orange-600',
      bgColor: 'bg-gradient-to-br from-orange-400 to-orange-600',
      message: 'Reduced coordination and judgment. Do not drive or operate machinery.' + impairmentWarning,
      margin,
      showEmergency: false
    };

    return {
      label: 'Intoxicated',
      color: 'text-red-600',
      bgColor: 'bg-gradient-to-br from-red-400 to-red-600',
      message: 'Significant impairment. Do NOT drive. Seek safe transportation and stay hydrated.' + impairmentWarning,
      margin,
      showEmergency: false
    };
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

  const calculateElapsedTime = () => {
    if (state.drinks.length === 0) return '0m';
    const firstDrinkTime = state.startTime || state.drinks[0].timestamp;
    const elapsedMs = Date.now() - firstDrinkTime;
    const hours = Math.floor(elapsedMs / (1000 * 60 * 60));
    const minutes = Math.floor((elapsedMs % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const calculateSoberTime = () => {
    return getSoberTime(state.bac);
  };

  const handleOpenSettings = () => {
    // Initialize edit fields with current values (with fallbacks)
    // Default to 'female' as it's more conservative (lower body water = higher BAC estimate)
    dispatch({ type: 'SET_FIELD', field: 'settingsEditGender', value: state.gender || 'female' });
    dispatch({ type: 'SET_FIELD', field: 'settingsEditWeight', value: state.weight || '' });
    dispatch({ type: 'SET_FIELD', field: 'settingsEditMode', value: false });
    dispatch({ type: 'SET_FIELD', field: 'showSettings', value: true });
  };

  const handleSaveSettings = () => {
    try {
      // Validate inputs with clear feedback
      const weight = parseFloat(state.settingsEditWeight);
      if (isNaN(weight) || weight < 50 || weight > 500) {
        dispatch({ type: 'SET_FIELD', field: 'weightError', value: 'Please enter a valid weight between 50-500 lbs' });
        showRobotMessage('Please enter a valid weight between 50-500 lbs.');
        return;
      }

      // Validate gender
      if (!state.settingsEditGender || (state.settingsEditGender !== 'male' && state.settingsEditGender !== 'female')) {
        showRobotMessage('Please select a valid gender (Male or Female).');
        return;
      }

      // Check if values actually changed
      if (state.settingsEditGender === state.gender && weight === parseFloat(state.weight)) {
        dispatch({ type: 'SET_FIELD', field: 'showSettings', value: false });
        showRobotMessage('No changes detected.');
        return;
      }

      // Warn user that changing profile will reset tracking
      if (state.drinks.length > 0 || state.bac > 0) {
        dispatch({
          type: 'SHOW_CONFIRM',
          message: 'Changing your profile will reset your current BAC tracking and drink history. Continue?',
          action: () => {
            updateProfile();
          }
        });
      } else {
        updateProfile();
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      showRobotMessage('Failed to save settings. Please try again.');
    }
  };

  const updateProfile = () => {
    try {
      // Validate before updating - defensive programming
      const newWeight = parseFloat(state.settingsEditWeight);
      if (isNaN(newWeight) || newWeight < 50 || newWeight > 500) {
        showRobotMessage('Invalid weight value. Please enter a weight between 50-500 lbs.');
        return;
      }

      if (!state.settingsEditGender || (state.settingsEditGender !== 'male' && state.settingsEditGender !== 'female')) {
        showRobotMessage('Invalid gender selection. Please select Male or Female.');
        return;
      }

      // Use SET_MULTIPLE for atomic state update - best practice
      // This ensures all related state changes happen together
      dispatch({
        type: 'SET_MULTIPLE',
        values: {
          gender: state.settingsEditGender,
          weight: state.settingsEditWeight,
          drinks: [],
          bac: 0,
          startTime: null,
          weightError: '',
          showSettings: false,
          settingsEditMode: false,
          hasBeenImpaired: false, // Reset impairment tracking
        }
      });

      showRobotMessage('Profile updated successfully! BAC tracking has been reset.');
    } catch (error) {
      console.error('Error updating profile:', error);
      showRobotMessage('Failed to update profile. Please try again.');
    }
  };

  const handleSaveCustomDrink = () => {
    try {
      const oz = parseFloat(state.customDrinkOz);
      const abv = parseFloat(state.customDrinkABV);
      const name = state.customDrinkName.trim();

      // Validate inputs
      if (!name) {
        showRobotMessage('Please enter a name for your custom drink.');
        return;
      }

      // Validate name length and characters
      if (name.length > 50) {
        showRobotMessage('Drink name is too long. Please use 50 characters or less.');
        return;
      }

      if (isNaN(oz) || oz <= 0 || oz > 64) {
        showRobotMessage('Please enter a valid drink size (0-64 oz).');
        return;
      }
      if (isNaN(abv) || abv <= 0 || abv > 100) {
        showRobotMessage('Please enter a valid ABV% (0-100%).');
        return;
      }

      // Check if name already exists
      if (state.savedCustomDrinks.some(drink => drink.name.toLowerCase() === name.toLowerCase())) {
        showRobotMessage('A custom drink with this name already exists. Please choose a different name.');
        return;
      }

      // Add to saved custom drinks
      const newDrink = {
        id: Date.now(),
        name,
        oz,
        abv
      };
      dispatch({
        type: 'SET_FIELD',
        field: 'savedCustomDrinks',
        value: [...state.savedCustomDrinks, newDrink]
      });

      // Clear form and hide custom drink input
      dispatch({ type: 'SET_FIELD', field: 'customDrinkName', value: '' });
      dispatch({ type: 'SET_FIELD', field: 'customDrinkOz', value: '' });
      dispatch({ type: 'SET_FIELD', field: 'customDrinkABV', value: '5' });
      dispatch({ type: 'SET_FIELD', field: 'showCustomDrink', value: false });

      showRobotMessage(`Custom drink "${name}" saved!`);
    } catch (error) {
      console.error('Error saving custom drink:', error);
      showRobotMessage('Error saving custom drink. Please try again.');
    }
  };

  const handleDeleteCustomDrink = (drinkId) => {
    dispatch({
      type: 'SET_FIELD',
      field: 'savedCustomDrinks',
      value: state.savedCustomDrinks.filter(drink => drink.id !== drinkId)
    });
    showRobotMessage('Custom drink deleted.');
  };

  const handleAddSavedCustomDrink = (drink) => {
    try {
      if (!drink || !drink.name || drink.oz == null || drink.abv == null) {
        showRobotMessage('Error: Invalid drink data. Please try again.');
        return;
      }
      addDrink(drink.name, drink.oz, drink.abv);
      showRobotMessage(`Added ${drink.name} to your log!`);
    } catch (error) {
      console.error('Error adding saved custom drink:', error);
      showRobotMessage('Error adding drink. Please try again.');
    }
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

    // Open Stripe Payment Link in new tab ($5 donation)
    window.open(CONSTANTS.STRIPE_PAYMENT_LINK, '_blank', 'noopener,noreferrer');
    showRobotMessage(`*beep boop* Opening $5 payment page... Thank you for your support! Share to spread safety! 🤖`);
  };

  const handleShare = async () => {
    const shareData = {
      title: 'DrinkBot3000',
      text: 'Check out DrinkBot3000 - A responsible drinking companion that helps you track your BAC and stay safe!',
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        showRobotMessage('*beep boop* Thanks for sharing! 🤖');
      } else {
        // Fallback for browsers that don't support Web Share API
        await navigator.clipboard.writeText(window.location.href);
        showRobotMessage('*beep* Link copied to clipboard! 📋');
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error sharing:', error);
      }
    }
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

  // Geographic Consent Dialog
  if (state.showGeoConsent && state.ageVerified && !state.geoConsentGiven) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 p-6 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-24 h-24 mb-6 bg-blue-100 rounded-full">
              <Globe className="w-16 h-16 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">🇺🇸 USA Location Verification</h1>
            <p className="text-lg text-gray-700 mb-4">
              This is a USA-only service. We need to verify you're in the United States.
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 mb-6 border-2 border-blue-200">
            <p className="text-gray-800 font-semibold mb-3">What We Check:</p>
            <ul className="text-sm text-gray-700 space-y-2 text-left">
              <li>✓ Your country only (via IP address)</li>
              <li>✓ One-time verification only</li>
              <li>✓ NOT your precise location within USA (no GPS)</li>
              <li>✓ IP address is NOT stored</li>
            </ul>
          </div>

          <div className="bg-amber-50 rounded-lg p-4 mb-6 border border-amber-200">
            <p className="text-amber-900 font-semibold mb-2">🇺🇸 USA-Only Access:</p>
            <p className="text-sm text-amber-800">
              DrinkBot3000 is only available to users physically located in the United States. We must verify your location for legal compliance and service restrictions.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleGeoConsentAccept}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transition shadow-lg"
            >
              I Consent to USA Location Verification
            </button>

            <button
              onClick={handleGeoConsentDecline}
              className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition"
            >
              I Do Not Consent
            </button>
          </div>

          <div className="mt-4 text-center">
            <a href="/privacy.html" target="_blank" className="text-xs text-blue-600 hover:underline">
              Read our Privacy Policy
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Geographic Verification Loading Screen
  if (state.geoVerifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 p-6 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 mb-6 bg-blue-100 rounded-full">
              <Globe className="w-16 h-16 text-blue-600 animate-pulse" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Verifying Location...</h1>
            <p className="text-lg text-gray-700 mb-6">
              Please wait while we verify your location.
            </p>
            <div className="flex justify-center mb-6">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
            <p className="text-sm text-gray-600">
              This usually takes just a few seconds.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Geographic Blocked Screen
  if (state.geoBlocked) {
    // Show different UI for technical errors vs actual geo-blocking
    if (state.geoTechnicalError) {
      // Technical Error Screen - with bypass option
      return (
        <div className="min-h-screen bg-gradient-to-br from-orange-900 via-orange-800 to-orange-900 p-6 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-24 h-24 mb-6 bg-orange-100 rounded-full">
                <AlertCircle className="w-16 h-16 text-orange-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">⚠️ Verification Service Issue</h1>
              <p className="text-lg text-gray-700 mb-4">
                We couldn't verify your location due to a technical issue.
              </p>
            </div>

            <div className="bg-orange-50 rounded-lg p-6 mb-6 border-2 border-orange-200">
              <p className="text-gray-800 font-bold text-lg mb-3">
                Technical Error Details:
              </p>
              <p className="text-gray-700 mb-4 text-sm">
                {state.geoError || 'All geolocation services are currently unavailable.'}
              </p>
              <p className="text-sm text-orange-800 font-semibold">
                This appears to be a temporary service issue, not a geographic restriction.
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-200">
              <p className="text-sm text-blue-900 font-semibold mb-2">
                What you can do:
              </p>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Wait a few minutes and try again (recommended)</li>
                <li>• Check your internet connection</li>
                <li>• Disable any ad blockers or privacy extensions</li>
                <li>• If you're in the USA, you can bypass this error</li>
              </ul>
            </div>

            <div className="bg-yellow-50 rounded-lg p-4 mb-4 border border-yellow-300">
              <p className="text-xs text-yellow-900 font-semibold mb-2">
                ⚠️ Important Notice:
              </p>
              <p className="text-xs text-yellow-800">
                DrinkBot3000 is only available in the USA. By bypassing this error, you confirm that you are physically located in the United States. Using this service from outside the USA may violate terms of service and local laws.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  // Bypass the technical error and proceed with manual verification
                  dispatch({ type: 'SET_FIELD', field: 'geoVerified', value: true });
                  dispatch({ type: 'SET_FIELD', field: 'geoBlocked', value: false });
                  dispatch({ type: 'SET_FIELD', field: 'geoCountry', value: 'USA (Manual Override)' });
                  localStorage.setItem('geoVerified', 'true');
                  localStorage.setItem('userCountry', 'USA (Manual Override)');
                  localStorage.setItem('userCountryCode', 'US');
                  dispatch({ type: 'SET_FIELD', field: 'showDisclaimerModal', value: true });
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                I'm in the USA - Continue Anyway
              </button>

              <button
                onClick={() => {
                  // Retry verification
                  dispatch({ type: 'SET_FIELD', field: 'geoBlocked', value: false });
                  dispatch({ type: 'SET_FIELD', field: 'geoTechnicalError', value: false });
                  dispatch({ type: 'SET_FIELD', field: 'geoError', value: null });
                  dispatch({ type: 'SET_FIELD', field: 'showGeoConsent', value: true });
                }}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                🔄 Try Again
              </button>

              <button
                onClick={() => {
                  // Clear all verification state and go back
                  localStorage.removeItem('ageVerified');
                  localStorage.removeItem('geoVerified');
                  localStorage.removeItem('userCountry');
                  localStorage.removeItem('userCountryCode');
                  localStorage.removeItem('geoConsentGiven');
                  dispatch({ type: 'SET_FIELD', field: 'ageVerified', value: false });
                  dispatch({ type: 'SET_FIELD', field: 'geoBlocked', value: false });
                  dispatch({ type: 'SET_FIELD', field: 'geoVerified', value: false });
                  dispatch({ type: 'SET_FIELD', field: 'geoTechnicalError', value: false });
                  dispatch({ type: 'SET_FIELD', field: 'showGeoConsent', value: false });
                  dispatch({ type: 'SET_FIELD', field: 'geoConsentGiven', value: false });
                  dispatch({ type: 'SET_FIELD', field: 'geoCountry', value: '' });
                }}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                ← Go Back
              </button>
            </div>
          </div>
        </div>
      );
    } else {
      // Actual Geo-Blocking Screen
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

            <div className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-200">
              <p className="text-sm text-blue-900 font-semibold mb-2">
                If you believe this is an error:
              </p>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Check if you're using a VPN or proxy routing through a non-US server</li>
                <li>• Disable VPN/proxy and reload the page</li>
                <li>• Ensure you're physically located in the United States</li>
                <li>• Contact support at drinkbot3000@gmail.com</li>
              </ul>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-600 mb-4">
                USA location verification is required for service access.
              </p>
            </div>

            <button
              onClick={() => {
                // Clear all verification state
                localStorage.removeItem('ageVerified');
                localStorage.removeItem('geoVerified');
                localStorage.removeItem('userCountry');
                localStorage.removeItem('userCountryCode');
                localStorage.removeItem('geoConsentGiven');
                // Reset state to start over
                dispatch({ type: 'SET_FIELD', field: 'ageVerified', value: false });
                dispatch({ type: 'SET_FIELD', field: 'geoBlocked', value: false });
                dispatch({ type: 'SET_FIELD', field: 'geoVerified', value: false });
                dispatch({ type: 'SET_FIELD', field: 'geoTechnicalError', value: false });
                dispatch({ type: 'SET_FIELD', field: 'showGeoConsent', value: false });
                dispatch({ type: 'SET_FIELD', field: 'geoConsentGiven', value: false });
                dispatch({ type: 'SET_FIELD', field: 'geoCountry', value: '' });
              }}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              ← Go Back
            </button>
          </div>
        </div>
      );
    }
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

            <div className="space-y-3">
              <button
                onClick={handleSafetyScreenNext}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-lg"
              >
                I Understand (1 of 4)
              </button>

              <button
                onClick={handleSafetyScreenDecline}
                className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition"
              >
                I Do Not Accept
              </button>
            </div>
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
                  ⚠️ Sleep Can Be Dangerous When Intoxicated
                </p>
                <ul className="text-left text-gray-700 space-y-3">
                  <li className="flex items-start">
                    <span className="text-red-600 font-bold mr-2">─¢</span>
                    <span>Risk of choking on vomit</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 font-bold mr-2">─¢</span>
                    <span>Alcohol poisoning symptoms worsen</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 font-bold mr-2">─¢</span>
                    <span>Dehydration and injuries from falls</span>
                  </li>
                </ul>
              </div>

              <div className="bg-green-50 rounded-lg p-4 mb-4 border border-green-200">
                <p className="font-semibold text-gray-800 mb-3">Plan Ahead:</p>
                <ul className="text-left text-sm text-gray-700 space-y-2">
                  <li>─œ“ Drink water throughout the evening</li>
                  <li>─œ“ Eat food before drinking</li>
                  <li>─œ“ Stay with friends who can monitor you</li>
                  <li>─œ“ Sleep on your side, not back</li>
                  <li>─œ“ Set multiple alarms</li>
                </ul>
              </div>

              <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                <p className="text-sm text-red-800 font-semibold">
                  If someone is passed out drunk, place them in the recovery position and seek medical help if needed.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleSafetyScreenNext}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-lg"
              >
                I Understand (2 of 4)
              </button>

              <button
                onClick={handleSafetyScreenDecline}
                className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition"
              >
                I Do Not Accept
              </button>
            </div>
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
                  ─˜ ï¸ DEADLY COMBINATION ─˜ ï¸
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
                    <span className="text-red-600 font-bold mr-2">─¢</span>
                    <span>Extreme sedation and respiratory depression</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 font-bold mr-2">─¢</span>
                    <span>Increased risk of overdose and death</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 font-bold mr-2">─¢</span>
                    <span>Severe impairment even at low doses</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 font-bold mr-2">─¢</span>
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

            <div className="space-y-3">
              <button
                onClick={handleSafetyScreenNext}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-lg"
              >
                I Understand (3 of 4)
              </button>

              <button
                onClick={handleSafetyScreenDecline}
                className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition"
              >
                I Do Not Accept
              </button>
            </div>
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
                  ─˜ ï¸ FATAL COMBINATION ─˜ ï¸
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
                    <span className="text-red-600 font-bold mr-2">─¢</span>
                    <span><strong>Respiratory Depression:</strong> Both slow breathing</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 font-bold mr-2">─¢</span>
                    <span><strong>You can stop breathing:</strong> Even in your sleep</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 font-bold mr-2">─¢</span>
                    <span><strong>Overdose risk:</strong> Dramatically increased</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 font-bold mr-2">─¢</span>
                    <span><strong>Death can occur quickly:</strong> Minutes, not hours</span>
                  </li>
                </ul>
              </div>

              <div className="bg-red-100 rounded-lg p-4 border-2 border-red-300 mb-4">
                <p className="text-red-900 font-bold text-sm mb-2">
                  🚨 NEVER MIX ALCOHOL WITH OPIATES 🚨
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

            <div className="space-y-3">
              <button
                onClick={handleSafetyScreenNext}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-lg"
              >
                I Understand - Continue to App (4 of 4)
              </button>

              <button
                onClick={handleSafetyScreenDecline}
                className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition"
              >
                I Do Not Accept
              </button>
            </div>
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
              Estimates only ─¢ Not medical advice ─¢ Drink responsibly ─¢ Never drink and drive
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

  // Main Tracker Interface
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
            <div className="flex items-center space-x-2">
              <button
                onClick={handleShare}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
                title="Share DrinkBot3000"
              >
                <Share2 className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={() => dispatch({ type: 'SET_FIELD', field: 'showHelp', value: true })}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
                title="How to use"
              >
                <HelpCircle className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={handleOpenSettings}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
                title="Settings"
              >
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
            </div>
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
                  {state.bac > 0 && status.margin && (
                    <div className="text-sm text-white/90 mb-2">
                      Range: {status.margin.min.toFixed(3)}% - {status.margin.max.toFixed(3)}%
                    </div>
                  )}
                  <div className="text-xl text-white font-medium mb-4">{status.label}</div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                    <p className="text-white text-sm">{status.message}</p>
                  </div>
                  {state.bac > 0 && status.margin && (
                    <div className="mt-3 text-xs text-white/80">
                      ⚠️ Margin of error: ±{(status.margin.max - state.bac).toFixed(3)}% (±{status.margin.marginPercent.toFixed(0)}%)
                    </div>
                  )}
                </div>
              </div>

              {/* Emergency Warning Banner */}
              {status.showEmergency && (
                <div className="bg-red-900 border-4 border-yellow-400 rounded-lg p-6 mb-6 animate-pulse shadow-2xl">
                  <div className="text-center">
                    <div className="text-4xl mb-3">🚨</div>
                    <h3 className="text-2xl font-bold text-white mb-3">MEDICAL EMERGENCY</h3>
                    <div className="bg-white rounded-lg p-4 mb-4">
                      <p className="text-red-900 font-bold text-lg mb-2">Signs of Alcohol Poisoning:</p>
                      <ul className="text-left text-sm text-red-900 space-y-1">
                        <li>• Confusion, stupor, unconsciousness</li>
                        <li>• Vomiting or seizures</li>
                        <li>• Slow breathing (less than 8 breaths/min)</li>
                        <li>• Irregular breathing (10+ seconds between breaths)</li>
                        <li>• Pale or blue-tinged skin</li>
                        <li>• Low body temperature</li>
                      </ul>
                    </div>
                    <a
                      href="tel:911"
                      className="block w-full bg-yellow-400 hover:bg-yellow-300 text-red-900 font-bold text-xl py-4 px-6 rounded-lg mb-3 transition"
                    >
                      📞 CALL 911 NOW
                    </a>
                    <p className="text-white text-sm">
                      DO NOT wait for all symptoms to appear. DO NOT leave person alone.
                    </p>
                  </div>
                </div>
              )}

              {/* Impairment History Warning */}
              {state.hasBeenImpaired && state.bac > 0 && (
                <div className="bg-red-100 border-2 border-red-500 rounded-lg p-4 mb-6 animate-pulse">
                  <div className="flex items-start">
                    <AlertTriangle className="w-6 h-6 text-red-600 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-red-900 font-bold mb-1">⚠️ IMPAIRMENT WARNING</p>
                      <p className="text-red-800 text-sm">You have exceeded the legal limit during this session. DO NOT DRIVE until your BAC reaches 0.00% and you feel fully recovered.</p>
                    </div>
                  </div>
                </div>
              )}

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
                      <div className="text-2xl font-bold text-gray-800">{calculateElapsedTime()}</div>
                      <div className="text-xs text-gray-500">Time Elapsed</div>
                    </div>
                    <div>
                      <Coffee className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                      <div className="text-2xl font-bold text-gray-800">{calculateSoberTime()}</div>
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

                {/* Saved Custom Drinks */}
                {state.savedCustomDrinks.length > 0 && (
                  <div className="border-t pt-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Your Custom Drinks</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {state.savedCustomDrinks.map((drink) => (
                        <div key={drink.id} className="relative">
                          <button
                            onClick={() => handleAddSavedCustomDrink(drink)}
                            className="w-full bg-indigo-100 hover:bg-indigo-200 text-indigo-900 p-3 rounded-lg font-medium transition text-left"
                          >
                            {drink.name}<br />
                            <span className="text-xs">{drink.oz} oz, {drink.abv}% ABV</span>
                          </button>
                          <button
                            onClick={() => handleDeleteCustomDrink(drink.id)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition text-xs"
                            title="Delete"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Custom Drink Input */}
                {state.showCustomDrink && (
                  <div className="border-t pt-4 space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Drink Name</label>
                      <input
                        type="text"
                        value={state.customDrinkName}
                        onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'customDrinkName', value: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="e.g., My IPA, Margarita"
                      />
                    </div>
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
                            addDrink(state.customDrinkName || 'custom', parseFloat(state.customDrinkOz), parseFloat(state.customDrinkABV));
                            dispatch({ type: 'SET_FIELD', field: 'customDrinkName', value: '' });
                            dispatch({ type: 'SET_FIELD', field: 'customDrinkOz', value: '' });
                            dispatch({ type: 'SET_FIELD', field: 'showCustomDrink', value: false });
                          }
                        }}
                        className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
                        disabled={!state.customDrinkOz || !state.customDrinkABV}
                      >
                        Add Once
                      </button>
                      <button
                        onClick={handleSaveCustomDrink}
                        className="flex-1 bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition"
                        disabled={!state.customDrinkName || !state.customDrinkOz || !state.customDrinkABV}
                        title="Save as reusable preset"
                      >
                        Save Preset
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        dispatch({ type: 'SET_FIELD', field: 'customDrinkName', value: '' });
                        dispatch({ type: 'SET_FIELD', field: 'customDrinkOz', value: '' });
                        dispatch({ type: 'SET_FIELD', field: 'customDrinkABV', value: '5' });
                        dispatch({ type: 'SET_FIELD', field: 'showCustomDrink', value: false });
                      }}
                      className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
                    >
                      Cancel
                    </button>
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
                      {state.drinks.map((drink, index) => (
                        <div key={drink.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <div className="font-medium text-gray-800">
                              {drink.type === 'beer' && '🍺 Beer'}
                              {drink.type === 'wine' && '🍷 Wine'}
                              {drink.type === 'shot' && '🥃 Shot'}
                              {drink.type === 'custom' && '🍹 Custom'}
                            </div>
                            <div className="text-xs text-gray-500">
                              {drink.oz}oz, {drink.abv}% ABV • {new Date(drink.time).toLocaleTimeString()}
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
                  Help us spread life-saving safety messages! Support development with $5 and share with friends.
                </p>

                <button
                  onClick={() => handleTip(5)}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 rounded-xl font-bold text-xl transition shadow-lg flex items-center justify-center space-x-2"
                  title="Opens Stripe payment page"
                >
                  <DollarSign className="w-6 h-6" />
                  <span>Support with $5</span>
                </button>

                <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200">
                  <p className="text-sm text-blue-900 font-semibold mb-2">
                    💡 Help us save lives!
                  </p>
                  <p className="text-xs text-blue-800 mb-2">
                    Your $5 keeps DrinkBot3000 free and spreads critical safety messages to more people.
                  </p>
                  <p className="text-xs text-indigo-800 font-medium">
                    Secure payments via Stripe with automatic tax collection
                  </p>
                </div>

                <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                  <p className="text-xs text-purple-900 font-semibold mb-1">
                    🚀 Spread the word!
                  </p>
                  <p className="text-xs text-purple-800">
                    Share DrinkBot3000 with friends to help grow our community and spread safety awareness!
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
                  <>
                    <div className={`rounded-lg p-6 ${getBACStatus().bgColor}`}>
                      <div className="text-center">
                        <div className="text-5xl font-bold text-white mb-2">
                          {state.calcBAC.toFixed(3)}%
                        </div>
                        {state.calcBAC > 0 && getBACStatus().margin && (
                          <div className="text-sm text-white/90 mb-2">
                            Range: {getBACStatus().margin.min.toFixed(3)}% - {getBACStatus().margin.max.toFixed(3)}%
                          </div>
                        )}
                        <div className="text-xl text-white font-medium mb-3">
                          {getBACStatus().label}
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                          <p className="text-white text-sm">
                            {getBACStatus().message}
                          </p>
                        </div>
                        {state.calcBAC > 0 && getBACStatus().margin && (
                          <div className="mt-3 text-xs text-white/80">
                            ⚠️ Margin of error: ±{(getBACStatus().margin.max - state.calcBAC).toFixed(3)}% (±{getBACStatus().margin.marginPercent.toFixed(0)}%)
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Emergency Warning for Calculator */}
                    {getBACStatus().showEmergency && (
                      <div className="bg-red-900 border-4 border-yellow-400 rounded-lg p-6 mt-4 animate-pulse shadow-2xl">
                        <div className="text-center">
                          <div className="text-4xl mb-3">🚨</div>
                          <h3 className="text-2xl font-bold text-white mb-3">MEDICAL EMERGENCY</h3>
                          <div className="bg-white rounded-lg p-4 mb-4">
                            <p className="text-red-900 font-bold text-lg mb-2">Signs of Alcohol Poisoning:</p>
                            <ul className="text-left text-sm text-red-900 space-y-1">
                              <li>• Confusion, stupor, unconsciousness</li>
                              <li>• Vomiting or seizures</li>
                              <li>• Slow breathing (less than 8 breaths/min)</li>
                              <li>• Irregular breathing (10+ seconds between breaths)</li>
                              <li>• Pale or blue-tinged skin</li>
                              <li>• Low body temperature</li>
                            </ul>
                          </div>
                          <a
                            href="tel:911"
                            className="block w-full bg-yellow-400 hover:bg-yellow-300 text-red-900 font-bold text-xl py-4 px-6 rounded-lg mb-3 transition"
                          >
                            📞 CALL 911 NOW
                          </a>
                          <p className="text-white text-sm">
                            DO NOT wait for all symptoms to appear. DO NOT leave person alone.
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                )}

                <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                  <p className="text-xs text-amber-800 mb-2">
                    <strong>Calculation Method:</strong> Uses scientifically-validated Widmark formula with conservative metabolism rate (0.010%/hr).
                  </p>
                  <p className="text-xs text-amber-800 mb-2">
                    <strong>Margin of Error:</strong> Individual metabolism varies ±30-50%. Actual BAC could be higher or lower than estimated range.
                  </p>
                  <p className="text-xs text-amber-800">
                    <strong>Factors Affecting Accuracy:</strong> Food intake, hydration, medications, genetics, liver function, body composition.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Help Modal */}
        {state.showHelp && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">How to Use DrinkBot3000</h2>
                <button
                  onClick={() => dispatch({ type: 'SET_FIELD', field: 'showHelp', value: false })}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                  <h3 className="font-semibold text-indigo-900 mb-2 flex items-center">
                    <Activity className="w-4 h-4 mr-2" />
                    Tracker Tab
                  </h3>
                  <ul className="text-sm text-indigo-800 space-y-2">
                    <li><strong>1.</strong> Log each drink as you consume it using the drink buttons</li>
                    <li><strong>2.</strong> Your BAC (Blood Alcohol Content) is estimated in real-time</li>
                    <li><strong>3.</strong> The color-coded display shows your current state:
                      <ul className="ml-4 mt-1 space-y-1">
                        <li>• <strong>Green:</strong> Sober</li>
                        <li>• <strong>Yellow:</strong> Buzzed (caution)</li>
                        <li>• <strong>Orange:</strong> Impaired (do not drive)</li>
                        <li>• <strong>Red:</strong> Dangerously intoxicated</li>
                      </ul>
                    </li>
                    <li><strong>4.</strong> View elapsed time and estimated time until sober</li>
                  </ul>
                </div>

                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <h3 className="font-semibold text-purple-900 mb-2 flex items-center">
                    <Calculator className="w-4 h-4 mr-2" />
                    Calculator Tab
                  </h3>
                  <p className="text-sm text-purple-800 mb-2">
                    Plan ahead or check what your BAC might be:
                  </p>
                  <ul className="text-sm text-purple-800 space-y-1">
                    <li>• Enter number of drinks and time period</li>
                    <li>• Get estimated BAC without logging drinks</li>
                    <li>• Useful for planning your night</li>
                  </ul>
                </div>

                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <h3 className="font-semibold text-green-900 mb-2">Common Drink Types</h3>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li><strong>Beer (12oz):</strong> ~5% ABV standard</li>
                    <li><strong>Wine (5oz):</strong> ~12% ABV</li>
                    <li><strong>Shot (1.5oz):</strong> ~40% ABV (vodka, whiskey, etc.)</li>
                    <li><strong>Cocktail:</strong> Typically 1-2 standard drinks</li>
                    <li><strong>Custom:</strong> Enter your own oz + ABV%</li>
                  </ul>
                </div>

                <div className="bg-red-50 rounded-lg p-4 border-2 border-red-300 mb-4">
                  <h3 className="font-semibold text-red-900 mb-2 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Dangerous BAC Levels
                  </h3>
                  <ul className="text-xs text-red-900 space-y-1">
                    <li><strong>0.15%:</strong> Severe impairment, blackout risk</li>
                    <li><strong>0.20%:</strong> Confusion, needs assistance</li>
                    <li><strong>0.25%:</strong> Alcohol poisoning risk</li>
                    <li><strong>0.30%:</strong> Life-threatening, loss of consciousness</li>
                    <li><strong>0.40%+:</strong> Coma, respiratory failure, death</li>
                    <li className="mt-2 pt-2 border-t border-red-200"><strong>⚠️ At dangerous levels, app shows CALL 911 button</strong></li>
                  </ul>
                </div>

                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200 mb-4">
                  <h3 className="font-semibold text-purple-900 mb-2">Margin of Error</h3>
                  <p className="text-xs text-purple-900 mb-2">
                    All BAC estimates include a calculated margin of error shown as a range (e.g., 0.04% - 0.06%).
                  </p>
                  <p className="text-xs text-purple-900">
                    <strong>Why?</strong> Metabolism varies ±30-50% between individuals. Food, hydration, genetics, and medications all affect accuracy.
                  </p>
                </div>

                <div className="bg-amber-50 rounded-lg p-4 border-2 border-amber-300">
                  <h3 className="font-semibold text-amber-900 mb-2 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Important Reminders
                  </h3>
                  <ul className="text-xs text-amber-900 space-y-1">
                    <li>• BAC estimates are approximations with ±margin of error</li>
                    <li>• Never drive if you've been drinking</li>
                    <li>• Everyone metabolizes alcohol differently</li>
                    <li>• When in doubt, wait it out or call a ride</li>
                    <li>• This app does not replace medical advice</li>
                  </ul>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h3 className="font-semibold text-blue-900 mb-2">Tips for Best Results</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Log drinks immediately when consumed</li>
                    <li>• Be honest about drink sizes and strength</li>
                    <li>• Check your profile in Settings (gender & weight affect BAC)</li>
                    <li>• Use the Calculator to plan ahead</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

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
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-800">Your Profile</h3>
                    {!state.settingsEditMode && (
                      <button
                        onClick={() => dispatch({ type: 'SET_FIELD', field: 'settingsEditMode', value: true })}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Edit
                      </button>
                    )}
                  </div>

                  {!state.settingsEditMode ? (
                    <div className="space-y-2 text-sm">
                      <p><strong>Gender:</strong> {state.gender === 'male' ? 'Male' : state.gender === 'female' ? 'Female' : 'Not set'}</p>
                      <p><strong>Weight:</strong> {state.weight ? `${state.weight} lbs` : 'Not set'}</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Gender
                        </label>
                        <div className="flex gap-3">
                          <button
                            onClick={() => dispatch({ type: 'SET_FIELD', field: 'settingsEditGender', value: 'male' })}
                            className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                              state.settingsEditGender === 'male'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            Male
                          </button>
                          <button
                            onClick={() => dispatch({ type: 'SET_FIELD', field: 'settingsEditGender', value: 'female' })}
                            className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                              state.settingsEditGender === 'female'
                                ? 'bg-pink-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            Female
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Weight (lbs)
                        </label>
                        <input
                          type="number"
                          value={state.settingsEditWeight}
                          onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'settingsEditWeight', value: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter weight (50-500)"
                          min="50"
                          max="500"
                        />
                        {state.weightError && (
                          <p className="text-sm text-red-600 mt-1">{state.weightError}</p>
                        )}
                      </div>

                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <p className="text-xs text-amber-900">
                          <strong>Warning:</strong> Changing your profile will reset your current BAC tracking and drink history.
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            dispatch({ type: 'SET_FIELD', field: 'settingsEditMode', value: false });
                            dispatch({ type: 'SET_FIELD', field: 'weightError', value: '' });
                          }}
                          className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-300 transition"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveSettings}
                          className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <a
                    href="/privacy.html"
                    target="_blank"
                    className="block w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition text-center"
                  >
                    <FileText className="w-4 h-4 inline mr-2" />
                    Privacy Policy
                  </a>

                  <a
                    href="/terms.html"
                    target="_blank"
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
