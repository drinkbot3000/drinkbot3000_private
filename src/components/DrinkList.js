import React from 'react';
import { Beer, Trash2, Clock } from 'lucide-react';

/**
 * DrinkList Component
 * Displays list of consumed drinks with ARIA labels for accessibility
 */
const DrinkList = ({ drinks, onDeleteDrink, formatTime }) => {
  if (drinks.length === 0) {
    return (
      <div
        className="bg-white rounded-2xl shadow-xl p-6 text-center"
        role="status"
        aria-label="No drinks recorded"
      >
        <Beer className="w-12 h-12 text-gray-300 mx-auto mb-3" aria-hidden="true" />
        <p className="text-gray-500">No drinks recorded yet</p>
      </div>
    );
  }

  return (
    <div
      className="bg-white rounded-2xl shadow-xl p-6"
      role="region"
      aria-labelledby="drink-list-heading"
    >
      <h2 id="drink-list-heading" className="text-lg font-semibold text-gray-800 mb-4">
        Drink History ({drinks.length})
      </h2>

      <ul className="space-y-3" role="list" aria-label="List of consumed drinks">
        {drinks.map((drink, index) => (
          <li
            key={drink.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            role="listitem"
          >
            <div className="flex items-center flex-1">
              <div
                className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3"
                aria-hidden="true"
              >
                <Beer className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800">
                  {drink.type}
                  <span className="sr-only">Drink {index + 1}</span>
                </p>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-3 h-3 mr-1" aria-hidden="true" />
                  <time
                    dateTime={new Date(drink.timestamp).toISOString()}
                    aria-label={`Consumed at ${formatTime(drink.timestamp)}`}
                  >
                    {formatTime(drink.timestamp)}
                  </time>
                  <span className="mx-2" aria-hidden="true">•</span>
                  <span aria-label={`${drink.standardDrinks.toFixed(1)} standard drinks`}>
                    {drink.standardDrinks.toFixed(1)} std drinks
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onDeleteDrink(drink.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition focus:outline-none focus:ring-4 focus:ring-red-300"
              aria-label={`Delete ${drink.type} consumed at ${formatTime(drink.timestamp)}`}
            >
              <Trash2 className="w-5 h-5" aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DrinkList;
