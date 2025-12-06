/**
 * SupportSection Component
 * Support/donation interface
 */

import React from 'react';
import { DollarSign } from 'lucide-react';

export interface SupportSectionProps {
  onTip: (amount: number) => void;
}

/**
 * SupportSection Component
 */
export function SupportSection({ onTip }: SupportSectionProps): JSX.Element {
  return (
    <div className="bg-white rounded-lg p-6 shadow">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Support DrinkBot3000</h3>
      <p className="text-sm text-gray-600 mb-4">
        Help us spread life-saving safety messages! Support development with $5 and share with
        friends.
      </p>

      <button
        onClick={() => onTip(5)}
        className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 rounded-xl font-bold text-xl transition shadow-lg flex items-center justify-center space-x-2"
        title="Opens Stripe payment page"
      >
        <DollarSign className="w-6 h-6" />
        <span>Support with $5</span>
      </button>

      <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200">
        <p className="text-sm text-blue-900 font-semibold mb-2">💡 Help us save lives!</p>
        <p className="text-xs text-blue-800 mb-2">
          Your $5 keeps DrinkBot3000 free and spreads critical safety messages to more people.
        </p>
        <p className="text-xs text-indigo-800 font-medium">
          Secure payments via Stripe with automatic tax collection
        </p>
      </div>

      <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
        <p className="text-xs text-purple-900 font-semibold mb-1">🚀 Spread the word!</p>
        <p className="text-xs text-purple-800">
          Share DrinkBot3000 with friends to help grow our community and spread safety awareness!
        </p>
      </div>
    </div>
  );
}
