/**
 * DrinkHistoryList Component
 * Displays list of consumed drinks with management options
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Trash2, RefreshCw } from 'lucide-react';
import { formatTime } from '../../utils';

/**
 * DrinkHistoryList Component
 * @param {Object} props
 * @param {Array} props.drinks - List of drinks
 * @param {boolean} props.showHistory - Whether to show the history list
 * @param {Function} props.onToggleHistory - Toggle history visibility
 * @param {Function} props.onDeleteDrink - Handler for deleting a drink
 * @param {Function} props.onUndoLast - Handler for undoing last drink
 * @param {Function} props.onClearAll - Handler for clearing all drinks
 */
export function DrinkHistoryList({
  drinks,
  showHistory,
  onToggleHistory,
  onDeleteDrink,
  onUndoLast,
  onClearAll,
}) {
  const hasDrinks = drinks.length > 0;

  return (
    <div className="bg-white rounded-lg p-6 mb-6 shadow">
      {hasDrinks && (
        <>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Drinks ({drinks.length})</h3>
            <button
              onClick={onToggleHistory}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              {showHistory ? 'Hide' : 'Show'}
            </button>
          </div>

          {/* Drink List */}
          {showHistory && (
            <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
              {drinks.map((drink) => (
                <div
                  key={drink.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{getDrinkIcon(drink.name)}</div>
                    <div className="text-xs text-gray-500">
                      {drink.oz && drink.abv ? `${drink.oz}oz, ${drink.abv}% ABV • ` : ''}
                      {formatTime(drink.timestamp)}
                    </div>
                  </div>
                  <button
                    onClick={() => onDeleteDrink(drink.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={onUndoLast}
          className="flex-1 bg-orange-100 text-orange-700 py-2 rounded-lg font-medium hover:bg-orange-200 transition disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
          disabled={!hasDrinks}
        >
          <RefreshCw className="w-4 h-4 inline mr-1" />
          Undo Last
        </button>
        <button
          onClick={onClearAll}
          className="flex-1 bg-red-100 text-red-700 py-2 rounded-lg font-medium hover:bg-red-200 transition"
        >
          <Trash2 className="w-4 h-4 inline mr-1" />
          Clear All
        </button>
      </div>
    </div>
  );
}

DrinkHistoryList.propTypes = {
  drinks: PropTypes.array.isRequired,
  showHistory: PropTypes.bool.isRequired,
  onToggleHistory: PropTypes.func.isRequired,
  onDeleteDrink: PropTypes.func.isRequired,
  onUndoLast: PropTypes.func.isRequired,
  onClearAll: PropTypes.func.isRequired,
};

/**
 * Get drink icon based on name
 * @param {string} name - Drink name
 * @returns {string} Icon and name
 */
function getDrinkIcon(name) {
  const lowerName = name.toLowerCase();

  if (lowerName.includes('beer')) return '🍺 Beer';
  if (lowerName.includes('wine')) return '🍷 Wine';
  if (lowerName.includes('shot')) return '🥃 Shot';
  if (lowerName.includes('cocktail')) return '🍸 Cocktail';

  return `🍹 ${name}`;
}
