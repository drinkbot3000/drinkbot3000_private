/**
 * AddDrinkPanel Component
 * Interface for adding drinks (preset and custom)
 */

import React from 'react';
import { Button } from '../common';

/**
 * AddDrinkPanel Component
 * @param {Object} props
 * @param {Function} props.onAddDrink - Handler for adding a drink
 * @param {Array} props.savedCustomDrinks - Saved custom drink presets
 * @param {boolean} props.showCustomDrink - Whether custom drink form is visible
 * @param {Function} props.onToggleCustomDrink - Toggle custom drink form
 * @param {string} props.customDrinkName - Custom drink name
 * @param {string} props.customDrinkOz - Custom drink oz
 * @param {string} props.customDrinkABV - Custom drink ABV
 * @param {Function} props.onCustomDrinkChange - Handler for custom drink field changes
 * @param {Function} props.onAddCustomDrink - Handler for adding custom drink once
 * @param {Function} props.onSaveCustomDrink - Handler for saving custom drink preset
 * @param {Function} props.onDeleteCustomDrink - Handler for deleting saved preset
 * @param {Function} props.onCancelCustomDrink - Handler for canceling custom drink form
 */
export function AddDrinkPanel({
  onAddDrink,
  savedCustomDrinks,
  showCustomDrink,
  onToggleCustomDrink,
  customDrinkName,
  customDrinkOz,
  customDrinkABV,
  onCustomDrinkChange,
  onAddCustomDrink,
  onSaveCustomDrink,
  onDeleteCustomDrink,
  onCancelCustomDrink,
}) {
  return (
    <div className="bg-white rounded-lg p-6 mb-6 shadow">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Drink</h3>

      {/* Preset Drink Buttons */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <button
          onClick={() => onAddDrink('Beer', 12, 5)}
          className="bg-amber-100 hover:bg-amber-200 text-amber-900 p-4 rounded-lg font-medium transition"
        >
          🍺 Beer
          <br />
          <span className="text-xs">12 oz, 5% ABV</span>
        </button>
        <button
          onClick={() => onAddDrink('Wine', 5, 12)}
          className="bg-purple-100 hover:bg-purple-200 text-purple-900 p-4 rounded-lg font-medium transition"
        >
          🍷 Wine
          <br />
          <span className="text-xs">5 oz, 12% ABV</span>
        </button>
        <button
          onClick={() => onAddDrink('Shot', 1.5, 40)}
          className="bg-red-100 hover:bg-red-200 text-red-900 p-4 rounded-lg font-medium transition"
        >
          🥃 Shot
          <br />
          <span className="text-xs">1.5 oz, 40% ABV</span>
        </button>
        <button
          onClick={onToggleCustomDrink}
          className="bg-gray-100 hover:bg-gray-200 text-gray-900 p-4 rounded-lg font-medium transition"
        >
          ➕ Custom
          <br />
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
                  onClick={() => onAddDrink(drink.name, drink.oz, drink.abv)}
                  className="w-full bg-indigo-100 hover:bg-indigo-200 text-indigo-900 p-3 rounded-lg font-medium transition text-left"
                >
                  {drink.name}
                  <br />
                  <span className="text-xs">
                    {drink.oz} oz, {drink.abv}% ABV
                  </span>
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
              onChange={(e) => onCustomDrinkChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="e.g., My IPA, Margarita"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Volume (oz)</label>
            <input
              type="number"
              value={customDrinkOz}
              onChange={(e) => onCustomDrinkChange('oz', e.target.value)}
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
              onChange={(e) => onCustomDrinkChange('abv', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="e.g., 5"
              step="0.1"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="primary"
              fullWidth
              onClick={onAddCustomDrink}
              disabled={!customDrinkOz || !customDrinkABV}
            >
              Add Once
            </Button>
            <Button
              variant="success"
              fullWidth
              onClick={onSaveCustomDrink}
              disabled={!customDrinkName || !customDrinkOz || !customDrinkABV}
              title="Save as reusable preset"
            >
              Save Preset
            </Button>
          </div>
          <Button variant="secondary" fullWidth onClick={onCancelCustomDrink}>
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}
