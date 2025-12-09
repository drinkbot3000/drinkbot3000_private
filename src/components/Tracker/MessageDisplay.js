/**
 * MessageDisplay Component
 * Displays robot messages and jokes
 */

import React from 'react';
import PropTypes from 'prop-types';
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
      {/* Robot Message - Always reserve space to prevent layout shift */}
      <div
        className={`rounded-lg mb-6 transition-all duration-200 ${
          robotMessage
            ? 'bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 p-4 opacity-100'
            : 'h-0 opacity-0 overflow-hidden'
        }`}
      >
        {robotMessage && <p className="text-purple-900 font-medium text-center">{robotMessage}</p>}
      </div>

      {/* Joke Display - Always reserve space to prevent layout shift */}
      <div
        className={`rounded-lg mb-6 transition-all duration-200 ${
          showJoke && joke
            ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 p-4 opacity-100'
            : 'h-0 opacity-0 overflow-hidden'
        }`}
      >
        {showJoke && joke && (
          <div className="flex items-start">
            <Smile className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-gray-800">{joke}</p>
          </div>
        )}
      </div>
    </>
  );
}

MessageDisplay.propTypes = {
  robotMessage: PropTypes.string,
  joke: PropTypes.string,
  showJoke: PropTypes.bool,
};
