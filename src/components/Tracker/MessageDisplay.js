/**
 * MessageDisplay Component
 * Displays robot messages and jokes
 */

import React from 'react';
import { Smile } from 'lucide-react';

/**
 * MessageDisplay Component
 * @param {Object} props
 * @param {string} props.robotMessage - Robot message to display
 * @param {string} props.joke - Joke to display
 * @param {boolean} props.showJoke - Whether to show the joke
 */
export function MessageDisplay({ robotMessage, joke, showJoke }) {
  return (
    <>
      {/* Robot Message */}
      {robotMessage && (
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 mb-6 border-2 border-purple-200">
          <p className="text-purple-900 font-medium text-center">{robotMessage}</p>
        </div>
      )}

      {/* Joke Display */}
      {showJoke && joke && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 mb-6 border-2 border-yellow-200">
          <div className="flex items-start">
            <Smile className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-gray-800">{joke}</p>
          </div>
        </div>
      )}
    </>
  );
}
