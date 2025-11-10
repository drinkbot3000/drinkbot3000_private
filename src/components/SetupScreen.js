import React, { useCallback } from 'react';
import { User, Scale, Beer, AlertCircle } from 'lucide-react';
import { validateWeight, validateDrinkCount, validateHours, validateGender } from '../utils/security';

/**
 * SetupScreen Component
 * Handles initial user setup with ARIA labels and security validation
 */
const SetupScreen = ({
  mode,
  gender,
  weight,
  weightError,
  estimateDrinks,
  estimateHours,
  onFieldChange,
  onModeSelect,
  onSetup,
  onBack,
  constants,
}) => {
  const handleWeightChange = useCallback((e) => {
    const value = e.target.value;
    onFieldChange('weight', value);

    // Validate weight with security utilities
    const validation = validateWeight(value);
    onFieldChange('weightError', validation.error || '');
  }, [onFieldChange]);

  const handleEstimateDrinksChange = useCallback((e) => {
    const value = e.target.value;
    const validation = validateDrinkCount(value);
    if (validation.isValid || value === '') {
      onFieldChange('estimateDrinks', value);
    }
  }, [onFieldChange]);

  const handleEstimateHoursChange = useCallback((e) => {
    const value = e.target.value;
    const validation = validateHours(value);
    if (validation.isValid || value === '') {
      onFieldChange('estimateHours', value);
    }
  }, [onFieldChange]);

  const handleGenderChange = useCallback((selectedGender) => {
    const validated = validateGender(selectedGender);
    if (validated) {
      onFieldChange('gender', validated);
    }
  }, [onFieldChange]);

  const isSetupDisabled =
    !gender ||
    !weight ||
    weightError ||
    (mode === 'estimate' && (!estimateDrinks || !estimateHours));

  // Mode selection screen
  if (!mode) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 flex items-center justify-center"
        role="main"
        aria-labelledby="mode-select-title"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <div
              className="w-24 h-24 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4 overflow-hidden"
              aria-hidden="true"
            >
              <img
                src="/path/to/your/icon.png"
                alt=""
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <span className="text-6xl" style={{ display: 'none' }}>🤖</span>
            </div>
            <h1 id="mode-select-title" className="text-3xl font-bold text-gray-800 mb-2">
              DrinkBot3000
            </h1>
            <p className="text-gray-600">Track your blood alcohol content</p>
          </div>

          <div className="space-y-4" role="group" aria-labelledby="mode-select-heading">
            <h2 id="mode-select-heading" className="text-lg font-semibold text-gray-800 text-center mb-4">
              Choose Mode
            </h2>
            <button
              onClick={() => onModeSelect('live')}
              className="w-full bg-indigo-600 text-white py-4 rounded-lg font-semibold hover:bg-indigo-700 transition focus:outline-none focus:ring-4 focus:ring-indigo-300"
              aria-label="Select Live Tracking mode to track drinks in real-time"
            >
              Live Tracking
              <p className="text-sm font-normal mt-1">Track drinks in real-time</p>
            </button>
            <button
              onClick={() => onModeSelect('estimate')}
              className="w-full bg-purple-600 text-white py-4 rounded-lg font-semibold hover:bg-purple-700 transition focus:outline-none focus:ring-4 focus:ring-purple-300"
              aria-label="Select Quick Estimate mode if you have already been drinking"
            >
              Quick Estimate
              <p className="text-sm font-normal mt-1">Already been drinking?</p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Setup form screen
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 flex items-center justify-center"
      role="main"
      aria-labelledby="setup-title"
    >
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div
            className="w-24 h-24 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4 overflow-hidden"
            aria-hidden="true"
          >
            <img
              src="/path/to/your/icon.png"
              alt=""
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <span className="text-6xl" style={{ display: 'none' }}>🤖</span>
          </div>
          <h1 id="setup-title" className="text-3xl font-bold text-gray-800 mb-2">
            DrinkBot3000
          </h1>
          <p className="text-gray-600">Track your blood alcohol content</p>
        </div>

        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            onSetup();
          }}
          aria-label="User setup form"
        >
          <div>
            <label
              id="gender-label"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              <User className="inline w-4 h-4 mr-1" aria-hidden="true" />
              Gender
            </label>
            <div
              className="grid grid-cols-2 gap-3"
              role="radiogroup"
              aria-labelledby="gender-label"
              aria-required="true"
            >
              <button
                type="button"
                onClick={() => handleGenderChange('male')}
                className={`py-3 px-4 rounded-lg font-medium transition focus:outline-none focus:ring-4 focus:ring-indigo-300 ${
                  gender === 'male'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
                role="radio"
                aria-checked={gender === 'male'}
                aria-label="Select male gender"
              >
                Male
              </button>
              <button
                type="button"
                onClick={() => handleGenderChange('female')}
                className={`py-3 px-4 rounded-lg font-medium transition focus:outline-none focus:ring-4 focus:ring-indigo-300 ${
                  gender === 'female'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
                role="radio"
                aria-checked={gender === 'female'}
                aria-label="Select female gender"
              >
                Female
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="weight-input"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              <Scale className="inline w-4 h-4 mr-1" aria-hidden="true" />
              Weight (lbs)
            </label>
            <input
              id="weight-input"
              type="number"
              value={weight}
              onChange={handleWeightChange}
              placeholder="Enter your weight"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-4 ${
                weightError
                  ? 'border-red-500 focus:ring-red-300'
                  : 'border-gray-300 focus:ring-indigo-300'
              }`}
              min={constants?.MIN_WEIGHT || 50}
              max={constants?.MAX_WEIGHT || 500}
              aria-required="true"
              aria-invalid={!!weightError}
              aria-describedby={weightError ? 'weight-error' : undefined}
            />
            {weightError && (
              <p
                id="weight-error"
                className="text-red-600 text-sm mt-1"
                role="alert"
                aria-live="polite"
              >
                {weightError}
              </p>
            )}
          </div>

          {mode === 'estimate' && (
            <>
              <div>
                <label
                  htmlFor="drinks-input"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  <Beer className="inline w-4 h-4 mr-1" aria-hidden="true" />
                  Number of Drinks
                </label>
                <input
                  id="drinks-input"
                  type="number"
                  value={estimateDrinks}
                  onChange={handleEstimateDrinksChange}
                  placeholder="How many drinks?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-indigo-300"
                  min="0"
                  step="0.5"
                  aria-required="true"
                />
              </div>
              <div>
                <label
                  htmlFor="hours-input"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Hours Since First Drink
                </label>
                <input
                  id="hours-input"
                  type="number"
                  value={estimateHours}
                  onChange={handleEstimateHoursChange}
                  placeholder="How many hours ago?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-indigo-300"
                  min="0"
                  step="0.5"
                  aria-required="true"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isSetupDisabled}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-indigo-300"
            aria-label={mode === 'estimate' ? 'Calculate BAC estimate' : 'Start tracking drinks'}
          >
            {mode === 'estimate' ? 'Calculate BAC' : 'Start Tracking'}
          </button>

          <button
            type="button"
            onClick={onBack}
            className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-300 transition focus:outline-none focus:ring-4 focus:ring-gray-300"
            aria-label="Go back to mode selection"
          >
            Back
          </button>
        </form>

        <div
          className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200"
          role="alert"
          aria-label="Safety warning"
        >
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-amber-600 mr-2 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-sm text-amber-800">This app provides estimates only. Never drink and drive.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupScreen;
