/**
 * SetupForm Component
 * Initial setup form for gender, weight, and mode selection
 */

import React, { useState, useCallback } from 'react';
import { User, Weight, Beer, AlertCircle } from 'lucide-react';
import { MODES, GENDERS } from '../../constants';
import { validateWeight } from '../../utils/bacCalculations';

/**
 * @param {Object} props
 * @param {Function} props.onComplete - Callback when setup is complete
 */
const SetupForm = ({ onComplete }) => {
  const [mode, setMode] = useState('');
  const [gender, setGender] = useState('');
  const [weight, setWeight] = useState('');
  const [estimateDrinks, setEstimateDrinks] = useState('');
  const [estimateHours, setEstimateHours] = useState('');
  const [weightError, setWeightError] = useState('');

  const handleWeightChange = useCallback((value) => {
    setWeight(value);
    const error = validateWeight(value);
    setWeightError(error);
  }, []);

  const handleSubmit = useCallback(() => {
    const error = validateWeight(weight);
    if (error) {
      setWeightError(error);
      return;
    }

    if (!gender || !weight) return;
    if (mode === MODES.ESTIMATE && (!estimateDrinks || !estimateHours)) return;

    onComplete({
      mode,
      gender,
      weight,
      estimateDrinks,
      estimateHours,
    });
  }, [mode, gender, weight, estimateDrinks, estimateHours, onComplete]);

  const handleReset = useCallback(() => {
    setMode('');
    setGender('');
    setWeight('');
    setEstimateDrinks('');
    setEstimateHours('');
    setWeightError('');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-6xl" role="img" aria-label="Robot icon">
              🤖
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            DrinkBot3000
          </h1>
          <p className="text-gray-600">Track your blood alcohol content</p>
        </div>

        {!mode ? (
          <div className="space-y-4" role="group" aria-labelledby="mode-selection-heading">
            <h2 id="mode-selection-heading" className="text-lg font-semibold text-gray-800 text-center mb-4">
              Choose Mode
            </h2>

            <button
              onClick={() => setMode(MODES.LIVE)}
              className="w-full bg-indigo-600 text-white py-4 rounded-lg font-semibold hover:bg-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              aria-label="Select live tracking mode"
            >
              Live Tracking
              <p className="text-sm font-normal mt-1">Track drinks in real-time</p>
            </button>

            <button
              onClick={() => setMode(MODES.ESTIMATE)}
              className="w-full bg-purple-600 text-white py-4 rounded-lg font-semibold hover:bg-purple-700 transition focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              aria-label="Select quick estimate mode"
            >
              Quick Estimate
              <p className="text-sm font-normal mt-1">Already been drinking?</p>
            </button>
          </div>
        ) : (
          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            {/* Gender Selection */}
            <div role="group" aria-labelledby="gender-label">
              <label id="gender-label" className="block text-sm font-medium text-gray-700 mb-2">
                <User className="inline w-4 h-4 mr-1" aria-hidden="true" />
                Gender
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setGender(GENDERS.MALE)}
                  className={`py-3 px-4 rounded-lg font-medium transition focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    gender === GENDERS.MALE
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  aria-pressed={gender === GENDERS.MALE}
                >
                  Male
                </button>
                <button
                  type="button"
                  onClick={() => setGender(GENDERS.FEMALE)}
                  className={`py-3 px-4 rounded-lg font-medium transition focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    gender === GENDERS.FEMALE
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  aria-pressed={gender === GENDERS.FEMALE}
                >
                  Female
                </button>
              </div>
            </div>

            {/* Weight Input */}
            <div>
              <label htmlFor="weight-input" className="block text-sm font-medium text-gray-700 mb-2">
                <Weight className="inline w-4 h-4 mr-1" aria-hidden="true" />
                Weight (lbs)
              </label>
              <input
                id="weight-input"
                type="number"
                value={weight}
                onChange={(e) => handleWeightChange(e.target.value)}
                placeholder="Enter your weight"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                  weightError
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-indigo-500'
                }`}
                min="1"
                aria-invalid={!!weightError}
                aria-describedby={weightError ? 'weight-error' : undefined}
              />
              {weightError && (
                <p id="weight-error" className="text-red-600 text-sm mt-1" role="alert">
                  {weightError}
                </p>
              )}
            </div>

            {/* Estimate Mode Fields */}
            {mode === MODES.ESTIMATE && (
              <>
                <div>
                  <label htmlFor="drinks-input" className="block text-sm font-medium text-gray-700 mb-2">
                    <Beer className="inline w-4 h-4 mr-1" aria-hidden="true" />
                    Number of Drinks
                  </label>
                  <input
                    id="drinks-input"
                    type="number"
                    value={estimateDrinks}
                    onChange={(e) => setEstimateDrinks(e.target.value)}
                    placeholder="How many drinks?"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    min="0"
                    step="0.5"
                  />
                </div>

                <div>
                  <label htmlFor="hours-input" className="block text-sm font-medium text-gray-700 mb-2">
                    Hours Since First Drink
                  </label>
                  <input
                    id="hours-input"
                    type="number"
                    value={estimateHours}
                    onChange={(e) => setEstimateHours(e.target.value)}
                    placeholder="How many hours ago?"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    min="0"
                    step="0.5"
                  />
                </div>
              </>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={
                !gender ||
                !weight ||
                weightError ||
                (mode === MODES.ESTIMATE && (!estimateDrinks || !estimateHours))
              }
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {mode === MODES.ESTIMATE ? 'Calculate BAC' : 'Start Tracking'}
            </button>

            {/* Back Button */}
            <button
              type="button"
              onClick={handleReset}
              className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-300 transition focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            >
              Back
            </button>
          </form>
        )}

        {/* Warning Notice */}
        <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-amber-600 mr-2 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-sm text-amber-800">
              This app provides estimates only. Never drink and drive.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupForm;
