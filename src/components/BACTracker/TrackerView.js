/**
 * TrackerView Component
 * Main tracking view with BAC display, drink count, and controls
 */

import React, { useCallback } from 'react';
import { Beer, Smile, AlertCircle } from 'lucide-react';
import BACDisplay from './BACDisplay';
import { formatSoberTime } from '../../utils/formatting';
import { MODES } from '../../constants';

/**
 * @param {Object} props
 * @param {number} props.bac - Current BAC value
 * @param {Array} props.drinks - Array of drinks
 * @param {string} props.mode - Tracking mode
 * @param {string} props.gender - User's gender
 * @param {string} props.weight - User's weight
 * @param {string} props.estimateDrinks - Number of drinks in estimate mode
 * @param {Function} props.onAddDrink - Callback to add a drink
 * @param {Function} props.onUndoDrink - Callback to undo last drink
 * @param {Function} props.onTellJoke - Callback to show a joke
 * @param {Object} props.jokeState - Current joke state
 */
const TrackerView = ({
  bac,
  drinks,
  mode,
  gender,
  weight,
  estimateDrinks,
  onAddDrink,
  onUndoDrink,
  onTellJoke,
  jokeState,
}) => {
  const drinkCount = mode === MODES.ESTIMATE ? estimateDrinks : drinks.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 pb-24">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* BAC Display */}
          <BACDisplay bac={bac} />

          {/* Stats Section */}
          <div className="p-6 bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-2 gap-4 text-center mb-4">
              <div>
                <div className="text-2xl font-bold text-gray-800">{drinkCount}</div>
                <div className="text-sm text-gray-600">Drinks</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">
                  {formatSoberTime(bac)}
                </div>
                <div className="text-sm text-gray-600">Sober At</div>
              </div>
            </div>

            {/* Undo Button for Live Mode */}
            {mode === MODES.LIVE && drinks.length > 0 && (
              <button
                onClick={onUndoDrink}
                className="w-full bg-orange-100 text-orange-700 py-2 rounded-lg font-medium hover:bg-orange-200 transition text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                aria-label="Undo last drink"
              >
                Undo Last Drink
              </button>
            )}
          </div>

          {/* Action Buttons */}
          {mode === MODES.LIVE && (
            <div className="p-6 space-y-3">
              <button
                onClick={onAddDrink}
                className="w-full bg-indigo-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-indigo-700 transition flex items-center justify-center shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                aria-label="Add a standard drink"
              >
                <Beer className="w-6 h-6 mr-2" aria-hidden="true" />
                Add Drink
              </button>

              <button
                onClick={onTellJoke}
                className="w-full bg-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-purple-700 transition flex items-center justify-center shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                aria-label="Tell me a joke"
              >
                <Smile className="w-6 h-6 mr-2" aria-hidden="true" />
                Tell Me a Joke
              </button>
            </div>
          )}

          {mode === MODES.ESTIMATE && (
            <div className="p-6">
              <button
                onClick={onTellJoke}
                className="w-full bg-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-purple-700 transition flex items-center justify-center shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                aria-label="Tell me a joke"
              >
                <Smile className="w-6 h-6 mr-2" aria-hidden="true" />
                Tell Me a Joke
              </button>
            </div>
          )}

          {/* Joke Display */}
          {jokeState.showJoke && (
            <div className="px-6 pb-6">
              <div
                className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-xl border-2 border-purple-300 animate-pulse"
                role="status"
                aria-live="polite"
                aria-atomic="true"
              >
                <p className="text-center text-gray-800 font-medium">
                  {jokeState.currentJoke}
                </p>
              </div>
            </div>
          )}

          {/* Profile Info */}
          <div className="p-6 bg-gray-50">
            <div className="text-xs text-gray-600 space-y-2">
              <p>
                <strong>Profile:</strong> {gender === 'male' ? 'Male' : 'Female'}, {weight} lbs
              </p>
              <p>
                <strong>Standard Drink:</strong> 12oz beer (5%), 5oz wine (12%), or 1.5oz spirits (40%)
              </p>
            </div>
          </div>

          {/* Warning Notice */}
          <div className="p-6 bg-red-50 border-t border-red-200">
            <div className="flex items-start">
              <AlertCircle
                className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <div className="text-sm text-red-800">
                <strong>Legal Limit:</strong> 0.08% in most US states. This is an estimate only. Do not drive after drinking.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(TrackerView);
