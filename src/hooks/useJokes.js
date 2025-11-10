/**
 * Custom hook for managing joke display
 */

import { useState, useCallback } from 'react';
import { getRandomJoke } from '../data/jokes.js';
import { BAC_CONSTANTS } from '../constants/index.js';

/**
 * Hook for displaying random jokes with timed visibility
 * @returns {Object} Joke state and methods
 */
export const useJokes = () => {
  const [currentJoke, setCurrentJoke] = useState('');
  const [showJoke, setShowJoke] = useState(false);

  /**
   * Display a random joke for a specified duration
   * @param {number} duration - Duration in milliseconds (default from constants)
   */
  const tellJoke = useCallback((duration = BAC_CONSTANTS.JOKE_DURATION) => {
    const joke = getRandomJoke();
    setCurrentJoke(joke);
    setShowJoke(true);

    setTimeout(() => {
      setShowJoke(false);
    }, duration);
  }, []);

  /**
   * Hide the current joke immediately
   */
  const hideJoke = useCallback(() => {
    setShowJoke(false);
  }, []);

  return {
    currentJoke,
    showJoke,
    tellJoke,
    hideJoke,
  };
};
