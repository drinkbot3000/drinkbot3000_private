/**
 * CalculatorView Component
 * Quick BAC calculator without tracking
 */

import React, { useState, useCallback } from 'react';
import { Beer, Smile, AlertCircle } from 'lucide-react';
import { calculateBACFromEstimate } from '../../utils/bacCalculations';
import { formatBAC, formatSoberTime, getBACStatus } from '../../utils/formatting';
import { BAC_CONSTANTS } from '../../constants';

/**
 * @param {Object} props
 * @param {string} props.gender - User's gender
 * @param {string} props.weight - User's weight
 * @param {Function} props.onTellJoke - Callback to show a joke
 * @param {Object} props.jokeState - Current joke state
 */
const CalculatorView = ({ gender, weight, onTellJoke, jokeState }) => {
  const [calcDrinks, setCalcDrinks] = useState('');
  const [calcHours, setCalcHours] = useState('');
  const [calcBAC, setCalcBAC] = useState(null);

  const handleCalculate = useCallback(() => {
    if (!gender || !weight || !calcDrinks || !calcHours) return;

    const result = calculateBACFromEstimate(calcDrinks, calcHours, weight, gender);
    setCalcBAC(result);
  }, [gender, weight, calcDrinks, calcHours]);

  const status = calcBAC !== null ? getBACStatus(calcBAC) : getBACStatus(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 pb-24">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-slate-700 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl" role="img" aria-label="Robot icon">
                  🤖
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Quick BAC Calculator
              </h2>
              <p className="text-gray-600">*beep boop* Let me calculate for you!</p>
            </div>

            {/* Input Form */}
            <div className="space-y-4">
              <div>
                <label htmlFor="calc-drinks" className="block text-sm font-medium text-gray-700 mb-2">
                  <Beer className="inline w-4 h-4 mr-1" aria-hidden="true" />
                  Number of Drinks
                </label>
                <input
                  id="calc-drinks"
                  type="number"
                  value={calcDrinks}
                  onChange={(e) => setCalcDrinks(e.target.value)}
                  placeholder="How many?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  min="0"
                  step="0.5"
                  aria-label="Enter number of drinks"
                />
              </div>

              <div>
                <label htmlFor="calc-hours" className="block text-sm font-medium text-gray-700 mb-2">
                  Hours Since First Drink
                </label>
                <input
                  id="calc-hours"
                  type="number"
                  value={calcHours}
                  onChange={(e) => setCalcHours(e.target.value)}
                  placeholder="How long ago?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  min="0"
                  step="0.5"
                  aria-label="Enter hours since first drink"
                />
              </div>

              <button
                onClick={handleCalculate}
                disabled={!calcDrinks || !calcHours}
                className="w-full bg-indigo-600 text-white py-4 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Calculate BAC
              </button>
            </div>

            {/* Results */}
            {calcBAC !== null && (
              <>
                <div className={`mt-6 ${status.bg} p-6 rounded-xl text-center`} role="region" aria-live="polite">
                  <h3 className="text-sm font-medium text-gray-600 mb-2">
                    Your Estimated BAC
                  </h3>
                  <div className={`text-5xl font-bold ${status.color} mb-2`}>
                    {formatBAC(calcBAC)}%
                  </div>
                  <div
                    className={`inline-block px-4 py-1 rounded-full ${status.color} bg-white bg-opacity-50 font-semibold`}
                    role="status"
                  >
                    {status.text}
                  </div>
                  {calcBAC > 0 && (
                    <div className="mt-4 text-sm text-gray-700">
                      <strong>Sober At:</strong> {formatSoberTime(calcBAC)}
                    </div>
                  )}
                </div>

                {/* Safety Message */}
                <div className="mt-4 bg-gradient-to-r from-slate-700 to-slate-800 text-white p-4 rounded-xl border-2 border-slate-600 shadow-lg">
                  <p className="text-center font-medium">
                    {calcBAC === 0
                      ? "*beeps approvingly* All clear, human! You're sober! ✨"
                      : calcBAC < BAC_CONSTANTS.LEGAL_LIMIT
                      ? "*whirrs thoughtfully* Even below the legal limit, impairment begins at any BAC. Do not drive! 🤖"
                      : "*concerned beeping* You are over the legal limit! Do not drive under any circumstances! 🎩"}
                  </p>
                </div>
              </>
            )}

            {/* Joke Button */}
            <button
              onClick={onTellJoke}
              className="w-full mt-6 bg-purple-600 text-white py-4 rounded-xl font-semibold hover:bg-purple-700 transition flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              aria-label="Tell me a joke"
            >
              <Smile className="w-6 h-6 mr-2" aria-hidden="true" />
              Tell Me a Joke
            </button>

            {/* Joke Display */}
            {jokeState.showJoke && (
              <div className="mt-4 bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-xl" role="status" aria-live="polite">
                <p className="text-center text-gray-800 font-medium">
                  {jokeState.currentJoke}
                </p>
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="p-6 bg-gray-50 border-t border-gray-200">
            <div className="text-xs text-gray-600 space-y-2">
              <p>
                <strong>Standard Drink:</strong> 12oz beer (5%), 5oz wine (12%), or 1.5oz spirits (40%)
              </p>
              <p>
                <strong>Metabolism:</strong> Average rate is {BAC_CONSTANTS.METABOLISM_RATE * 100}% per hour
              </p>
            </div>
          </div>

          {/* Warning */}
          <div className="p-6 bg-red-50 border-t border-red-200">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" aria-hidden="true" />
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

export default React.memo(CalculatorView);
