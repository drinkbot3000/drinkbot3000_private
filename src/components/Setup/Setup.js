/**
 * Setup Component
 * User profile setup with gender, weight, and mode selection
 */

import React from 'react';
import { User, Scale, Beer } from 'lucide-react';
import { Button } from '../common';
import { validateWeight } from '../../services';

/**
 * Setup Component
 * @param {Object} props
 * @param {string} props.mode - Selected mode ('live' or 'estimate')
 * @param {string} props.gender - Selected gender ('male' or 'female')
 * @param {string} props.weight - Weight in pounds
 * @param {string} props.weightError - Weight validation error
 * @param {string} props.estimateDrinks - Number of drinks for estimate mode
 * @param {string} props.estimateHours - Hours for estimate mode
 * @param {Function} props.onModeSelect - Handler for mode selection
 * @param {Function} props.onGenderChange - Handler for gender change
 * @param {Function} props.onWeightChange - Handler for weight change
 * @param {Function} props.onEstimateDrinksChange - Handler for estimate drinks change
 * @param {Function} props.onEstimateHoursChange - Handler for estimate hours change
 * @param {Function} props.onSubmit - Handler for form submission
 * @param {Function} props.onBack - Handler for going back to mode selection
 */
export function Setup({
  mode,
  gender,
  weight,
  weightError,
  estimateDrinks,
  estimateHours,
  onModeSelect,
  onGenderChange,
  onWeightChange,
  onEstimateDrinksChange,
  onEstimateHoursChange,
  onSubmit,
  onBack,
}) {
  const isFormValid =
    gender &&
    weight &&
    !weightError &&
    (mode !== 'estimate' || (estimateDrinks && estimateHours));

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

        {!mode ? (
          // Mode Selection
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 text-center mb-4">Choose Mode</h2>
            <button
              onClick={() => onModeSelect('live')}
              className="w-full bg-indigo-600 text-white py-4 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Live Tracking
              <p className="text-sm font-normal mt-1">Track drinks in real-time</p>
            </button>
            <button
              onClick={() => onModeSelect('estimate')}
              className="w-full bg-purple-600 text-white py-4 rounded-lg font-semibold hover:bg-purple-700 transition"
            >
              Quick Estimate
              <p className="text-sm font-normal mt-1">Already been drinking?</p>
            </button>
          </div>
        ) : (
          // Profile Setup Form
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="inline w-4 h-4 mr-1" />
                Gender
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => onGenderChange('male')}
                  className={`py-3 px-4 rounded-lg font-medium transition ${
                    gender === 'male' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  Male
                </button>
                <button
                  onClick={() => onGenderChange('female')}
                  className={`py-3 px-4 rounded-lg font-medium transition ${
                    gender === 'female' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'
                  }`}
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
                value={weight}
                onChange={(e) => onWeightChange(e.target.value)}
                placeholder="Enter your weight"
                className={`w-full px-4 py-3 border rounded-lg ${
                  weightError ? 'border-red-500' : 'border-gray-300'
                }`}
                min="50"
                max="500"
              />
              {weightError && <p className="text-red-600 text-sm mt-1">{weightError}</p>}
            </div>

            {mode === 'estimate' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Beer className="inline w-4 h-4 mr-1" />
                    Number of Drinks
                  </label>
                  <input
                    type="number"
                    value={estimateDrinks}
                    onChange={(e) => onEstimateDrinksChange(e.target.value)}
                    placeholder="How many drinks?"
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
                    value={estimateHours}
                    onChange={(e) => onEstimateHoursChange(e.target.value)}
                    placeholder="How many hours ago?"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    min="0"
                    step="0.5"
                  />
                </div>
              </>
            )}

            <Button
              variant="primary"
              size="md"
              fullWidth
              onClick={onSubmit}
              disabled={!isFormValid}
            >
              {mode === 'estimate' ? 'Calculate BAC' : 'Start Tracking'}
            </Button>

            <Button variant="secondary" size="md" fullWidth onClick={onBack}>
              ← Back to Mode Selection
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
