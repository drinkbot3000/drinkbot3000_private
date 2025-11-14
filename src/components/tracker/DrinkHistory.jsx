/**
 * DrinkHistory Component
 * Displays list of consumed drinks with management actions
 */

import React from 'react';
import { Trash2, RefreshCw } from 'lucide-react';

/**
 * DrinkHistory Component
 *
 * @param {Object} props
 * @param {Array} props.drinks - Array of drink objects
 * @param {boolean} props.showHistory - Whether drink list is expanded
 * @param {Function} props.onToggleHistory - Handler to toggle history visibility
 * @param {Function} props.onRemoveDrink - Handler to remove a specific drink by ID
 * @param {Function} props.onUndoLast - Handler to undo last drink
 * @param {Function} props.onClearAll - Handler to clear all drinks
 */
const DrinkHistory = ({
  drinks = [],
  showHistory = false,
  onToggleHistory,
  onRemoveDrink,
  onUndoLast,
  onClearAll
}) => {
  if (drinks.length === 0) return null;

  const getDrinkIcon = (type) => {
    switch (type) {
      case 'beer': return '🍺 Beer';
      case 'wine': return '🍷 Wine';
      case 'shot': return '🥃 Shot';
      case 'custom': return '🍹 Custom';
      default: return '🍹 Drink';
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 mb-6 shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Drinks ({drinks.length})
        </h3>
        <button
          onClick={onToggleHistory}
          className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
        >
          {showHistory ? 'Hide' : 'Show'}
        </button>
      </div>

      {showHistory && (
        <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
          {drinks.map((drink) => (
            <div key={drink.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="font-medium text-gray-800">
                  {getDrinkIcon(drink.type)}
                </div>
                <div className="text-xs text-gray-500">
                  {drink.oz}oz, {drink.abv}% ABV • {new Date(drink.time).toLocaleTimeString()}
                </div>
              </div>
              <button
                onClick={() => onRemoveDrink(drink.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={onUndoLast}
          className="flex-1 bg-orange-100 text-orange-700 py-2 rounded-lg font-medium hover:bg-orange-200 transition"
          disabled={drinks.length === 0}
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
};

export default DrinkHistory;
