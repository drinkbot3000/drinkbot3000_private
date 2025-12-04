/**
 * Central Type Definitions for DrinkBot3000
 * All application types are defined here for reuse across the codebase
 */

// ============================================================================
// User Types
// ============================================================================

export type Gender = 'male' | 'female';

export interface UserProfile {
  weight: number; // in pounds
  gender: Gender;
  age: number;
}

// ============================================================================
// Drink Types
// ============================================================================

export interface Drink {
  id: string;
  name: string;
  standardDrinks: number;
  timestamp: number;
  customAbv?: number;
  customVolume?: number;
}

export interface PresetDrink {
  name: string;
  standardDrinks: number;
  icon?: string;
  description?: string;
}

export interface CustomDrink {
  id: string;
  name: string;
  volume: number; // in oz
  abv: number; // percentage
  createdAt: number;
}

// ============================================================================
// BAC Types
// ============================================================================

export interface BACCalculationParams {
  gender: Gender;
  weight: number;
  drinks: Drink[];
  startTime: number;
  currentTime?: number;
}

export interface BACResult {
  bac: number;
  peakBAC: number;
  soberTime: number | null;
  totalDrinks: number;
  isImpaired: boolean;
  hasBeenImpaired: boolean;
}

export interface BACStatus {
  level: 'safe' | 'warning' | 'danger' | 'extreme';
  message: string;
  colorClass: string;
}

// ============================================================================
// Validation Types
// ============================================================================

export interface ValidationResult {
  isValid: boolean;
  error: string;
}

export interface FormValidation {
  weight: ValidationResult;
  age: ValidationResult;
  gender: ValidationResult;
}

// ============================================================================
// Storage Types
// ============================================================================

export interface StorageData {
  userProfile?: UserProfile;
  drinks?: Drink[];
  customDrinks?: CustomDrink[];
  startTime?: number;
  hasBeenImpaired?: boolean;
  acceptedTerms?: boolean;
  [key: string]: unknown;
}

export type StorageKey = keyof StorageData | string;

// ============================================================================
// Geolocation Types
// ============================================================================

export interface GeolocationResult {
  isAllowed: boolean;
  country: string;
  countryCode: string;
  error?: string;
}

export interface GeolocationAPIResponse {
  country_name: string;
  country_code2: string;
  [key: string]: unknown;
}

// ============================================================================
// Receipt Types
// ============================================================================

export interface Receipt {
  id: string;
  timestamp: number;
  amount: number;
  drinkName: string;
  userEmail?: string;
}

export interface ReceiptData {
  receiptNumber: string;
  date: string;
  amount: string;
  description: string;
  userName?: string;
  userEmail?: string;
}

// ============================================================================
// State Types
// ============================================================================

export type AppScreen =
  | 'ageVerification'
  | 'safetyScreens'
  | 'geolocation'
  | 'disclaimer'
  | 'setup'
  | 'tracker'
  | 'calculator';

export type SafetyScreen = 'opiates' | 'benzodiazepines' | 'sleep' | 'dui';

export interface UIState {
  currentScreen: AppScreen;
  currentSafetyScreen: SafetyScreen | null;
  isLoading: boolean;
  error: string | null;
  showModal: boolean;
  modalType: string | null;
}

export interface TrackerState {
  // User data
  userProfile: UserProfile | null;

  // Drinks
  drinks: Drink[];
  customDrinks: CustomDrink[];

  // BAC tracking
  startTime: number | null;
  currentBAC: number;
  peakBAC: number;
  soberTime: number | null;
  hasBeenImpaired: boolean;

  // UI state
  currentScreen: AppScreen;
  currentSafetyScreen: SafetyScreen | null;
  safetyScreensCompleted: SafetyScreen[];

  // Modals
  showHelpModal: boolean;
  showSettingsModal: boolean;
  showReceiptModal: boolean;
  showRefundModal: boolean;
  showAgeRestrictionModal: boolean;

  // Flags
  acceptedTerms: boolean;
  ageVerified: boolean;
  geolocationVerified: boolean;
  manualGeolocationBypass: boolean;
}

// ============================================================================
// Action Types
// ============================================================================

export type TrackerAction =
  | { type: 'SET_USER_PROFILE'; payload: UserProfile }
  | { type: 'ADD_DRINK'; payload: Drink }
  | { type: 'REMOVE_DRINK'; payload: string }
  | { type: 'UPDATE_BAC'; payload: BACResult }
  | { type: 'SET_SCREEN'; payload: AppScreen }
  | { type: 'SET_SAFETY_SCREEN'; payload: SafetyScreen | null }
  | { type: 'COMPLETE_SAFETY_SCREEN'; payload: SafetyScreen }
  | { type: 'TOGGLE_MODAL'; payload: { modal: string; show: boolean } }
  | { type: 'RESET_SESSION' }
  | { type: 'SET_FIELD'; payload: { field: keyof TrackerState; value: unknown } };

// ============================================================================
// API Types
// ============================================================================

export interface APIError {
  message: string;
  code: string;
  status: number;
}

export interface APIResponse<T> {
  data?: T;
  error?: APIError;
  success: boolean;
}

// ============================================================================
// Constants Types
// ============================================================================

export interface BACConstants {
  MALE_WIDMARK: number;
  FEMALE_WIDMARK: number;
  METABOLISM_RATE: number;
  GRAMS_PER_STANDARD_DRINK: number;
  GRAMS_TO_OUNCES: number;
}

export interface Emojis {
  ROBOT: string;
  HEART: string;
  TOP_HAT: string;
  SHIELD: string;
  WATER: string;
  WIZARD: string;
  DROPLET: string;
}

// ============================================================================
// Component Props Types (common patterns)
// ============================================================================

export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export interface ButtonProps extends BaseComponentProps {
  onClick: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export interface CardProps extends BaseComponentProps {
  title?: string;
  subtitle?: string;
}

// ============================================================================
// Utility Types
// ============================================================================

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type Maybe<T> = T | null | undefined;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

// ============================================================================
// Type Guards
// ============================================================================

export const isValidGender = (value: unknown): value is Gender => {
  return value === 'male' || value === 'female';
};

export const isDrink = (value: unknown): value is Drink => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value &&
    'standardDrinks' in value &&
    'timestamp' in value
  );
};

export const isUserProfile = (value: unknown): value is UserProfile => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'weight' in value &&
    'gender' in value &&
    'age' in value &&
    typeof (value as UserProfile).weight === 'number' &&
    isValidGender((value as UserProfile).gender) &&
    typeof (value as UserProfile).age === 'number'
  );
};
