/**
 * DrinkButtons Component
 * Provides drink selection buttons and custom drink functionality
 */

import React from 'react';
import { sanitizeText } from '../../utils/sanitization';

/**
 * DrinkButtons Component
 *
 * @param {Object} props
 * @param {Function} props.addDrink - Function to add a drink (name, oz, abv)
 * @param {Array} props.savedCustomDrinks - Array of saved custom drink presets
 * @param {boolean} props.showCustomDrink - Whether custom drink form is visible
 * @param {string} props.customDrinkName - Custom drink name input value
 * @param {string} props.customDrinkOz - Custom drink volume input value
 * @param {string} props.customDrinkABV - Custom drink ABV input value
 * @param {Function} props.onFieldChange - Handler to update form fields (field, value)
 * @param {Function} props.onAddSavedCustomDrink - Handler to add a saved custom drink
 * @param {Function} props.onDeleteCustomDrink - Handler to delete a saved custom drink
 * @param {Function} props.onSaveCustomDrink - Handler to save custom drink as preset
 */
const DrinkButtons = ({
  addDrink,
  savedCustomDrinks = [],
  showCustomDrink = false,
  customDrinkName = '',
  customDrinkOz = '',
  customDrinkABV = '5',
  onFieldChange,
  onAddSavedCustomDrink,
  onDeleteCustomDrink,
  onSaveCustomDrink
}) => {
  const handleAddOnce = () => {
    if (customDrinkOz && customDrinkABV) {
      // Sanitize name before adding (XSS protection)
      const drinkName = customDrinkName ? sanitizeText(customDrinkName) : 'Custom Drink';
      addDrink(drinkName, parseFloat(customDrinkOz), parseFloat(customDrinkABV));
      onFieldChange('customDrinkName', '');
      onFieldChange('customDrinkOz', '');
      onFieldChange('showCustomDrink', false);
    }
  };

  const handleCancel = () => {
    onFieldChange('customDrinkName', '');
    onFieldChange('customDrinkOz', '');
    onFieldChange('customDrinkABV', '5');
    onFieldChange('showCustomDrink', false);
  };

  return (
    <div className="bg-white rounded-lg p-6 mb-6 shadow">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Drink</h3>

      {/* Standard Drink Buttons */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <button
          onClick={() => addDrink('beer', 12, 5)}
          className="bg-amber-100 hover:bg-amber-200 text-amber-900 p-4 rounded-lg font-medium transition"
        >
          🍺 Beer<br />
          <span className="text-xs">12 oz, 5% ABV</span>
        </button>
        <button
          onClick={() => addDrink('wine', 5, 12)}
          className="bg-purple-100 hover:bg-purple-200 text-purple-900 p-4 rounded-lg font-medium transition"
        >
          🍷 Wine<br />
          <span className="text-xs">5 oz, 12% ABV</span>
        </button>
        <button
          onClick={() => addDrink('shot', 1.5, 40)}
          className="bg-red-100 hover:bg-red-200 text-red-900 p-4 rounded-lg font-medium transition"
        >
          🥃 Shot<br />
          <span className="text-xs">1.5 oz, 40% ABV</span>
        </button>
        <button
          onClick={() => onFieldChange('showCustomDrink', true)}
          className="bg-gray-100 hover:bg-gray-200 text-gray-900 p-4 rounded-lg font-medium transition"
        >
          ➕ Custom<br />
          <span className="text-xs">Custom drink</span>
        </button>
      </div>

      {/* Saved Custom Drinks */}
      {savedCustomDrinks.length > 0 && (
        <div className="border-t pt-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Your Custom Drinks</h3>
          <div className="grid grid-cols-2 gap-2">
            {savedCustomDrinks.map((drink) => (
              <div key={drink.id} className="relative">
                <button
                  onClick={() => onAddSavedCustomDrink(drink)}
                  className="w-full bg-indigo-100 hover:bg-indigo-200 text-indigo-900 p-3 rounded-lg font-medium transition text-left"
                >
                  {drink.name}<br />
                  <span className="text-xs">{drink.oz} oz, {drink.abv}% ABV</span>
                </button>
                <button
                  onClick={() => onDeleteCustomDrink(drink.id)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition text-xs"
                  title="Delete"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Custom Drink Input Form */}
      {showCustomDrink && (
        <div className="border-t pt-4 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Drink Name</label>
            <input
              type="text"
              value={customDrinkName}
              onChange={(e) => onFieldChange('customDrinkName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="e.g., My IPA, Margarita"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Volume (oz)</label>
            <input
              type="number"
              value={customDrinkOz}
              onChange={(e) => onFieldChange('customDrinkOz', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="e.g., 12"
              step="0.1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ABV %</label>
            <input
              type="number"
              value={customDrinkABV}
              onChange={(e) => onFieldChange('customDrinkABV', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="e.g., 5"
              step="0.1"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAddOnce}
              className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
              disabled={!customDrinkOz || !customDrinkABV}
            >
              Add Once
            </button>
            <button
              onClick={onSaveCustomDrink}
              className="flex-1 bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition"
              disabled={!customDrinkName || !customDrinkOz || !customDrinkABV}
              title="Save as reusable preset"
            >
              Save Preset
            </button>
          </div>
          <button
            onClick={handleCancel}
            className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default DrinkButtons;
