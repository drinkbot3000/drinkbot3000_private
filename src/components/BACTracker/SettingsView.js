/**
 * SettingsView Component
 * Settings page for user profile and custom drinks
 */

import React, { useState, useCallback } from 'react';
import { User, Weight, Beer, AlertCircle } from 'lucide-react';
import { GENDERS, DRINK_PRESETS, MODES } from '../../constants';
import { validateWeight } from '../../utils/bacCalculations';

/**
 * @param {Object} props
 * @param {string} props.gender - Current gender setting
 * @param {string} props.weight - Current weight setting
 * @param {string} props.mode - Current tracking mode
 * @param {Function} props.onGenderChange - Callback when gender changes
 * @param {Function} props.onWeightChange - Callback when weight changes
 * @param {Function} props.onAddCustomDrink - Callback to add custom drink
 * @param {Function} props.onClose - Callback to close settings
 */
const SettingsView = ({
  gender,
  weight,
  mode,
  onGenderChange,
  onWeightChange,
  onAddCustomDrink,
  onClose,
}) => {
  const [localWeight, setLocalWeight] = useState(weight);
  const [weightError, setWeightError] = useState('');
  const [customDrinkOz, setCustomDrinkOz] = useState('');
  const [customDrinkABV, setCustomDrinkABV] = useState('5');

  const handleWeightChange = useCallback((value) => {
    setLocalWeight(value);
    const error = validateWeight(value);
    setWeightError(error);
    if (!error) {
      onWeightChange(value);
    }
  }, [onWeightChange]);

  const handleAddCustomDrink = useCallback(() => {
    if (!customDrinkOz || !customDrinkABV) return;

    const standardDrinks = onAddCustomDrink(customDrinkOz, customDrinkABV);
    setCustomDrinkOz('');
    onClose();
  }, [customDrinkOz, customDrinkABV, onAddCustomDrink, onClose]);

  const abvPresets = Object.values(DRINK_PRESETS);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 pb-24">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-slate-700 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl" role="img" aria-label="Robot icon">
                  🤖
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Settings</h2>
              <p className="text-gray-600">*whirrs* Adjust your preferences!</p>
            </div>

            <div className="space-y-6">
              {/* Gender Setting */}
              <div role="group" aria-labelledby="settings-gender-label">
                <label id="settings-gender-label" className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="inline w-4 h-4 mr-1" aria-hidden="true" />
                  Gender
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => onGenderChange(GENDERS.MALE)}
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
                    onClick={() => onGenderChange(GENDERS.FEMALE)}
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

              {/* Weight Setting */}
              <div>
                <label htmlFor="settings-weight" className="block text-sm font-medium text-gray-700 mb-2">
                  <Weight className="inline w-4 h-4 mr-1" aria-hidden="true" />
                  Weight (lbs)
                </label>
                <input
                  id="settings-weight"
                  type="number"
                  value={localWeight}
                  onChange={(e) => handleWeightChange(e.target.value)}
                  placeholder="Enter your weight"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    weightError
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-indigo-500'
                  }`}
                  min="1"
                  aria-invalid={!!weightError}
                  aria-describedby={weightError ? 'settings-weight-error' : undefined}
                />
                {weightError && (
                  <p id="settings-weight-error" className="text-red-600 text-sm mt-1" role="alert">
                    {weightError}
                  </p>
                )}
              </div>

              {/* Custom Drink Section (Live Mode Only) */}
              {mode === MODES.LIVE && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Add Custom Drink
                  </h3>

                  {/* ABV Selection */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alcohol % (ABV)
                    </label>

                    {/* Preset Buttons */}
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {abvPresets.map(({ abv, label }) => (
                        <button
                          key={abv}
                          onClick={() => setCustomDrinkABV(String(abv))}
                          className={`py-2 px-3 rounded-lg font-medium text-sm transition focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                            customDrinkABV === String(abv)
                              ? 'bg-amber-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                          aria-pressed={customDrinkABV === String(abv)}
                          title={label}
                        >
                          {abv}%
                        </button>
                      ))}
                    </div>

                    {/* Custom ABV Input */}
                    <input
                      type="number"
                      value={customDrinkABV}
                      onChange={(e) => setCustomDrinkABV(e.target.value)}
                      placeholder="Or enter custom %"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                      min="0"
                      max="100"
                      step="0.5"
                      aria-label="Custom alcohol percentage"
                    />
                  </div>

                  {/* Volume Input */}
                  <div className="mb-4">
                    <label htmlFor="custom-drink-oz" className="block text-sm font-medium text-gray-700 mb-2">
                      Volume (oz)
                    </label>
                    <input
                      id="custom-drink-oz"
                      type="number"
                      value={customDrinkOz}
                      onChange={(e) => setCustomDrinkOz(e.target.value)}
                      placeholder="Enter ounces"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      min="0"
                      step="0.5"
                      aria-label="Drink volume in ounces"
                    />
                  </div>

                  {/* Add Button */}
                  <button
                    onClick={handleAddCustomDrink}
                    disabled={!customDrinkOz || !customDrinkABV}
                    className="w-full bg-amber-600 text-white py-3 rounded-xl font-semibold hover:bg-amber-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                  >
                    <Beer className="inline w-5 h-5 mr-2" aria-hidden="true" />
                    Add Custom Drink
                  </button>
                </div>
              )}

              {/* Close Button */}
              <button
                onClick={onClose}
                className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
              >
                Close Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(SettingsView);
