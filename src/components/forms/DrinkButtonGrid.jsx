import React from 'react';

/**
 * DrinkButtonGrid - Grid of buttons for adding common drink types
 *
 * Modern pattern: Uses React.memo since these buttons are static
 * and only their callbacks change (which is handled properly)
 *
 * @param {function} onAddBeer - Callback when beer button is clicked
 * @param {function} onAddWine - Callback when wine button is clicked
 * @param {function} onAddShot - Callback when shot button is clicked
 * @param {function} onShowCustom - Callback when custom button is clicked
 */
const DrinkButtonGrid = React.memo(({
  onAddBeer,
  onAddWine,
  onAddShot,
  onShowCustom
}) => {
  return (
    <div className="bg-white rounded-lg p-6 mb-6 shadow">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Drink</h3>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <button
          onClick={onAddBeer}
          className="bg-amber-100 hover:bg-amber-200 text-amber-900 p-4 rounded-lg font-medium transition"
        >
          🍺 Beer<br />
          <span className="text-xs">12 oz, 5% ABV</span>
        </button>
        <button
          onClick={onAddWine}
          className="bg-purple-100 hover:bg-purple-200 text-purple-900 p-4 rounded-lg font-medium transition"
        >
          🍷 Wine<br />
          <span className="text-xs">5 oz, 12% ABV</span>
        </button>
        <button
          onClick={onAddShot}
          className="bg-red-100 hover:bg-red-200 text-red-900 p-4 rounded-lg font-medium transition"
        >
          🥃 Shot<br />
          <span className="text-xs">1.5 oz, 40% ABV</span>
        </button>
        <button
          onClick={onShowCustom}
          className="bg-gray-100 hover:bg-gray-200 text-gray-900 p-4 rounded-lg font-medium transition"
        >
          ➕ Custom<br />
          <span className="text-xs">Custom drink</span>
        </button>
      </div>
    </div>
  );
});

DrinkButtonGrid.displayName = 'DrinkButtonGrid';

export default DrinkButtonGrid;
