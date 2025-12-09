# DrinkBot3000 Code Functions Reference

This document provides a comprehensive reference for all functions, services, hooks, and utilities in the DrinkBot3000 codebase.

---

## Table of Contents

1. [Services](#services)
   - [BAC Calculation Service](#bac-calculation-service)
   - [Validation Service](#validation-service)
   - [Storage Service](#storage-service)
   - [Geolocation Service](#geolocation-service)
   - [Receipt Service](#receipt-service)
   - [API Service](#api-service)
2. [Custom Hooks](#custom-hooks)
3. [Constants & Utilities](#constants--utilities)
4. [Type Definitions](#type-definitions)

---

## Services

All services are pure functions located in `src/services/`. They are side-effect free, fully testable, and provide strong type safety.

### BAC Calculation Service

**File:** `src/services/bacCalculation.service.ts`

Scientific Blood Alcohol Content calculation using the Widmark equation.

| Function | Parameters | Returns | Description |
|----------|------------|---------|-------------|
| `getBodyWaterConstant` | `gender: Gender` | `number` | Returns body water constant (0.68 for male, 0.55 for female) |
| `calculateLiveBAC` | `{drinks, weight, gender, useSlowMetabolism?}` | `number` | Calculates current BAC based on drinks consumed and time elapsed |
| `calculateBAC` | `{gender, weight, drinks, startTime, useSlowMetabolism?}` | `number` | Main BAC calculation function with session start time |
| `calculateSoberTime` | `currentBAC: number, useSlowMetabolism?: boolean` | `Date` | Calculates estimated time until BAC reaches 0.00% |
| `getBACStatus` | `bac: number` | `BACStatus` | Returns status level, message, color, and icon based on BAC |
| `calculateStandardDrinks` | `oz: number, abv: number` | `number` | Converts fluid ounces and ABV to standard drink count |
| `isValidBAC` | `bac: number` | `boolean` | Validates BAC is within realistic range (0-0.5) |

**Scientific Constants Used:**
- Metabolism Rate: 0.010% per hour (conservative estimate)
- Slow Metabolism Rate: 0.005% per hour
- Grams per Standard Drink: 14g
- Legal Limit: 0.08%

**BAC Status Levels:**
| BAC Range | Level | Message |
|-----------|-------|---------|
| 0.00% | safe | Sober - Safe to drive |
| < 0.02% | safe | Minimal impairment |
| < 0.05% | caution | Light impairment - Do not drive |
| < 0.08% | warning | Moderate impairment - Do not drive |
| < 0.15% | danger | Legally intoxicated - Do not drive |
| >= 0.15% | danger | Severe intoxication - Seek medical attention |

---

### Validation Service

**File:** `src/services/validation.service.ts`

Input validation functions for user data with error messages.

| Function | Parameters | Returns | Description |
|----------|------------|---------|-------------|
| `validateWeight` | `weight: string \| number` | `string` | Validates weight (50-500 lbs). Returns error message or empty string |
| `validateTipAmount` | `amount: string \| number` | `string` | Validates tip amount ($3-$1000). Returns error message or empty string |
| `validateCustomDrink` | `{oz, abv, name}` | `ValidationResult` | Validates custom drink inputs (name, oz < 100, abv < 100%) |
| `validateCalculatorInput` | `{drinks, hours}` | `ValidationResult` | Validates calculator inputs (drinks < 50, hours < 72) |
| `validateAge` | `age: number` | `boolean` | Validates age meets legal drinking age (21+) |

**ValidationResult Interface:**
```typescript
interface ValidationResult {
  isValid: boolean;
  error: string;
}
```

---

### Storage Service

**File:** `src/services/storage.service.ts`

Type-safe localStorage abstraction with error handling.

| Function | Parameters | Returns | Description |
|----------|------------|---------|-------------|
| `getItem<T>` | `key: string, defaultValue?: T` | `T \| null` | Retrieves and parses JSON from localStorage |
| `setItem<T>` | `key: string, value: T` | `boolean` | Stores JSON-serialized value. Handles quota exceeded errors |
| `removeItem` | `key: string` | `boolean` | Removes item from localStorage |
| `getBoolean` | `key: string, defaultValue?: boolean` | `boolean` | Retrieves boolean value from localStorage |
| `setBoolean` | `key: string, value: boolean` | `boolean` | Stores boolean value in localStorage |
| `clearAll` | none | `boolean` | Clears all localStorage data |
| `isAvailable` | none | `boolean` | Tests if localStorage is accessible |

**Storage Keys:**
```typescript
STORAGE_KEYS = {
  BAC_TRACKER_DATA: 'bacTrackerData',
  AGE_VERIFIED: 'ageVerified',
  DISCLAIMER_ACCEPTED: 'disclaimerAccepted',
  SAFETY_SCREENS_COMPLETE: 'safetyScreensComplete',
  RECEIPTS: 'bacTrackerReceipts',
  GEO_VERIFIED: 'geoVerified',
  GEO_COUNTRY: 'userCountry',
  GEO_COUNTRY_CODE: 'userCountryCode',
  GEO_CONSENT_GIVEN: 'geoConsentGiven',
  PWA_INSTALL_DISMISSED: 'pwa-install-dismissed',
}
```

---

### Geolocation Service

**File:** `src/services/geolocation.service.ts`

Geographic restriction verification for USA-only access.

| Function | Parameters | Returns | Description |
|----------|------------|---------|-------------|
| `checkGeographicRestriction` | none | `Promise<GeographicRestrictionResult>` | Verifies user is in USA using multiple fallback APIs |
| `resetGeographicVerification` | none | `void` | Clears cached verification (for testing/debugging) |
| `getStoredCountry` | none | `StoredCountryInfo \| null` | Returns cached country info if previously verified |

**GeographicRestrictionResult Interface:**
```typescript
interface GeographicRestrictionResult {
  allowed: boolean;           // true if user is in USA
  country: string;            // Country name
  countryCode?: string;       // ISO country code
  error: string | null;       // Error message if failed
  technicalError?: boolean;   // true if failure was technical (not geo-block)
  errorDetails?: string[];    // Detailed error information
  warning?: string;           // Warning message
  rateLimited?: boolean;      // true if rate limited
  cached?: boolean;           // true if result from cache
  service?: string;           // Which API service was used
}
```

**Features:**
- Uses multiple fallback geolocation APIs (ipapi, ip-api, ipwhois)
- 5-minute rate limit caching
- Privacy-focused: IP address is NOT stored, only country code
- Distinguishes between technical errors and geographic blocks

---

### Receipt Service

**File:** `src/services/receipt.service.ts`

Payment receipt generation and management.

| Function | Parameters | Returns | Description |
|----------|------------|---------|-------------|
| `generateReceipt` | `amount: number, paymentMethod?: string` | `Receipt` | Creates a new receipt with unique ID and Stripe fee calculation |
| `formatReceiptText` | `receipt: Receipt` | `string` | Formats receipt as plain text for download |
| `downloadReceipt` | `receipt: Receipt` | `void` | Triggers browser download of receipt as .txt file |
| `isRefundable` | `receipt: Receipt` | `boolean` | Checks if receipt is within 30-day refund window |
| `getDaysUntilRefundExpires` | `receipt: Receipt` | `number` | Returns days remaining in refund window |

**Receipt Interface:**
```typescript
interface Receipt {
  id: string;              // Unique ID (format: DBT-{timestamp}-{random})
  date: string;            // ISO date string
  amount: number;          // Payment amount
  stripeFee: string;       // Calculated Stripe fee (2.9% + $0.30)
  netAmount: string;       // Amount after fees
  paymentMethod: string;   // Payment method (default: 'Stripe')
  description: string;     // Receipt description
  status: string;          // Payment status
  refundableUntil: string; // ISO date for refund expiration
}
```

---

### API Service

**File:** `src/services/api.service.ts`

Generic HTTP client with timeout, retry logic, and error handling.

| Function | Parameters | Returns | Description |
|----------|------------|---------|-------------|
| `request<T>` | `url: string, options?: RequestOptions` | `Promise<T>` | Makes HTTP request with timeout and error handling |
| `get<T>` | `url: string, options?: RequestOptions` | `Promise<T>` | Convenience method for GET requests |
| `post<T>` | `url: string, body: any, options?: RequestOptions` | `Promise<T>` | Convenience method for POST requests |
| `requestWithRetry<T>` | `url, options?, maxRetries?, shouldRetry?` | `Promise<T>` | Makes request with exponential backoff retry logic |

**RequestOptions Interface:**
```typescript
interface RequestOptions {
  method?: string;                    // HTTP method (default: 'GET')
  headers?: Record<string, string>;   // Request headers
  body?: any;                         // Request body (JSON serialized)
  timeout?: number;                   // Timeout in ms (default: 8000)
  signal?: AbortSignal | null;        // Abort signal
  credentials?: boolean;              // Include credentials
  cache?: RequestCache;               // Cache mode (default: 'no-cache')
}
```

**ApiError Class:**
```typescript
class ApiError extends Error {
  statusCode: number;      // HTTP status code (0 for network errors)
  response: Response | null;
}
```

**Features:**
- Automatic timeout handling (default 8 seconds)
- Exponential backoff retry (1s, 2s, 4s...)
- Does not retry rate limits (429) or client errors (4xx)
- User-friendly error messages for common HTTP status codes

---

## Custom Hooks

Located in `src/hooks/`. React hooks that orchestrate business logic and state management.

### useBACCalculation

**File:** `src/hooks/useBACCalculation.ts`

Manages real-time BAC calculation updates.

```typescript
useBACCalculation({ dispatch, state }: UseBACCalculationParams): void
```

**Behavior:**
- Runs BAC calculation every 1 second
- Uses refs to avoid unnecessary effect re-runs
- Only dispatches updates when BAC changes by >= 0.001
- Tracks impairment state (at or above 0.08% legal limit)
- Validates BAC results before dispatching

---

### useDrinkManagement

**File:** `src/hooks/useDrinkManagement.ts`

Handles all drink-related operations.

```typescript
useDrinkManagement(state, actions, showRobotMessage): DrinkManagementHandlers
```

**Returns:**
| Handler | Description |
|---------|-------------|
| `addDrink(name?, oz?, abv?)` | Adds a drink to the tracker |
| `clearDrinks()` | Removes all drinks from history |
| `deleteDrink(id)` | Removes a specific drink |
| `undoDrink()` | Undoes the last drink addition |
| `handleSaveCustomDrink()` | Saves a custom drink definition |
| `handleDeleteCustomDrink(id)` | Deletes a saved custom drink |
| `handleAddCustomDrink()` | Adds the current custom drink to tracker |
| `handleCancelCustomDrink()` | Cancels custom drink creation |

---

### usePersistence

**File:** `src/hooks/usePersistence.ts`

Synchronizes state to localStorage on changes.

```typescript
usePersistence(state: TrackerState): void
```

**Behavior:**
- Automatically saves state to localStorage when it changes
- Loads state from localStorage on mount
- Handles storage errors gracefully

---

### useOnboarding

**File:** `src/hooks/useOnboarding.ts`

Manages the multi-step onboarding flow.

```typescript
useOnboarding(state, actions): OnboardingHandlers
```

**Handles:**
- Age verification (21+ check)
- Geographic verification (USA-only)
- Disclaimer acceptance
- Safety screens progression (4 mandatory screens)

---

### useSettings

**File:** `src/hooks/useSettings.ts`

Manages settings dialog state and operations.

```typescript
useSettings(state, actions): SettingsHandlers
```

**Returns:**
- `handleEditSettings()` - Enter edit mode
- `handleSaveSettings()` - Save settings changes
- `handleCancelSettings()` - Cancel without saving

---

### useSetup

**File:** `src/hooks/useSetup.ts`

Manages user profile setup.

```typescript
useSetup(state, actions): SetupHandlers
```

**Handles:**
- Gender selection
- Weight input and validation
- Setup completion

---

### useRobotMessage

**File:** `src/hooks/useRobotMessage.ts`

Displays robot personality messages with auto-dismiss.

```typescript
useRobotMessage(setField): (message: string) => void
```

**Returns:** Function to show a message that auto-dismisses after 5 seconds.

---

### useLocalStorage

**File:** `src/hooks/useLocalStorage.ts`

Generic localStorage hook with state synchronization.

```typescript
useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void]
```

**Returns:** Tuple of current value and setter function (similar to useState).

---

## Constants & Utilities

**File:** `src/constants/index.ts`

### Scientific Constants

```typescript
CONSTANTS = {
  METABOLISM_RATE: 0.010,          // BAC elimination per hour (conservative)
  SLOW_METABOLISM_RATE: 0.005,     // Slow metabolism rate
  GRAMS_PER_STANDARD_DRINK: 14,    // Grams of alcohol per standard drink
  LBS_TO_KG: 0.453592,             // Pounds to kilograms conversion
  MALE_BODY_WATER: 0.68,           // Male body water constant
  FEMALE_BODY_WATER: 0.55,         // Female body water constant
  STANDARD_DRINK_OZ: 0.6,          // Fluid oz of pure alcohol in standard drink
  LEGAL_LIMIT: 0.08,               // Legal BAC limit for driving
  MIN_WEIGHT: 50,                  // Minimum valid weight (lbs)
  MAX_WEIGHT: 500,                 // Maximum valid weight (lbs)
  ROBOT_MESSAGE_DURATION: 5000,    // Robot message display time (ms)
  JOKE_DURATION: 7000,             // Joke display time (ms)
  MIN_TIP_AMOUNT: 3,               // Minimum tip amount ($)
  LEGAL_DRINKING_AGE: 21,          // Legal drinking age (USA)
  REFUND_WINDOW_DAYS: 30,          // Refund eligibility window
}
```

### Configuration

```typescript
CONFIG = {
  STRIPE_PAYMENT_LINK: string,  // Stripe payment URL
  SUPPORT_EMAIL: string,        // Support email address
}
```

### Utility Functions

| Function | Returns | Description |
|----------|---------|-------------|
| `getRandomJoke()` | `string` | Returns a random family-friendly joke |
| `getRandomGreeting()` | `string` | Returns a random robot greeting |
| `getRandomComment()` | `string` | Returns a random robot comment |

### Emojis

```typescript
EMOJIS = {
  ROBOT: '🤖',
  HEART: '💚',
  TOP_HAT: '🎩',
  SHIELD: '🛡️',
  WATER: '💧',
  WIZARD: '🧙',
  DROPLET: '💦',
}
```

---

## Type Definitions

**File:** `src/types/index.ts`

### Core Types

```typescript
type Gender = 'male' | 'female';

interface Drink {
  id: string;
  name: string;
  standardDrinks: number;
  timestamp: number;
}

interface UserProfile {
  gender: Gender | null;
  weight: number | null;
}

interface TrackerState {
  currentBAC: number;
  peakBAC: number;
  drinks: Drink[];
  startTime: number | null;
  hasBeenImpaired: boolean;
  userProfile: UserProfile;
  setupComplete: boolean;
  // ... additional UI state fields
}

interface ValidationResult {
  isValid: boolean;
  error: string;
}
```

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     React Components                         │
│    (TrackerInterface, OnboardingFlow, SafetyScreens, etc.)  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Custom Hooks                             │
│  (useBACCalculation, useDrinkManagement, usePersistence)    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Context Stores                            │
│    (BACStore, UserStore, UIStore, ModalStore, etc.)         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Pure Services                              │
│  (bacCalculation, validation, storage, geolocation, etc.)   │
└─────────────────────────────────────────────────────────────┘
```

**Data Flow:**
1. Components dispatch actions via hooks
2. Hooks call services for business logic
3. Services return pure results (no side effects)
4. State is updated in Context stores
5. `usePersistence` syncs state to localStorage

---

## Related Documentation

- [Architecture Guide](./ARCHITECTURE.md) - System design and patterns
- [Development Guide](./DEVELOPMENT.md) - Development workflow
- [Quick Start](./QUICK_START.md) - Getting started in 5 minutes
- [Troubleshooting](./TROUBLESHOOTING.md) - Common issues and solutions
