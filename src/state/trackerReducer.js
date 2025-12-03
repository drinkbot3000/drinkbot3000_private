/**
 * Tracker Reducer
 * Centralized state management for the tracker application
 */

// Initial state
export const initialState = {
  // User verification
  ageVerified: false,
  disclaimerAccepted: false,
  safetyScreensComplete: false,
  currentSafetyScreen: 0,

  // User profile
  setupComplete: false,
  gender: '',
  weight: '',

  // BAC tracking
  bac: 0,
  drinks: [],
  startTime: null,
  hasBeenImpaired: false,
  useSlowMetabolism: true,

  // Mode
  mode: '',
  estimateDrinks: '',
  estimateHours: '',

  // UI state
  activeTab: 'tracker',
  showSplash: true,
  showSettings: false,
  showHelp: false,
  showJoke: false,
  currentJoke: '',
  robotMessage: '',

  // Calculator
  calcDrinks: '',
  calcHours: '',
  calcBAC: null,

  // Custom drinks
  customDrinkOz: '',
  customDrinkABV: '5',
  customDrinkName: '',
  showCustomDrink: false,
  savedCustomDrinks: [],
  showDrinkHistory: false,

  // Modals
  showConfirmModal: false,
  confirmModalMessage: '',
  confirmModalAction: null,
  showDisclaimerModal: false,
  showRefundPolicy: false,
  showReceipt: false,

  // Receipts
  currentReceipt: null,
  receipts: [],

  // Validation errors
  weightError: '',
  tipError: '',
  customTipAmount: '',

  // Geographic verification
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
};

/**
 * Tracker Reducer
 * @param {Object} state - Current state
 * @param {Object} action - Action object
 * @returns {Object} New state
 */
export function trackerReducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        [action.field]: action.value,
      };

    case 'SET_MULTIPLE':
      return {
        ...state,
        ...action.values,
      };

    case 'ADD_DRINK':
      return {
        ...state,
        drinks: [...state.drinks, action.drink],
      };

    case 'REMOVE_DRINK':
      return {
        ...state,
        drinks: state.drinks.filter((d) => d.id !== action.id),
      };

    case 'UNDO_DRINK':
      return {
        ...state,
        drinks: state.drinks.slice(0, -1),
      };

    case 'CLEAR_DRINKS':
      return {
        ...state,
        drinks: [],
        bac: 0,
        startTime: null,
        hasBeenImpaired: false,
      };

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
